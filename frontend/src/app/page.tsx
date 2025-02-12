'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [health, setHealth] = useState<string>('Loading...');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/health/');
        setHealth(response.data.status);
      } catch (error) {
        setHealth('Error connecting to backend');
      }
    };
    
    checkHealth();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to Django + Next.js App</h1>
        <p className="text-xl">Backend Status: {health}</p>
      </div>
    </main>
  );
}
