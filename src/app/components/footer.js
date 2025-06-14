'use client';

// IMPORTS
import { Twitter, Instagram, Discord} from 'lucide-react';
import Link from 'next/link';

// FOOTER
export default function Footer() {
    return (
        <footer className="w-full border-t bg-white text-gray-700 mt-12">
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center gap-4 text-center">
                {/* SOCIAL LINKS */}
                <div className="flex gap-5">
                    <Link
                        href="https://twitter.com/wittleydaily"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover: text-black transition"
                    >
                        <Twitter size={20} />
                    </Link>
                </div>

                {/* COPYRIGHT */}
                {/* COPYRIGHT */}
                <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Wittley. All rights reserved.
                </p>

                {/* PRIVACY & TERMS */}
                <div className="text-sm text-gray-500 space-x-2">
                    <Link 
                        href="/terms" 
                        className="hover:underline"
                    >
                        Terms of Service
                    </Link>
                    <span>|</span>
                    <Link
                        href="/privacy"
                        className="hover:underline"
                    >
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </footer>
    )
}