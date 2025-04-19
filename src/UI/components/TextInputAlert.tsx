import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, Button, StyleSheet } from 'react-native';

// Crie uma referência para o componente
let showAlertFunction: (config: AlertConfig) => void;
let hideAlertFunction: () => void;

type AlertConfig = {
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  onSubmit?: (text: string) => void;
  onCancel?: () => void;
};

// Componente de alerta
export const TextInputAlertGlobal = () => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<AlertConfig>({
    title: '',
    message: '',
    placeholder: '',
    defaultValue: '',
  });
  const [inputValue, setInputValue] = useState('');

  // Atualiza as funções globais quando o componente monta
  useEffect(() => {
    showAlertFunction = (newConfig: AlertConfig) => {
      setConfig(newConfig);
      setInputValue(newConfig.defaultValue || '');
      setVisible(true);
    };

    hideAlertFunction = () => {
      setVisible(false);
    };
  }, []);

  const handleSubmit = () => {
    if (config.onSubmit) {
      config.onSubmit(inputValue);
    }
    setVisible(false);
  };

  const handleCancel = () => {
    if (config.onCancel) {
      config.onCancel();
    }
    setVisible(false);
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{config.title}</Text>
          {config.message && (
            <Text style={styles.message}>{config.message}</Text>
          )}
          <TextInput
            style={styles.textInput}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={config.placeholder}
            autoFocus={true}
          />
          <View style={styles.buttonContainer}>
            <Button title="Cancelar" onPress={handleCancel} />
            <Button title="OK" onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Função global para mostrar o alerta
export const showTextInputAlert = (config: AlertConfig) => {
  if (showAlertFunction) {
    showAlertFunction(config);
  } else {
    console.warn('TextInputAlertGlobal não foi montado ainda');
  }
};

// Função global para esconder o alerta
export const hideTextInputAlert = () => {
  if (hideAlertFunction) {
    hideAlertFunction();
  }
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  alertBox: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
