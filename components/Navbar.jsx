import Link from 'next/link';
import React, { useContext } from 'react';
import AuthContext from '../lib/authContext';

function Navbar(props) {
  const { user, userName } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button>FEED</button>
          </Link>
        </li>
        {userName && (
          <>
            <li>
              <Link href="/admin">
                <button>Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${userName}`}>
                <img src={`${user?.photoURL}`} alt="user-img" />
              </Link>
            </li>
          </>
        )}
        {!userName && (
          <>
            <li>
              <Link href="/auth">
                <button className="btn-blue">Login</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
