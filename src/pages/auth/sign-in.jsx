import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../../../firebase-config';
import { useNavigate } from 'react-router-dom';
import {
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard/home');
    } catch (error) {
      switch (error.code) {
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/user-not-found':
          setError('No user found with this email. Please sign up.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled. Please contact support.');
          break;
        default:
          setError('Failed to sign in. Please try again later.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard/home');
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div style={{ textAlign: 'center' }}>
          <img
            src="/img/synlogo.jpg"
            alt="Syndicate Logo"
            style={{ width: '50%', height: 'auto', display: 'inline-block', marginLeft: '-20px' }}
            className="mb-4"
          />
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to sign in.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSignIn}>
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
              value={email} // Set the value of the input to the email state
              onChange={(e) => setEmail(e.target.value)} // Update the email state on input change
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
              value={password} // Set the value of the input to the password state
              onChange={(e) => setPassword(e.target.value)} // Update the password state on input change
            />
          </div>
          <Button className="mt-6" fullWidth type="submit">
            Sign In
          </Button>

          <div className="space-y-4 mt-8">
            <Button onClick={handleGoogleSignIn} className="mt-6" fullWidth>

              <span>Sign in With Google</span>
            </Button>
          </div>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">Create account</Link>
          </Typography>
        </form>

      </div>
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
      {error && <Typography color="red">{error}</Typography>}
    </section>
  );
}

export default SignIn;
