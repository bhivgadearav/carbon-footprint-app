import { supabase } from './supabaseClient';
import { UserEmissions, CalculationRecord } from '../schema/UserEmissions';

export const addCalculationToEmissions = async (
  userId: string,
  calculation: CalculationRecord
): Promise<UserEmissions | CalculationRecord[]> => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // Try to get an existing record for this user, year, and month.
  const { data, error } = await supabase
    .from<UserEmissions>('user_emissions')
    .select('*')
    .match({ user_id: userId, year, month })
    .single();

  if (error && !data) {
    // No record found – create a new one.
    const newRecord = {
      user_id: userId,
      year,
      month,
      calculations: [calculation],
    };
    const { data: insertData, error: insertError } = await supabase
      .from<UserEmissions>('user_emissions')
      .insert(newRecord)
      .single();
    if (insertError) throw insertError;
    return insertData;
  }

  if (data) {
    // Record exists; append the new calculation.
    const updatedCalculations = [...data.calculations, calculation];
    const { error: updateError } = await supabase
      .from<UserEmissions>('user_emissions')
      .update({ calculations: updatedCalculations })
      .match({ id: data.id });
    if (updateError) throw updateError;
    return updatedCalculations;
  }

  throw new Error('Unexpected error while updating emissions.');
};
