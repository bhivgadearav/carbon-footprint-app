export interface User {
    id: string;      // Unique Supabase user ID.
    email: string;
    name?: string;
    provider?: 'google' | 'apple';
    created_at?: string;
  }
  