import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useRef } from 'react';
import { Colors } from '@/constants/Colors';
import { StyleSheet, useColorScheme } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import ProductDetails from './ProductDetails';
import { ParsedProduct } from '@/app/scan';

export default function ProductDetailsSheet({ data }: { data: ParsedProduct }) {

    const bottomSheetRef = useRef<BottomSheet>(null);
    const theme = useColorScheme() ?? 'light';
    const handleSheetChanges = useCallback((index: number) => {
        // console.log('handleSheetChanges', index);
    }, []);
    
    return (
        <BottomSheet
        snapPoints={['48%', '100%']}
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            backgroundStyle={{ backgroundColor: theme === 'light' ? Colors.light.background : Colors.dark.background }}
            handleIndicatorStyle={{ backgroundColor: theme === 'light' ? Colors.light.icon : Colors.dark.icon }}
        >
            <BottomSheetScrollView style={{flex: 1}}>
                <ProductDetails product={data} />
                {/* <ThemedView style={styles.contentContainer}>
                    <ThemedText>Name: {data.name}</ThemedText>
                    <ThemedText>Brand: {data.brand}</ThemedText>
                    <ThemedText>Ingredients: {data.ingredients}</ThemedText>
                    <ThemedText>Protein: {data.nutrition.protein.value} {data.nutrition.protein.unit}</ThemedText>
                    <ThemedText>Saturated Fat: {data.nutrition.saturatedFat.value} {data.nutrition.saturatedFat.unit}</ThemedText>
                    <ThemedText>Sugar: {data.nutrition.sugar.value} {data.nutrition.sugar.unit}</ThemedText>
                    <ThemedText>Salt: {data.nutrition.salt.value} {data.nutrition.salt.unit}</ThemedText>
                    <ThemedText>Calories: {data.nutrition.calories.value} {data.nutrition.calories.unit}</ThemedText>
                    <ThemedText>Additives Count: {data.additives.count}</ThemedText>
                    <ThemedText>Ingredients: {data.ingredients}</ThemedText>
                </ThemedView> */}
            </BottomSheetScrollView>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center'
    }
})
