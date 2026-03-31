'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        await signIn('resend', { email, redirect: false, callbackUrl: window.location.href });
        setLoading(false);
        setSent(true);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-cream w-full max-w-sm p-8 shadow-2xl"
                    >
                        {sent ? (
                            <div className="text-center">
                                <div className="text-3xl mb-4">✉️</div>
                                <h2 className="font-cormorant text-2xl font-light mb-3 text-warm-dark">Check your inbox</h2>
                                <p className="text-muted text-sm leading-relaxed">
                                    A sign-in link has been sent to <strong>{email}</strong>. Click the link to continue.
                                </p>
                                <button onClick={onClose} className="mt-6 text-xs uppercase tracking-widest text-muted hover:text-warm-dark transition-colors">
                                    Close
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="font-cormorant text-2xl font-light mb-2 text-warm-dark">Sign in</h2>
                                <p className="text-muted text-xs mb-6 leading-relaxed">Enter your email and we'll send you a magic link — no password needed.</p>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        className="bg-transparent border-b border-warm-dark/30 py-2 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-muted/50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-warm-dark text-white text-xs uppercase tracking-[0.2em] font-medium py-3 hover:bg-gold transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Sending…' : 'Send magic link'}
                                    </button>
                                </form>
                                <button onClick={onClose} className="mt-4 w-full text-center text-xs text-muted hover:text-warm-dark transition-colors uppercase tracking-widest">
                                    Cancel
                                </button>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
