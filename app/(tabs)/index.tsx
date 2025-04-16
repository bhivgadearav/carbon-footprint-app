import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  calculateFuelEmission,
  calculateCarTravelEmission,
  calculateFlightEmission,
  calculateMotorbikeEmission,
  calculatePublicTransportEmission,
} from '../../services/carbonApi';
import { AuthContext } from '../../context/AuthContext';
import { addCalculationToEmissions } from '../../services/emissions';
import { CalculationRecord } from '../../schema/UserEmissions';

type CalculationMethod = 'Fuel' | 'CarTravel' | 'Flight' | 'Motorbike' | 'PublicTransit';

const types = {
  type: {
    transportationTypes: ["Taxi", "ClassicBus", "EcoBus", "Coach", "NationalTrain", "LightRail", "Subway", "FerryOnFoot", "FerryInCar"],
    motorbikeTypes: ["SmallMotorBike", "MediumMotorBike", "LargeMotorBike"],
    flightTypes: [
      "DomesticFlight", "ShortEconomyClassFlight", "ShortBusinessClassFlight",
      "LongEconomyClassFlight", "LongPremiumClassFlight", "LongBusinessClassFlight", "LongFirstClassFlight"
    ],
    fuelTypes: ["Petrol", "Diesel", "LPG"],
    carTypes: [
      "SmallDieselCar", "MediumDieselCar", "LargeDieselCar", "MediumHybridCar", "LargeHybridCar",
      "MediumLPGCar", "LargeLPGCar", "MediumCNGCar", "LargeCNGCar", "SmallPetrolVan", "LargePetrolVan",
      "SmallDielselVan", "MediumDielselVan", "LargeDielselVan", "LPGVan", "CNGVan",
      "SmallPetrolCar", "MediumPetrolCar", "LargePetrolCar", "SmallMotorBike", "MediumMotorBike", "LargeMotorBike"
    ]
  }
};

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const [method, setMethod] = useState<CalculationMethod>('Fuel');
  const [params, setParams] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (key: string, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleCalculate = async () => {
    try {
      let data;
      switch (method) {
        case 'Fuel':
          data = await calculateFuelEmission(params.fuelType || 'Petrol', parseFloat(params.litres || '0'));
          break;
        case 'CarTravel':
          data = await calculateCarTravelEmission(parseFloat(params.distance || '0'), params.carType || '');
          break;
        case 'Flight':
          data = await calculateFlightEmission(parseFloat(params.distance || '0'), params.flightType || '');
          break;
        case 'Motorbike':
          data = await calculateMotorbikeEmission(params.motorbikeType || 'SmallMotorBike', parseFloat(params.distance || '0'));
          break;
        case 'PublicTransit':
          data = await calculatePublicTransportEmission(parseFloat(params.distance || '0'), params.transportType || '');
          break;
      }
      setResult(data);

      const newCalculation: CalculationRecord = {
        calculation_method: method,
        parameters: params,
        result: { carbonEquivalent: data.carbonEquivalent },
        created_at: new Date().toISOString(),
      };

      if (user) {
        await addCalculationToEmissions(user.id, newCalculation);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🌱 Carbon Emission Calculator</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Select Calculation Method:</Text>
        <Picker
          selectedValue={method}
          onValueChange={(itemValue) => {
            setMethod(itemValue as CalculationMethod);
            setParams({});
            setResult(null);
          }}
          style={styles.picker}
        >
          <Picker.Item label="Fuel Consumption" value="Fuel" />
          <Picker.Item label="Car Travel" value="CarTravel" />
          <Picker.Item label="Flight" value="Flight" />
          <Picker.Item label="Motorbike" value="Motorbike" />
          <Picker.Item label="Public Transit" value="PublicTransit" />
        </Picker>
      </View>

      <View style={styles.card}>
        {method === 'Fuel' && (
          <>
            <Text style={styles.label}>Fuel Type:</Text>
            <Picker
              selectedValue={params.fuelType}
              onValueChange={(itemValue) => handleInputChange('fuelType', itemValue)}
              style={styles.picker}
            >
              {types.type.fuelTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
            <Text style={styles.label}>Litres:</Text>
            <TextInput
              style={styles.input}
              placeholder="Litres"
              keyboardType="numeric"
              onChangeText={(text) => handleInputChange('litres', text)}
              value={params.litres || ''}
            />
          </>
        )}

        {method === 'CarTravel' && (
          <>
            <Text style={styles.label}>Distance (km):</Text>
            <TextInput
              style={styles.input}
              placeholder="Distance"
              keyboardType="numeric"
              onChangeText={(text) => handleInputChange('distance', text)}
              value={params.distance || ''}
            />
            <Text style={styles.label}>Vehicle Type:</Text>
            <Picker
              selectedValue={params.carType}
              onValueChange={(itemValue) => handleInputChange('carType', itemValue)}
              style={styles.picker}
            >
              {types.type.carTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </>
        )}

        {method === 'Flight' && (
          <>
            <Text style={styles.label}>Distance (km):</Text>
            <TextInput
              style={styles.input}
              placeholder="Distance"
              keyboardType="numeric"
              onChangeText={(text) => handleInputChange('distance', text)}
              value={params.distance || ''}
            />
            <Text style={styles.label}>Flight Type:</Text>
            <Picker
              selectedValue={params.flightType}
              onValueChange={(itemValue) => handleInputChange('flightType', itemValue)}
              style={styles.picker}
            >
              {types.type.flightTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </>
        )}

        {method === 'Motorbike' && (
          <>
            <Text style={styles.label}>Motorbike Type:</Text>
            <Picker
              selectedValue={params.motorbikeType}
              onValueChange={(itemValue) => handleInputChange('motorbikeType', itemValue)}
              style={styles.picker}
            >
              {types.type.motorbikeTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
            <Text style={styles.label}>Distance (km):</Text>
            <TextInput
              style={styles.input}
              placeholder="Distance"
              keyboardType="numeric"
              onChangeText={(text) => handleInputChange('distance', text)}
              value={params.distance || ''}
            />
          </>
        )}

        {method === 'PublicTransit' && (
          <>
            <Text style={styles.label}>Distance (km):</Text>
            <TextInput
              style={styles.input}
              placeholder="Distance"
              keyboardType="numeric"
              onChangeText={(text) => handleInputChange('distance', text)}
              value={params.distance || ''}
            />
            <Text style={styles.label}>Transport Type:</Text>
            <Picker
              selectedValue={params.transportType}
              onValueChange={(itemValue) => handleInputChange('transportType', itemValue)}
              style={styles.picker}
            >
              {types.type.transportationTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCalculate}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Your Carbon Footprint</Text>
          <Text style={styles.resultText}>{result?.carbonEquivalent}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f1f5f9' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginTop: 10, marginBottom: 5 },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  button: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  resultCard: {
    backgroundColor: '#e0f2fe',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  resultText: { fontFamily: 'monospace', color: '#1e3a8a' },
});