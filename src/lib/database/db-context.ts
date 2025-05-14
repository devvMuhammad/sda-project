'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { SupabaseClient } from './supabase-client';

// Create a context to provide the DB client throughout the app
const DatabaseContext = createContext<any | null>(null);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  // Get the singleton instance of the SupabaseClient
  const dbClient = SupabaseClient.getInstance();

  return (
    <DatabaseContext.Provider value= { dbClient } >
    { children }
    </DatabaseContext.Provider>
  );
};

// Custom hook to use the database context
export const useDatabase = () => {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }

  return context;
};

// Example usage - how to use the singleton DB client in components:
/*
  import { useDatabase } from '@/lib/database/db-context';
  
  export default function MyComponent() {
    const db = useDatabase();
    
    const fetchData = async () => {
      const { data, error } = await db.from('users').select('*');
      // Process data...
    };
    
    return (
      // Component JSX
    );
  }
*/ 