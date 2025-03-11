import React from "react";
import { View, StyleSheet, Button } from "react-native";
import { loadTimers, saveTimer } from "../../utils/storage";
import TimerItem from "../components/Timer";
import { Timer } from "interfaces/timer";

const Focus = () => {

    const [timers, setTimers] = React.useState<Timer[]>([]);
    const [selectedTimer, setSelectedTimer] = React.useState<Timer | null>(null);

    React.useEffect(() => {
        loadTimers().then((timers) => {
            setTimers(timers);
        });
    }, []);

    React.useEffect(() => {
        setDefaultTimers();
    }, [timers]);

    const handleSelectTimer = (timer: Timer) => {
        setSelectedTimer(timer);
    };

    const setDefaultTimers = () => {
        if (timers.length === 0) {
            const defaultTimer: Timer = 
            {
                id: "1",
                name: "Pomodoro",
                focusDuration: { minutes: 25, seconds: 0 },
                shortBreakDuration: { minutes: 5, seconds: 0 },
                longBreakDuration: { minutes: 15, seconds: 0 },
                loops: 4,
            };
            setTimers(prevState => [...prevState, defaultTimer]);
            saveTimer(defaultTimer);
        }
    }

    return (
        <View>
            <View style={styles.timerList}>
                {timers.map((timer) => (
                    <Button
                        key={timer.id}
                        title={timer.name}
                        onPress={() => handleSelectTimer(timer)}
                    />
                ))}
            </View>
            {selectedTimer && <TimerItem initialMinutes={selectedTimer.focusDuration.minutes} />}
        </View>
    );
}

export default Focus;

const styles = StyleSheet.create({
    timerList: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
});