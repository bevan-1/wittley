'use client';

// IMPORTS
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

// USER MANAGEMENT
export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async () => {
        setSearching(true);
        setResults([]);

        if (!searchTerm.trim()) {
            setSearching(false);
            return;
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, answers (question_id, answer)')
            .ilike('username', `%${searchTerm}%`);

        if (!error) {
            setResults(data);
        }

        setSearching(false);
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl border shadow space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">User Management</h2>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search by username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 rounded bg-white border w-full"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition cursor-pointer"
                    >
                        Search
                    </button>
                </div>
            </div>

            {searching ? (
                <p className="text-gray-500 italic text-center">Searching...</p>
            ) : results.length === 0 ? (
                <p className="text-gray-400 italic text-center">No users found</p>
            ) : (
                <div className="space-y-6">
                    {results.map((user) => (
                        <div
                            key={user.id}
                            className="bg-white border p-4 rounded-xl shadow-sm space-y-3"
                        >
                            <p className="font-semibold">@{user.username}</p>
                            <div className="space-y-2">
                                {user.answers.length === 0 ? (
                                    <p className="text-sm text-gray-500">No answers submitted.</p>
                                ) : (
                                    <ul className="list-disc pl-5 space-y-1">
                                        {user.answers.map((a, i) => (
                                            <li key={i} className="text-sm text-gray-700">
                                                {a.answer} (Q: {a.question_id})
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
