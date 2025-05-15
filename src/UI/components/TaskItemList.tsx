import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";


interface TaskItemProps {
    onDelete: (id: string) => void;
}
const TaskItemList: React.FC<TaskItemProps> = ({  onDelete }) => {
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
                    
                </Text>
                <Text style={{ fontSize: 12, color: "gray" }}></Text>
                
            </TouchableOpacity>
            <Button title="🗑" color="red" onPress={() =>{ }} />
        </View>
    );
};

export default TaskItemList;
