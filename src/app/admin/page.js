'use client';

// IMPORTS
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import ScheduleQuestion from '../components/schedulequestions';
import PastQuestions from '../components/pastquestions';
import UserManagement from '../components/usermanagement';

export default function AdminPanel() {
    // CONSTS
    const [isLoading, setIsLoading] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tab, setTab] = useState('schedule');

    const tabs = [
        { key: 'schedule', label: '🗓️ Schedule Questions' },
        { key: 'past', label: '📜 Past Questions' },
        { key: 'users', label: '👤 User Management' },
    ];

    // ADMIN UID
    const ADMIN_UID = '9cd12f12-a518-47f6-a5ea-3babc6ddc061';

    useEffect(() => {
        // CHECK ADMIN ACCESS
        const checkAccess = async () => {
            const { data } = await supabase.auth.getSession();
            const user = data?.session?.user;

            setIsLoading(false);
            setIsLoggedIn(!!user);

            if (user?.id === ADMIN_UID) {
                setIsAllowed(true);
            }
        };
        checkAccess();
    }, []);

    if (isLoading) {
        return (
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mt-10 mb-8">
                Loading...
            </p>
        );
    }

    if (!isLoggedIn) {
        return (
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mt-10 mb-8">
                Please log in to access the admin panel.
            </p>
        );
    }

    if (!isAllowed) {
        return (
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mt-10 mb-8">
                Nope. That&apos;s not for you.
            </p>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold text-center mb-8">Admin Panel</h1>

            {/* TABS */}
            <div className="flex justify-center flex-wrap gap-4 mb-6">
                {tabs.map((t) => (
                <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`px-5 py-2 rounded-full font-semibold transition cursor-pointer border ${
                    tab === t.key
                        ? 'bg-white text-blue-600 border-blue-500 shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300'
                    }`}
                >
                    {t.label}
                </button>
                ))}
            </div>

            {/* TAB CONTENT */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                {tab === 'schedule' && <ScheduleQuestion />}
                {tab === 'past' && <PastQuestions />}
                {tab === 'users' && <UserManagement />}
            </div>
        </div>
    );
}
