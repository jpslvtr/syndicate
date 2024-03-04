import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../../../firebase-config';
import { useNavigate } from 'react-router-dom';
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { db } from '../../../firebase-config';
import { doc, setDoc } from 'firebase/firestore';

const generateHash = (userId) => {
  // Define an array of allowed ASCII character codes based on the specified ranges
  const allowedCharCodes = [
    33, ...Array.from({ length: (38 - 35 + 1) }, (_, i) => i + 35),
    ...Array.from({ length: (43 - 42 + 1) }, (_, i) => i + 42),
    45, ...Array.from({ length: (57 - 48 + 1) }, (_, i) => i + 48),
    ...Array.from({ length: (91 - 59 + 1) }, (_, i) => i + 59),
    ...Array.from({ length: (95 - 93 + 1) }, (_, i) => i + 93),
    ...Array.from({ length: (126 - 98 + 1) }, (_, i) => i + 98),
  ];

  let hash = '';
  for (let i = 0; i < 4; i++) {
    // Use the userId to generate an index for the allowedCharCodes array
    const charCode = userId.charCodeAt(i % userId.length);
    const index = charCode % allowedCharCodes.length;
    const hashCharCode = allowedCharCodes[index];
    hash += String.fromCharCode(hashCharCode);
  }
  return hash;
};

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uidPublic = generateHash(user.uid); // Generate the hash for uidPublic

      // Create a user document in Firestore using the UID as the document ID
      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        name: email.split('@')[0], // Use part of the email as the name or prompt for a real name
        groupId: null,
        uidPublic, // Include the generated hash
      });

      navigate('/dashboard/home');
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already in use. Please try another.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email format. Please enter a valid email address.');
          break;
        default:
          setError('Failed to register. Please try again later.');
      }
    }
  };


  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const uidPublic = generateHash(user.uid); // Generate the hash for uidPublic

      // Create a user document in Firestore using the UID as the document ID
      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        name: user.displayName || user.email.split('@')[0], // Use the Google profile name or part of the email
        groupId: null,
        uidPublic, // Include the generated hash
      });

      navigate('/dashboard/home');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block relative"> {/* Add relative positioning here */}
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center" style={{ width: '75%', margin: '0 auto', fontFamily: 'Roboto, sans-serif' }}>
          <span className="text-white text-xl">
            Syndicate is a private newsletter platform for individuals seeking a more meaningful and private way to communicate with their circles.
            <br /><br />
            Substack enabled content creators to scale their newsletters. Syndicate empowers individuals to deepen their relationships through intentional communication.
          </span>
        </div>
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">

        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to register.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSignUp}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree to the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button className="mt-6" fullWidth type="submit">
            Register Now
          </Button>
          <Button onClick={handleGoogleSignUp} className="mt-6" fullWidth>
            Register through Google
          </Button>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/auth/sign-in" className="text-gray-900 ml-1">Sign in</Link>
          </Typography>
        </form>
      </div>
      {error && <Typography color="red">{error}</Typography>}
    </section>
  );
}

export default SignUp;