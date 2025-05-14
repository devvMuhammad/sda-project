/**
 * Authentication Facade Pattern
 * 
 * This facade provides a simplified interface for authentication operations
 * by abstracting away the complexity of the Clerk authentication system.
 */

import {
  createClerkClient
} from '@clerk/nextjs/server';
import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * AuthFacade provides a simplified interface for authentication operations
 */
export class AuthFacade {

  /**
   * Gets the current authenticated user
   * @returns Promise resolving to the user or null if not authenticated
   */
  static async getCurrentUser() {
    return await currentUser();
  }

  /**
   * Checks if the user is authenticated
   * @returns Promise resolving to a boolean indicating authentication status
   */
  static async isAuthenticated(): Promise<boolean> {
    const { userId } = await auth();
    return !!userId;
  }

  /**
   * Gets the user ID of the authenticated user
   * @returns User ID or null if not authenticated
   */
  static async getUserId(): Promise<string | null> {
    const { userId } = await auth();
    return userId;
  }

  /**
   * Verifies a session token for API/server operations
   * @param sessionId - The session ID to verify
   * @param sessionToken - The session token to verify
   * @returns Promise resolving to verification result
   */
  static async verifySession(sessionId: string, sessionToken: string): Promise<{ userId: string } | null> {
    try {
      const clerk = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY
      });

      const session = await clerk.sessions.verifySession(sessionId, sessionToken);
      return { userId: session.userId };
    } catch (error) {
      console.error('Session verification failed:', error);
      return null;
    }
  }

  /**
   * Gets user metadata for the authenticated user
   * @returns Promise resolving to user metadata or null
   */
  static async getUserMetadata(): Promise<Record<string, any> | null> {
    const user = await currentUser();
    if (!user) return null;

    return user.publicMetadata;
  }
}
