import React, { useEffect, useState } from 'react';
import {
  Text, TouchableOpacity,
  View,
  StyleSheet,
  ScrollView
} from 'react-native';
import Modal from 'react-native-modal';

import { TaskForm, TaskRoutineForm } from './forms';

interface NewTaskProps {
  type?: string | null;

}

const NewTask: React.FC<NewTaskProps> = ({ type = null}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const types = ['Tarefa', 'Rotina'];

  useEffect(() => {
    setSelectedType('Tarefa');
  }
  , []);

  useEffect(() => {
    if (type) {
      setSelectedType(type);
    } 
  }, [type]);

  return (
    <ScrollView>
        <View>
          {types.map((item) => (
            <TouchableOpacity key={item} onPress={() => setSelectedType(item)}>
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      <Modal
        isVisible={!!selectedType}
        onBackdropPress={() => {return}}
        onSwipeComplete={() => {}}
        swipeDirection="down"
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        {selectedType === 'Tarefa' && (
          <TaskForm onAbort={() => {}} onAdd={() => {}} />
        )}
        {selectedType === 'Rotina' && (
          <TaskRoutineForm onAbort={() => {}} onAdd={() => {}} />
        )}
      </Modal>
    </ScrollView>
  );
};

export default NewTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
