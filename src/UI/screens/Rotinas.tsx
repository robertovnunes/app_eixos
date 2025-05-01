import React, { useEffect, useState, useCallback } from 'react';
import shortid from 'shortid';
import { View, Modal, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import FloatingButton from '../components/FloatingButton';
import NewRoutine from '../components/NewRotine';
import TaskByDayScreen from './RoutineTasks/TaskByDayScreen';
import TaskByWeekScreen from './RoutineTasks/TaskByWeekScreen';
import RoutineTaskDay, { RoutineTaskItem} from 'interfaces/routineTask';
import routineStorage from '../../utils/storage/routine.storage';
import notificationService from '../../utils/services/NotificationService';
import { ReloadProvider, useReload } from '../../utils/contexts/reloadContext';

const Tab = createBottomTabNavigator();

const Rotinas = () => {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState<RoutineTaskDay[]>([]);
  
  async function fetchTasks() {
    try {
      const tasks = await routineStorage.getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  }

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

  const generateId = (): string => {
    return shortid.generate(); // Gera um ID único para a tarefa
  }

  const handleAddTask = async (newTask: Partial<RoutineTaskItem>, diasDaSemana: number[]) => {
    try {
      if(!newTask.titulo || !newTask.descricao || !newTask.horario) {
        Toast.show({
          type: 'error',
          text1: 'Preencha todos os campos!',
          position: 'bottom',
        });
        return;
      }
      const horario = new Date();
      horario.setHours(
        parseInt(newTask.horario.split(':')[0]),
        parseInt(newTask.horario.split(':')[1]),
      );
      const _taskId = generateId();
      diasDaSemana.forEach( async (dia) => {
        const id = generateId(); // Gera um ID único para a tarefa
        const task = await routineStorage.saveTask({...newTask, id: id, taskId: _taskId}, dia); // Salvar tarefa no armazenamento
        if (!task) {
          throw new Error('Erro ao salvar tarefa no armazenamento.');
        } else {
          setTasks((prevTasks) => {
            prevTasks[dia].tasks.length > 0 
            ? prevTasks[dia].tasks.push(task) 
            : {...prevTasks[dia], tasks: [task]};
            return [...prevTasks];
          });
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
              `${newTask.titulo} começará em ${reminder} minutos`,
              reminderDate,
              dia+1,
            ); // Agendar notificação
          });
          }
        }
      });
      // Exibe mensagem de sucesso
      Toast.show({
        type: 'success',
        text1: 'Tarefa adicionada com sucesso!',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao adicionar tarefa.',
        position: 'bottom'
      });
    }
    setShowModal(false);
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
                    onAdd={(newTask, diasDaSemana) => handleAddTask(newTask, diasDaSemana)}
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
