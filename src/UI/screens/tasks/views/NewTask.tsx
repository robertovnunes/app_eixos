import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView
} from 'react-native';
import Modal from 'react-native-modal';
import CustomSelect from '../../../components/CustomSelect';
import * as taskHandler from './../rotinas/taskHandler';

import { TaskForm, TaskRoutineForm } from './forms';

interface NewTaskProps {
  type?: string | null;
}

const NewTask: React.FC<NewTaskProps> = ({ type = null }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const types = ['Tarefa', 'Rotina'];

  useEffect(() => {
    if (type) {
      setSelectedType(type);
    }
  }, [type]);

  return (
    <ScrollView style={styles.container}>
      <Modal
        isVisible={!!selectedType}
        onBackdropPress={() => {
          setSelectedType(null);
        }}
        onSwipeComplete={() => {
          setSelectedType(null);
        }}
        swipeDirection="down"
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        <CustomSelect
          options={types.map((type) => ({ label: type, value: type }))}
          selectedValue={selectedType}
          placeholder="Selecione um tipo"
          onValueChange={setSelectedType}
        />

        {selectedType === 'Tarefa' && (
          <TaskForm
            onAbort={() => {
              setSelectedType(null);
            }}
            onAdd={() => {}}
          />
        )}
        {selectedType === 'Rotina' && (
          <TaskRoutineForm
            onAbort={() => {
              setSelectedType(null);
            }}
            onAdd={() => {}}
          />
        )}
      </Modal>
    </ScrollView>
  );
};

export default NewTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
