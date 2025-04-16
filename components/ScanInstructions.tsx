import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useRef } from 'react';
import { Colors } from '@/constants/Colors';
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function ScanInstructions() {

    const bottomSheetRef = useRef<BottomSheet>(null);
    const theme = useColorScheme() ?? 'light';
    const handleSheetChanges = useCallback((index: number) => {
        // console.log('handleSheetChanges', index);
    }, []);
    
    return (
        <BottomSheet
            snapPoints={['27%', '27%']}
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            backgroundStyle={{ backgroundColor: theme === 'light' ? Colors.light.background : Colors.dark.background }}
            handleIndicatorStyle={{ backgroundColor: theme === 'light' ? Colors.light.icon : Colors.dark.icon }}
        >
            <BottomSheetView style={{flex: 1}}>
                <ThemedView style={styles.sheetContainer}>
                    <View style={styles.topContentContainer}>
                        <MaterialCommunityIcons name="barcode-scan" size={48} color={Colors[theme].icon} />
                        <ThemedText style={styles.title}>Scan any Barcode to See Ingredients</ThemedText>
                    </View>
                    <ThemedText style={styles.subtitle}>
                    • Food • Edible Items Only • Drinks •
                    </ThemedText>
                </ThemedView>
            </BottomSheetView>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
  sheetContainer: {
    padding: 20,
    alignItems: 'center',
  },
  topContentContainer: {
    marginBottom: 10,
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
  },
});