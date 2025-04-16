export interface User {
    id: string;
    email: string;
    name?: string;
    provider?: 'google' | 'apple';
    created_at?: string;
  }