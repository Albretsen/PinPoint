import PinMapView from "@/src/components/MapView";
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
      <View style={styles.mapContainer}>
        <PinMapView
          allowMarkerPlacement={true}
          onLocationSelect={(coordinate) => {
            console.log("Selected location:", coordinate);
          }}
          correctLocation={{
            latitude: 60.38855338545047,
            longitude: 5.329026082594844,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: 300,
    width: "100%",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});
