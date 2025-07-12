'use client';

// IMPORTS
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

export default function NotificationsBell() {
    // STATE
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [unread, setUnread] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState({});
    const scrollRef = useRef(null);
    const limit = 20;

    // FETCH NOTIFICATIONS FROM SUPABASE
    const fetchNotifications = async (refresh = false) => {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        if (!userId) return;

        const offset = refresh ? 0 : notifications.length;

        setLoading(true);
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (refresh) {
            setNotifications(data || []);
        } else {
            setNotifications(prev => [...prev, ...(data || [])]);
        }

        setUnread((data || []).some(n => !n.seen));
        setHasMore((data || []).length === limit);
        setLoading(false);
    };

    // AUTO REFRESH EVERY 30 SECONDS
    useEffect(() => {
        fetchNotifications(true);
        const interval = setInterval(() => fetchNotifications(true), 30000);
        return () => clearInterval(interval);
    }, []);

    // INFINITE SCROLL HANDLER
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => {
            if (
                el.scrollTop + el.clientHeight >= el.scrollHeight - 20 &&
                hasMore &&
                !loading
            ) {
                fetchNotifications();
            }
        };

        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading, notifications]);

    // MARK ONE OR MORE NOTIFICATIONS AS SEEN
    const markAsSeen = async (ids) => {
        await supabase.from('notifications').update({ seen: true }).in('id', ids);
        setNotifications(prev => prev.filter(n => !ids.includes(n.id)));
        setUnread(prev => notifications.some(n => !n.seen && !ids.includes(n.id)));
    };

    // GROUP SIMILAR NOTIFICATIONS
    const grouped = {};
    notifications.forEach(n => {
        const match = n.message.match(/^@[\w\d_-]+ (.+)$/);
        const key = match ? match[1] : n.message;

        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(n);
    });

    return (
        <div className="relative">
            {/* BELL ICON */}
            <button
                onClick={() => {
                    setOpen(!open);
                    if (!open) fetchNotifications(true);
                }}
                className="text-2xl relative cursor-pointer"
            >
                🔔
                {unread && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
            </button>

            {/* DROPDOWN CONTAINER */}
            {open && (
                <div
                    ref={scrollRef}
                    className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white text-black shadow-lg rounded-xl z-50 border border-gray-200"
                >
                    {/* HEADER */}
                    <div className="p-3 font-bold border-b">NOTIFICATIONS</div>

                    {/* EMPTY STATE */}
                    {Object.keys(grouped).length === 0 && !loading && (
                        <div className="text-sm text-gray-500 text-center p-4">NO NOTIFICATIONS</div>
                    )}

                    {/* GROUPED NOTIFICATION RENDERING */}
                    {Object.entries(grouped).map(([msg, group]) => {
                        const seen = group.every(n => n.seen);
                        const firstLink = group[0].link || '#';
                        const ids = group.map(n => n.id);

                        // IF ONLY ONE ENTRY, RENDER NORMALLY
                        if (group.length === 1) {
                            const n = group[0];
                            return (
                                <Link
                                    key={n.id}
                                    href={n.link || '#'}
                                    onClick={() => markAsSeen([n.id])}
                                    className={`block px-4 py-3 text-sm hover:bg-gray-100 transition ${
                                        n.seen ? 'text-gray-600' : 'text-black font-semibold'
                                    } ${n.message?.startsWith('🚨') ? 'bg-red-100 border-l-4 border-red-500' : ''}`}
                                >
                                    {n.message}
                                </Link>
                            );
                        }

                        // MULTIPLE USERS POSTED SAME TYPE OF UPDATE
                        const isExpanded = expanded[msg];

                        return (
                            <div key={msg} className="border-b border-gray-100">
                                <div
                                    onClick={() => setExpanded(prev => ({ ...prev, [msg]: !prev[msg] }))}
                                    className={`block px-4 py-3 text-sm cursor-pointer hover:bg-gray-100 transition ${
                                        seen ? 'text-gray-600' : 'text-black font-semibold'
                                    }`}
                                >
                                    👥 {group.length} users you follow {msg}
                                    <span className="float-right text-xs text-gray-400">
                                        {isExpanded ? '▲' : '▼'}
                                    </span>
                                </div>

                                {/* EXPANDED USER LIST */}
                                {isExpanded && (
                                    <div className="px-4 pb-2">
                                        {group.map(n => {
                                            const username = n.message.match(/^@([\w\d_-]+)/)?.[1] || 'Someone';
                                            return (
                                                <Link
                                                    key={n.id}
                                                    href={n.link || '#'}
                                                    onClick={() => markAsSeen([n.id])}
                                                    className="block text-xs py-1 px-2 hover:bg-gray-50 rounded"
                                                >
                                                    @{username}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* LOADING INDICATOR */}
                    {loading && (
                        <div className="text-sm text-center text-gray-400 py-3">LOADING...</div>
                    )}
                </div>
            )}
        </div>
    );
}