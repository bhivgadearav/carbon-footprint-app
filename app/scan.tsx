import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Camera, CameraView, BarcodeScanningResult } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import ProductDetailsSheet from '@/components/ProductDetailsSheet';
import ScanInstructions from '@/components/ScanInstructions';
import { ParsedProduct } from '@/components/ProductDetails';

const dummyProduct: ParsedProduct = {
  name: 'XYZ Product',
  brand: 'XYZ Brand',
  image: null,
  ecoscore_grade: '',
  ecoscore_tags: [],
  ecoscore_score: 0
};

interface ApiNutriments {
  proteins_100g?: number;
  'saturated-fat_100g'?: number;
  sugars_100g?: number;
  salt_100g?: number;
  energy_value?: number;
  'energy-kcal_100g'?: number;
  energy_unit?: string;
  [key: string]: any; // For other nutriments that might be present
}

interface ApiProduct {
  product_name?: string;
  brands?: string;
  image_url?: string;
  image_front_url?: string;
  nutriments?: ApiNutriments;
  additives_n?: number;
  additives_tags?: string[];
  nutriscore_grade?: string;
  nova_group?: number;
  ingredients_text?: string;
  [key: string]: any; // For other properties that might be present
}

interface ApiResponse {
  status: number;
  product: ApiProduct;
  code: string;
  [key: string]: any; // For other properties in the response
}

const API_URL = "https://in.openfoodfacts.org/api/v0/product/"

// Function to fetch product data by barcode
export const fetchProductByBarcode = async (barcode: string): Promise<ParsedProduct> => {
  try {
    const response = await fetch(`${API_URL}${barcode}.json`);
    const data: ApiResponse = await response.json();
    
    if (data.status === 1) {
      // Product found
      return parseProductData(data.product);
    } else {
      // Product not found
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product data:', error);
    throw error;
  }
};

// Parse the raw API data to get the specific nutritional values we want
const parseProductData = (product: ApiProduct): ParsedProduct => {
  const nutriments = product.nutriments || {};
  
  return {
    name: product.product_name || 'Unknown Product',
    brand: product.brands || 'Unknown Brand',
    image: product.image_url || product.image_front_url || null,
    ecoscore_grade: product.ecoscore_grade || 'Unknown',
    ecoscore_tags: product.ecoscore_tags || 'Unknown',
    ecoscore_score: product.ecoscore_score || 0
  };
};

export default function BarcodeScanner() {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<ParsedProduct>();
  const theme = useColorScheme() ?? 'light';

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async (scanningResult: BarcodeScanningResult) => {
    setScanned(true);
    const { type, data } = scanningResult;
    const result = await fetchProductByBarcode(data);
    setScannedData(result)
  };

  if (permission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText>Requesting camera permission...</ThemedText>
      </SafeAreaView>
    );
  }

  if (permission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText>No access to camera</ThemedText>
        <Button 
          title="Request Permission" 
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setPermission(status === 'granted');
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scannerContainer}>
        <CameraView
          style={styles.scanner}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              'qr',
              'aztec',
              'ean13',
              'ean8',
              'pdf417',
              'upc_e',
              'datamatrix',
              'code39',
              'code128',
              'code93',
              'itf14',
              'upc_a'
            ],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanWindowContainer}> 
              <View style={styles.scanWindow}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>
          </View>
        </CameraView>

        {/* Results section */}
          {scanned && (
            <ProductDetailsSheet data={scannedData || dummyProduct} />
          )}
          {!scanned && (
            <ScanInstructions />
          )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productContainer: {
    flex: 1,
    zIndex: 100,
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanWindowContainer: {
    borderWidth: 2,
    padding: 10,
    bottom: 40,
    borderColor: '#fff',
  },
  scanWindow: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    width: 30,
    height: 30,
    borderColor: '#fff',
    position: 'absolute',
  },
  topLeft: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    top: 0,
    left: 0,
  },
  topRight: {
    borderTopWidth: 2,
    borderRightWidth: 2,
    top: 0,
    right: 0,
  },
  bottomLeft: {
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    borderBottomWidth: 2,
    borderRightWidth: 2,
    bottom: 0,
    right: 0,
  },
  resultContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});