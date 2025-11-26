import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../images/logo.png';


export function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  // Ensure the page always starts showing the Sign In form on mount.
  // This forces the initial view to Login even if something else
  // briefly toggles it before React mounts.
  useEffect(() => {
    setIsSignIn(false);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/role_selector');
  };

  const switchToSignUp = () => setIsSignIn(false);
  const switchToSignIn = () => setIsSignIn(true);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4"
      
    >
      {/* Absolute Top-Left Logo */}
      <div className="fixed top-4 left-4 z-50">
        <img
          src={logo}
          alt="mGate Logo"
          className="h-16 w-auto object-contain drop-shadow"
        />
      </div>
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-lg flex overflow-hidden">
        {/* Forms side by side on desktop, only active on mobile */}
        <div className="w-full flex flex-col md:flex-row">
          {/* Sign In Form (left side on desktop) */}
          <div className={`w-full md:w-1/2 ${isSignIn ? 'flex' : 'hidden'} md:flex flex-col justify-center items-center p-8`}>
            <div className="font-bold text-3xl text-teal-500 mb-4">Log In</div>
            {/* <div className="flex gap-4 mb-4">
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-teal-500 font-bold">F</button>
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-teal-500 font-bold">G+</button>
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-teal-500 font-bold">in</button>
            </div>
            <div className="text-gray-400 text-sm mb-4">or use your account:</div> */}
            <form  className="w-full max-w-xs flex flex-col gap-3" onSubmit={handleAuth}>
              <input type="email" placeholder="Email" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="password" placeholder="Password" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <div className="text-sm text-gray-500 mt-1 cursor-pointer hover:text-teal-500">Forgot your password?</div>
              <button 
                
                className="mt-4 bg-teal-500 text-white rounded-full px-8 py-2 font-semibold hover:bg-teal-600 transition-colors"
              >
                SIGN IN
              </button>



            {/* Mobile: Show Create Account toggle */}
            <button
              type="button"
              onClick={switchToSignUp}
              className="md:hidden mt-4 text-teal-500 underline text-sm"
            >
              Create Account
            </button>



            </form>
          </div>
          {/* Sign Up Form (right side on desktop) */}
          <div className={`w-full md:w-1/2 ${isSignIn ? 'hidden' : 'flex'} md:flex flex-col justify-center items-center p-8`}>
            <div className="font-bold text-3xl text-teal-500 mb-4">Create Account</div>
            {/* <div className="flex gap-4 mb-4">
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-teal-500 font-bold">F</button>
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-teal-500 font-bold">G+</button>
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-teal-500 font-bold">in</button>
            </div>
            <div className="text-gray-400 text-sm mb-4">or use your email for registration:</div> */}
            <form className="w-full max-w-xs flex flex-col gap-3" onSubmit={handleAuth}>
              <input type="text" placeholder="Name" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="email" placeholder="Email" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="password" placeholder="Password" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="password" placeholder="Confirm Password" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <label className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <input type="checkbox" required className="accent-teal-500" />
                <span>I accept the <a href="#" className="underline text-teal-500">Terms & Privacy</a></span>
              </label>
              <button
                type="submit"
                className="mt-4 bg-teal-500 text-white rounded-full px-8 py-2 font-semibold hover:bg-teal-600 transition-colors"
              >
                Create Account
              </button>
            {/* Mobile: Show Log In toggle */}
            <button
              type="button"
              onClick={switchToSignIn}
              className="md:hidden mt-4 text-teal-500 underline text-sm"
            >
              Log In
            </button>
            </form>
          </div>
        </div>



        
        {/* Overlay Panel for switching */}
        <div className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full transition-transform duration-700 ease-in-out ${isSignIn ? '-translate-x-full' : 'translate-x-0'}`}>
          <div className="absolute top-0 left-0 w-full h-full bg-teal-500 text-white flex flex-col justify-center items-center p-8">
            {/* Overlay for Sign In */}
            <div className={`transition-opacity duration-300 absolute w-full px-8 ${isSignIn ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <div className="font-bold text-2xl mb-2">Welcome back</div>
              <div className="text-base mb-6">To keep connected with us please login with your personal info</div>
              <div className="text-base mb-6">I have already an account?</div>
              <button
                onClick={switchToSignUp}
                className="border border-white rounded-full px-8 py-2 font-semibold hover:bg-white hover:text-teal-500 transition-colors"
              >
                SIGN IN
              </button>
            </div>
            {/* Overlay for Sign Up */}
            <div className={`transition-opacity duration-300 absolute w-full px-8 ${isSignIn ? 'opacity-0 z-0' : 'opacity-100 z-10'}`}>
              <div className="font-bold text-2xl mb-2">Hello</div>
              <div className="text-base mb-6">Enter your personal details and start your journey with us</div>
              <button
                onClick={switchToSignIn}
                className="border border-white rounded-full px-8 py-2 font-semibold hover:bg-white hover:text-teal-500 transition-colors"
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}