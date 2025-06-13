'use client'

// FEEDBACK
export default function Feedback({ message, type = 'success' }) {
    if (!message) return null;

    const isError = message.toLowerCase().includes('wrong') || message.toLowerCase().includes('log') || message.toLowerCase().includes('already') || message.toLowerCase().includes('fail');

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-mb transition-all duration-300 ${
                isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}
        >
            <span className="text-lg">
                {isError ? '❌' : '✅'}
            </span>
            <p className="text-sm">{message}</p>
        </div>
    );
}