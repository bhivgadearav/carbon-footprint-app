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
    .from('user_emissions')
    .select('*')
    .match({ user_id: userId, year, month })
    .single();

  if (error && error.code !== 'PGRST116') { // Allow for "No rows found"
    console.error('Error fetching existing emissions record:', error);
    throw error;
  }

  if (!data) {
    // No record found – create a new one.
    const newRecord = {
      user_id: userId,
      year,
      month,
      calculations: [calculation],
    };
    const { data: insertData, error: insertError } = await supabase
      .from('user_emissions')
      .insert(newRecord)
      .select()
      .single();
    if (insertError) {
      console.error('Insert Error:', insertError);
      throw insertError;
    }
    return insertData as UserEmissions;
  }

  if (data) {
    // Record exists; append the new calculation.
    const updatedCalculations = [...data.calculations, calculation];
    const { error: updateError } = await supabase
      .from('user_emissions')
      .update({ calculations: updatedCalculations })
      .eq('id', data.id);
    if (updateError) {
      console.error('Update Error:', updateError);
      throw updateError;
    }
    return updatedCalculations;
  }

  throw new Error('Unexpected error while updating emissions.');
};
