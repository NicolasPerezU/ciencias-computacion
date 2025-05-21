export const MQTT_CONFIG = {
  brokerUrl: 'ws://broker.emqx.io:8083/mqtt', 
  topic: 'alerts/topic',                        
  options: {
    clientId: 'mobile_' + Math.random().toString(16).substr(2, 8),
    keepalive: 60,
    reconnectPeriod: 1000,
    clean: true
  }
};
