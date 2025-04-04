import React, { useEffect, useState, useCallback } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import FloatingButton from '../components/FloatingButton';
import { useReload, ReloadProvider } from '../../utils/contexts/reloadContext';
import NewRoutine from '../components/NewRotine';
import TaskByDayScreen from './RoutineTasks/TaskByDayScreen';
import TaskByWeekScreen from './RoutineTasks/TaskByWeekScreen';
import { RoutineTask } from 'interfaces/routineTask';
import { loadTasks } from '../../utils/storage/routine.storage';
import notificationService from '../../utils/services/NotificationService';

const Tab = createBottomTabNavigator();

const Rotinas = () => {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState<RoutineTask[]>([]);

  const { triggerRoutinesReload, resetReload, reload } = useReload();

  useFocusEffect(
    useCallback(() => {
      triggerRoutinesReload();
    }, []),
  );

  useEffect(() => {
    async function fetchTasks() {
      try {
        const tasks = await loadTasks();
        setTasks(tasks);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      }
    }
    fetchTasks();

    return () => {
      resetReload("routines");
    };
  }, [reload.reloadRoutines]);

  const handleAddTask = async (newTask: RoutineTask) => {
    try {
      const horario = new Date();
      horario.setHours(
        parseInt(newTask.horario.split(':')[0]),
        parseInt(newTask.horario.split(':')[1]),
      );
      console.log('horario', horario);
      newTask.diasDaSemana.forEach((dia) => {
        notificationService.scheduleWeeklyNotification(
          newTask.titulo ?? 'Título não informado',
          newTask.descricao ?? 'Descrição não informada',
          horario,
          dia,
        ); // Agendar notificação
        const reminderTime = newTask.reminderTime ?? 0;
        const reminderDate = new Date(
          horario.getTime() - reminderTime * 60 * 1000,
        ); // Calcula a data do lembrete
        notificationService.scheduleWeeklyNotification(
          'Lembrete: ',
          `${newTask.titulo} começará em ${newTask.reminderTime} minutos`,
          reminderDate,
          dia,
        ); // Agendar notificação
        setShowModal(false);
        triggerRoutinesReload();
      });
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
    }
  };
  

  return (
    <ReloadProvider>
      <SafeAreaProvider>
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
                    onAdd={(newTask: RoutineTask) => {
                      handleAddTask(newTask);
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
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ReloadProvider>
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
