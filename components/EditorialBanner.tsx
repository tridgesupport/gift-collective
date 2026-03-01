import Image from 'next/image';
import { Collection } from '../lib/types';

export default function EditorialBanner({ collection }: { collection: Collection }) {
    return (
        <div className="relative w-full h-[60vh] md:h-[80vh] bg-warm-dark overflow-hidden">
            {collection.editorialType === 'video' ? (
                <video
                    src={collection.editorialUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    // @ts-ignore
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <Image
                    src={collection.editorialUrl}
                    alt={collection.name}
                    fill
                    unoptimized
                    priority
                    className="object-cover opacity-80"
                />
            )}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 md:p-16 text-cream pointer-events-none">
                <h1 className="font-cormorant text-5xl md:text-7xl lg:text-[100px] font-medium italic mb-6 tracking-wide drop-shadow-md">
                    {collection.name}
                </h1>
                <span className="text-cream uppercase tracking-[0.3em] lg:tracking-[0.4em] text-[10px] md:text-sm font-medium drop-shadow-md">
                    {collection.description}
                </span>
            </div>
        </div>
    );
}
