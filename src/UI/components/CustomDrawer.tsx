// CustomDrawerContent.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useTheme } from './../../utils/contexts/themeContext';

const CustomDrawerContent: React.FC<any> = (props) => {
  const { toggleDarkMode } = useTheme();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      <View style={styles.ButtonContainer}>
        <Button
          title="Configurações"
          onPress={() => props.navigation.navigate('Configurações')}
        />
        <Button title="Toggle Dark Mode" onPress={toggleDarkMode} />
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    padding: 16
  },
});
