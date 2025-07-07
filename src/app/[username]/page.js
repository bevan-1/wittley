'use client'

// IMPORTS
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

// PROFILE PAGE
export default function ProfilePage() {
    const pathname = usePathname()
    const username = pathname?.split('/')?.[1] || ''
    const [profile, setProfile] = useState(null)
    const [answers, setAnswers] = useState([])
    const [sessionUserId, setSessionUserId] = useState(null)
    const [loading, setLoading] = useState(true)

    const RESERVED_ROUTES = ['admin', 'login', 'signup', 'about', 'settings', 'terms', 'privacy']

    // FETCH USER DATA + ANSWERS
    useEffect(() => {
        const fetchData = async () => {
            if (RESERVED_ROUTES.includes(username.toLowerCase())) {
                setProfile(null)
                setAnswers([])
                setLoading(false)
                return
            }

            setLoading(true)

            const sessionRes = await supabase.auth.getSession()
            setSessionUserId(sessionRes.data.session?.user?.id || null)

            const { data: user, error: userError } = await supabase
                .from('profiles')
                .select('id, username, created_at, streak')
                .eq('username', username)
                .single()

            if (userError || !user) {
                setProfile(null)
                setAnswers([])
                setLoading(false)
                return
            }

            setProfile(user)

            const { data: answersData } = await supabase
                .from('answers')
                .select('answer, created_at, questions(question), likes')
                .eq('user_id', user.id)
                .order('likes', { ascending: false })
                .limit(3)

            setAnswers(answersData || [])
            setLoading(false)
        }

        fetchData()
    }, [username])

    if (loading) {
        return <p className="text-center mt-10 text-xl">Loading profile...</p>
    }

    if (!profile) {
        return <p className="text-center mt-10 text-xl text-red-500">User not found</p>
    }

    const formattedJoinDate = new Date(profile.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
    })

    const isOwnProfile = sessionUserId === profile.id

    return (
        <div className="bg-[#f4f0ff] min-h-screen px-6 py-10">
            {/* TOP PROFILE SECTION */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-md flex items-center justify-between gap-6">
                {/* PROFILE PICTURE */}
                <div className="text-4xl bg-gray-300 rounded-full h-16 w-16 flex items-center justify-center">
                    👤
                </div>

                {/* USER INFO */}
                <div className="flex flex-col gap-1 flex-1">
                    <h1 className="text-2xl font-bold text-jetblack">@{profile.username}</h1>
                    <p className="text-sm text-gray-500">123 followers</p>
                    <div className="mt-1 flex items-center gap-2">
                        {/* STREAK BADGE */}
                        <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-600 text-xs px-3 py-[3px] rounded-full font-semibold transition-transform hover:scale-105 cursor-default select-none">
                            🔥 {profile.streak || 0}
                        </span>
                        {/* JOIN DATE */}
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full transition-transform hover:scale-105 cursor-default select-none">
                            Joined {formattedJoinDate}
                        </span>
                    </div>

                    {/* BADGE ZONE */}
                    <div className="mt-3 flex gap-2">
                        {/* ← put badges here when you build them */}
                    </div>
                </div>

                {/* SETTINGS OR FOLLOW BUTTON */}
                {isOwnProfile ? (
                    <Link
                        href="/settings"
                        className="text-sm px-5 py-3 rounded-full bg-gray-500/30 text-gray-900 hover:bg-gray-500/20 transition cursor-pointer select-none"
                    >
                        ⚙️ Settings
                    </Link>
                ) : (
                    <button
                        className="text-sm px-5 py-3 rounded-full bg-yellow-300 text-gray-900 hover:bg-yellow-400 transition cursor-pointer select-none"
                    >
                        ➕ Follow
                    </button>
                )}
            </div>

            {/* TOP ANSWERS */}
            <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-jetblack">Top Answers</h2>
                {answers.length === 0 ? (
                    <p className="text-gray-500 italic">No answers yet</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {answers.map((a, i) => (
                            <div
                                key={i}
                                className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                            >
                                <p className="text-sm italic text-gray-600 mb-1">
                                    Question: {a.questions?.question || 'Unknown'}
                                </p>
                                <p className="text-md font-medium text-gray-800 mb-3">{a.answer}</p>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>{new Date(a.created_at).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1">
                                        🔥 {a.likes || 0}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
