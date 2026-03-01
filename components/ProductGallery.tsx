'use client';

import { Asset } from '../lib/types';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

function cx(...args: (string | undefined | null | false)[]) {
    return twMerge(clsx(args));
}

export default function ProductGallery({ assets, priority = false }: { assets: Asset[], priority?: boolean }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const touchStartX = useRef<number | null>(null);

    if (!assets || assets.length === 0) return null;

    const currentAsset = assets[currentIndex];

    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            zIndex: 0,
            x: dir < 0 ? '100%' : '-100%',
            opacity: 0,
        }),
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        let newIndex = currentIndex + newDirection;
        if (newIndex < 0) newIndex = assets.length - 1;
        if (newIndex >= assets.length) newIndex = 0;
        setCurrentIndex(newIndex);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) paginate(1);
            else paginate(-1);
        }
        touchStartX.current = null;
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div
            className="relative w-full aspect-[3/4] overflow-hidden bg-sand group"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => {
                // Prevent click from bubbling out to the product frame block 
                // to avoid double triggering navigation logic if it's placed incorrectly.
            }}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ x: { type: 'tween', duration: 0.3 } }}
                    className="absolute inset-0 w-full h-full"
                >
                    {currentAsset.type === 'video' ? (
                        <video
                            ref={videoRef}
                            src={currentAsset.url}
                            autoPlay
                            muted={isMuted}
                            loop
                            playsInline
                            // @ts-ignore
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Image
                            src={currentAsset.url}
                            alt={`Asset ${currentIndex + 1}`}
                            fill
                            unoptimized
                            priority={priority && currentIndex === 0}
                            className="object-cover"
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Speaker Icon */}
            {currentAsset.type === 'video' && (
                <button
                    onClick={toggleMute}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center text-sm"
                >
                    {isMuted ? '🔇' : '🔊'}
                </button>
            )}

            {/* Desktop Arrows */}
            {assets.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); paginate(-1); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center md:block hidden text-lg"
                    >
                        ←
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); paginate(1); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center md:block hidden text-lg"
                    >
                        →
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {assets.length > 1 && (
                <div className="absolute bottom-4 left-0 w-full flex justify-center space-x-2 z-10">
                    {assets.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDirection(idx > currentIndex ? 1 : -1);
                                setCurrentIndex(idx);
                            }}
                            className={cx(
                                "w-1.5 h-1.5 rounded-full transition-colors",
                                idx === currentIndex ? "bg-white" : "bg-white/40"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
