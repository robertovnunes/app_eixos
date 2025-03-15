import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadTasks, saveTasks } from '../../../utils/storage/routine.storage';
import { RoutineTask } from 'interfaces/routineTask';
import TaskItemList from '../../components/TaskItemList';
import { ReloadContext } from '../../../utils/contexts/reloadContext';
import { useTheme } from '../../../utils/contexts/themeContext';

const ListScreen: React.FC = () => {

  const [tasks, setTasks] = useState<RoutineTask[]>([]);
  const { reload, resetReload, triggerReload } = useContext(ReloadContext);
  const { isDarkMode } = useTheme();
  const color = isDarkMode ? 'white' : 'black';

  // Atualizar tarefas sempre que a tela for focada
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchTasks = async () => {
        if (isActive) {
          const savedTasks = await loadTasks();
          setTasks(savedTasks);
        }
      };
      fetchTasks().finally(() => {
        resetReload();
      });
      return () => {
        isActive = false;
      };
    }, [reload]),
  );

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);



  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    triggerReload();
  };

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      <Text style={{ fontSize: 20, textAlign: 'center', margin: 10, color }}>
        Lista de Tarefas
      </Text>
      <FlatList
        data={tasks}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => (
          <TaskItemList
            task={item}
            onDelete={deleteTask}
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color }}>
            Nenhuma tarefa registrada.
          </Text>
        }
      />
    </View>
  );
};

export default ListScreen;
