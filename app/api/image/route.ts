import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');
    if (!url) {
        return new NextResponse('Missing url parameter', { status: 400 });
    }

    // Validate it's a proper http(s) URL
    let targetUrl: URL;
    try {
        targetUrl = new URL(url);
        if (!['http:', 'https:'].includes(targetUrl.protocol)) {
            return new NextResponse('Only http/https URLs are supported', { status: 400 });
        }
    } catch {
        return new NextResponse('Invalid URL', { status: 400 });
    }

    const fetchHeaders: HeadersInit = {
        // Pass through range requests so video seeking works
        ...(request.headers.get('range') ? { Range: request.headers.get('range')! } : {}),
    };

    let response: Response;
    try {
        response = await fetch(targetUrl.toString(), { headers: fetchHeaders });
    } catch {
        return new NextResponse('Failed to fetch the URL', { status: 502 });
    }

    if (!response.ok && response.status !== 206) {
        return new NextResponse('Remote server returned an error', { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const isVideo = contentType.startsWith('video/');

    const responseHeaders: Record<string, string> = {
        // Cache aggressively — Vercel CDN serves subsequent requests from the edge
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
        'Content-Type': contentType,
        // Required for browsers to seek/stream video — must be present on the proxy response
        'Accept-Ranges': response.headers.get('accept-ranges') || (isVideo ? 'bytes' : 'none'),
    };

    const contentLength = response.headers.get('content-length');
    if (contentLength) responseHeaders['Content-Length'] = contentLength;

    const contentRange = response.headers.get('content-range');
    if (contentRange) responseHeaders['Content-Range'] = contentRange;

    return new NextResponse(response.body, {
        status: response.status,
        headers: responseHeaders,
    });
}
