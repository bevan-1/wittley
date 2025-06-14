'use client';

// IMPORTS
import Link from 'next/link';

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
            <h1 className="text-4xl font-bold mb-4">📄 Privacy Policy for Wittley</h1>
            <p><strong>Effective Date:</strong> June 13, 2025</p>

            <p>Wittley ("we", "us", or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data when you use our platform.</p>

            <p>We comply with the <strong>Privacy Act 1988 (Cth)</strong> and the <strong>Australian Privacy Principles (APPs)</strong>, and where applicable, the <strong>General Data Protection Regulation (GDPR)</strong>.</p>

            <h2 className="text-2xl font-semibold mt-8">1. About Wittley</h2>
            <p>Wittley is a daily social platform that posts one debate-style or reflective question per day. Users respond, vote, and comment. While the platform resets each day, all content is archived for Pro users.</p>
            <p>Our platform is designed for users aged <strong>13 and over</strong> and is available <strong>globally</strong>. We are based in <strong>Australia</strong> and operate under Australian privacy laws.</p>

            <h2 className="text-2xl font-semibold mt-8">2. What Data We Collect</h2>
            <ul className="list-disc pl-8 space-y-1">
                <li><strong>Account Data:</strong> Email address, username, and hashed password</li>
                <li><strong>Authentication Data:</strong> Google or Apple login data (if used)</li>
                <li><strong>User Content:</strong> Answers, comments, votes</li>
                <li><strong>Usage Info:</strong> Streaks, likes, activity logs</li>
                <li><strong>Device Data:</strong> IP address, session cookies (via Supabase)</li>
                <li><strong>Cookies:</strong> Only essential cookies for login/session</li>
            </ul>
            <p>We do <strong>not</strong> collect location, contacts, direct messages, or sensitive data.</p>

            <h2 className="text-2xl font-semibold mt-8">3. How We Use Your Data</h2>
            <ul className="list-disc pl-8 space-y-1">
                <li>To create and manage your account</li>
                <li>To display your activity and content</li>
                <li>To send transactional and optional marketing emails</li>
                <li>To improve and monitor the platform</li>
                <li>To comply with legal obligations</li>
            </ul>
            <p>We may enable usage analytics (e.g. Vercel Analytics, Google Analytics) in the future for platform improvement.</p>

            <h2 className="text-2xl font-semibold mt-8">4. Legal Basis for Processing (GDPR)</h2>
            <ul className="list-disc pl-8 space-y-1">
                <li>Consent (for marketing emails and optional cookies)</li>
                <li>Performance of a contract (to provide the Wittley service)</li>
                <li>Legal obligations</li>
                <li>Legitimate interests (e.g., improving functionality and maintaining platform security)</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8">5. User Rights</h2>
            <ul className="list-disc pl-8 space-y-1">
                <li>Access, correct, or delete your personal information via your account</li>
                <li>Delete your account entirely (removing all personal data and content)</li>
                <li>Unsubscribe from marketing communications</li>
                <li>Lodge a complaint</li>
                <li>Request data portability (EU/EEA)</li>
                <li>Restrict or object to processing (EU/EEA)</li>
                <li>Withdraw consent at any time (EU/EEA)</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8">6. Data Sharing</h2>
            <p>We do not sell your personal data. We may share data only with trusted service providers that help us operate Wittley:</p>
            <ul className="list-disc pl-8 space-y-1">
                <li>Supabase (backend database, storage, and authentication)</li>
                <li>Vercel (hosting and frontend deployment)</li>
                <li>Google / Apple (social login)</li>
                <li>Email services (e.g., SendGrid – planned)</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8">7. International Data Transfers</h2>
            <p>Some service providers may process data outside Australia and the EU. We ensure they meet equivalent data protection standards through contracts and safeguards.</p>

            <h2 className="text-2xl font-semibold mt-8">8. Data Retention</h2>
            <ul className="list-disc pl-8 space-y-1">
                <li>User-generated content is retained unless deleted by the user</li>
                <li>Archived answers available only to Pro users</li>
                <li>Deleted accounts are permanently erased</li>
                <li>Inactive accounts may be deleted after long periods (planned)</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8">9. Security Measures</h2>
            <ul className="list-disc pl-8 space-y-1">
                <li>HTTPS encryption</li>
                <li>Passwords hashed securely (via Supabase)</li>
                <li>Role-based access for admin/moderators</li>
                <li>Cloud infrastructure via Vercel and Supabase</li>
            </ul>
            <p>Note: We do not use end-to-end encryption since Wittley is public-facing.</p>

            <h2 className="text-2xl font-semibold mt-8">10. Your Privacy Rights in Australia</h2>
            <p>You may contact us to access, correct, or remove your data. We aim to respond within 30 days. If you're unsatisfied, you can contact the Office of the Australian Information Commissioner at <a href="https://www.oaic.gov.au" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">oaic.gov.au</a>.</p>

            <h2 className="text-2xl font-semibold mt-8">11. Children’s Privacy</h2>
            <p>Wittley is not for users under 13. If we discover an account from a child under this age, it will be deleted.</p>

            <h2 className="text-2xl font-semibold mt-8">12. Changes to This Policy</h2>
            <p>We may update this policy. Significant changes will be announced by email or via the platform.</p>

            <h2 className="text-2xl font-semibold mt-8">13. Contact Us</h2>
            <p>If you have questions or privacy concerns, contact us at:</p>
            <p><strong>Email:</strong>{' '}
                <a href="mailto:support@wittley.com" className="text-blue-600 underline">
                    support@wittley.com
                </a>
            </p>
            <p><strong>Jurisdiction:</strong> Australia</p>
        </div>
    );
}
