'use client';

// IMPORTS
import { useEffect, useState } from "react";
import { supabase } from "/lib/supabase";

// ANSWER FEED
export default function AnswersFeed({ questionId }) {
    // ADMIN UID
    const ADMIN_UID = '9cd12f12-a518-47f6-a5ea-3babc6ddc061';

    // CONSTS
    const [answers, setAnswers] = useState([]);
    const [userId, setUserId] = useState(null);
    const [feedback, setFeedback] = useState('');

    // EDITING
    const [editingId, setEditingId] = useState(null);
    const [editedAnswer, setEditedAnswer] = useState('');

    // DELETE CONFIRM
    const [showConfirm, setShowConfirm] = useState(false);
    const [toDeleteId, setToDeleteId] = useState(null);
    const [toDeleteAnswer, setToDeleteAnswer] = useState('');

    // FETCH ON LOAD
    useEffect(() => {
        const fetchAnswers = async () => {
            const sessionRes = await supabase.auth.getSession();
            const uid = sessionRes.data?.session?.user?.id;
            setUserId(uid);

            const { data } = await supabase
                .from('answers')
                .select('id, answer, created_at, likes, dislikes, score, user_id')
                .eq('question_id', questionId)
                .order('score', { ascending: false })
                .order('created_at', { ascending: false });

            setAnswers(data || []);
        };
        fetchAnswers();
    }, [questionId]);

    // VOTE HANDLER
    const handleVote = async (answerId, voteValue) => {
        if (!userId) {
            setFeedback('Please log in to vote.');
            return;
        }

        const { data: existingVote } = await supabase
            .from('answer_votes')
            .select('vote')
            .eq('user_id', userId)
            .eq('answer_id', answerId)
            .single();

        let voteAction;

        if (existingVote) {
            if (existingVote?.vote === voteValue) {
                voteAction = await supabase
                    .from('answer_votes')
                    .delete()
                    .eq('user_id', userId)
                    .eq('answer_id', answerId);
            } else {
                voteAction = await supabase
                    .from('answer_votes')
                    .update({ vote: voteValue })
                    .eq('user_id', userId)
                    .eq('answer_id', answerId);
            }
        } else {
            voteAction = await supabase
                .from('answer_votes')
                .upsert(
                    { user_id: userId, answer_id: answerId, vote: voteValue },
                    { onConflict: ['user_id', 'answer_id'] }
                )
        }

        if (voteAction.error) {
            setFeedback('Failed to vote. Please try again.');
            return;
        }

        const { data } = await supabase
            .from('answers')
            .select('id, answer, created_at, likes, dislikes, score, user_id')
            .eq('question_id', questionId)
            .order('score', { ascending: false })
            .order('created_at', { ascending: false });

        setAnswers(data || []);
    };

    return (
        <div className="w-full max-w-7xl mt-12 mx-auto px-4">
            {/* FEEDBACK */}
            {feedback && (
                <p className="text-sm text-red-500 mb-4 text-center">{feedback}</p>
            )}

            {/* HEADING */}
            <h2 className="text-2xl font-bold mb-6 text-center">Answers</h2>

            {/* ANSWERS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {answers.length === 0 ? (
                    <p className="text-gray-400 italic text-center col-span-full">
                        No answers yet.
                    </p>
                ) : (
                    answers.map((a) => (
                        <div
                            key={a.id}
                            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
                        >
                            <p className="text-base text-gray-900 mb-3">{a.answer}</p>
                            <div className="text-sm text-gray-500 flex justify-between items-center">
                                <span>
                                    {new Date(a.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleVote(a.id, 1)}
                                        className="hover:scale-110 transition text-green-600 cursor-pointer"
                                    >
                                        👍
                                    </button>
                                    <span>{a.likes || 0}</span>
                                    <button
                                        onClick={() => handleVote(a.id, -1)}
                                        className="hover:scale-110 transition text-red-500 cursor-pointer"
                                    >
                                        👎
                                    </button>
                                    <span>{a.dislikes || 0}</span>
                                    {(userId === a.user_id || userId === ADMIN_UID) && (
                                        <>
                                            {userId === a.user_id && (
                                                <button
                                                    onClick={() => {
                                                        setEditingId(a.id);
                                                        setEditedAnswer(a.answer);
                                                    }}
                                                    className="text-blue-500 font-medium cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setToDeleteId(a.id);
                                                    setToDeleteAnswer(a.answer);
                                                    setShowConfirm(true);
                                                }}
                                                className="text-red-500 font-medium cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* EDIT POPUP */}
            {editingId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
                        <h2 className="text-lg font-bold mb-3 text-center">Edit your answer</h2>
                        <textarea
                            value={editedAnswer}
                            onChange={(e) => setEditedAnswer(e.target.value)}
                            className="w-full h-32 border rounded p-3 mb-4"
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

                                    const { data } = await supabase
                                        .from('answers')
                                        .select('*')
                                        .eq('question_id', questionId)
                                        .order('score', { ascending: false });

                                    setAnswers(data || []);
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

            {/* DELETE CONFIRM POPUP */}
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
                                    setAnswers((prev) =>
                                        prev.filter((ans) => ans.id !== toDeleteId)
                                    );
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
        </div>
    );
}