import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Button } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { AuthContext } from '../../context/AuthContext';
import { UserEmissions } from '../../schema/UserEmissions';
import { ThemedText } from '@/components/ThemedText';

export default function ExploreScreen() {
  const { user } = useContext(AuthContext);
  const [emissionsData, setEmissionsData] = useState<UserEmissions[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    const fetchEmissions = async () => {
      if (user) {
        const { data, error } = await supabase
          .from<string, any>('user_emissions')
          .select('*')
          .eq('user_id', user.id);
        if (error) {
          console.error(error);
        } else {
          setEmissionsData(data || []);
        }
      }
    };
    fetchEmissions();
  }, [user, refresh]);

  // Group records by year and month.
  const groupedData = emissionsData.reduce((acc: any, record) => {
    const { year, month } = record;
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(record);
    return acc;
  }, {});

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Emissions History</Text>
      <Button title='Refresh' onPress={() => {
        setRefresh(!refresh)
      }}></Button>
      {Object.entries(groupedData).map(([year, months]: any) => (
        <View key={year} style={styles.yearSection}>
          <Text style={styles.yearHeader}>Year: {year}</Text>
          {Object.entries(months).map(([month, records]: any) => (
            <View key={month} style={styles.monthSection}>
              <Text style={styles.monthHeader}>Month: {month}</Text>
              {records.map((record: UserEmissions) =>
                record.calculations.map((calc, index) => (
                  <View key={index} style={styles.card}>
                    <Text>Method: {calc.calculation_method}</Text>
                    <Text>Parameters: {JSON.stringify(calc.parameters)}</Text>
                    <Text>Carbon Equivalent: {calc.result.carbonEquivalent}</Text>
                    <Text>Date: {new Date(calc.created_at).toLocaleDateString()}</Text>
                  </View>
                ))
              )}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  yearSection: { marginBottom: 15 },
  yearHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  monthSection: { marginLeft: 10, marginBottom: 10 },
  monthHeader: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  card: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 5 },
});
