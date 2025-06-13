'use client'

// IMPORTS
import { useEffect, useState} from 'react';
import { supabase } from '../../../lib/supabase';

// USERNAME PROMPT
export default function UsernamePrompt() {
    const [showPopup, setShowPopup] = useState(false);
    const [username, setUsername] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkUsername = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            const user = sessionData?.session?.user;
            if (!user || !user.email_confirmed_at) {
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single();

            if (!error && !data?.username) {
                setShowPopup(true);
            }
        }

        checkUsername()
    }, [])

    const saveUsername = async () => {
        setFeedback('');
        setLoading(true);

        const trimmed = username.trim().toLowerCase();
        if (!trimmed || trimmed.length < 3) {
            setFeedback('Username must be at least 3 characters');
            setLoading(false);
            return;
        }

        // CHECK FOR DUPES
        const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', trimmed)
            .single();
        
        if (existing) {
            setFeedback('Username already taken');
            setLoading(false);
            return;
        }

        // UPDATE PROFILE
        const { error } = await supabase
            .from('profiles')
            .update({ username: trimmed })
            .eq('id', (await supabase.auth.getUser()).data.user.id);

        if (error) {
            setFeedback('Unable to save. Try again');
            setLoading(false);
            return;
        }

        setShowPopup(false);
        setLoading(false);
    }

    if (!showPopup) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg animate-fadeIn relative">
                <h2 className="text-xl font-bold mb-3 text-center">You're In! 🎉</h2>
                <p className="mb-4 text-center">Pick your username to complete your profile</p>

                <input
                    className="w-ful mb-3 p-2 rounded bg-neutral-200 text-black justify-center text-center"
                    placeholder="Your username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button
                    onClick={saveUsername}
                    className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-500 cursor-pointer"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Username'}
                </button>

                {feedback && <p className="mt-3 tet-sm text-red-600">{feedback}</p>}
                <button 
                    onClick={() => setShowPopup(false)}
                    className="absolute top-3 right-3 text-xl"
                >
                    x
                </button>
            </div>
        </div>
    )
}