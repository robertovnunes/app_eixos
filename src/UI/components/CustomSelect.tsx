// components/CustomSelect.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';

interface CustomSelectProps {
    options: Array<{ label: string; value: any }>;
    selectedValue: any;
    onValueChange: (value: any) => void;
    placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  selectedValue,
  onValueChange,
  placeholder = 'Selecione...',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = options.find((item) => item.value === selectedValue);

  return (
    <View style={styles.container}>
      {/* Botão que mostra a opção selecionada */}
      <TouchableOpacity style={styles.button} onPress={() => setIsOpen(true)}>
        <Text style={selectedItem ? styles.text : styles.placeholder}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
      </TouchableOpacity>

      {/* Modal com lista de opções */}
      <Modal visible={isOpen} transparent animationType="none">
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item.value.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        item.value === selectedValue && styles.selectedOption,
                      ]}
                      onPress={() => {
                        onValueChange(item.value);
                        setIsOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          item.value === selectedValue &&
                            styles.selectedOptionText,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default CustomSelect;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    marginTop: 60,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 20,
    maxHeight: 200,
    zIndex: 10,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
});
