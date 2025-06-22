'use client'

// IMPORTS
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

// COMMENT POPUP
export default function CommentPopup({ answer, onClose }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    // GET USER & COMMENTS
    useEffect(() => {
        const fetchAll = async () => {
            const session = await supabase.auth.getSession();
            const uid = session?.data?.session?.user?.id;
            setUserId(uid);

            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('answer_id', answer.id)
                .order('created_at', { ascending: true });

            if (!error) {
                setComments(data || []);
            }
            setLoading(false);
        };
        fetchAll();
    }, [answer.id]);

    // HANDLE COMMENT SUBMIT
    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const { data, error } = await supabase
            .from('comments')
            .insert({
                comment: newComment.trim(),
                answer_id: answer.id,
                user_id: userId,
            })
            .select('*')
            .single();

        if (!error && data) {
            setComments((prev) => [...prev, data]);
            setNewComment('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 p-6">
                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl font-bold cursor-pointer"
                >
                    &times;
                </button>

                {/* ANSWER HEADER */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gunmetal mb-3">Answer</h2>
                    <div className="bg-platinum text-gunmetal p-4 rounded-xl border border-frenchgray">
                        {answer.answer}
                    </div>
                </div>

                {/* COMMENT INPUT */}
                {userId ? (
                    <form onSubmit={handleComment} className="flex items-center gap-3 mb-6">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 rounded-full border border-frenchgray px-5 py-2 text-sm text-gunmetal placeholder-frenchgray bg-white focus:outline-none focus:ring-2 focus:ring-uranian shadow-sm"
                            placeholder="Write a comment..."
                        />
                        <button
                            type="submit"
                            className="bg-uranian hover:bg-[#A1C3FF] text-white font-semibold text-sm px-5 py-2 rounded-full shadow transition cursor-pointer"
                        >
                            Post
                        </button>
                    </form>
                ) : (
                    <p className="text-sm text-frenchgray italic mb-6">Log in to leave a comment.</p>
                )}

                {/* COMMENTS */}
                <div className="space-y-4">
                    {loading ? (
                        <p className="text-sm text-gray-400 italic">Loading comments...</p>
                    ) : comments.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">No comments yet</p>
                    ) : (
                        comments.map((c) => (
                            <div
                                key={c.id}
                                className="bg-[#F8F8F8] border border-gray-200 p-3 rounded-xl text-sm text-gunmetal shadow-sm"
                            >``
                                {c.comment}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
