'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { registerUser } from '@/utils/auth';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await registerUser(email, password);
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Yay, New Friend!"
        imageSrc="/cat.png"
        imageAlt="Sleeping Cat"
        imageWidth={188}
        imageHeight={134}
      />
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}
        
        <div className="space-y-3">
          <Input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <PasswordInput
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Sign Up
        </Button>

        <div className="text-center">
          <Link
            href="/auth/login"
            className="inline-block mt-4 text-[#8B4513] hover:underline transition-all duration-200 font-medium"
          >
            We're already friends!
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
