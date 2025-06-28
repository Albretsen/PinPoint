import * as Font from 'expo-font';

export function useLoadFonts() {
    return Font.useFonts({
        'LilitaOne': require('@/assets/fonts/LilitaOne-Regular.ttf'),
    });
}
