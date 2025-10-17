"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useEffect } from "react";
import { ListTodo, LogOut } from "lucide-react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };
  return (
    <header className="border-b border-white/10">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ListTodo className="h-7 w-7 text-blue-500" />
          <span className="text-xl font-bold">TodoApp</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-400">{user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600/20 text-red-400 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-red-600/40"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-300 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/login"
                className="bg-white text-black px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
