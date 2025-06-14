'use client';

// IMPORTS
import { Twitter, Instagram, Discord } from 'lucide-react';
import Link from 'next/link';

// FOOTER
export default function Footer() {
    return (
        <footer className="w-full border-t border-frenchgray bg-frenchgray text-gunmetal mt-12">
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center gap-4 text-center">

                {/* SOCIAL LINKS */}
                <div className="flex gap-5">
                    <Link
                        href="https://twitter.com/wittleydaily"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gunmetal transition duration-200"
                    >
                        <Twitter size={22} />
                    </Link>
                </div>

                {/* COPYRIGHT */}
                <p className="text-sm text-gunmetal">
                    &copy; {new Date().getFullYear()} Wittley. All rights reserved.
                </p>

                {/* PRIVACY & TERMS */}
                <div className="text-sm text-gunmetal space-x-2">
                    <Link 
                        href="/terms" 
                        className="hover:underline hover:text-gunmetal"
                    >
                        Terms of Service
                    </Link>
                    <span>|</span>
                    <Link
                        href="/privacy"
                        className="hover:underline hover:text-gunmetal"
                    >
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </footer>
    )
}
