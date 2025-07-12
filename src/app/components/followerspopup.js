'use client'

// IMPORTS
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import FollowButton from '../components/follow';

// FOLLOWERS POPUP
export default function FollowersPopup({ userId, type, onClose }) {
    // CONSTS
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const load = async () => {
            let ids;

            if (type === 'followers') {
                const { data: rawFollows } = await supabase
                    .from('follows')
                    .select('follower_id')
                    .eq('following_id', userId);

                ids = rawFollows?.map(f => f.follower_id) || [];
            } else {
                const { data: rawFollows } = await supabase
                    .from('follows')
                    .select('following_id')
                    .eq('follower_id', userId);

                ids = rawFollows?.map(f => f.following_id) || [];
            }

                if (ids.length === 0) {
                    setUsers([]);
                    return;
                }

                const { data: usersData } = await supabase
                    .from('profiles')
                    .select('id, username, streak')
                    .in('id', ids);

                setUsers(usersData || []);
            };

        load();
    }, [type, userId]);

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-gunmetal text-lavender w-96 max-h-[70vh] rounded-xl shadow-lg p-4 overflow-y-auto border border-frenchgray">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">
                        {type === 'followers' ? 'Followers' : 'Following'}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-red-400 text-xl cursor-pointer">×</button>
                </div>

                {users.length === 0 ? (
                    <div className="text-center text-sm text-gray-400 py-10">No one yet.</div>
                ) : (
                    users.map(u => (
                        <div key={u.id} className="flex items-center justify-between py-2 border-b border-white/10">
                            <Link href={`/${u.username}`} className="flex items-center gap-3 over:underline">
                                <div className="text-xl">👤</div>
                                <div>
                                    <div className="font-medium">@{u.username}</div>
                                    <div className="text-xs text-red-400">🔥 {u.streak}</div>
                                </div>
                            </Link>
                            <FollowButton targetUserId={u.id} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}