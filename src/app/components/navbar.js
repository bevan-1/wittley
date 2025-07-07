'use client';

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import StreakDisplay from "./streakdisplay";

export default function Navbar() {
    const [session, setSession] = useState(null);
    const [username, setUsername] = useState(null);
    const [streak, setStreak] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const ADMIN_UID = '9cd12f12-a518-47f6-a5ea-3babc6ddc061';

    useEffect(() => {
        const init = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            const user = sessionData?.session?.user;

            if (!user) return;

            setSession(sessionData.session);

            const { data: profile } = await supabase
                .from('profiles')
                .select('username, streak, last_answered')
                .eq('id', user.id)
                .single();

            if (profile?.username) {
                setUsername(profile.username);
            }

            const today = new Date().toISOString().split('T')[0];
            if (profile?.last_answered === today && profile.streak > 0) {
                setStreak(profile.streak);
            } else {
                setStreak(profile?.streak || 0);
            }
        };

        init();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUsername(null);
        setMenuOpen(false);
    };

    useEffect(() => {
        const close = (e) => {
            if (!e.target.closest('#menu-drawer') && !e.target.closest('#menu-toggle')) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, []);

    return (
        <nav className="w-full bg-gunmetal text-lavender shadow-md px-6 py-4 sticky top-0 z-50 border-b border-frenchgray">
            <div className="max-w-7xl mx-auto flex items-center justify-between relative">

                {/* LOGO */}
                <Link 
                    href="/" 
                    className="text-3xl font-extrabold tracking-tight hover:text-uranian transition-colors"
                >
                    Wittley
                </Link>

                {/* NAV BUTTONS */}
                {session ? (
                    <div
                        id="menu-toggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-3xl bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                    >
                        👤
                    </div>
                ) : (
                    <a
                        href="/login"
                        className="text-uranian hover:text-white font-medium text-lg transition-colors"
                    >
                        Login
                    </a>
                )}
            </div>

            {/* DROPDOWN MENU DRAWER */}
            {session && (
                <div
                    id="menu-drawer"
                    className={`fixed top-[64px] right-0 h-[calc(100vh-64px)] w-64 bg-gunmetal text-lavender shadow-2xl rounded-l-2xl z-40 transition-transform duration-200 p-4 flex flex-col gap-4 ${
                        menuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    {/* PROFILE CLICKABLE BLOCK */}
                    <Link
                        href={`/${username}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all"
                    >
                        <div className="text-3xl bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
                            👤
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">@{username}</span>
                            <div className="mt-1">
                                <span className="inline-flex items-center gap-1 bg-red-600/30 text-red-300 text-xs px-2 py-[2px] rounded-full font-semibold">
                                    🔥 {streak}
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* SETTINGS */}
                    <Link
                        href="/settings"
                        onClick={() => setMenuOpen(false)}
                        className="w-full px-4 py-3 rounded-full bg-[#2A2A2A] hover:bg-uranian/10 transition-all text-sm font-medium flex items-center gap-2"
                    >
                        ⚙️ Settings
                    </Link>

                    {/* ADMIN */}
                    {session.user.id === ADMIN_UID && (
                        <Link
                            href="/admin"
                            onClick={() => setMenuOpen(false)}
                            className="w-full px-4 py-3 rounded-full bg-[#2A2A2A] hover:bg-uranian/10 transition-all text-sm font-medium flex items-center gap-2 text-uranian"
                        >
                            🛠️ Admin
                        </Link>
                    )}

                    {/* LOGOUT */}
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 rounded-full bg-red-600 hover:bg-red-500 text-lavender transition-all text-sm font-semibold flex items-center gap-2 cursor-pointer"
                    >
                        🚪 Logout
                    </button>
                </div>
            )}
        </nav>
    );
}
