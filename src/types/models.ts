export interface User {
    id: number;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    status: string;
    created_at: Date;
    updated_at: Date;
  }
  
export interface Wallet {
    id: number;
    user_id: number;
    balance: string; // MySQL DECIMAL comes back as a string
    currency: string;
    created_at: Date;
    updated_at: Date;
  }