import React from 'react';
import { View, StyleSheet, Button, Modal } from 'react-native';
import { FAB, Provider } from 'react-native-paper';

interface FloatingButtonProps {
    onClick: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => {
    return (
      <Provider>
        <View style={{ alignSelf: 'flex-end' }}>
          <FAB
            style={{
              marginEnd: 10,
              backgroundColor: '#6200EE',
            }}
            icon="plus"
            onPress={() => onClick()}
          />
        </View>
      </Provider>
    );
  };

  export default FloatingButton;