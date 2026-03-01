'use server';

export async function submitInquiry(data: {
    name: string;
    email: string;
    phone: string;
    productName: string;
    collectionName: string;
    menuSection: string;
    minOrderQty: number;
    desiredDelivery: string;
    wish: string;
}) {
    const url = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!url) {
        throw new Error('GOOGLE_APPS_SCRIPT_URL is missing.');
    }

    if (!data.name?.trim()) {
        return { success: false, error: 'Name is required' };
    }
    if (!data.email?.trim() || !/\S+@\S+\.\S+/.test(data.email)) {
        return { success: false, error: 'Valid email is required' };
    }
    if (!data.minOrderQty) {
        return { success: false, error: 'Minimum order quantity is required' };
    }

    const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || '',
        productName: data.productName,
        collectionName: data.collectionName,
        menuSection: data.menuSection,
        minOrderQty: data.minOrderQty,
        desiredDelivery: data.desiredDelivery || '',
        wish: data.wish?.trim() || ''
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.success) {
            return { success: true };
        } else {
            return { success: false, error: result.error || 'Server error' };
        }
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
