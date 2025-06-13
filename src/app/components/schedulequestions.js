'use client'

// IMPORTS
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Feedback from '../components/feedback';

// ADMIN PAGE
export default function ScheduleQuestion() {
    const [session, setSession] = useState(null);
    const [question, setQuestion] = useState('');
    const [date, setDate] = useState('');
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editedQuestion, setEditedQuestion] = useState('');
    const [editedDate, setEditedDate] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [toDeleteId, setToDeleteId] = useState(null);
    const [toDeleteQuestion, setToDeleteQuestion] = useState('');

    // ADMIN UID
    const ADMIN_UID = '9cd12f12-a518-47f6-a5ea-3babc6ddc061';

    // CHECK ACCESS
    const checkAccess = async () => {
        const { data } = await supabase.auth.getSession();
        const user = data?.session?.user;

        if (user?.id === ADMIN_UID) {
            fetchScheduledQuestions();
            fetchCurrentQuestion();
        }
    };

    const handleSubmit = async () => {
        setFeedback('');
        setFeedbackType('');

        if (!question || !date) {
            setFeedback('Question and date required.');
            setFeedbackType('error');
        return;
        }

        const { data: dateMatch } = await supabase
            .from('questions')
            .select('id')
            .eq('date_posted', date)
            .single();

        if (dateMatch) {
            setFeedback('A question for that date already exists');
            setFeedbackType('error');
            return;
        }

        const { data: textMatches } = await supabase
            .from('questions')
            .select('id')
            .ilike('question', question.trim());

        if (textMatches && textMatches.length > 0) {
            setFeedback('That question has already been asked');
            setFeedbackType('error');
            return;
        }

        const { error } = await supabase.from('questions').insert({
            question,
            date_posted: date,
        });

        if (error) {
            setFeedback('Failed to add question');
            setFeedbackType('error');
        } else {
            setQuestion('');
            setDate('');
            setFeedback('Question scheduled');
            setFeedbackType('success');
            fetchScheduledQuestions();
        }

        setTimeout(() => {
            setFeedback('');
            setFeedbackType('');
        }, 3000);
    };

    const fetchCurrentQuestion = async () => {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await supabase
        .from('questions')
        .select('*')
        .eq('date_posted', today)
        .single();

        if (data) setCurrentQuestion(data);
    };

    const fetchScheduledQuestions = async () => {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await supabase
            .from('questions')
            .select('*')
            .order('date_posted', { ascending: true });

        if (data) {
            const filtered = data.filter((q) => q.date_posted > today);
            setQuestions(filtered);
        }
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from('questions').delete().eq('id', id);

        if (error) {
            setFeedback('Failed to delete question');
        } else {
            setFeedback('Question deleted');
            setTimeout(() => setFeedback(''), 3000);
            fetchScheduledQuestions();
        }
    };

    useEffect(() => {
        checkAccess();
    }, []);

    return (
        <div className="space-y-6">
            {/* FORM */}
            <div className="bg-gray-50 p-6 rounded-xl border shadow space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Schedule New Question</h2>
                <input
                    type="text"
                    placeholder="Write your question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    maxLength={100}
                    className="w-full px-4 py-2 rounded bg-white border"
                />
                <p className="text-sm text-gray-500 text-right italic">{question.length}/100 characters</p>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-white border"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition cursor-pointer"
                >
                    Schedule Question
                </button>
                <Feedback message={feedback} />
            </div>

            {/* TODAY'S QUESTION */}
            {currentQuestion && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl">
                    <strong>Today's Question:</strong>
                    <p>{currentQuestion.date_posted}: {currentQuestion.question}</p>
                </div>
            )}

            {/* SCHEDULED QUESTIONS */}
            <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Scheduled Questions</h2>
                <ul className="space-y-4">
                    {questions.map((q) => (
                    <li key={q.id} className="bg-white border p-4 rounded-xl shadow-sm flex flex-col">
                        {editingId === q.id ? (
                        <>
                            <input
                                type="text"
                                value={editedQuestion}
                                onChange={(e) => setEditedQuestion(e.target.value)}
                                className="w-full px-2 py-2 mb-2 rounded border"
                            />
                            <input
                                type="date"
                                value={editedDate}
                                onChange={(e) => setEditedDate(e.target.value)}
                                className="w-full px-2 py-2 mb-2 rounded border"
                            />
                        </>
                    ) : (
                        <p><strong>{q.date_posted}:</strong> {q.question}</p>
                    )}

                    <div className="flex flex-wrap gap-3 mt-2">
                        {editingId === q.id ? (
                            <>
                                <button
                                    onClick={async () => {
                                        const { error } = await supabase
                                            .from('questions')
                                            .update({ question: editedQuestion, date_posted: editedDate })
                                            .eq('id', q.id);

                                         if (error) {
                                            setFeedback('Failed to update question');
                                        } else {
                                            setFeedback('Question Updated');
                                            setTimeout(() => setFeedback(''), 3000);
                                            setEditingId(null);
                                            fetchScheduledQuestions();
                                        }
                                    }}
                                    className="text-green-600 font-bold"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="text-gray-600 font-bold"
                                >
                                    Cancel
                                </button>
                            </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            setToDeleteId(q.id);
                                            setToDeleteQuestion(q.question);
                                            setShowConfirm(true);
                                        }}
                                        className="text-red-600 font-bold"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingId(q.id);
                                            setEditedQuestion(q.question);
                                            setEditedDate(q.date_posted);
                                        }}
                                        className="text-blue-600 font-bold"
                                    >
                                        Edit
                                    </button>
                                </>
                            )}
                        </div>
                    </li>
                    ))}
                </ul>
            </div>

            {/* DELETE CONFIRM */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
                        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                        <p className="mb-6 text-gray-700">
                            You're about to delete:<br />
                            <span className="italic text-black">{toDeleteQuestion}</span>
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={async () => {
                                    await handleDelete(toDeleteId);
                                    setShowConfirm(false);
                                }}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 cursor-pointer"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
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