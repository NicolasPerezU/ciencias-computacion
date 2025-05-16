import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles';

const MessageList = ({ messages }) => { 
  return (
    <>
      {messages
        .filter((msg) => msg.zona && msg.tipo && msg.valor)  
        .map((msg, index) => (
          <View key={index} style={styles.messageBox}>
            <Text style={styles.label}>📍 Zona: <Text style={styles.value}>{msg.zona}</Text></Text>
            <Text style={styles.label}>⚠️ Tipo: <Text style={styles.value}>{msg.tipo}</Text></Text>
            <Text style={styles.label}>🌡 Mensaje: <Text style={styles.value}>{msg.valor}</Text></Text>
          </View>
        ))}
    </>
  );
};

export default MessageList;
