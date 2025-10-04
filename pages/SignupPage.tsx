import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const setAuthPage = useAuthStore((state) => state.setAuthPage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      login();
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-black p-8 text-black dark:text-white">
      <h1 className="text-3xl font-bold text-blue-500 mb-2">Create Account</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Join the community</p>
      
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Sign Up
        </button>
      </form>
      
      <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <button onClick={() => setAuthPage('login')} className="font-bold text-blue-500 hover:underline">
          Login
        </button>
      </p>
    </div>
  );
};

export default SignupPage;