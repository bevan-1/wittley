'use client'

// IMPORTS
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

//  FOLLOW BUTTON
export default function FollowButton({ targetUserId }) {
    // CONSTS
    const [session, setSession] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const { data } = await supabase.auth.getSession();
            const user = data?.session?.user;
            if (!user) return;
            setSession(user);

            const { data: existing } = await supabase
                .from('follows')
                .select('id')
                .eq('follower_id', user.id)
                .eq('following_id', targetUserId)
                .single();

            setIsFollowing(!!existing);
            setLoading(false);
        };
        init();
    }, [targetUserId]);

    const toggleFollow = async () => {
        if (!session) return;
        setLoading(true);

        if (isFollowing) {
            await supabase
                .from('follows')
                .delete()
                .eq('follower_id', session.id)
                .eq('following_id', targetUserId);
            setIsFollowing(false);
        } else {
            await supabase.from('follows').insert({
                follower_id: session.id,
                following_id: targetUserId,
            });
            setIsFollowing(true);
        }
        setLoading(false);
    };

    if (!session || session.id === targetUserId) return null; // DON'T SHOW IF VIEWING SELF

    return (
        <button
            onClick={toggleFollow}
            disabled={loading}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                isFollowing
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
            {loading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
        </button>
    );
}