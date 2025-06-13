'use client'

// IMPORTS
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

// PAST QUESTIONS
export default function PastQuestions() {
    const [pastQuestions, setPastQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPastQuestions = async () => {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .lt('date_posted', today)
                .order('date_posted', { ascending: false });

            if (!error) {
                setPastQuestions(data || []);
            }
            setLoading(false);
        };

        fetchPastQuestions();
    }, []);

    return (
        <div className="bg-gray-50 p-6 rounded-xl border shadow space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Past Questions</h2>
                {loading ? (
                    <p className="text-gray-500 italic">Loading past questions...</p>
                ) : pastQuestions.length === 0 ? (
                    <p className="text-gray-400 italic">No past questions yet</p>
                ) : (
                    <ul className="space-y-3">
                        {pastQuestions.map((q) => (
                            <li
                                key={q.id}
                                className="bg-white border border-neutral-200 px-4 py-3 rounded shadow-sm"
                            >
                                <strong>{q.date_posted}:</strong> {q.question}
                            </li>
                        ))}
                    </ul>
                )}
        </div>
    );
}
