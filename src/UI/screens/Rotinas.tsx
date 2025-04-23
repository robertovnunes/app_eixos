import React, { useEffect, useState, useCallback } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import alarmService from '../../utils/services/AlarmService';
import FloatingButton from '../components/FloatingButton';
import NewRoutine from '../components/NewRotine';
import TaskByDayScreen from './RoutineTasks/TaskByDayScreen';
import TaskByWeekScreen from './RoutineTasks/TaskByWeekScreen';
import { RoutineTask } from 'interfaces/routineTask';
import routineStorage from '../../utils/storage/routine.storage';
import notificationService from '../../utils/services/NotificationService';
import { ReloadProvider, useReload } from '../../utils/contexts/reloadContext';

const Tab = createBottomTabNavigator();

const Rotinas = () => {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState<RoutineTask[][]>(
    Array.from({ length: 7 }, () => []),
  );

  const { reloadTasks, resetReload, triggerRoutinesReload } = useReload();
  
  async function fetchTasks() {
    try {
      const tasks = await routineStorage.getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  }

  useEffect(() => {
    fetchTasks();
    return () => {
      resetReload('tasks'); // Reseta o reloadTasks após a atualização
    }
  }, [reloadTasks]);


  useFocusEffect(  
    useCallback(() => {
      let isActive = true; // Variável para controlar o estado do componente
      if (isActive) {
        fetchTasks();
      }
      return () => {
        isActive = false;
      };
    }, []),
  );


  const handleAddTask = async (newTask: RoutineTask, diasDaSemana: number[]) => {
    try {
      const horario = new Date();
      horario.setHours(
        parseInt(newTask.horario.split(':')[0]),
        parseInt(newTask.horario.split(':')[1]),
      );
      diasDaSemana.forEach( async (dia) => {
        notificationService.scheduleWeeklyNotification(
          newTask.titulo ?? 'Título não informado',
          newTask.descricao ?? 'Descrição não informada',
          horario,
          dia+1,
        ); // Agendar notificação
        if(newTask.reminderTime){
          newTask.reminderTime.forEach(async (reminder) => {
          const reminderDate = new Date(
            horario.getTime() - reminder * 60 * 1000,
          ); // Calcula a data do lembrete
          notificationService.scheduleWeeklyNotification(
            'Lembrete: ',
            `${newTask.titulo} começará em ${newTask.reminderTime} minutos`,
            reminderDate,
            dia+1,
          ); // Agendar notificação
        });
        }
        const task = await routineStorage.saveTask(newTask, dia); // Salvar tarefa no armazenamento
        if (!task) {
          throw new Error('Erro ao salvar tarefa no armazenamento.');
        }
        setTasks((prevTasks) => {
          const updatedTasks = [...prevTasks];
          updatedTasks[dia].push(task);
          return updatedTasks;
        });
      });
      setShowModal(false);
      // Exibe mensagem de sucesso
      Toast.show({
        type: 'success',
        text1: 'Tarefa adicionada com sucesso!',
        position: 'bottom',
      });
      triggerRoutinesReload;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao adicionar tarefa.',
        position: 'bottom'
      });
    }
  };
  

  return (
    <SafeAreaProvider>
      <ReloadProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View>
              <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                  setShowModal(false);
                }}
              >
                <View style={styles.modalContent}>
                  <NewRoutine
                    onAbort={() => setShowModal(false)}
                    onAdd={(newTask, diasDaSemana) => {
                      handleAddTask(newTask, diasDaSemana);
                    }}
                  />
                </View>
              </Modal>
            </View>

            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  let iconName;
                  if (route.name === 'Por dia') iconName = 'list';
                  else if (route.name === 'Por semana')
                    iconName = 'calendar-today';
                  return (
                    <MaterialIcons
                      name={iconName as any}
                      size={size}
                      color={color}
                    />
                  );
                },
                headerShown: false,
              })}
            >
              <Tab.Screen
                name="Por dia"
                children={() => <TaskByDayScreen tasks={tasks} />}
              />
              <Tab.Screen
                name="Por semana"
                children={() => <TaskByWeekScreen tasks={tasks} />}
              />
            </Tab.Navigator>
            <View
              style={{
                position: 'absolute',
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                padding: 10,
                bottom: 50,
                marginStart: 10,
                marginEnd: 10,
                width: '100%',
              }}
            >
              <FloatingButton onClick={() => setShowModal(true)} />
            </View>
            <Toast />
          </View>
        </SafeAreaView>
      </ReloadProvider>
    </SafeAreaProvider>
  );
};

export default Rotinas;

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'rgb(194, 194, 194)', // Cor de fundo do modal
    borderRadius: 10,
    margin: 'auto',
    marginHorizontal: 20,
  },
});
