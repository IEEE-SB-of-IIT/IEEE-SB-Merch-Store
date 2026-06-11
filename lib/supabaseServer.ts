import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/**
 * Server-only Supabase client using the service role key.
 * Bypasses Row Level Security — ONLY use this in API routes (server-side).
 * Never expose this key to the browser.
 */
export const supabaseServer = createClient(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

/**
 * Validate the caller's Supabase session from the request's Authorization
 * header (`Bearer <access_token>`). Returns the authenticated user, or null
 * if the token is missing/invalid.
 *
 * Any logged-in Supabase user is treated as an admin here, because the only
 * accounts that exist are the admin accounts created in the Supabase dashboard
 * (there is no public sign-up flow). If public accounts are ever added, gate
 * this on a role/claim or an allowlist instead.
 */
export async function getAuthedUser(request: Request) {
    const authHeader = request.headers.get('authorization') ?? '';
    const token = authHeader.toLowerCase().startsWith('bearer ')
        ? authHeader.slice(7).trim()
        : '';

    if (!token) return null;

    // A throwaway anon-keyed client just to validate the token server-side.
    const client = createClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await client.auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user;
}

/** Loose UUID v4-ish shape check to reject obviously malformed order IDs. */
export function isUuid(value: unknown): value is string {
    return typeof value === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
