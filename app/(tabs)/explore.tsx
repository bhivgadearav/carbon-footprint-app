import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text, SafeAreaView } from 'react-native';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { supabase } from '../../services/supabaseClient';
import { AuthContext } from '../../context/AuthContext';
import { UserEmissions } from '../../schema/UserEmissions';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ExploreScreen() {
  const { user } = useContext(AuthContext);
  const [emissionsData, setEmissionsData] = useState<UserEmissions[]>([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchEmissions = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_emissions')
          .select('*')
          .eq('user_id', user.id);

        if (error) console.error(error);
        else setEmissionsData(data || []);
      }
    };
    fetchEmissions();
  }, [user, refresh]);

  const groupedData = emissionsData.reduce((acc: any, record) => {
    const { year, month } = record;
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(record);
    return acc;
  }, {});

  const renderParams = (method: string, rawParams: any) => {
    const params = typeof rawParams === 'string' ? JSON.parse(rawParams) : rawParams;

    switch (method) {
      case 'Fuel':
        return (
          <>
            <Text>Fuel Type: {params.fuelType}</Text>
            <Text>Litres: {params.litres}</Text>
          </>
        );
      case 'CarTravel':
        return (
          <>
            <Text>Distance: {params.distance} km</Text>
            {params.carType && <Text>Car Type: {params.carType}</Text>}
          </>
        );
      case 'Flight':
        return (
          <>
            <Text>Distance: {params.distance} km</Text>
            {params.flightType && <Text>Flight Type: {params.flightType}</Text>}
          </>
        );
      case 'Motorbike':
        return (
          <>
            <Text>Motorbike Type: {params.type}</Text>
            <Text>Distance: {params.motorbikeType}</Text>
          </>
        );
      case 'PublicTransit':
        return (
          <>
            <Text>Distance: {params.distance} km</Text>
            {params.transportType && <Text>Transport Type: {params.transportType}</Text>}
          </>
        );
      default:
        return <Text>Unknown Method</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text>🌱 Emissions History</Text>

        <Pressable style={styles.refreshBtn} onPress={() => setRefresh(!refresh)}>
          <Text style={styles.refreshText}>Refresh</Text>
        </Pressable>

        {Object.entries(groupedData).map(([year, months]: any) => (
          <View key={year} style={styles.section}>
            <Text style={styles.year}>📆 Year: {year}</Text>

            {Object.entries(months).map(([month, records]: any) => (
              <View key={month} style={styles.subSection}>
                <Text style={styles.month}>
                  Month: {monthNames[parseInt(month) - 1]}
                </Text>

                {records.map((record: UserEmissions) =>
                  record.calculations.map((calc, idx) => (
                    <View key={idx} style={styles.card}>
                      <Text style={styles.cardTitle}>
                        Method: {calc.calculation_method}
                      </Text>
                      {renderParams(calc.calculation_method, calc.parameters)}
                      <Text>
                        Carbon: {calc.result.carbonEquivalent} kgCO₂e
                      </Text>
                      <Text style={styles.cardDate}>
                        Date: {new Date(calc.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  ))
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  refreshBtn: {
    backgroundColor: '#007aff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  refreshText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  year: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },
  subSection: {
    paddingLeft: 8,
    marginBottom: 10,
  },
  month: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
});