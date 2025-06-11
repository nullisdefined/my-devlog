import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:bg-black dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-black">
      <Link href="/devlog">
        <div className="group text-center space-y-6 p-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-2xl rounded-2xl w-80 h-80 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl hover:scale-105 transition-all duration-700 ease-out">
          <FaExclamationTriangle className="w-20 h-20 text-gray-400 mx-auto group-hover:text-gray-500 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ease-out will-change-transform" />
          <div className="relative inline-block">
            <h1 className="text-7xl font-black tracking-tighter leading-none">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-pink-700 transition-all duration-700 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 dark:group-hover:from-blue-300 dark:group-hover:via-purple-300 dark:group-hover:to-pink-300">
                404
              </span>
            </h1>
            {/* 배경 텍스트 효과 */}
            <div className="absolute inset-0 -z-10">
              <span className="text-7xl font-black tracking-tighter leading-none text-gray-100 dark:text-gray-800 opacity-30 blur-lg group-hover:opacity-40 transition-all duration-700">
                404
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors duration-500">
              페이지를 찾을 수 없습니다
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
