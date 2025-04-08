export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-6 text-center">TAPs Digital Business Cards</h1>
        <p className="text-xl mb-8 text-center">
          Share your digital business card with a simple link.
        </p>
        <p className="text-center text-gray-600 mb-4">
          Visit <code className="font-mono bg-gray-100 p-1 rounded">/v/[profile_id]</code> to view a shared card
        </p>
      </div>
    </main>
  );
}