import React from 'react';
import AuthCheck from '../components/AuthCheck';

function Admin(props) {
  return (
    <main>
      <AuthCheck>hello</AuthCheck>
    </main>
  );
}

export default Admin;
