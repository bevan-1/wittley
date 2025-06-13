'use client';
// IMPORTS
import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import Signup from "../components/signup";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showSignup, setShowSignup] = useState(false);

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password});
        if (error) setError(error.message);
        else setSuccess('Logged in!');
    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            {/* EMAIL */}
            <input
                className="w-full mb-2 p-2 rounded bg-neutral-200 text-black"
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            {/* PASSWORD */}
            <input
                className="w-full mb-4 p-2 rounded bg-neutral-200 text-black"
                tpye="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            
            <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                Log In
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-600 mt-2">{success}</p>}

            <p className="mt-4 text-sm text-gray-600">
                Don't have an account? 
                <a 
                    onClick={() => setShowSignup(true)}
                    className="text-blue-600 hover:underline cursor-pointer mx-2"
                >
                    Sign Up
                </a>
            </p>

            {/* SIGNUP MODAL */}
            {showSignup && <Signup onClose={() => setShowSignup(false)} />}
        </div>
    )
}