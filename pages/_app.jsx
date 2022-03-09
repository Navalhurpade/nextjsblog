import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar2';
import AuthContext from '../lib/AuthContext';
import useUserData from '../lib/hooks/useUserData';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <>
      <AuthContext.Provider value={userData}>
        <Navbar />
        <Toaster />
        <Component {...pageProps} />
        <Toaster />
      </AuthContext.Provider>
    </>
  );
}

export default MyApp;
