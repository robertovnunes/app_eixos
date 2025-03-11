import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadTasks, saveTasks } from '../../../utils/storage';
import { Task } from 'interfaces/task';
import TaskItemList from '../../components/TaskItemList';
import { ReloadContext } from '../../../utils/contexts/reloadContext';
import { useTheme } from '../../../utils/contexts/themeContext';

const ListScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const { reload, resetReload, triggerReload } = useContext(ReloadContext);

  const [taskLenght, setTaskLenght] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

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

  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

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
            onToggle={toggleTaskCompletion}
            onDelete={deleteTask}
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color }}>
            Nenhuma tarefa registrada.
          </Text>
        }
      />
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 20,
        }}
      >
        <Text style={{ marginTop: 20, color }}>
          Total de tarefas: {tasks.length}
        </Text>
        <Text style={{marginTop: 20, color }}>
          Tarefas completadas: {tasks.filter((task) => task.completed).length}
        </Text>
      </View>
    </View>
  );
};

export default ListScreen;
