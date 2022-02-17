import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import AuthContext from '../lib/authContext';
import useUserData from '../lib/hooks/useUserData';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <>
      <AuthContext.Provider value={userData}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </AuthContext.Provider>
    </>
  );
}

export default MyApp;
