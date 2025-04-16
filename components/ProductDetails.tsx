import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export interface ParsedProduct {
  name: string;
  brand: string;
  image: string | null;
  ecoscore_grade: string,
  ecoscore_tags: string[],
  ecoscore_score: number
}

export default function ProductDetails({ product }: { product: ParsedProduct }) {
  const placeholderImageUrl = "https://imgs.search.brave.com/N3kz3YyqQ73ZxtIMC1yqojMp9GTZ8Qry_YVyUOkT7VU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDU4/NjY5MzU3L3Bob3Rv/L2NvY2EtY29sYS1j/YW4uanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPW9ZQnRKRHpK/dThueGV3enlIRnMx/S3NoTUYzRTFWdGFN/aUlmak94QmFhN1U9";

  return (
    <ThemedView style={styles.container}>
      <View style={styles.productCardSection}>
        <View style={styles.productCard}>
          <Image 
            source={product.image ? { uri: product.image } : { uri: placeholderImageUrl }} 
            style={styles.productImage} 
          />
          <View style={styles.productContent}>
            <ThemedText style={styles.productTitle}>{product.name}</ThemedText>
            <ThemedText style={styles.productBrand}>{product.brand}</ThemedText>
          </View>
        </View>
      </View>
      
      {/* Ingredients section */}
      {product.name && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>ECO-SCORE</ThemedText>
          {/* <ThemedText style={styles.ingredients}>{product.ingredients}</ThemedText> */}
          <ThemedText style={styles.ecoscoreText}>Ecoscore: {product.ecoscore_score || 'Unknown'}</ThemedText>
          <ThemedText style={styles.ecoscoreText}>Ecoscore Grade: {product.ecoscore_grade || 'Unknown'}</ThemedText>
        </View>
      )}      

    </ThemedView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    productCardSection: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    productCard: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    productImage: {
      width: 80,
      height: 100,
      borderRadius: 8,
      marginRight: 16,
    },
    productContent: {
      flex: 1,
      justifyContent: 'center',
    },
    productTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
    },
    productBrand: {
      fontSize: 14,
      marginBottom: 8,
    },
    section: {
      paddingHorizontal: 16,
      paddingTop: 24,
    },
    sectionTitle: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 4,
    },
    ecoscoreText: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 4,
    },
  });
  