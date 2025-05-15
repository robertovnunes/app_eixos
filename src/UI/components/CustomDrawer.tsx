// CustomDrawerContent.tsx
import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

const CustomDrawerContent: React.FC<any> = (props) => {

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      <View style={styles.ButtonContainer}>
        <Button
          title="Configurações"
          onPress={() => props.navigation.navigate('Configurações')}
        />
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    padding: 16,
  },
});
