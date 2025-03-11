import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { Task } from 'interfaces/task';
import { loadTasks } from '../../../utils/storage';
import { ReloadContext } from '../../../utils/contexts/reloadContext';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../utils/contexts/themeContext';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const TaskByDayScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const currentDate = new Date(); // Data atual
  const [selectedDay, setSelectedDay] = useState(currentDate.getDay()); // Dia atual
  const [monthDay, setMonthDay] = useState(currentDate.getDate()); // Dia do mês
  const [month, setMonth] = useState(currentDate.getMonth()); // Mês
  const { reload } = useContext(ReloadContext);


  const { isDarkMode } = useTheme();
  const color = isDarkMode ? 'white' : 'black';

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

  // Filtrar tarefas que têm o dia selecionado na lista de dias da task
  const filteredTasks = tasks.filter((task) =>
    task.dias.includes(weekDays[selectedDay]),
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
              borderColor: item.completed ? 'green' : 'gray',
              borderRadius: 5,
            }}
          >
            <Text style={{ color }}>
              {item.icon} {item.titulo} - {item.horario}
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
