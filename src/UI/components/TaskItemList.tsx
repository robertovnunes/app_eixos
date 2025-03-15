import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { Task } from "interfaces/task";

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

const TaskItemList: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                marginVertical: 5,
                borderWidth: 1,
                borderColor: task.concluido ? "green" : "gray",
                borderRadius: 5,
            }}
        >
            <TouchableOpacity onPress={() => onToggle(task.id)} style={{ flex: 1 }}>
                <Text>
                    {task.titulo} - {task.horario}
                </Text>
                <Text style={{ fontSize: 12, color: "gray" }}>{task.descricao}</Text>
                
            </TouchableOpacity>
            <Button title="🗑" color="red" onPress={() => onDelete(task.id)} />
        </View>
    );
};

export default TaskItemList;
