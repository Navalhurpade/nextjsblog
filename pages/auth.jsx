import React, { useContext, useEffect, useState, useCallback } from 'react';
import { logInWithGoogle as logInWithGoogleFirebase, logOut } from '../lib/firebase';
import AuthContext from '../lib/AuthContext';
import debounce from 'lodash.debounce';
import { firestore } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Router from 'next/router';
import Loader from '../components/Loader';

function auth(props) {
  const { user, userName, setUserName } = useContext(AuthContext);

  user && userName && Router.replace(`/${userName}`);

  return (
    <div>
      {user ? (
        userName ? (
          <SignOutButton setUserName={setUserName} />
        ) : (
          <UserNameForm user={user} userName={userName} />
        )
      ) : (
        <SingInButton />
      )}
    </div>
  );
}

const SingInButton = () => {
  const logInWithGoogle = async () => {
    try {
      await logInWithGoogleFirebase();
    } catch (error) {
      console.log('Error Ocured ', error);
    }
  };
  return (
    <main>
      <button onClick={logInWithGoogle} className="btn-google">
        <img src="google-logo.png"></img>
        sign in
      </button>
    </main>
  );
};

const SignOutButton = ({ setUserName }) => {
  return (
    <button
      onClick={() => {
        logOut();
        setUserName(null);
      }}
    >
      Sign Out
    </button>
  );
};

const UserNameForm = ({}) => {
  const [formValue, setFormValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const { user, userName } = useContext(AuthContext);

  useEffect(() => {
    checkUserName(formValue);
  }, [formValue]);

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    //Only set form value if length is less than OR it matches regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  const checkUserName = useCallback(
    debounce(async (userName) => {
      if (userName.length >= 3) {
        const userNameDocRef = doc(firestore, 'userNames', userName);

        const document = await getDoc(userNameDocRef);
        setIsValid(!document.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      const userDoc = doc(firestore, 'users', user.uid);
      const userNameDoc = doc(firestore, 'userNames', formValue);

      let newUser = {
        displayName: user.displayName || '',
        userName: formValue,
        photoURL: user.photoURL || '',
      };
      let newUserName = {
        userId: user.uid,
      };

      await setDoc(userDoc, newUser);
      await setDoc(userNameDoc, newUserName);
    } catch (error) {
      console.log('Error while saving', error);
    }
  };

  return (
    !userName && (
      <main>
        <h3>Choose a User Name</h3>
        <form onSubmit={onSubmit}>
          <input autoComplete="off" type="text" name="userName" onChange={onChange} value={formValue} />
          {isValid && formValue ? (
            <span className="text-success">Congratulations username is available.. 🤩🤩🤩🤩 </span>
          ) : (
            <span className="text-danger">Sorry username is already taken 😫😫</span>
          )}
          <button type="submit" className="btn-green" disabled={loading || !isValid}>
            Choose
          </button>
        </form>
        <Loader show={loading} />
        <h3>Debug State</h3>
        <div>
          isValid: {isValid.toString()}
          <br />
          Username: {formValue}
        </div>
      </main>
    )
  );
};

export default auth;
