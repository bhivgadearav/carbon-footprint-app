import { supabase } from './supabaseClient';
import { User } from '../schema/User';

export const signup = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return user;
};

export const login = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signIn({ email, password });
  if (error) throw error;
  return user;
};

export const signInWithProvider = async (provider: 'google' | 'apple') => {
  const { user, session, error } = await supabase.auth.signIn({ provider });
  if (error) throw error;
  return { user, session };
};

export const createOrUpdateUserProfile = async (userData: User) => {
  const { data, error } = await supabase
    .from<User>('profiles')
    .upsert(userData, { returning: 'minimal' });
  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from<User>('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
};

export const editUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from<User>('profiles')
    .update(updates)
    .eq('id', userId);
  if (error) throw error;
  return data;
};
