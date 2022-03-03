import Link from 'next/link';
import React, { useContext } from 'react';
import AuthContext from '../lib/AuthContext';

function AuthCheck({ children, fallback }) {
  const { userName } = useContext(AuthContext);

  return userName
    ? children
    : fallback || (
        <Link href="/auth">
          <button> You must be signed in to view this page </button>
        </Link>
      );
}

export default AuthCheck;
