import { useTheme } from "@/src/context/ThemeProvider";
import React, { useState } from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import MapView, {
  MapPressEvent,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";

interface MapViewProps {
  style?: ViewStyle;
  initialRegion?: Region;
  zoomEnabled?: boolean;
  onLocationSelect?: (coordinate: {
    latitude: number;
    longitude: number;
  }) => void;
  allowMarkerPlacement?: boolean;
  correctLocation?: {
    latitude: number;
    longitude: number;
  };
}

const DEFAULT_REGION = {
  latitude: 60.37788555085164,
  longitude: 5.332091644443243,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export function PinMapView({
  style,
  initialRegion,
  zoomEnabled,
  onLocationSelect,
  allowMarkerPlacement,
  correctLocation,
}: MapViewProps) {
  const { theme } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const region = initialRegion || DEFAULT_REGION;

  const handleMapPress = (event: MapPressEvent) => {
    const coordinate = event.nativeEvent.coordinate;
    setSelectedLocation(coordinate);
    onLocationSelect?.(coordinate);
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        provider={Platform.select({
          ios: PROVIDER_GOOGLE,
          android: PROVIDER_GOOGLE,
          default: undefined,
        })}
        initialRegion={region}
        region={region}
        onPress={handleMapPress}
        zoomEnabled={zoomEnabled}
        showsCompass={true}
        loadingEnabled={true}
        loadingIndicatorColor={theme.colors.text}
        loadingBackgroundColor={theme.colors.background}
      >
        {selectedLocation && allowMarkerPlacement && (
          <Marker
            coordinate={selectedLocation}
            pinColor={theme.colors.primary}
          />
        )}
        {correctLocation &&
          correctLocation.latitude !== undefined &&
          correctLocation.longitude !== undefined && (
            <Marker
              coordinate={correctLocation}
              pinColor={theme.colors.success}
            />
          )}
      </MapView>
    </View>
  );
}

PinMapView.defaultProps = {
  style: {},
  initialRegion: DEFAULT_REGION,
  zoomEnabled: true,
  onLocationSelect: () => {},
  allowMarkerPlacement: false,
  correctLocation: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

PinMapView.displayName = "PinMapView";

export default PinMapView;
