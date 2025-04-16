import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useCallback, useRef } from 'react';
import { Colors } from '@/constants/Colors';
import { StyleSheet, useColorScheme } from 'react-native';
import ProductDetails from './ProductDetails';
import { ParsedProduct } from './ProductDetails';

export default function ProductDetailsSheet({ data }: { data: ParsedProduct }) {

    const bottomSheetRef = useRef<BottomSheet>(null);
    const theme = useColorScheme() ?? 'light';
    const handleSheetChanges = useCallback((index: number) => {
        // console.log('handleSheetChanges', index);
    }, []);
    
    return (
        <BottomSheet
        snapPoints={['48%', '15%']}
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            backgroundStyle={{ backgroundColor: theme === 'light' ? Colors.light.background : Colors.dark.background }}
            handleIndicatorStyle={{ backgroundColor: theme === 'light' ? Colors.light.icon : Colors.dark.icon }}
        >
            <BottomSheetScrollView style={{flex: 1}}>
                <ProductDetails product={data} />
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
