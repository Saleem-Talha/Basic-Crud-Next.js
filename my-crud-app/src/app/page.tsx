import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-center p-4 shadow-lg rounded-lg">
        <Link href="/books" className="text-blue-500 hover:underline">
          Go to Books
        </Link>
      </div>
    </div>
  );
}
