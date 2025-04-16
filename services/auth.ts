import { supabase } from './supabaseClient';
import { User } from '../schema/User';

export const signup = async (email: string, password: string): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    throw error;
  }
  if (!user) return null;
  return {
    id: user.id,
    email: user.email || '', // Ensure email is a string
    // Map other fields as necessary
  } as User;
};

export const login = async (email: string, password: string): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
  if (!user) return null;
  return {
    id: user.id,
    email: user.email || '', // Ensure email is a string
    // Map other fields as necessary
  } as User;
};
