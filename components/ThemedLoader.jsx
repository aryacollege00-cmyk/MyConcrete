import { StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

const ThemedLoader = () => {
  const scheme = useColorScheme();
  const theme = Colors[scheme] ?? Colors.light;

  return (
    <ActivityIndicator
      size='large'
      color={theme.text}
    />
  );
};

export default ThemedLoader;

const styles = StyleSheet.create({});
