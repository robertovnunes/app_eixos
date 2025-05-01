import React, { useState } from 'react';
import { View, Modal } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import FloatingButton from '../../components/FloatingButton';
import NewRoutine from '../../components/NewRotine';
import TaskByDayScreen from './RoutineTasks/TaskByDayScreen';
import TaskByWeekScreen from './RoutineTasks/TaskByWeekScreen';
import { useRoutineTasks } from './useRoutineTasks';
import { handleAddTask } from './taskHandler';
import { styles } from './styles';
import { ReloadProvider } from '../../../utils/contexts/reloadContext';

const Tab = createBottomTabNavigator();

const Rotinas = () => {
  const [showModal, setShowModal] = useState(false);
  const { tasks, setTasks } = useRoutineTasks();

  return (
    <SafeAreaProvider>
      <ReloadProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Modal
              visible={showModal}
              animationType="slide"
              transparent
              onRequestClose={() => setShowModal(false)}
            >
              <View style={styles.modalContent}>
                <NewRoutine
                  onAbort={() => setShowModal(false)}
                  onAdd={(task, dias) =>
                    handleAddTask(task, dias, setTasks, () =>
                      setShowModal(false),
                    )
                  }
                />
              </View>
            </Modal>

            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  const icon =
                    route.name === 'Por dia' ? 'list' : 'calendar-today';
                  return (
                    <MaterialIcons name={icon} size={size} color={color} />
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
                bottom: 50,
                width: '100%',
                paddingHorizontal: 10,
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
