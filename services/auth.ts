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

export const createOrUpdateUserProfile = async (userData: User) => {
  const { data, error } = await supabase
    .from<User, any>('profiles')
    .upsert(userData, { returning: 'minimal' });
  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from<User, any>('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
};

export const editUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from<User, any>('profiles')
    .update(updates)
    .eq('id', userId);
  if (error) throw error;
  return data;
};
