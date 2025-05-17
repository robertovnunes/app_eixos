import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Rotina from 'interfaces/Rotina';
import Task, { SubTask } from 'interfaces/Task';
import taskStorage from '../../../../utils/storage/tasks.storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../../utils/contexts/themeContext';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface TaskByDayScreenProps {
  routines: Rotina[]; // Array de rotinas do dia
  setRoutines: React.Dispatch<React.SetStateAction<Rotina[]>>; // Função para atualizar as rotinas
}

const TaskByDayScreen: React.FC<TaskByDayScreenProps> = ({
  routines,
  setRoutines,
}) => {
  const currentDate = new Date(); // Data atual
  const [selectedDay, setSelectedDay] = useState(currentDate.getDay()); // Dia atual
  const [monthDay, setMonthDay] = useState(currentDate.getDate()); // Dia do mês
  const [month, setMonth] = useState(currentDate.getMonth()); // Mês atual
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]); // Tarefas filtradas

  const { isDarkMode } = useTheme();
  const color = isDarkMode ? 'white' : 'black';

  useFocusEffect(
    useCallback(() => {
      let isActive = true; // Variável para controlar o estado do componente
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

  useEffect(() => {
    //Função que carrega filteredTasks
    const loadFilteredTasks = async () => {
      const rotina = routines.find((r) => r.dia === selectedDay);
      if (!rotina) {
        setFilteredTasks([]);
        return;
      }
      routines[selectedDay]?.tarefas.forEach(async (taskId) => {
        // Filtra as rotinas do dia selecionado
        const task = await taskStorage.getById(taskId);
        if (task) {
          // Atualiza a lista de tarefas filtradas
          setFilteredTasks((prev) => [
            ...prev,
            { ...task, subtasks: Array.from(task.subtasks || []) },
          ]);
        }
        return null;
      });
    };
    // Atualiza a lista de tarefas filtradas sempre que selectedDay ou tasks muda
    loadFilteredTasks();
  }, [routines, selectedDay]);
  // Função para excluir tarefa
  const handleDeleteTask = async (id: string) => {
    try {
      Alert.alert(
        'Selecione uma opção',
        'Deseja excluir tarefa apenas no dia atual ou em todos os dias?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Atual',
            onPress: () => {
              if (filteredTasks.length > 0) {
                //handleDeleteRoutineTask(id, selectedDay, setFilteredTasks);
              } else {
                Alert.alert('Nenhuma tarefa encontrada para excluir.');
              }
            },
          },
          {
            text: 'Todos',
            onPress: async () => {
              if (filteredTasks.length > 0) {
                //await handleDeleteFullRoutineTask(id, selectedDay, setTasks); // Chama a função de exclusão
              } else {
                Alert.alert('Nenhuma tarefa encontrada para excluir.');
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

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
            <View style={{ flexDirection: 'row', margin: 10, gap: 10 }}>
              <TouchableOpacity
                onPress={() =>
                  alert(`Detalhes de ${item.titulo}\n${item.descricao}`)
                }
              >
                <Text style={{ color: 'blue' }}>Ver</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (item.id) handleDeleteTask(item.id); // Chama a função de exclusão
                }}
              >
                <Text style={{ color: 'red' }}>Excluir</Text>
              </TouchableOpacity>
            </View>
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
