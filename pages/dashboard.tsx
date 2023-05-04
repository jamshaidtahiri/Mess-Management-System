import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { GetServerSideProps } from 'next';
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { useRouter } from 'next/router';

interface User {
  email: string;
  name: string;
  balance: number;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase;

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error:any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const database = getDatabase(app);
    const userRef = ref(database, `users/${auth.currentUser?.uid}`);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email, displayName } = user;
        const balanceRef = ref(database, `users/${user.uid}/balance`);

        // set(balanceRef, 0); // Set balance to 0 if it doesn't exist yet

        // Listen for changes to the user's balance in Firebase Realtime Database
        onValue(balanceRef, (snapshot) => {
          const balance = snapshot.val() || 0;
          setUser({
            email: email ?? '',
            name: displayName ?? '',
            balance,
          });
        });
      } else {
        router.push('/login');
      }
    });
    return unsubscribe;
  }, [auth, db, router]);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div>
        <h2>Welcome back, {user.name}!</h2>
        <p>Email: {user.email}</p>
        <p>Balance: {user.balance}</p>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
};

export default Dashboard;
