'use client';

export default function SubjectsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Subjects</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <p className="text-gray-600 dark:text-gray-400">
          Subjects content coming soon. Here you'll be able to browse all available subjects 
          for your class level and track your progress.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">Mathematics</h3>
            <p className="text-sm text-gray-500">Progress: 0%</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">Science</h3>
            <p className="text-sm text-gray-500">Progress: 0%</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">English</h3>
            <p className="text-sm text-gray-500">Progress: 0%</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">Computer Science</h3>
            <p className="text-sm text-gray-500">Progress: 0%</p>
          </div>
        </div>
      </div>
    </div>
  );
}