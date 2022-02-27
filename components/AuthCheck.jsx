import Link from 'next/link';
import React, { useContext } from 'react';
import AuthContext from './../lib/AuthContext';

function AuthCheck({ children, fallback }) {
  const a = useContext(AuthContext);
  console.log('CONTEXT::', a);
  return a ? children : fallback || <Link href={'/enter'}>You must be signed in to view this page.</Link>;
}

export default AuthCheck;
