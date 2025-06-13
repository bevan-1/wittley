'use client';

// IMPORTS
import { use, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

// COMPONENT
import AnswersFeed from "./components/answersfeed";
import Feedback from "./components/feedback";

export default function Home() {

  // CONSTS
  const [question, setQuestion] = useState('');
  const [questionId, setQuestionId] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [done, setDone] = useState(false);

  const [answer, setAnswer] = useState('');
  const [userId, setUserId] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);

  // ANIMATION SUBMIT
  const [submitted, setSubmitted] = useState(false);

  // CHARACTER COUNTER
  const maxChars = 50;

  // TYPING ANIMATION
  useEffect(() => {
    if (!question) return;

    setDisplayedText(''); //RESET THE ANIMATED TEXT WHEN QUESTION CHANGES
    let i = 0;

    const interval = setInterval(() => {
      if (i < question.length) {
        setDisplayedText(question.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [question]);

  // GET USER SESSION
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      const id = data?.session?.user?.id;
      setUserId(id);
      if (id) {
        checkIfAlreadySubmitted(id);
      }
    };
    getUser();
  }, []);

  // FETCH QUESTION
  useEffect(() => {
    const fetchQuestion = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('date_posted', today)
        .single();

      if (data) {
        setQuestion(data.question);
        setQuestionId(data.id);
      } else {
        setQuestion('Why is there no question for today? Answer: a bug.');
      }
    };
    fetchQuestion();
  }, []);

  // CHECK IF USER HAS ALREADY SUBMITTED AN ANSWER
  const checkIfAlreadySubmitted = async (uid) => {
    const { data, error } = await supabase
      .from('answers')
      .select('created_at, question_id')
      .eq('user_id', uid);

    const today = new Date().toDateString();

    const submittedToday = data?.some((a) => a.question_id === questionId);

    if (submittedToday) {
      setHasSubmitted(true);
    }
  };

  // FETCH ALL ANSWERS
  useEffect(() => {
    const fetchAnswers = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      const { data, error } = await supabase
        .from('answers')
        .select('id, answer, created_at, likes, dislikes, score, user_id')
        .order('score', { ascending: false })
        .order('created_at', { ascending: false });

      if (data) {
        setAnswers(data);
        setUserId(userId);
      }
    }
    fetchAnswers();
  }, []);

  // SUBMIT HANDLER
  const handleSubmit = async () => {
    if (!userId) {
      setFeedback('Please log in to submit your answer.');
      return;
    }
    if (!answer.trim()) {
      setFeedback('Gotta type something!');
      return;
    }
    if (hasSubmitted) {
      setFeedback('You have already submitted an answer today.');
      return;
    }

    const { error } = await supabase.from("answers").insert({
      answer,
      user_id: userId,
      question_id: questionId,
    });

    if (error) {
      if (error.code === "23505") {
        setFeedback('You have already submitted an answer today.');
      } else {
        setFeedback('Something went wrong. Please try again.')
      }
    } else {
      setAnswer('');
      setHasSubmitted(true);
      setSubmitted(true);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center justify-start p-6">
      {/* TODAY'S QUESTION */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mt-10 mb-8">
        {displayedText}
        <span
          className={`inline-block w-[1ch] ${done ? 'animate-blink' : ''}`}
        >
          |
        </span>
      </h1>

      {/* ANSWER INPUT */}
      {!hasSubmitted && (
        <div className={`flex w-full max-w-2xl items-center space-x-2 mb-2 transition-all duration-700 ease-in-out ${submitted ? 'opacity-0 translate-x-[-100%]' : ''}`}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            maxLength={maxChars}
            className="flex-1 rounded-full bg-neutral-300 text-black placeholder-neutral-500 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-400 transition-shadow duration-300"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-3 rounded-full transition cursor-pointer"
          >
            Submit
          </button>
        </div>
      )}

      {/* CHARACTER COUNTER */}
      {!hasSubmitted && (
        <div className="w-full max-w-2xl text-right text-xs text-gray-500 mb-6 italic">
          {answer.length}/{maxChars} characters
        </div>
      )}

      {/* SUBMITTED */}
      {submitted && (
        <div className="animate-fadeIn text-xl font-semibold text-green-600 mb-4">
          Answer Submitted!
        </div>
      )}

      {/* FEEDBACK MESSAGE */}
      {feedback && (
        <p className="text-sm text-gray-700 mb-6">{feedback}</p>
      )}

      {/* ANSWER FEED */}
      <>
        <AnswersFeed questionId={questionId} />
      </>
    </main>
  );
}