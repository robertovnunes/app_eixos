import { Timer } from 'interfaces/timer';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useTheme } from '../../utils/contexts/themeContext';


interface TimerProps {
  timer: Timer;
}


const TimerItem: React.FC<TimerProps> = ({ timer }) => {
  const initialSeconds =
    timer.focusDuration.minutes * 60 + timer.focusDuration.seconds;
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(initialSeconds); // Armazenar o tempo inicial
  const { isDarkMode } = useTheme();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, seconds]);

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(initialTime);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.timerText,
      {color: isDarkMode ? 'white' : 'black'}]
       }>{formatTime(seconds)}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={isActive ? 'Pausar' : 'Iniciar'}
          onPress={isActive ? pauseTimer : startTimer}
        />
        <Button title="Resetar" onPress={resetTimer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
    margin: 'auto',
    width: '90%',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    alignContent: 'center'
  },
});

export default TimerItem;
