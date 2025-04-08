export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h1>
        <p className="text-gray-600 mb-6">The digital business card you're looking for doesn't exist or has been removed.</p>
        <a href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Go Home
        </a>
      </div>
    </div>
  );
}