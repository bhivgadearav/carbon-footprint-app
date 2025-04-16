import React from 'react';
import { View, Text, StyleSheet, Pressable, PressableProps, Image } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface NutrimentValue {
  value: number;
  unit: string;
}

interface ProductNutrition {
  protein: NutrimentValue;
  saturatedFat: NutrimentValue;
  sugar: NutrimentValue;
  salt: NutrimentValue;
  calories: NutrimentValue;
}

interface ProductAdditives {
  count: number;
  tags: string[];
  names: string[];
}

export interface ParsedProduct {
  name: string;
  brand: string;
  image: string | null;
  nutrition: ProductNutrition;
  additives: ProductAdditives;
  nutriscore: string | null;
  novaGroup: number | null;
  ingredients: string;
}

interface CategoryBarProps {
  value: number;
  max: number;
}

interface NutritionItemProps {
  IconComponent: typeof MaterialCommunityIcons | typeof Ionicons | typeof FontAwesome5;
  iconName: string;
  title: string;
  subtitle: string;
  value: number;
  unit: string;
  showBar?: boolean;
  max?: number;
  expanded?: boolean;
  onPress?: PressableProps['onPress'];
}

const getNutriscoreColor = (score: string | null) => {
  if (!score) return '#888888';
  
  switch (score.toLowerCase()) {
    case 'a':
      return '#32CD32'; // Green
    case 'b':
      return '#90EE90'; // Light Green
    case 'c':
      return '#FFD700'; // Yellow
    case 'd':
      return '#FFA500'; // Orange
    case 'e':
      return '#FF4444'; // Red
    default:
      return '#888888'; // Grey for unknown
  }
};

const getNovaGroupDescription = (group: number | null) => {
  if (group === null) return 'Unknown processing level';
  
  switch (group) {
    case 1:
      return 'Unprocessed or minimally processed';
    case 2:
      return 'Processed culinary ingredients';
    case 3:
      return 'Processed foods';
    case 4:
      return 'Ultra-processed foods';
    default:
      return 'Unknown processing level';
  }
};

const CategoryBar: React.FC<CategoryBarProps> = ({ value, max }) => {
  const getColor = (ratio: number): string => {
    if (ratio <= 0.25) return '#FF4444';  // Poor - Red
    if (ratio <= 0.5) return '#FFD700';   // Bad - Yellow
    if (ratio <= 0.75) return '#90EE90';  // Good - Light Green
    return '#32CD32';                     // Excellent - Green
  };

  return (
    <View style={styles.barContainer}>
      <View style={styles.barBackground}>
        <View 
          style={[
            styles.barFill,
            {
              width: `${(value/max) * 100}%`,
              backgroundColor: getColor(value/max)
            }
          ]}
        />
      </View>
    </View>
  );
};

const NutritionItem: React.FC<NutritionItemProps> = ({ 
  IconComponent,
  iconName, 
  title, 
  subtitle, 
  value, 
  unit, 
  showBar = true, 
  max = 800, 
  expanded = false, 
  onPress 
}) => {
  const getStatusColor = (): string => {
    if (title === 'Additives') {
      if (value === 0) return '#32CD32';  // No Risk - Green
      if (value <= 2) return '#FFD700';   // Limited Risk - Yellow
      return '#FF4444';                   // High Risk - Red
    }

    // For nutritional values
    const ratio = value / max;
    
    if (title === 'Saturated fat' || title === 'Sugar' || title === 'Salt') {
      // Lower is better for these values
      if (ratio <= 0.25) return '#32CD32'; // Green
      if (ratio <= 0.5) return '#90EE90';  // Light Green
      if (ratio <= 0.75) return '#FFD700'; // Yellow
      return '#FF4444';                    // Red
    } else {
      // Higher is better for protein
      if (ratio >= 0.75) return '#32CD32'; // Green
      if (ratio >= 0.5) return '#90EE90';  // Light Green
      if (ratio >= 0.25) return '#FFD700'; // Yellow
      return '#FF4444';                    // Red
    }
  };

  return (
    <Pressable onPress={onPress} style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <View style={styles.titleSection}>
          <View style={styles.textContainer}>
            <View style={styles.iconContainer}><IconComponent name={iconName as any} size={24} color="#666" /></View>
            <View>
              <ThemedText style={styles.title}>{title}</ThemedText>
              <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
            </View>
          </View>
        </View>
        <View style={styles.valueSection}>
          <ThemedText style={styles.value}>
            {value}{unit}
          </ThemedText>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        </View>
      </View>
      {showBar && <CategoryBar value={value} max={max} />}
    </Pressable>
  );
};

// Get subtitle for nutrition items
const getNutritionSubtitle = (title: string, value: number, max: number): string => {
  const ratio = value / max;
  
  if (title === 'Protein') {
    if (ratio >= 0.75) return 'Excellent quantity';
    if (ratio >= 0.5) return 'Good quantity';
    if (ratio >= 0.25) return 'Average quantity';
    return 'Low quantity';
  }
  
  if (title === 'Saturated fat') {
    if (ratio <= 0.1) return 'No saturated fat';
    if (ratio <= 0.25) return 'Low saturated fat';
    if (ratio <= 0.5) return 'Average saturated fat';
    return 'High saturated fat';
  }
  
  if (title === 'Sugar') {
    if (ratio <= 0.1) return 'No sugar';
    if (ratio <= 0.25) return 'Low sugar';
    if (ratio <= 0.5) return 'Average sugar content';
    return 'High sugar content';
  }
  
  if (title === 'Salt') {
    if (ratio <= 0.1) return 'No salt';
    if (ratio <= 0.25) return 'Low salt';
    if (ratio <= 0.5) return 'Average salt content';
    return 'High salt content';
  }
  
  if (title === 'Calories') {
    if (ratio <= 0.4) return 'Low calorie content';
    if (ratio <= 0.6) return 'Average calories';
    if (ratio <= 0.8) return 'A bit too caloric';
    return 'High calorie content';
  }
  
  return '';
};

