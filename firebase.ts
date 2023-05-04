import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import firebaseConfig from './firebaseConfig';

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app)
