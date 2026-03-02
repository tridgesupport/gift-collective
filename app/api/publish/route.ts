import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { secret } = await request.json();

    if (!secret || secret !== process.env.PUBLISH_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Revalidate all pages — the root layout covers every route in the app
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, publishedAt: new Date().toISOString() });
}
