import Link from "next/link";
import { ListTodo } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-white/10">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ListTodo className="h-7 w-7 text-gray-300" />
          <span className="text-xl font-bold">TodoApp</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white">
            Login
          </Link>
          <Link href="/signup" className="bg-white text-black px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-200">
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  )
}