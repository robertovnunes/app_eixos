import React from 'react';
import { View, StyleSheet, Button, Modal } from 'react-native';
import { loadTimers } from '../../utils/storage/timers.storage';
import TimerItem from '../components/Timer';
import { Timer } from 'interfaces/timer';

const Focus = () => {
  const [timers, setTimers] = React.useState<Timer[]>([]);
  const [selectedTimer, setSelectedTimer] = React.useState<Timer | null>(null);

  React.useEffect(() => {
    async function initializeTimers() {
      const loadedTimers = await loadTimers();
      setTimers(loadedTimers);

      // Carregue o temporizador padrão
      const defaultTimer = loadedTimers.find((timer) => timer.isDefault);
      if (defaultTimer) {
        setSelectedTimer(defaultTimer);
      } else if (loadedTimers.length > 0) {
        //Se não tiver um timer default, pega o primeiro timer da lista.
        setSelectedTimer(loadedTimers[0]);
      }
    }

    initializeTimers();
  }, []);

  const handleSelectTimer = (timer: Timer) => {
    console.log('Selected timer:', selectedTimer);
    if (selectedTimer && selectedTimer.id === timer.id) {
      return;
    }
    setSelectedTimer(timer);
  };

  return (
    <View style={{ flex: 1 }}>
    <View style= {styles.timer}>{selectedTimer && <TimerItem timer={selectedTimer} />}</View>
      <View style={styles.timerList}>
        {timers.map((timer) => (
          <Button
            key={timer.id}
            title={timer.name}
            onPress={() => handleSelectTimer(timer)}
          />
        ))}
      </View>

    </View>
  );
};

export default Focus;

const styles = StyleSheet.create({
  timerList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
    timer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '20%',
    },
});
