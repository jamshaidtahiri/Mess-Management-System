import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useState, useEffect } from 'react';
import {onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

import Layout from '../components/Layout';
import firebaseConfig from '../firebaseConfig';
import { initializeApp } from 'firebase/app';
import { auth, database } from '../firebase';
import firebase from 'firebase/compat/app';
const app = initializeApp(firebaseConfig);

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const { user } = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      router.push('/dashboard');
    } catch (err:any) {
      setError(err.message);
    }
  };

  return (
    
      <div>
        <h1>Login to Mess Management System</h1>
        <form onSubmit={handleSubmit}>
          {error && <p>{error}</p>}
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    
  );
};

export default LoginPage;
