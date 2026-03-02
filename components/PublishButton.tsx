'use client';

import { useState } from 'react';
import { publishToProduction } from '@/actions/publishToProduction';

export default function PublishButton() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handlePublish = async () => {
        if (status === 'loading') return;
        setStatus('loading');

        const result = await publishToProduction();
        setStatus(result.success ? 'success' : 'error');

        // Reset after 4 seconds
        setTimeout(() => setStatus('idle'), 4000);
    };

    const labels = {
        idle: 'Publish to Production',
        loading: 'Publishing...',
        success: '✓ Published',
        error: '✗ Failed — try again',
    };

    const colours = {
        idle: 'bg-gold text-white hover:bg-warm-dark',
        loading: 'bg-warm-dark/60 text-white cursor-not-allowed',
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <button
                onClick={handlePublish}
                disabled={status === 'loading'}
                className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] rounded-lg shadow-xl transition-all duration-300 ${colours[status]}`}
            >
                {labels[status]}
            </button>
        </div>
    );
}
