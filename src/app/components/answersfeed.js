'use client';

import { useEffect, useState } from 'react';
import { supabase } from '/lib/supabase';
import CommentPopup from './comments';
import { RefreshCcw } from 'lucide-react';

export default function AnswersFeed({ questionId, onRefresh, answers, userId }) {
    const [feedback, setFeedback] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editedAnswer, setEditedAnswer] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [toDeleteId, setToDeleteId] = useState(null);
    const [toDeleteAnswer, setToDeleteAnswer] = useState('');
    const [commentingAnswer, setCommentingAnswer] = useState(null);

    const ADMIN_UID = '9cd12f12-a518-47f6-a5ea-3babc6ddc061';

    const sortedAnswers = Array.isArray(answers)
        ? [...answers].sort((a, b) => (b.likes || 0) - (a.likes || 0))
        : [];
    const topThree = sortedAnswers.slice(0, 3);
    const rest = sortedAnswers.slice(3);
    const [showAll, setShowAll] = useState(false);

    const fetchAnswers = async () => {
        await supabase.auth.getSession();
        onRefresh();
    };

    const handleLike = async (answerId) => {
        if (!userId) {
            setFeedback('Please log in to react.');
            return;
        }

        // grab a single vote or null
        const { data: existingLike, error: fetchError } = await supabase
            .from('answer_votes')
            .select('vote')
            .eq('user_id', userId)
            .eq('answer_id', answerId)
            .maybeSingle();

        if (fetchError) {
            console.error('Error fetching like status:', fetchError);
            return;
        }

        if (existingLike) {
            // user already liked it – remove the vote
            const { error: deleteError } = await supabase
                .from('answer_votes')
                .delete()
                .eq('user_id', userId)
                .eq('answer_id', answerId);
            if (deleteError) console.error('Error deleting like:', deleteError);
        } else {
            // not liked yet – insert a new vote
            const { error: insertError } = await supabase
                .from('answer_votes')
                .insert([
                    { user_id: userId, answer_id: answerId, vote: 1 }
                ]);
            if (insertError) console.error('Error inserting like:', insertError);
        }

        onRefresh();
    };

    const renderAnswerCard = (a) => (
        <div
            key={a.id}
            onClick={() => setCommentingAnswer(a)}
            className="bg-white border border-frenchgray rounded-xl p-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer"
        >
            <p className="text-base font-medium text-gunmetal mb-4">{a.answer}</p>
            <div className="text-xs text-frenchgray flex justify-between items-center">
                <span>{new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <div className="flex items-center gap-3 text-gunmetal">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleLike(a.id);
                        }}
                        className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-yellow-200 transition group cursor-pointer"
                    >
                        <span className="text-xl group-hover:scale-110 transition">🔥</span>
                        <span className="text-sm font-semibold">{a.likes || 0}</span>
                    </button>
                    {(userId === a.user_id || userId === ADMIN_UID) && (
                        <>
                            {userId === a.user_id && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingId(a.id);
                                        setEditedAnswer(a.answer);
                                    }}
                                    className="text-blue-500 font-medium cursor-pointer hover:underline"
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setToDeleteId(a.id);
                                    setToDeleteAnswer(a.answer);
                                    setShowConfirm(true);
                                }}
                                className="text-red-500 font-medium cursor-pointer hover:underline"
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mt-12 mx-auto px-4">
            {feedback && (
                <p className="text-sm text-red-500 mb-4 text-center">{feedback}</p>
            )}

            <h2 className="text-2xl text-gunmetal font-bold mb-6 text-center">Answers</h2>

            <div className="flex mb-6">
                <button
                    onClick={fetchAnswers}
                    className="bg-uranian text-gunmetal font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow-md hover:bg-[#A1C3FF] transition cursor-pointer"
                >
                    🔄 Refresh Answers
                </button>
            </div>

            {topThree.length > 0 && (
                <>
                    <h3 className="text-xl font-bold text-center mb-4 text-uranian">Top Answers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                        {topThree.map(renderAnswerCard)}
                    </div>
                </>
            )}

            {!showAll && rest.length > 0 && (
                <div className="text-center my-6">
                    <button
                        onClick={() => setShowAll(true)}
                        className="bg-platinum hover:bg-yellow-400 text-gunmetal font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                    >
                        Show More Answers
                    </button>
                </div>
            )}

            {showAll && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {rest.map(renderAnswerCard)}
                </div>
            )}

            {editingId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
                        <h2 className="text-lg font-bold mb-3 text-center">Edit your answer</h2>
                        <textarea
                            value={editedAnswer}
                            onChange={(e) => setEditedAnswer(e.target.value)}
                            className="w-full h-32 border border-frenchgray rounded p-3 mb-4"
                            maxLength={50}
                        />
                        <p className="text-sm text-right text-gray-500 mb-4 italic">
                            {editedAnswer.length}/50 characters
                        </p>
                        {feedback && (
                            <p className="text-sm text-red-500 text-center mb-2">{feedback}</p>
                        )}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={async () => {
                                    const trimmed = editedAnswer.trim();
                                    if (!trimmed) {
                                        setFeedback('Answer cannot be empty');
                                        setTimeout(() => setFeedback(''), 3000);
                                        return;
                                    }
                                    if (trimmed.length > 50) {
                                        setFeedback('Answer must be 50 characters or less');
                                        setTimeout(() => setFeedback(''), 3000);
                                        return;
                                    }
                                    await supabase
                                        .from('answers')
                                        .update({ answer: editedAnswer })
                                        .eq('id', editingId);
                                    setEditingId(null);
                                    onRefresh();
                                }}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 cursor-pointer"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditingId(null)}
                                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md text-center">
                        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                        <p className="mb-6 text-gray-700">
                            You're about to delete this answer:
                            <br />
                            <span className="italic text-black">{toDeleteAnswer}</span>
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={async () => {
                                    await supabase
                                        .from('answers')
                                        .delete()
                                        .eq('id', toDeleteId);
                                    onRefresh((prev) => prev.filter((ans) => ans.id !== toDeleteId));
                                    setShowConfirm(false);
                                }}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 cursor-pointer"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {commentingAnswer && (
                <CommentPopup
                    answer={commentingAnswer}
                    onClose={() => setCommentingAnswer(null)}
                />
        )}
        </div>
    );
}
