'use client'

// IMPORTS
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// PROFILE
export default function ProfilePage() {
    // CONSTS
    const pathname = usePathname();
    const username = pathname?.split('/')?.[1] || '';

    const [profile, setProfile] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true)

    // RESERVED ROUTES
    const RESERVED_ROUTES = ['admin', 'login', 'signup', 'about']

    useEffect(() => {
        const fetchData = async () => {
            if (RESERVED_ROUTES.includes(username.toLowerCase())) {
            setProfile(null);
            setAnswers([]);
            setLoading(false);
            return;
        }

            setLoading(true);

            // GET USER PROFLILE
            const { data: user, error: userError } = await supabase
                .from('profiles')
                .select('id, username, created_at')
                .eq('username', username)
                .single();

            if (userError || !user) {
                setProfile(null);
                setAnswers([]);
                setLoading(false);
                return;
            }

            setProfile(user);

            // GET ANSWERS
            const { data: answersData } = await supabase
                .from('answers')
                .select('answer, created_at, questions(question)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            setAnswers(answersData || []);
            setLoading(false);
        }

        fetchData();
    }, [username])

    if (loading) {
        return <p className="text-center mt-10 text-xl">Loading profile...</p>
    }

    if (!profile) {
        return <p className="text-center mt-10 text-xl text-red-500">User not found</p>
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* HEADER */}
            <div className="bg-white p-6 rounded-xl shadow border">
                <h1 className="text-3xl font-bold">@{profile.username}</h1>

                {/* JOINED DATE */}
                <p className="text-gray-600 mt-1">
                    Joined {new Date(profile.created_at).toLocaleDateString()}
                </p>

                {/* STREAK */}
                <p className="text-gray-600 mt-1">
                    🔥 Streak: {profile.streak || 0} days
                </p>

                {/* SETTINGS */}
                <Link
                    href="/settings"
                    className="mt-4 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 border text-sm cursor-pointer"
                >
                    ⚙️ Settings
                </Link>

            </div>

            {/* ANSWERS */}
            <div className="bg-white p-6 rounded-xl shadow border">
                <h2 className="text-xl font-semibold mb-4">Answers</h2>
                {answers.length === 0 ? (
                    <p className="text-gray-500 italic">No answers yet</p>
                ) : (
                    <ul className="space-y-3">
                        {answers.map((a, i) => (
                            <li key={i} className="border p-4 rounded-xl bg-gray-50">
                                <p className="text-gray-900 mb-1"><strong>{a.answer}</strong></p>
                                <p className="text-sm text-gray-500">
                                    <strong>Question:</strong> {a.questions?.question || 'Unknown question'} <br />
                                    <strong>Posted:</strong> {new Date(a.created_at).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
