'use client';

import { useSession,signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { data: session } = useSession();
    const [memberSince, setMemberSince] = useState(null);
     useEffect(() => {
    // This code only runs on the client, after hydration
    setMemberSince(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="space-y-3">
          <p><strong>Name:</strong> {session?.user?.name}</p>
          <p><strong>Email:</strong> {session?.user?.email}</p>
          <p><strong>Class Level:</strong> Not set yet</p>
          <p><strong>Member since:</strong>  {memberSince}</p>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded">
              <p className="font-bold">Current Streak</p>
              <p className="text-2xl">7 days</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded">
              <p className="font-bold">Total Points</p>
              <p className="text-2xl">1,250</p>
            </div>
          </div>
        </div>
         {/* Sign Out Button */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                 onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full py-2 px-4 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
      </div>
    </div>
  );
}