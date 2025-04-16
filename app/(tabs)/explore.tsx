import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { AuthContext } from '../../context/AuthContext';
import { UserEmissions } from '../../schema/UserEmissions';

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌿 Emissions History</Text>

      <Pressable style={styles.refreshBtn} onPress={() => setRefresh(!refresh)}>
        <Text style={styles.refreshText}>Refresh</Text>
      </Pressable>

      {Object.entries(groupedData).map(([year, months]: any) => (
        <View key={year} style={styles.section}>
          <Text style={styles.year}>📅 Year: {year}</Text>
          {Object.entries(months).map(([month, records]: any) => (
            <View key={month} style={styles.subSection}>
              <Text style={styles.month}>Month: {month}</Text>
              {records.map((record: UserEmissions) =>
                record.calculations.map((calc, idx) => (
                  <View key={idx} style={styles.card}>
                    <Text style={styles.cardTitle}>Method: {calc.calculation_method}</Text>
                    <Text style={styles.cardText}>Parameters: {JSON.stringify(calc.parameters)}</Text>
                    <Text style={styles.cardText}>Carbon: {calc.result.carbonEquivalent} kgCO₂e</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
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
    color: '#222',
    marginBottom: 6,
  },
  subSection: {
    paddingLeft: 8,
  },
  month: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
});