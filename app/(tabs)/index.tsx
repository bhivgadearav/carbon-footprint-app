import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
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
  "type": {
    "transportationTypes": [
      "Taxi",
      "ClassicBus",
      "EcoBus",
      "Coach",
      "NationalTrain",
      "LightRail",
      "Subway",
      "FerryOnFoot",
      "FerryInCar"
    ],
    "motorbikeTypes": [
      "SmallMotorBike",
      "MediumMotorBike",
      "LargeMotorBike"
    ],
    "flightTypes": [
      "DomesticFlight",
      "ShortEconomyClassFlight",
      "ShortBusinessClassFlight",
      "LongEconomyClassFlight",
      "LongPremiumClassFlight",
      "LongBusinessClassFlight",
      "LongFirstClassFlight"
    ],
    "fuelTypes": [
      "Petrol",
      "Diesel",
      "LPG"
    ],
    "carTypes": [
      "SmallDieselCar",
      "MediumDieselCar",
      "LargeDieselCar",
      "MediumHybridCar",
      "LargeHybridCar",
      "MediumLPGCar",
      "LargeLPGCar",
      "MediumCNGCar",
      "LargeCNGCar",
      "SmallPetrolVan",
      "LargePetrolVan",
      "SmallDielselVan",
      "MediumDielselVan",
      "LargeDielselVan",
      "LPGVan",
      "CNGVan",
      "SmallPetrolCar",
      "MediumPetrolCar",
      "LargePetrolCar",
      "SmallMotorBike",
      "MediumMotorBike",
      "LargeMotorBike"
    ]
  }
}


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
          data = await calculateMotorbikeEmission(params.type || 'SmallMotorBike', parseFloat(params.motorbikeType || '0'));
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
      <Text style={styles.title}>Calculate Carbon Emission</Text>
      
      <Text>Select Calculation Method:</Text>
      <Picker
        selectedValue={method}
        onValueChange={(itemValue) => {
          setMethod(itemValue as CalculationMethod);
          setParams({});
        }}
      >
        <Picker.Item label="Fuel Consumption" value="Fuel" />
        <Picker.Item label="Car Travel" value="CarTravel" />
        <Picker.Item label="Flight" value="Flight" />
        <Picker.Item label="Motorbike" value="Motorbike" />
        <Picker.Item label="Public Transit" value="PublicTransit" />
      </Picker>
      
      {method === 'Fuel' && (
        <>
          <Text>Fuel Type (Petrol, Diesel, LPG):</Text>
          <Picker
            selectedValue={params.fuelType}
            onValueChange={(itemValue) => handleInputChange('fuelType', itemValue)}
          >
            {types.type.fuelTypes.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
          <Text>Litres:</Text>
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
          <Text>Distance (km):</Text>
          <TextInput
            style={styles.input}
            placeholder="Distance"
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange('distance', text)}
            value={params.distance || ''}
          />
          <Text>Vehicle Type (e.g., SmallDieselCar):</Text>
          <Picker
            selectedValue={params.carType}
            onValueChange={(itemValue) => handleInputChange('carType', itemValue)}
          >
            {types.type.carTypes.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </>
      )}

      {method === 'Flight' && (
        <>
          <Text>Distance (km):</Text>
          <TextInput
            style={styles.input}
            placeholder="Distance"
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange('distance', text)}
            value={params.distance || ''}
          />
          <Text>Flight Type (DomesticFlight, etc.):</Text>
          <Picker
            selectedValue={params.flightType}
            onValueChange={(itemValue) => handleInputChange('flightType', itemValue)}
          >
            {types.type.flightTypes.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </>
      )}

      {method === 'Motorbike' && (
        <>
          <Text>Motorbike Type (SmallMotorBike, etc.):</Text>
          <Picker
            selectedValue={params.motorbikeType}
            onValueChange={(itemValue) => handleInputChange('motorbikeType', itemValue)}
          >
            {types.type.motorbikeTypes.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
          <Text>Distance (km):</Text>
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
          <Text>Distance (km):</Text>
          <TextInput
            style={styles.input}
            placeholder="Distance"
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange('distance', text)}
            value={params.distance || ''}
          />
          <Text>Transport Type:</Text>
          <Picker
            selectedValue={params.transportType}
            onValueChange={(itemValue) => handleInputChange('transportType', itemValue)}
          >
            {types.type.transportationTypes.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </>
      )}

      <Button title="Calculate" onPress={handleCalculate} />

      {result && (
        <View style={styles.resultCard}>
          <Text>Results:</Text>
          <Text>{JSON.stringify(result)}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 5 },
  resultCard: { borderWidth: 1, borderColor: '#007AFF', padding: 10, marginTop: 15 },
});