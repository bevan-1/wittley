'use client';

// IMPORTS
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function Navbar() {
    // CONST
    const [session, setSession] = useState(null);

    // ADMIN UID
    const ADMIN_UID = '9cd12f12-a518-47f6-a5ea-3babc6ddc061';

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        };
        getSession();
    }, []);

    const handleLogin = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    return (
        <nav className="w-full bg-white border-b border-gray-200 shadow-md px-6 py-3 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* LOGO */}
                <a href="/" className="text-3xl font-extrabold text-gray-900 tracking-tight hover:text-blue-600 transition-colors">
                    Wittley
                </a>

                {/* NAV BUTTONS */}
                {session ? (
                    <div className="flex items-center gap-6">
                        {session.user.id === ADMIN_UID && (
                            <a
                                href="/admin"
                                className="text-blue-600 hover:text-blue-800 font-semibold text-lg transition-colors"
                            >
                                Admin
                            </a>
                        )}

                        <a
                            href="/account"
                            className="text-gray-700 hover:text-gray-900 font-semibold text-lg transition-colors"
                        >
                            Profile
                        </a>

                        <button
                            onClick={handleLogin}
                            className="text-red-600 hover:text-red-800 font-semibold text-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <a
                        href="/login"
                        className="text-blue-600 hover:text-blue-800 font-semibold text-lg transition-colors"
                    >
                        Login
                    </a>
                )}
            </div>
        </nav>
    );
}
