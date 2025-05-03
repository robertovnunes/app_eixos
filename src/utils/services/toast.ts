import Toast from 'react-native-toast-message';

export const showToast = (
  type: 'success' | 'error' | 'info',
  title: string,
  message: string,
  position: 'top' | 'bottom' = 'bottom'
) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position,
  });
};