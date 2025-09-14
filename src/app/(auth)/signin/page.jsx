'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="p-8 rounded-lg shadow-lg max-w-md w-full bg-white dark:bg-gray-800">
        {/* Back to Home */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to home
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Welcome to QuestLearn
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to start your learning adventure
          </p>
        </div>

        <button
          onClick={() => signIn('google')}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-200 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}