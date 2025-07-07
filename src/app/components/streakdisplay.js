'use client';

// CONSTS
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

// STREAK DISPLAY
export default function StreakDisplay() {
    const [streak, setStreak] = useState(null);

    useEffect(() => {
        const fetchStreak = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            const userId = sessionData?.session?.user?.id;
            if (!userId) return;

            const { data } = await supabase
                .from('profiles')
                .select('streak, last_answered')
                .eq('id', userId)
                .single();

            const today = new Date().toISOString().split('T')[0];
            if (data?.last_answered === today) {
                setStreak(data.streak);
            } else {
                setStreak(data.streak || 0);
            }
        };
        fetchStreak();
    }, []);

    if (streak === null) return null;

    return (
        <div className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray100 cursor-default">
            🔥 Streak: {streak} days
        </div>
    );
}