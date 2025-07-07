'use client'

// IMPORTS
import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup({ onClose }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [feedback, setFeedback] = useState('');

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // Handle Signup
    const handleSignup = async () => {
        setFeedback('');
        setLoading(true);

        if (!agreedToTerms) {
            setFeedback("You must agree to the Terms of Service to create an account.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword){
            setFeedback('Passwords do not match.');
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setFeedback(error.message);
        } else {
            setStep(2);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="relative bg-white w-full max-w-md p-6 rounded-xl shadow-lg animate-fadeIn">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {step === 1 ? 'Create Account' : 'Verify Your Email'}
                </h2>

                {/* STEP 1: SIGNUP FORM */}
                {step === 1 && (
                    <>
                        <input
                            className="w-full mb-3 p-2 rounded bg-neutral-200 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-400"
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="w-full mb-3 p-2 rounded bg-neutral-200 text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-400"
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            className={`w-full mb-4 p-2 rounded ${
                                confirmPassword && confirmPassword === password
                                    ? 'bg-green-200'
                                    : 'bg-neutral-200'
                            } text-black placeholder-gray-500 outline-none focus-ring-2 ${
                                confirmPassword && confirmPassword !== password
                                    ? 'ring-2 ring-red-400'
                                    : 'focus:ring-blue-400'
                            }`}
                            type="password"
                            placeholder="Confirm Password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {/* TOS */}
                        <label className="flex items-start mb-4 space-x-2 text-sm">
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 cursor-pointer"
                            />
                            <span className="cursor-pointer">
                                By creating an account, you agree to our{' '}
                                <Link
                                    href="/terms"
                                    className="text-blue-600 underline"
                                >
                                    Terms of Service
                                </Link>.
                            </span>
                        </label>

                        <button 
                            onClick={handleSignup}
                            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-500 transition cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </button>
                    </>
                )}

                {/* STEP 2: EMAIL VERIFICATION MESSAGE */}
                {step === 2 && (
                    <div className="text-center">
                        <p className="text-lg mb-4">
                            ✅ Sent to {email}!
                            <br />
                            You'll have to verify your email by clicking the link sent to your inbox before going any further.
                        </p>
                        <p className="text-sm text-neutral-600">
                            Once verified, come back here to pick your username.
                        </p>
                        <p className="text-sm text-neutral-600">
                            If you don't see the email, check your spam folder.
                        </p>
                    </div>
                )}

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-xl cursor-pointer"
                >
                    x
                </button>

                {/* FEEDBACK */}
                {feedback && <p className="mt-3 text-sm text-red-600">{feedback}</p>}
            </div>
        </div>
    );
}