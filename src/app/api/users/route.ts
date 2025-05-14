import { NextRequest, NextResponse } from 'next/server';
import { DataAdapter } from '@/lib/adapters/data-adapter';
import { SupabaseClient } from '@/lib/database/supabase-client';

// Mock server data format
const mockServerUsers = [
  {
    user_id: '1',
    user_name: 'John Doe',
    user_email: 'john@example.com',
    created_at: '2023-01-15T09:30:00Z',
    last_login: '2023-11-20T16:45:00Z',
    account_status: 1
  },
  {
    user_id: '2',
    user_name: 'Jane Smith',
    user_email: 'jane@example.com',
    created_at: '2023-03-22T14:45:00Z',
    last_login: '2023-11-19T10:15:00Z',
    account_status: 1
  },
  {
    user_id: '3',
    user_name: 'Mike Johnson',
    user_email: 'mike@example.com',
    created_at: '2023-05-10T11:20:00Z',
    last_login: '2023-10-05T13:30:00Z',
    account_status: 0
  }
];

// GET handler for users
export async function GET(req: NextRequest) {
  try {
    // Get the user ID from URL if it exists (via searchParams)
    const url = new URL(req.url);
    const userId = url.searchParams.get('id');

    // If a user ID is provided, return that specific user
    if (userId) {
      // Using the singleton pattern to get the database instance
      // const supabase = SupabaseClient.getInstance();
      // const { data, error } = await supabase.from('users').select('*').eq('user_id', userId).single();
      // if (error) throw error;

      // Mock finding a user
      const foundUser = mockServerUsers.find(user => user.user_id === userId);
      if (!foundUser) {
        return NextResponse.json(
          { error: 'User not found', success: false },
          { status: 404 }
        );
      }

      // Using the adapter to convert server data to frontend format
      const adaptedUser = DataAdapter.adaptUser(foundUser);

      return NextResponse.json({
        user: adaptedUser,
        success: true
      });
    }

    // Otherwise return all users
    // In a real implementation, fetch data from database using singleton
    // Get the Supabase client instance via singleton
    // const supabase = SupabaseClient.getInstance();
    // const { data, error } = await supabase.from('users').select('*');
    // if (error) throw error;

    // Using the adapter to convert server data to frontend format
    const adaptedUsers = DataAdapter.adaptUsers(mockServerUsers);

    return NextResponse.json({
      users: adaptedUsers,
      success: true
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', success: false },
      { status: 500 }
    );
  }
} 