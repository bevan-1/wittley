'use client';

// IMPORTS
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

// SETTINGS
export default function SettingsPage() {
    const [username, setUsername] = useState('');
    const router = useRouter();

    useEffect(() => {
        // FETCH PROFILE
        const fetchProfile = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            const user = sessionData?.session?.user;

            if (!user) {
                router.push('/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single();

            if (profile?.username) {
                setUsername(profile.username);
            }
        };

        fetchProfile();
    }, []);

    // LOGOUT
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>

            <div className="space-y-4 bg-white p-6 rounded-xl shadow border">
                <p><strong>Username:</strong> {username || 'Loading...'}</p>

                {/* SETTINGS */}
                {/* LOGOUT */}
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-whit px-4 py-2 rounded hover:bg-red-500"
                >
                    Logout
                </button>

                {/* DELETE ACCOUNT */}
            </div>
        </div>
    );
}