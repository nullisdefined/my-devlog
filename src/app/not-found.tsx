import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Link href="/devlog">
        <div className="group text-center space-y-6 p-12 bg-white shadow-lg rounded-lg w-64 h-64">
          <FaExclamationTriangle className="w-16 h-16 text-gray-400 mx-auto group-hover:text-red-300 transform group-hover:translate-z-2 group-hover:scale-105 transition-transform duration-300" />
          <h1 className="text-5xl font-extrabold text-gray-800 group-hover:text-red-300 transform group-hover:translate-z-2 group-hover:scale-105 transition-transform duration-300">
            404
          </h1>
        </div>
      </Link>
    </div>
  );
}
