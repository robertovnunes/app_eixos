import React, { useEffect, useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { View, Modal, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import FloatingButton from '../components/FloatingButton';
import { ReloadContext } from '../../utils/contexts/reloadContext';
import NewRoutine from '../components/NewRotine';
import TaskByDayScreen from './RoutineTasks/TaskByDayScreen';
import TaskByWeekScreen from './RoutineTasks/TaskByWeekScreen';
import { RoutineTask } from 'interfaces/routineTask';
import { loadTasks, updateTask } from '../../utils/storage/routine.storage';

const Tab = createBottomTabNavigator();

const Rotinas = () => {
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [tasks, setTasks] = useState<RoutineTask[]>([]);

  const triggerReload = () => {
    setReload(true); // Define reload como true para disparar o recarregamento
  };

  // Garante que o reload volte a ser false após o recarregamento
  const resetReload = () => {
    setReload(false);
  };

  useFocusEffect(
    useCallback(() => {
      triggerReload();
    }, [])
  );

  const scheduleTaskNotifications = async (task: RoutineTask) => {
    // Certifique-se de que o formato de horário é HH:MM
    if (
      typeof task.horario !== 'string' ||
      !/^([01]\d|2[0-3]):([0-5]\d)$/.test(task.horario)
    ) {
      console.error('Formato de horário inválido:', task.horario);
      return;
    }
  
    // Cancelar notificações existentes, se houver
    if (task.notificationIds && task.notificationIds.length > 0) {
      console.log(
        `Cancelando notificações existentes para a tarefa: ${task.titulo}`,
      );
      await Notifications.cancelScheduledNotificationAsync(
        task.notificationIds[0],
      );
      await Notifications.cancelScheduledNotificationAsync(
        task.notificationIds[1],
      );
    }
  
    const [hour, minute] = task.horario.split(':').map(Number);
    const now = new Date();
  
    // Calcula o dia da semana da tarefa
    let dayOfWeek = 0;
    switch (task.diasDaSemana[0]) {
      case 'Dom':
        dayOfWeek = 0;
        break;
      case 'Seg':
        dayOfWeek = 1;
        break;
      case 'Ter':
        dayOfWeek = 2;
        break;
      case 'Qua':
        dayOfWeek = 3;
        break;
      case 'Qui':
        dayOfWeek = 4;
        break;
      case 'Sex':
        dayOfWeek = 5;
        break;
      case 'Sáb':
        dayOfWeek = 6;
        break;
    }
  
    const trigger = new Date();
    trigger.setHours(hour);
    trigger.setMinutes(minute);
    trigger.setSeconds(0);
    trigger.setMilliseconds(0);
  
    // Ajuste para o dia da semana correto
    let daysUntilNextDayOfWeek = (dayOfWeek - now.getDay() + 7) % 7;
    if (daysUntilNextDayOfWeek === 0 && trigger <= now) {
      daysUntilNextDayOfWeek = 7; // Se for hoje e o horário já passou, agendar para a próxima semana
    }
    trigger.setDate(now.getDate() + daysUntilNextDayOfWeek);
  
    // Schedule notification BEFORE the routine time
    const reminderTimeInMinutes = task.reminderTime ?? 0; // Se for null, usa 0 como padrão
    const beforeTrigger = new Date(
      trigger.getTime() - reminderTimeInMinutes * 60000,
    );
  
    console.log('Before Trigger:', beforeTrigger.getTime());
    const reminderNotificationId =
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Rotina: ${task.titulo} (Lembrete)`,
          body: task.descricao || 'Lembrete: Hora de realizar sua rotina!',
          data: { taskId: task.id },
        },
        trigger: {
          channelId: 'eixos-channel',
          hour: beforeTrigger.getHours(),
          minute: beforeTrigger.getMinutes(),
          repeats: true,
        },
      });
    console.log('Notificação de lembrete agendada para:', beforeTrigger);
  
    // Schedule notification AT the routine time
    const routineNotificationId =
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Rotina: ${task.titulo}`,
          body: task.descricao || 'Hora de realizar sua rotina!',
          data: { taskId: task.id },
        },
        trigger: {
          channelId: 'eixos-channel',
          hour: trigger.getHours(),
          minute: trigger.getMinutes(),
          repeats: true,
        },
      });
    console.log('Notificação da rotina agendada para:', trigger);
  
    // Atualizar os IDs das notificações na tarefa
    const updatedTask = {
      ...task,
      notificationIds: [reminderNotificationId, routineNotificationId],
    };
    await updateTask(updatedTask);
  };
  

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
      resetReload();
    };
  }, [reload]);

  return (
    <ReloadContext.Provider value={{ reload, triggerReload, resetReload }}>
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
                    onAdd={() => {
                      setShowModal(false); 
                      triggerReload();
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
              <Tab.Screen name="Por dia" children={() => <TaskByDayScreen tasks={tasks}/>} />
              <Tab.Screen name="Por semana" children={ () => <TaskByWeekScreen tasks={tasks}/>} />
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
    </ReloadContext.Provider>
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
