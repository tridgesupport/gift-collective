'use server';

export async function publishToProduction(): Promise<{ success: boolean; message: string }> {
    const prodUrl = process.env.PROD_URL;
    const secret = process.env.PUBLISH_SECRET;

    if (!prodUrl || !secret) {
        return { success: false, message: 'Publishing is not configured on this environment.' };
    }

    try {
        const response = await fetch(`${prodUrl}/api/publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret }),
            cache: 'no-store',
        });

        if (!response.ok) {
            return { success: false, message: 'Production site rejected the request.' };
        }

        return { success: true, message: 'Published to production successfully.' };
    } catch {
        return { success: false, message: 'Could not reach the production site.' };
    }
}
