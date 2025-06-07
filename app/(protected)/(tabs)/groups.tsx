import PinText from "@/src/components/PinText";
import { useTheme } from "@/src/context/ThemeProvider";
import { StyleSheet, View } from "react-native";

export default function GroupsScreen() {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <PinText style={[styles.title, { color: theme.colors.text }]}>
        Groups
      </PinText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});
