import { redirect } from 'next/navigation';

export const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      redirect('/auth/login');
    }
    
    try {
      // Check if token is expired
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expirationTime) {
        localStorage.removeItem('accessToken');
        redirect('/auth/login');
      }
    } catch (error) {
      // If token is invalid (can't be parsed), remove it and redirect
      localStorage.removeItem('accessToken');
      redirect('/auth/login');
    }
  }
};
