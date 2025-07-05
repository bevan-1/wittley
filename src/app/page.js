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

  const [streakCount, setStreakCount] = useState(null);

  // ANIMATION SUBMIT
  const [submitted, setSubmitted] = useState(false);

  // CHARACTER COUNTER
  const maxChars = 50;

  // TYPING ANIMATION
  useEffect(() => {
    if (!question) return;

    setDisplayedText('');
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
        .limit(1);

        if (error || !data || data.length === 0) {
          setQuestion('Uhh...I cant think of a question.');
        } else {
          setQuestion(data[0].question);
          setQuestionId(data[0].id);
        }
    };
    fetchQuestion();
  }, []);

  // CHECK IF USER HAS ALREADY SUBMITTED AN ANSWER
  const checkIfAlreadySubmitted = async (uid) => {
    const { data } = await supabase
      .from('answers')
      .select('created_at, question_id')
      .eq('user_id', uid);

    const submittedToday = data?.some((a) => a.question_id === questionId);
    if (submittedToday) setHasSubmitted(true);
  };

  // FETCH ALL ANSWERS
  const fetchAnswers = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      const { data } = await supabase
        .from('answers')
        .select('id, answer, created_at, likes, dislikes, score, user_id')
        .eq('question_id', questionId)
        .order('score', { ascending: false })
        .order('created_at', { ascending: false });

      if (data) {
        setAnswers(data);
        setUserId(userId);
      }
    }

  useEffect(() => {
    if (!questionId) return
    fetchAnswers();
  }, [questionId]);

    // GET STREAK COUNT
  useEffect(() => {
    const fetchStreak = async () => {
      if (!userId) return;
      const { data } = await supabase
        .from('profiles')
        .select('streak, last_answered')
        .eq('id', userId)
        .single();

      const today = new Date().toISOString().split('T')[0];
      if (data?.last_answered === today && data.streak > 0) {
        setStreakCount(data.streak);

        // 4-HOUR WARNING BEFORE LOSING STREAK
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const msRemaining = endOfDay.getTime() - now.getTime();
        const hoursRemaining = msRemaining / (1000 * 60 * 60);

        if (data.last_answered !== today && hoursRemaining <= 4 && data.streak > 0) {
          setFeedback(`⏳ You're ${Math.floor(hoursRemaining)} hours from losing your ${data.streak} day streak. Don’t forget to answer!`);
        }
      }
    };
    fetchStreak();
  }, [userId, submitted]);

  // STREAKS
  const updateStreak = async (userId) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const { data: profile } = await supabase
      .from('profiles')
      .select('streak, last_answered')
      .eq('id', userId)
      .single();
    
    let newStreak = 1;
    if (profile?.last_answered === yesterdayStr) {
      newStreak = (profile.streak || 0) + 1;
    }

    await supabase
      .from('profiles')
      .update({
        streak: newStreak,
        last_answered: today,
      })
      .eq('id', userId);
  };

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
      await updateStreak(userId);
      fetchAnswers();
    }
  };


  return (
    <main className="min-h-screen bg-lavender flex flex-col items-center justify-start p-6 md:p-10 lg:px-24 font-sans">

      {/* TODAY'S QUESTION */}
      <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-uranian mb-2">Wittle Asks:</p>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-gunmetal mb-6">
        {displayedText}
        <span className={`inline-block w-[1ch] ${done ? 'animate-blink' : ''}`}>
          |
        </span>
      </h1>

      {streakCount && (
        <div 
          className={`mb-4 text-gunmetal text-lg font-semibold text-center transition-all ${
            submitted ? 'animate-bounce' : ''
          }`}
        >
          🔥 {streakCount} day streak!
        </div>
      )}

      {/* ANSWER INPUT */}
      {!hasSubmitted && (
        <div className={`flex w-full max-w-2xl items-center space-x-3 mb-1 transition-all duration-700 ease-in-out ${submitted ? 'opacity-0 translate-x-[-100%]' : ''}`}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type your answer here..."
            maxLength={maxChars}
            className="flex-1 rounded-full bg-platinum text-gunmetal placeholder:text-frenchgray px-5 py-3 text-base outline-none focus:ring-2 focus:ring-uranian transition-all duration-300 shadow-md hover:shadow-lg"
          />
          <button
            onClick={handleSubmit}
            className="bg-uranian hover:bg-[#3A87E8] text-lavender font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer"
          >
            Submit
          </button>
        </div>
      )}

      {/* CHARACTER COUNTER */}
      {!hasSubmitted && (
        <div className="w-full max-w-2xl text-right text-[11px] text-gunmetal/60 mb-6 italic pr-2">
          {answer.length}/{maxChars} characters
        </div>
      )}

      {/* SUBMITTED */}
      {submitted && (
        <div className="animate-fadeIn text-xl font-semibold text-green-600 mb-4">
          ✅ Answer Submitted!
        </div>
      )}

      {/* FEEDBACK MESSAGE */}
      {feedback && (
        <p className="text-sm font-medium text-frenchgray mb-6">
          {feedback}
        </p>
      )}

      {/* ANSWER FEED */}
      <AnswersFeed 
        questionId={questionId}
        onRefresh={fetchAnswers}
        answers={answers}
        userId={userId}
      />
    </main>
  );
}