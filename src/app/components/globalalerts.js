'use client';

// IMPORTS
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function GlobalAlerts() {
    // STATE
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    // SEND GLOBAL NOTIFICATION
    const handleSend = async () => {
        setStatus('');

        if (!message.trim()) {
            setStatus('MESSAGE CANNOT BE EMPTY');
            return;
        }

        // GET ALL USER IDS
        const { data: users, error } = await supabase
            .from('profiles')
            .select('id');

        if (error || !users) {
            setStatus('FAILED TO FETCH USERS');
            return;
        }

        // CREATE NOTIFICATIONS FOR ALL
        const inserts = users.map((u) => ({
            user_id: u.id,
            message: `🚨 WITTLEY ALERT: ${message}`,
            link: '/',
        }));

        const { error: insertError } = await supabase
            .from('notifications')
            .insert(inserts);

        if (insertError) {
            setStatus('FAILED TO SEND ALERT');
        } else {
            setMessage('');
            setStatus('✅ ALERT SENT TO ALL USERS');
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">SEND A GLOBAL NOTIFICATION</h2>

            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter alert message..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none"
            />

            <button
                onClick={handleSend}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full font-semibold transition cursor-pointer"
            >
                🚨 Send Alert
            </button>

            {status && (
                <div className="text-sm font-medium mt-2 text-gray-700">
                    {status}
                </div>
            )}
        </div>
    );
}
