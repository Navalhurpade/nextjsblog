import React, { useState, useContext } from 'react';
import AuthContext from '../lib/AuthContext';
import { logOut } from '../lib/firebase';
import Link from 'next/link';

function Navbar(props) {
  const [active, setActive] = useState(false);
  const { user, userName } = useContext(AuthContext);

  return (
    <nav
      onBlur={() => {
        setActive(false);
      }}
      className="bg-white w-screen h-20 px-10 py-4 mb-10 flex flex-row justify-between items-center border-b-2 border-cyan-500"
    >
      <span className="text-slate-900 font-sans font-bold text-3xl cursor-pointer">
        <Link href={'/'}>Brand </Link>
      </span>
      <MenuItems />
      {user && (
        <div>
          <img className="rounded-full h-12 mobile:hidden transition-all" src={`${user?.photoURL}`} alt="profile-img" />
        </div>
      )}
      <div className="group transition-all laptop:hidden :desktop:hidden" onClick={() => setActive(!active)}>
        <span
          className={`block transition-all duration-300 group-hover:group-even:bg-cyan-600 group-hover:group-even:translate-y-2 group-hover:group-even:rotate-45  z-10  bg-slate-800 w-8 h-1 rounded-xl ${
            active ? 'translate-y-2 bg-cyan-600 rotate-45' : ''
          }`}
        ></span>
        <span
          className={`block transition-all duration-300 group-hover:group-even:bg-cyan-600 group-hover:group-even:translate-x-8  group-hover:group-even:opacity-0 z-20 bg-slate-800 w-8 h-1 rounded-xl my-1 ${
            active ? 'opacity-0' : ''
          }`}
        ></span>
        <span
          className={`block transition-all duration-300 group-hover:group-even:bg-cyan-500 group-hover:group-even:-translate-y-2 group-hover:group-even:-rotate-45  z-30 bg-slate-800 w-8 h-1 rounded-xl ${
            active ? '-translate-y-2 bg-cyan-600 -rotate-45' : ''
          }`}
        ></span>
      </div>
      <div
        className={`${
          !active ? 'h-0' : 'h-44 shadow-lg'
        } z-40 pt-3 transition-all w-screen left-0 px-10  bg-white absolute top-16`}
      >
        {active && <MenuItems vertical />}
        {active && (
          <Link href={`/${userName}`}>
            <img
              className="z-40 absolute right-10 bottom-6  rounded-full h-12 my-1 transition-all"
              src={`${user?.photoURL}`}
              alt="profile-img"
            />
          </Link>
        )}
      </div>
    </nav>
  );
}

const MenuItems = ({ vertical = false }) => {
  const { user, userName } = useContext(AuthContext);

  return (
    <ul
      className={`flex ${
        vertical ? 'flex-col h-36 mt-auto justify-around' : 'flex-row mobile:hidden justify-around'
      } relative z-50 font-sans laptop:w-1/2  transition-all`}
    >
      <li className="flex flex-row items-center transition-all ">
        <img src="content.png" className=" text-sm h-4 block pr-1" alt="login-png" />
        <Link href={'/'}>
          <a className="block text-lg font-semibold hover:text-cyan-700 ">Feed</a>
        </Link>
      </li>
      {user && userName && (
        <li className="flex flex-row items-center  transition-all ">
          <img src="write3.png" className=" text-sm h-4 block pr-1" alt="login-png" />
          <Link href="/admin">
            <a className="text-lg font-semibold hover:text-cyan-700 ">Write post</a>
          </Link>
        </li>
      )}
      {user && (
        <li className="flex flex-row items-center  transition-all ">
          <img src="logout.png" className=" text-sm h-4 block pr-1" alt="login-png" />
          <Link href={'/'}>
            <a onClick={() => logOut()} className="text-lg font-semibold hover:text-cyan-700 ">
              Logout
            </a>
          </Link>
        </li>
      )}
      {!userName && (
        <li className="flex flex-row items-center  transition-all ">
          <img src="login.png" className=" text-sm h-4 block pr-1" alt="login-png" />
          <Link href={'/auth'}>
            <a className="text-lg font-semibold hover:text-cyan-700 ">Login</a>
          </Link>
        </li>
      )}
    </ul>
  );
};

export default Navbar;
