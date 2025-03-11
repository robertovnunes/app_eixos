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
      <View style={styles.toggleButtonContainer}>
        <Button title="Toggle Dark Mode" onPress={toggleDarkMode} />
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  toggleButtonContainer: {
    padding: 16,
  },
});
