import { useState } from 'react';
import Layout from '../components/Layout';
import { auth, database } from '../firebase';
import firebase from 'firebase/compat/app';
import firebaseConfig from '../firebaseConfig';
import { initializeApp } from 'firebase/app';

const app = initializeApp(firebaseConfig);
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';





const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const { user } =  await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      await set(ref(database, `users/${user.uid}`), {
        email: user.email,
        balance: 1000,
      });
      
    } catch (err:any) {
      setError(err.message);
    }
  };

  return (
   
      <div>
        <h1>Sign up for Mess Management System</h1>
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
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    
  );
};

export default SignupPage;
