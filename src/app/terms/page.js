'use client';

// IMPORTS
import Link from 'next/link';

export default function TermsOfServicePage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
            <h1 className="text-4xl font-bold mb-4">📜 Terms of Service</h1>
            <p><strong>Last updated:</strong> June 13, 2025</p>

            <p>Welcome to Wittley — a daily social platform where users answer thought-provoking questions, vote on each other's responses, and join fast-paced discussions that refresh each day.</p>

            <p>By accessing or using Wittley, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the platform.</p>

            <h2 className="text-2xl font-semibold mt-8">1. Eligibility</h2>
            <p>To use Wittley, you must be at least 13 years old. By creating an account, you confirm that you meet this age requirement.</p>

            <h2 className="text-2xl font-semibold mt-8">2. Account Registration</h2>
            <p>When you register, you must provide a valid email address, password, and username. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.</p>

            <h2 className="text-2xl font-semibold mt-8">3. User Conduct</h2>
            <ul className="list-disc pl-8 space-y-1">
                <li>Harassment, abuse, hate speech, or threats</li>
                <li>Discriminatory or violent content</li>
                <li>Spam, scams, or deceptive practices</li>
                <li>Illegal or harmful behavior</li>
            </ul>
            <p>Wittley reserves the right to remove content, suspend, or permanently ban accounts at our discretion, especially for violations of these rules.</p>

            <h2 className="text-2xl font-semibold mt-8">4. Content Ownership and License</h2>
            <p>You retain ownership of the content you post (e.g., answers, comments). However, by submitting content to Wittley, you grant us a worldwide, non-exclusive, royalty-free license to use, display, reproduce, and distribute your content on the platform for as long as your content exists on our services.</p>

            <h2 className="text-2xl font-semibold mt-8">5. Content Storage and Access</h2>
            <p>All user-generated content on Wittley — including answers, comments, and questions — is stored indefinitely unless deleted by the user or removed for violating these Terms.</p>
            <p>Yesterday’s question and its content is accessible and interactive to all users. Archived content (older than one day) may only be accessible to users with a Wittley Pro subscription (when Pro is launched).</p>

            <h2 className="text-2xl font-semibold mt-8">6. Suspension and Termination</h2>
            <p>We may suspend or terminate your access to Wittley at any time, for any reason, including but not limited to:</p>
            <ul className="list-disc pl-8 space-y-1">
                <li>Violation of these Terms</li>
                <li>Harmful or abusive behavior</li>
                <li>Spamming or disruptive use</li>
            </ul>
            <p>You may also delete your account at any time. This will remove your personal data and associated content, subject to our privacy practices.</p>

            <h2 className="text-2xl font-semibold mt-8">7. Wittley Pro and Payments</h2>
            <p>Wittley Pro (premium features) is not yet available, but may be introduced in the future. All payments, when active, will be processed securely via Stripe.</p>
            <p>Pricing, features, and refund policies will be disclosed at the time of launch and updated in these Terms accordingly.</p>

            <h2 className="text-2xl font-semibold mt-8">8. Disclaimers</h2>
            <p>Wittley is provided "as is" without warranties of any kind. We do not guarantee:</p>
            <ul className="list-disc pl-8 space-y-1">
                <li>Continuous or error-free access</li>
                <li>That content will always be accurate, appropriate, or free of objectionable material</li>
            </ul>
            <p>You use the platform at your own risk.</p>

            <h2 className="text-2xl font-semibold mt-8">9. Modifications to Terms</h2>
            <p>We may update these Terms from time to time. If we make material changes, we will notify users via email or platform notice. Continued use of Wittley after changes are posted constitutes your acceptance of the updated Terms.</p>

            <h2 className="text-2xl font-semibold mt-8">10. Governing Law</h2>
            <p>These Terms are governed by the laws of Australia. Any disputes shall be subject to the exclusive jurisdiction of Australian courts.</p>

            <h2 className="text-2xl font-semibold mt-8">11. Contact</h2>
            <p>If you have questions or concerns about these Terms, please contact us at:</p>
            <p><strong>Email:</strong>{' '}
                <a href="mailto:support@wittley.com" className="text-blue-600 underline">
                    support@wittley.com
                </a>
            </p>
        </div>
    );
}
