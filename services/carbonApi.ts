// src/services/carbonApi.ts

import axios from 'axios';
import { API_BASE_URL, API_KEY, API_HOST } from '../constants/ApiConfig';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST,
  },
});

/**
 * Fuel to CO2e calculation.
 */
export const calculateFuelEmission = async (type: string, litres: number): Promise<any> => {
  const options = {
    method: 'GET',
    url: '/FuelToCO2e',
    params: { type, litres: litres.toString() },
  };
  try {
    const response = await apiClient.request(options);
    return response.data; // Expected response: { carbonEquivalent: number }
  } catch (error) {
    console.error('Fuel emission error:', error);
    throw error;
  }
};

/**
 * Car travel CO2e calculation.
 */
export const calculateCarTravelEmission = async (distance: number, vehicle: string): Promise<any> => {
  const options = {
    method: 'GET',
    url: '/CarbonFootprintFromCarTravel',
    params: { distance: distance.toString(), vehicle },
  };
  try {
    const response = await apiClient.request(options);
    return response.data;
  } catch (error) {
    console.error('Car travel emission error:', error);
    throw error;
  }
};

/**
 * Flight CO2e calculation.
 */
export const calculateFlightEmission = async (distance: number, flightType: string): Promise<any> => {
  const options = {
    method: 'GET',
    url: '/CarbonFootprintFromFlight',
    params: { distance: distance.toString(), type: flightType },
  };
  try {
    const response = await apiClient.request(options);
    return response.data;
  } catch (error) {
    console.error('Flight emission error:', error);
    throw error;
  }
};

/**
 * Motorbike CO2e calculation.
 */
export const calculateMotorbikeEmission = async (type: string, distance: number): Promise<any> => {
  const options = {
    method: 'GET',
    url: '/CarbonFootprintFromMotorBike',
    params: { type, distance: distance.toString() },
  };
  try {
    const response = await apiClient.request(options);
    return response.data;
  } catch (error) {
    console.error('Motorbike emission error:', error);
    throw error;
  }
};

/**
 * Public transport CO2e calculation.
 */
export const calculatePublicTransportEmission = async (distance: number, transportType: string): Promise<any> => {
  const options = {
    method: 'GET',
    url: '/CarbonFootprintFromPublicTransit',
    params: { distance: distance.toString(), type: transportType },
  };
  try {
    const response = await apiClient.request(options);
    return response.data;
  } catch (error) {
    console.error('Public transport emission error:', error);
    throw error;
  }
};
