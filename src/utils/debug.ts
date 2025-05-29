import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEBUG_MODE = process.env.EXPO_PUBLIC_DEBUG === 'true';

export const clearZustandStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const zustandKeys = keys.filter(key => 
      key.startsWith('device-storage') || 
      key.startsWith('theme-storage') ||
      key.startsWith('user-storage')
    );
    await AsyncStorage.multiRemove(zustandKeys);
    return true;
  } catch (error) {
    console.error('Error clearing Zustand storage:', error);
    return false;
  }
}; 