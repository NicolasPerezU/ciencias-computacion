import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import * as Notifications from 'expo-notifications';
import styles from './styles';
import MessageList from './components/MessageList';
import { initMQTT } from './services/mqttService';
import { sendAlertNotification, registerForPushNotificationsAsync } from './services/notificacionService';
import { saveAlerts, loadAlerts } from './storage/alertStorage';
import FilterBar from './components/FilterBar';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedZona, setSelectedZona] = useState('todas');
  const [selectedTipo, setSelectedTipo] = useState('todos');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const mqttClient = useRef(null);
  const notificationListener = useRef();
  const responseListener = useRef();


  //solicita permisos para notificaciones
  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener(() => {}); 
    responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {}); //escucha la respuesta de la notificación

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);



  useEffect(() => {
    const cargarAlertas = async () => {
      const almacenadas = await loadAlerts();
      setMessages(almacenadas);
    };
    cargarAlertas();
  }, []);


  
  useEffect(() => {
    mqttClient.current = initMQTT(
      async (message) => {
        try {
          const parsed = JSON.parse(message.toString());
          const newMessage = {
            zona: parsed.zona || 'Desconocida',
            tipo: parsed.tipo || 'general',
            valor: parsed.valor || '',
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => {
            const updated = [newMessage, ...prev].slice(0, 50);
            saveAlerts(updated);
            return updated;
          });

          if (newMessage.tipo === 'alerta' || newMessage.tipo === 'movimiento') {
            await sendAlertNotification(newMessage.zona, newMessage.tipo, newMessage.valor);
          }
        } catch (e) {
          const rawMessage = { raw: message.toString(), timestamp: new Date().toISOString() };
          setMessages((prev) => {
            const updated = [rawMessage, ...prev].slice(0, 50);
            saveAlerts(updated);
            return updated;
          });
        }
      },
      () => {
        setIsConnected(true);
        setError(null);
      },
      (err) => {
        console.error('❌ Error MQTT:', err.message);
        setError('Error de conexión MQTT');
        setIsConnected(false);
      },
      () => setIsConnected(false)
    );

    return () => {
      mqttClient.current?.end();
    };
  }, []);

  // Aplicar filtros a los mensajes
  useEffect(() => {
    const filtrados = messages.filter((msg) => {
      const zonaMatch = selectedZona === 'todas' || msg.zona === selectedZona;
      const tipoMatch = selectedTipo === 'todos' || msg.tipo === selectedTipo;
      return zonaMatch && tipoMatch;
    });
    setFilteredMessages(filtrados);
  }, [messages, selectedZona, selectedTipo]);

  const zonas = [...new Set(messages.map((msg) => msg.zona).filter((z) => z))];
  const tipos = [...new Set(messages.map((msg) => msg.tipo).filter((t) => t))];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alertas en Tiempo Real {isConnected ? '🟢' : '🔴'}</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      {!isConnected && !error && (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginBottom: 10 }} />
      )}

      {/* Filtros */}
      <FilterBar
        zonas={zonas}
        tipos={tipos}
        selectedZona={selectedZona}
        setSelectedZona={setSelectedZona}
        selectedTipo={selectedTipo}
        setSelectedTipo={setSelectedTipo}
      />

      {/* Lista de mensajes */}
      <ScrollView style={styles.messagesContainer}>
        <MessageList messages={filteredMessages} />
      </ScrollView>
    </View>
  );
};

export default App;
