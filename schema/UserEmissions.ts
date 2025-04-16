export interface CalculationRecord {
    calculation_method: 'Fuel' | 'CarTravel' | 'Flight' | 'Motorbike' | 'PublicTransit';
    parameters: Record<string, any>; // e.g. { type: 'Petrol', litres: '10' }
    result: {
      carbonEquivalent: number;
    };
    created_at: string;              // Timestamp of the calculation
  }
  
  export interface UserEmissions {
    id: string;
    user_id: string;
    year: number;
    month: number;
    calculations: CalculationRecord[];
  }
  