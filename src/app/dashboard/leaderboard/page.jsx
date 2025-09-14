'use client';

export default function LeaderboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Compete with other students and see where you rank on the global leaderboard!
        </p>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <span>1. Top Student</span>
            <span className="font-bold">5000 pts</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <span>2. Second Place</span>
            <span className="font-bold">4500 pts</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <span>3. Third Place</span>
            <span className="font-bold">4000 pts</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-yellow-100 dark:bg-yellow-900 rounded">
            <span>4. Your Position</span>
            <span className="font-bold">1250 pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}