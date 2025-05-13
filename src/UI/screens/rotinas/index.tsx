import React, { useState } from 'react';
import { View, Modal } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import FloatingButton from '../../components/FloatingButton';
import NewHabit from '../../components/NewHabit';
import TaskByDayScreen from './views/TaskByDayScreen';
import TaskByWeekScreen from './views/TaskByWeekScreen';
import { useRoutineTasks } from './useRoutineTasks';
import { handleAddTask } from './taskHandler';
import { styles } from './styles';

const Tab = createBottomTabNavigator();

/**
 * Rotinas component renders a screen for managing daily and weekly routine tasks.
 * 
 * @component
 * @description Provides a tab-based interface for viewing tasks by day and week, 
 * with a modal for adding new habits/tasks.
 * 
 * @returns {React.ReactElement} A screen with bottom tab navigation for task management
 * 
 * @uses useRoutineTasks - Hook for managing task state
 * @uses NewHabit - Modal component for creating new tasks
 * @uses TaskByDayScreen - Screen for displaying tasks by day
 * @uses TaskByWeekScreen - Screen for displaying tasks by week
 */
const Rotinas = () => {
  const [showModal, setShowModal] = useState(false);
  const { routine, setRoutine } = useRoutineTasks();

  return (
    <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
          {/* Modal to new tasks  */}
            <Modal
              visible={showModal}
              animationType="slide"
              transparent
              onRequestClose={() => setShowModal(false)}
            >
              <View style={styles.modalContent}>
                <NewHabit
                  onAbort={() => setShowModal(false)}
                  onAdd={async (task, dias) =>
                    await handleAddTask(task, dias, setRoutine, () =>
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
                children={() => (
                  <TaskByDayScreen routines={routine} setRoutines={setRoutine} />
                )}
              />
              <Tab.Screen
                name="Por semana"
                children={() => (
                  <TaskByWeekScreen routines={routine} setRoutines={setRoutine} />
                )}
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
          </View>
        </SafeAreaView>
    </SafeAreaProvider>
  );
};

/**
 * Rotinas component renders a screen for managing daily and weekly routine tasks.
 * 
 * @component
 * @description Provides a tab-based interface for viewing tasks by day and week, 
 * with a modal for adding new habits/tasks.
 * 
 * @returns {React.ReactElement} A screen with bottom tab navigation for task management
 * 
 * @uses useRoutineTasks - Hook for managing task state
 * @uses NewHabit - Modal component for creating new tasks
 * @uses TaskByDayScreen - Screen for displaying tasks by day
 * @uses TaskByWeekScreen - Screen for displaying tasks by week
 */
export default Rotinas;
