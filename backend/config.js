import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
//firebase config from console
const firebaseConfig = {
  apiKey: "AIzaSyD3Y7VCHMq1edptSZ1PMLOWpHheKg4DsPo",
  authDomain: "animetracker-1c4e3.firebaseapp.com",
  projectId: "animetracker-1c4e3",
  storageBucket: "animetracker-1c4e3.firebasestorage.app",
  messagingSenderId: "355710293921",
  appId: "1:355710293921:web:d77e80e1893521e6c69de0"
};
// init firebase 
const app = initializeApp(firebaseConfig);
// firebase instance
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };

