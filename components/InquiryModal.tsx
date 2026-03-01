'use client';

import { Product } from '../lib/types';
import { useState, useRef } from 'react';
import { submitInquiry } from '../actions/submitInquiry';
import { toast } from 'react-hot-toast';
import { isFuture, parseISO } from 'date-fns';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    collectionName: string;
    menuSection: string;
};

export default function InquiryModal({ isOpen, onClose, product, collectionName, menuSection }: Props) {
    const [loading, setLoading] = useState(false);
    const [wishText, setWishText] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const minQty = parseInt(formData.get('minOrderQty') as string, 10);
        if (isNaN(minQty) || minQty < product.minOrderQty) {
            toast.error(`Minimum order is ${product.minOrderQty} units.`);
            return;
        }

        const dDeliv = formData.get('desiredDelivery') as string;
        if (dDeliv && !isFuture(parseISO(dDeliv))) {
            toast.error('Desired delivery date must be in the future.');
            return;
        }

        setLoading(true);

        try {
            const result = await submitInquiry({
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                productName: product.name,
                collectionName: collectionName,
                menuSection: menuSection,
                minOrderQty: minQty,
                desiredDelivery: dDeliv,
                wish: wishText
            });

            if (result.success) {
                toast.success('Your inquiry has been received. We’ll be in touch soon.');
                onClose();
            } else {
                toast.error(result.error || 'Something went wrong. Please try again.');
            }
        } catch (err: any) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isNearingLimit = wishText.length >= 480;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-cream w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-sand">
                    <h2 className="font-cormorant text-2xl font-semibold">Place Inquiry</h2>
                    <button onClick={onClose} className="text-muted hover:text-warm-dark text-xl font-light">×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-muted mb-1">Name *</label>
                        <input
                            required
                            name="name"
                            type="text"
                            className="w-full bg-transparent border-b border-sand py-2 focus:outline-none focus:border-gold transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-muted mb-1">Email *</label>
                        <input
                            required
                            name="email"
                            type="email"
                            className="w-full bg-transparent border-b border-sand py-2 focus:outline-none focus:border-gold transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-muted mb-1">Phone</label>
                        <input
                            name="phone"
                            type="tel"
                            className="w-full bg-transparent border-b border-sand py-2 focus:outline-none focus:border-gold transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-muted mb-1">Quantity *</label>
                            <input
                                required
                                name="minOrderQty"
                                type="number"
                                min={product.minOrderQty}
                                defaultValue={product.minOrderQty}
                                className="w-full bg-transparent border-b border-sand py-2 focus:outline-none focus:border-gold transition-colors"
                            />
                            <p className="text-[10px] text-muted mt-1 uppercase tracking-wider">Min {product.minOrderQty}</p>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-muted mb-1">Desired Date</label>
                            <input
                                name="desiredDelivery"
                                type="date"
                                className="w-full bg-transparent border-b border-sand py-2 focus:outline-none focus:border-gold transition-colors text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-1">
                            <label className="block text-xs uppercase tracking-widest text-muted">What's your wish?</label>
                            <span className={`text-[10px] font-mono ${wishText.length >= 500 ? 'text-red-500' : isNearingLimit ? 'text-gold' : 'text-muted'}`}>
                                {wishText.length} / 500
                            </span>
                        </div>
                        <textarea
                            name="wish"
                            maxLength={500}
                            value={wishText}
                            onChange={e => setWishText(e.target.value)}
                            rows={3}
                            className="w-full bg-transparent border border-sand p-3 focus:outline-none focus:border-gold transition-colors resize-none text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gold text-white text-xs uppercase tracking-[0.2em] font-medium py-4 hover:bg-warm-dark transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Inquiry'}
                    </button>
                </form>
            </div>
        </div>
    );
}