// Get subtitle for additives
const getAdditivesSubtitle = (count: number): string => {
  if (count === 0) return 'No additives';
  if (count === 1) return '1 additive found';
  return `${count} additives found`;
};

export default function ProductDetails({ product }: { product: ParsedProduct }) {
  // Define maximum values for nutritional elements
  const maxValues = {
    protein: 30,
    saturatedFat: 20,
    sugar: 25,
    salt: 6,
    calories: 800
  };
  
  // Prepare nutrition data arrays for Positives and Negatives sections
  const positiveNutritionData = [
    {
      IconComponent: MaterialCommunityIcons,
      iconName: 'arm-flex',
      title: 'Protein',
      subtitle: getNutritionSubtitle('Protein', product.nutrition.protein.value, maxValues.protein),
      value: product.nutrition.protein.value,
      unit: product.nutrition.protein.unit,
      showBar: true,
      max: maxValues.protein
    }
  ];
  
  const negativeNutritionData = [
    {
      IconComponent: FontAwesome5,
      iconName: 'hamburger',
      title: 'Saturated fat',
      subtitle: getNutritionSubtitle('Saturated fat', product.nutrition.saturatedFat.value, maxValues.saturatedFat),
      value: product.nutrition.saturatedFat.value,
      unit: product.nutrition.saturatedFat.unit,
      showBar: true,
      max: maxValues.saturatedFat
    },
    {
      IconComponent: MaterialCommunityIcons,
      iconName: 'cube-outline',
      title: 'Sugar',
      subtitle: getNutritionSubtitle('Sugar', product.nutrition.sugar.value, maxValues.sugar),
      value: product.nutrition.sugar.value,
      unit: product.nutrition.sugar.unit,
      showBar: true,
      max: maxValues.sugar
    },
    {
      IconComponent: MaterialCommunityIcons,
      iconName: 'shaker-outline',
      title: 'Salt',
      subtitle: getNutritionSubtitle('Salt', product.nutrition.salt.value, maxValues.salt),
      value: product.nutrition.salt.value,
      unit: product.nutrition.salt.unit,
      showBar: true,
      max: maxValues.salt
    },
    {
      IconComponent: MaterialCommunityIcons,
      iconName: 'fire',
      title: 'Calories',
      subtitle: getNutritionSubtitle('Calories', product.nutrition.calories.value, maxValues.calories),
      value: product.nutrition.calories.value,
      unit: product.nutrition.calories.unit,
      showBar: true,
      max: maxValues.calories
    },
    {
      IconComponent: Ionicons,
      iconName: 'flask-outline',
      title: 'Additives',
      subtitle: getAdditivesSubtitle(product.additives.count),
      value: product.additives.count,
      unit: '',
      showBar: false,
      max: 0
    }
  ];

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
            
            {/* Nutriscore */}
            {product.nutriscore && (
              <View style={styles.productRatingContainer}>
                <View 
                  style={[
                    styles.productRatingDot, 
                    { backgroundColor: getNutriscoreColor(product.nutriscore) }
                  ]} 
                />
                <ThemedText style={styles.productRating}>
                  Nutriscore {product.nutriscore.toUpperCase()}
                </ThemedText>
              </View>
            )}
            
            {/* NOVA Group */}
            {product.novaGroup !== null && (
              <View style={[styles.productRatingContainer, styles.spaceTop]}>
                <ThemedText style={styles.novaGroup}>
                  NOVA {product.novaGroup}: {getNovaGroupDescription(product.novaGroup)}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>
      
      {/* Ingredients section */}
      {product.ingredients && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Ingredients</ThemedText>
          <ThemedText style={styles.ingredients}>{product.ingredients}</ThemedText>
        </View>
      )}
      
      {/* Positives section */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Positives</ThemedText>
        <ThemedText style={styles.sectionSubtitle}>For 100g</ThemedText>
        {positiveNutritionData.map((item, index) => (
          <NutritionItem key={index} {...item} />
        ))}
      </View>

      {/* Negatives section */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Negatives</ThemedText>
        <ThemedText style={styles.sectionSubtitle}>For 100g</ThemedText>
        {negativeNutritionData.map((item, index) => (
          <NutritionItem key={index} {...item} />
        ))}
      </View>
      
      {/* Additives section (if any) */}
      {product.additives.count > 0 && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Additives</ThemedText>
          <View style={styles.additivesContainer}>
            {product.additives.names.map((name, index) => (
              <View key={index} style={styles.additiveItem}>
                <ThemedText style={styles.additiveName}>{name}</ThemedText>
                <ThemedText style={styles.additiveTag}>{product.additives.tags[index] || ''}</ThemedText>
              </View>
            ))}
          </View>
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
  productRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceTop: {
    marginTop: 4,
  },
  productRatingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  productRating: {
    fontSize: 14,
  },
  novaGroup: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  ingredients: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  itemContainer: {
    marginBottom: 16,
    width: '100%',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    top: 10,
    marginRight: 1,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 10
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
  },
  valueSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 80,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
    textAlign: 'right',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  barContainer: {
    marginTop: 4,
  },
  barBackground: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EEEEEE',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  producttime: {
    fontSize: 12,
  },
  additivesContainer: {
    marginTop: 8,
  },
  additiveItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  additiveName: {
    fontSize: 14,
    fontWeight: '500',
  },
  additiveTag: {
    fontSize: 12,
    color: '#666',
  }
});