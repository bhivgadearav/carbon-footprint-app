export interface User {
    id: string;
    email: string;
    name?: string;
    created_at: string;
  }
  
  export interface EmissionRecord {
    id: string;
    user_id: string;
    date: string;
    source: EmissionSource;
    amount: number;
    details: any;
  }
  
  export enum EmissionSource {
    Fuel = 'fuel',
    CarTravel = 'car',
    Flight = 'flight',
    MotorBike = 'motorbike',
    PublicTransport = 'public_transport'
  }
  
  export interface FuelEmissionRequest {
    type: 'Petrol' | 'Diesel' | 'LPG';
    litres: string;
  }
  
  export interface CarEmissionRequest {
    distance: string;
    vehicle: string;
  }
  
  export interface FlightEmissionRequest {
    distance: string;
    type: string;
  }
  
  export interface MotorBikeEmissionRequest {
    distance: string;
    type: string;
  }
  
  export interface PublicTransportEmissionRequest {
    distance: string;
    type: string;
  }
  
  export interface EmissionResponse {
    carbonEquivalent: number;
    unit: string;
  }
  
  export interface CalculationFormData {
    source: EmissionSource;
    [key: string]: any;
  }
  
  export interface EmissionSummary {
    today: number;
    month: number;
    total: number;
  }
  
  export interface MonthlyEmission {
    month: string;
    amount: number;
  }
  
  export interface YearlyEmission {
    year: string;
    months: MonthlyEmission[];
    total: number;
  }