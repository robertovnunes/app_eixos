import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import taskStorage from '../../utils/storage/tasks.storage';
import Task from 'interfaces/Task';
import TaskItemList from '../components/TaskItemList';
import { useReload, ReloadProvider } from '../../utils/contexts/reloadContext';
import { useTheme } from '../../utils/contexts/themeContext';

const ListScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { triggerTasksReload, resetReload, reloadTasks } = useReload();
  const { isDarkMode } = useTheme();
  const color = isDarkMode ? 'white' : 'black';

  // Atualizar tarefas sempre que a tela for focada
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchTasks = async () => {
        if (isActive) {
          const savedTasks = await taskStorage.getAll();
          setTasks(savedTasks);
        }
      };
      fetchTasks().finally(() => {
        resetReload("tasks");
      });
      return () => {
        isActive = false;
      };
    }, [reloadTasks]),
  );

  const deleteTask = async (id: string) => {
    await deleteTask(id);
    triggerTasksReload();
  };

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      <Text style={{ fontSize: 20, textAlign: 'center', margin: 10, color }}>
        Lista de Tarefas
      </Text>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TaskItemList task={item} onDelete={deleteTask} />
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
