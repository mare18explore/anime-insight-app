import { Redirect } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../backend/config';

export default function Index() {
  // store the current user
	const [user, setUser] = useState<User | null>(null);    

  // flag to check if we're still verifying the auth state
  const [checkingAuth, setCheckingAuth] = useState(true);

  // run this once when the component mounts
  useEffect(() => {
    // listen to firebase auth state changes
    // if user exists, save them
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setCheckingAuth(false);
    });

    // clean up the listener when component unmounts
    return unsubscribe;
  }, []);

  // optional: return null or splash screen while checking
  if (checkingAuth) 
    return null;

  // if user is logged in, send to home/tabs screen
  // otherwise redirect them to login screen
  return <Redirect href={user ? '/tabs' : '/authentifcation/login'} />;
}