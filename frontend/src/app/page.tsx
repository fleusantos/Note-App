'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';
import axios from 'axios';

export default function Home() {
  const router = useRouter();
  redirect('/dashboard');
}
