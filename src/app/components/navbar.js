'use client';

// IMPORTS
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

export default function Navbar() {
    // CONST
    const [session, setSession] = useState(null);
    const [username, setUsername] = useState(null);

    // ADMIN UID
    const ADMIN_UID = '9cd12f12-a518-47f6-a5ea-3babc6ddc061';

    useEffect(() => {
        const init = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            const user = sessionData?.session?.user;

            if (!user) {
                setSession(null);
                setUsername(null);
                return;
            }

            setSession(sessionData.session);

            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single();
            
            if (profile?.username) {
                setUsername(profile.username);
            }
        };

        init();
    }, []);

    const handleLogin = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUsername(null);
    };

    return (
        <nav className="w-full bg-white border-b border-gray-200 shadow-md px-6 py-3 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* LOGO */}
                <Link href="/" className="text-3xl font-extrabold text-gray-900 tracking-tight hover:text-blue-600 transition-colors">
                    Wittley
                </Link>

                {/* NAV BUTTONS */}
                {session ? (
                    <div className="flex items-center gap-6">
                        {session.user.id === ADMIN_UID && (
                            <Link
                                href="/admin"
                                className="text-blue-600 hover:text-blue-800 font-semibold text-lg transition-colors"
                            >
                                Admin
                            </Link>
                        )}

                        <Link
                            href={`/${username}`}
                            className="text-gray-700 hover:text-gray-900 font-semibold text-lg transition-colors"
                        >
                            Profile
                        </Link>
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
