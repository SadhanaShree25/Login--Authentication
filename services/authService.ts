import type { User } from '../types';

// In-memory "database"
const users: User[] = [
  { id: '1', name: 'Test User', email: 'test@example.com' },
];
const passwords: Record<string, string> = {
  '1': 'password123',
};
const resetTokens: Record<string, { userId: string; expires: number }> = {};


// Simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const authService = {
  login: async (email: string, password): Promise<User> => {
    await delay(1000);
    const user = users.find(u => u.email === email);
    if (!user || passwords[user.id] !== password) {
      throw new Error('Invalid email or password.');
    }
    return user;
  },

  register: async (name: string, email: string, password): Promise<User> => {
    await delay(1500);
    if (users.some(u => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }
    const newUser: User = {
      id: String(users.length + 1),
      name,
      email,
    };
    users.push(newUser);
    passwords[newUser.id] = password;
    return newUser;
  },

  logout: async (): Promise<void> => {
    await delay(500);
    // On a real backend, this would invalidate a token or session
    return;
  },

  checkSession: async (): Promise<User | null> => {
    await delay(500);
    try {
      // Prioritize localStorage for "Remember Me"
      let userString = localStorage.getItem('authUser');
      if (!userString) {
        // Fallback to sessionStorage for session-only login
        userString = sessionStorage.getItem('authUser');
      }

      if (userString) {
        const userData = JSON.parse(userString);
        // "Re-validate" user against our mock DB
        const user = users.find(u => u.id === userData.id);
        return user || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    await delay(1000);
    const user = users.find(u => u.email === email);
    if (user) {
      // In a real app, generate a secure, unique token
      const token = Math.random().toString(36).substring(2, 15);
      const expires = Date.now() + 3600000; // 1 hour
      resetTokens[token] = { userId: user.id, expires };
      
      // Simulate sending an email by logging to the console
      console.log(`Password reset token for ${email}: ${token}`);
      console.log(`Reset link: /#/reset-password/${token}`); // Using hash router path
    }
    // Always resolve successfully to prevent user enumeration
    return;
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await delay(1000);
    const tokenData = resetTokens[token];
    if (!tokenData || tokenData.expires < Date.now()) {
      throw new Error('Invalid or expired password reset token.');
    }
    
    passwords[tokenData.userId] = newPassword;
    delete resetTokens[token]; // Token is single-use
    return;
  },
};