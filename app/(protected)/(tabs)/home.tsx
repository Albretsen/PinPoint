import Card from '@/src/components/Card';
import { useTheme } from '@/src/context/ThemeProvider';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card
        image={require('@/assets/images/partial-react-logo.png')}
        header="Bergen Brothers"
        subheading="Reveals in 02:34:02 seconds"
        buttonLabel="Guess Location"
        onButtonPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
}); 