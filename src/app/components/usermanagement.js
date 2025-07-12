'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import CommentPopup from '../components/comments';

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [answersPopup, setAnswersPopup] = useState(false);
    const [commentsPopup, setCommentsPopup] = useState(false);
    const [answers, setAnswers] = useState([]);

    const handleSearch = async () => {
        setSearching(true);
        setResults([]);

        if (!searchTerm.trim()) {
            setSearching(false);
            return;
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .ilike('username', `%${searchTerm}%`);

        if (!error) {
            setResults(data);
        }

        setSearching(false);
    };

    const handleStreakChange = async (userId, newStreak) => {
        await supabase
            .from('profiles')
            .update({ streak: newStreak })
            .eq('id', userId);
    };

    const handleUsernameChange = async (userId, newUsername) => {
        await supabase
            .from('profiles')
            .update({ username: newUsername })
            .eq('id', userId);
    };

    const handlePasswordReset = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) console.error(error);
        else alert('Reset email sent');
    };

    const openAnswersPopup = async (user) => {
        const { data } = await supabase
            .from('answers')
            .select('*, questions(question)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        setAnswers(data || []);
        setSelectedUser(user);
        setAnswersPopup(true);
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
                    {results.map((user) => {
                        const joinDate = new Date(user.created_at).toLocaleDateString();
                        return (
                            <div
                                key={user.id}
                                className="bg-white border p-6 rounded-xl shadow space-y-4"
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold">@{user.username}</h3>
                                    <span className="text-sm text-gray-400">Joined {joinDate}</span>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-2 items-center">
                                        <label className="text-sm text-gray-600">Username:</label>
                                        <input
                                            defaultValue={user.username}
                                            onBlur={(e) => handleUsernameChange(user.id, e.target.value)}
                                            className="border px-3 py-1 rounded text-sm"
                                        />
                                    </div>

                                    <div className="flex gap-2 items-center">
                                        <label className="text-sm text-gray-600">Streak:</label>
                                        <input
                                            type="number"
                                            defaultValue={user.streak}
                                            onBlur={(e) => handleStreakChange(user.id, parseInt(e.target.value))}
                                            className="border px-3 py-1 rounded text-sm w-20"
                                        />
                                    </div>

                                    <div className="flex gap-3 mt-2 flex-wrap">
                                        <button
                                            onClick={() => openAnswersPopup(user)}
                                            className="px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 text-sm"
                                        >
                                            View Answers
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setCommentsPopup(true);
                                            }}
                                            className="px-4 py-2 rounded bg-green-100 hover:bg-green-200 text-sm"
                                        >
                                            View Comments
                                        </button>
                                        <button
                                            onClick={() => handlePasswordReset(user.email)}
                                            className="px-4 py-2 rounded bg-yellow-100 hover:bg-yellow-200 text-sm"
                                        >
                                            Send Reset Email
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ANSWERS MODAL */}
            {answersPopup && selectedUser && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Answers from @{selectedUser.username}</h2>
                            <button
                                onClick={() => setAnswersPopup(false)}
                                className="text-xl font-bold text-gray-400 hover:text-black"
                            >
                                &times;
                            </button>
                        </div>
                        {answers.length === 0 ? (
                            <p className="text-sm italic text-gray-500">No answers</p>
                        ) : (
                            <ul className="space-y-4">
                                {answers.map((a) => (
                                    <li
                                        key={a.id}
                                        className="border border-gray-200 rounded-xl p-4 shadow-sm"
                                    >
                                        <p className="text-gray-700 text-sm mb-2">
                                            <strong>Q:</strong> {a.questions?.question || 'Unknown'}
                                        </p>
                                        <p className="text-gray-900 mb-2">{a.answer}</p>
                                        <div className="flex gap-4 text-sm text-blue-600">
                                            <button
                                                onClick={async () => {
                                                    const newAnswer = prompt('Edit answer:', a.answer);
                                                    if (newAnswer) {
                                                        await supabase
                                                            .from('answers')
                                                            .update({ answer: newAnswer })
                                                            .eq('id', a.id);
                                                        setAnswers((prev) =>
                                                            prev.map((ans) =>
                                                                ans.id === a.id ? { ...ans, answer: newAnswer } : ans
                                                            )
                                                        );
                                                    }
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Delete this answer?')) {
                                                        await supabase
                                                            .from('answers')
                                                            .delete()
                                                            .eq('id', a.id);
                                                        setAnswers((prev) => prev.filter((ans) => ans.id !== a.id));
                                                    }
                                                }}
                                                className="text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {/* COMMENTS POPUP (uses existing CommentPopup component on a dummy answer) */}
            {commentsPopup && selectedUser && (
                <CommentPopup
                    answer={{ id: selectedUser.id, answer: `Comments from @${selectedUser.username}` }}
                    onClose={() => setCommentsPopup(false)}
                />
            )}
        </div>
    );
}