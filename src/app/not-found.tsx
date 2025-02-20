// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4 max-[640px]:text-[1.125rem] max-[640px]:mb-0">
        404 - Page Not Found
      </h1>
      <p className="text-lg mb-6 max-[640px]:text-[1rem] max-[640px]:mb-4 max-[640px]:text-center">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        Go back home
      </Link>
    </div>
  );
}
