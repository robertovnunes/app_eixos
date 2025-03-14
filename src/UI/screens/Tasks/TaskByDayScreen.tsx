import * as Notifications from 'expo-notifications';
import { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { RoutineTask } from 'interfaces/routineTask';
import { loadTasks } from '../../../utils/storage/routine.storage';
import { ReloadContext } from '../../../utils/contexts/reloadContext';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../utils/contexts/themeContext';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const TaskByDayScreen = () => {
  const [tasks, setTasks] = useState<RoutineTask[]>([]);
  const currentDate = new Date(); // Data atual
  const [selectedDay, setSelectedDay] = useState(currentDate.getDay()); // Dia atual
  const [monthDay, setMonthDay] = useState(currentDate.getDate()); // Dia do mês
  const [month, setMonth] = useState(currentDate.getMonth()); // Mês
  const { reload } = useContext(ReloadContext);
  let isActive = true;

  const { isDarkMode } = useTheme();
  const color = isDarkMode ? 'white' : 'black';

  const scheduleTaskNotifications = async (tasks: RoutineTask[]) => {
    //Cancelar as notificações anteriores
    await Notifications.cancelAllScheduledNotificationsAsync()
    tasks.forEach(async (task) => {
      // Certifique-se de que o formato de horário é HH:MM
      if (typeof task.horario !== 'string' || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(task.horario)) {
        console.error('Formato de horário inválido:', task.horario);
        return;
      }
  
      const [hour, minute] = task.horario.split(':').map(Number);
      const now = new Date();
  
      const notificationTime = new Date();
      notificationTime.setHours(hour);
      notificationTime.setMinutes(minute);
      notificationTime.setSeconds(0);
  
      // Calcula a diferença de tempo em minutos (entre 30 minutos e agora)
      let timeDiffMinutes = Math.floor((notificationTime.getTime() - now.getTime()) / 60000);
  
      // Se a diferença for menor que zero, significa que o horário já passou
      if (timeDiffMinutes < 0) {
        timeDiffMinutes = 0;
      }
  
      // Garante que a diferença não seja superior a 30 minutos
      if(timeDiffMinutes > 30){
        timeDiffMinutes = 30
      }
  
      // Agendar notificação
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lembrete de Tarefa',
          body: `Sua tarefa "${task.titulo}" está para começar em breve!`,
          data: { taskId: task.id },
        },
        trigger: {
          seconds: timeDiffMinutes * 60, // Converter para segundos
          channelId: 'eixos-channel', // Canal do android
        },
      });
    });
  };
  

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (isActive) {
        setSelectedDay(currentDate.getDay());
        setMonthDay(currentDate.getDate());
        setMonth(currentDate.getMonth());
      }
      return () => {
        isActive = false;
      };
    }, []),
  );

  // Carregar tarefas
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchTasks = async () => {
        if (isActive) {
          const savedTasks = await loadTasks();
          setTasks(savedTasks);
        }
      };
      fetchTasks();
      return () => {
        isActive = false;
      };
    }, [reload]),
  );

    useEffect(() => {
  
      const fetchTasks = async () => {
        if (isActive) {
          const savedTasks = await loadTasks();
          setTasks(savedTasks);
        }
      };
      fetchTasks().then(() => {
        const filtered = tasks.filter((task) =>
          task.diasDaSemana.includes(weekDays[selectedDay]),
        );
        scheduleTaskNotifications(filtered);
      });
      return () => {
        isActive = false;
      };
    }, [reload, selectedDay]);
  

  // Filtrar tarefas que têm o dia selecionado na lista de dias da task
  const filteredTasks = tasks.filter((task) =>
    task.diasDaSemana.includes(weekDays[selectedDay]),
  );

  // Mudar para o dia anterior
  const prevDayWeek = () => {
    setSelectedDay((prev) => (prev === 0 ? 6 : prev - 1)); // Se for Domingo (0), volta para Sábado (6)
    if (monthDay === 1) {
      setMonth((prevMonth) => {
        const newMonth = prevMonth === 0 ? 11 : prevMonth - 1; // Voltar um mês
        const lastDayOfNewMonth = new Date(
          new Date().getFullYear(),
          newMonth + 1,
          0,
        ).getDate(); // Último dia do mês anterior
        setMonthDay(lastDayOfNewMonth); // Ajusta o dia para o último dia do mês anterior
        return newMonth;
      });
    } else {
      setMonthDay((prev) => prev - 1); // Apenas retrocede um dia
    }
  };

  // Mudar para o próximo dia
  const nextDayWeek = () => {
    setSelectedDay((prev) => (prev === 6 ? 0 : prev + 1)); // Se for Sábado (6), avança para Domingo (0)
    const lastDayOfCurrentMonth = new Date(
      new Date().getFullYear(),
      month + 1,
      0,
    ).getDate();

    if (monthDay === lastDayOfCurrentMonth) {
      setMonth((prevMonth) => {
        const newMonth = prevMonth === 11 ? 0 : prevMonth + 1; // Avança um mês
        setMonthDay(1); // Primeiro dia do próximo mês
        return newMonth;
      });
    } else {
      setMonthDay((prev) => prev + 1); // Apenas avança um dia
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Cabeçalho */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <Button title="⬅ Anterior" onPress={prevDayWeek} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', color }}>
          {`${weekDays[selectedDay]} (${monthDay}/${month + 1})`}
        </Text>
        <Button title="Próximo ➡" onPress={nextDayWeek} />
      </View>

      {/* Lista de Tarefas */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              marginVertical: 5,
              borderWidth: 1,
              borderRadius: 5,
            }}
          >
            <Text style={{ color }}>
              {item.titulo} - {item.horario}
            </Text>
            <TouchableOpacity
              onPress={() => alert(`Detalhes de ${item.titulo}`)}
            >
              <Text style={{ color: 'blue' }}>Ver</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color }}>
            Nenhuma tarefa para este dia.
          </Text>
        }
      />
    </View>
  );
};

export default TaskByDayScreen;
