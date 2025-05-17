import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import Task from "interfaces/Task";
import RoutineTask from "interfaces/RoutineTask";

interface TaskItemProps {
    task: Task | RoutineTask;
    onDelete: (id: string) => void;
}
const TaskItemList: React.FC<TaskItemProps> = ({ task, onDelete }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                marginVertical: 5,
                borderWidth: 1,
                borderRadius: 5,
            }}
        >
            <TouchableOpacity style={{ flex: 1 }}>
                <Text>
                    {task.titulo}
                </Text>
                <Text style={{ fontSize: 12, color: "gray" }}></Text>
                
            </TouchableOpacity>
            <Button title="🗑" color="red" onPress={() =>{ }} />
        </View>
    );
};

export default TaskItemList;
