import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Task } from 'interfaces/task';
import { loadTasks } from '../../../utils/storage';
import { ReloadContext } from '../../../utils/contexts/reloadContext';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../utils/contexts/themeContext';

// Array contendo os dias da semana abreviados.
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Get screen width for dynamic sizing
const { width: screenWidth } = Dimensions.get('window');

/**
 * Componente funcional para exibir as tarefas de uma semana específica.
 */
const TaskByWeekScreen = () => {
  // Estado para armazenar a lista de tarefas.
  const [tasks, setTasks] = useState<Task[]>([]);
  // Data atual.
  const currentDate = new Date();
  // Estado para armazenar os 7 dias da semana atual.
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  // Estado para armazenar o dia selecionado. Inicia com a data atual.
  const [selectedDay, setSelectedDay] = useState<Date>(currentDate);
  // Contexto para gerenciar o recarregamento das tarefas.
  const { reload } = useContext(ReloadContext);
  // Contexto para verificar o modo escuro
  const { isDarkMode } = useTheme();
  const color = isDarkMode ? 'white' : 'black';
  // Ref para o ScrollView
  const scrollViewRef = useRef<ScrollView>(null);

  /**
   * Função para gerar os próximos 7 dias a partir de uma data inicial.
   * @param startDate Data inicial para gerar os próximos 7 dias.
   * @returns Um array de objetos Date representando os próximos 7 dias.
   */
  const getNext7Days = (startDate: Date): Date[] => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(startDate);
      nextDay.setDate(startDate.getDate() + i);
      days.push(nextDay);
    }
    return days;
  };

  /**
   * Função para formatar uma data para exibição no formato "DiaDaSemana (dd/mm)".
   * @param date Objeto Date a ser formatado.
   * @returns Uma string representando a data formatada.
   */
  const formatDate = (date: Date): string => {
    return `${weekDays[date.getDay()]} (${date.getDate()}/${
      date.getMonth() + 1
    })`;
  };

  /**
   * Função assíncrona para carregar as tarefas do armazenamento local.
   * @param isActive Indica se a função deve ser executada.
   */
  const fetchTasks = async (isActive: boolean) => {
    if (isActive) {
      const savedTasks = await loadTasks();
      setTasks(savedTasks);
    }
  };

  // Hook para executar efeitos colaterais quando a tela ganha ou perde o foco.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      // Carrega os próximos 7 dias
      if (isActive) {
        const next7Days = getNext7Days(currentDate);
        setCurrentWeek(next7Days);
      }
      // Carrega as tarefas apenas se a tela estiver ativa
      fetchTasks(isActive);
      // Função de limpeza (executada quando a tela perde o foco ou quando o componente é desmontado).
      return () => {
        isActive = false;
      };
    }, [reload]),
  );

  //useEffect para atualizar os dias da semana quando a pagina é carregada
  useEffect(() => {
    const today = new Date();
    const next7Days = getNext7Days(today);
    setCurrentWeek(next7Days);
  }, []);

  // Filtrar tarefas para o dia selecionado.
  const filteredTasks = tasks.filter((task) =>
    task.dias.includes(weekDays[selectedDay.getDay()]),
  );

  // Function to handle day selection
  const handleDayPress = (day: Date) => {
    setSelectedDay(day);
    // Scroll to the selected day's item
    const index = currentWeek.indexOf(day);
    if (index !== -1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: (index * screenWidth) / 7,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Carousel de dias da semana */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        snapToInterval={screenWidth / 7} // Snap to each day item
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
      >
        {currentWeek.map((day) => (
          <TouchableOpacity
            key={day.toISOString()}
            style={[
              styles.dayItem,
              {width: screenWidth / 5},
              selectedDay.getDate() === day.getDate() &&
                selectedDay.getMonth() === day.getMonth() &&
                selectedDay.getFullYear() === day.getFullYear() &&
                styles.selectedDayItem,
            ]}
            onPress={() => handleDayPress(day)}
          >
            <Text
              style={[
                styles.dayText,
                {color},
                selectedDay.getDate() === day.getDate() &&
                  selectedDay.getMonth() === day.getMonth() &&
                  selectedDay.getFullYear() === day.getFullYear() && {
                    color: 'white',
                  },
              ]}
            >
              {formatDate(day)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de tarefas filtradas para o dia selecionado. */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.taskItem,
              { borderColor: item.completed ? 'green' : 'gray' },
            ]}
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
        //Mensagem caso nao tenha tarefas
        ListEmptyComponent={
          <Text style={[styles.emptyListText, { color }]}>
            Nenhuma tarefa para este dia.
          </Text>
        }
      />
    </View>
  );
};

// Folha de estilos.
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  carousel: {
    marginBottom: 20,
    maxHeight: 64, // Limit the height of the carousel
  },
  carouselContent: {
    paddingHorizontal: 10, // Add some padding to the content
  },
  dayItem: {
    width: screenWidth / 7, // Divide the screen width into 7 equal parts
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginHorizontal: 5, // Add margin between each item
  },
  selectedDayItem: {
    backgroundColor: 'blue',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TaskByWeekScreen;
