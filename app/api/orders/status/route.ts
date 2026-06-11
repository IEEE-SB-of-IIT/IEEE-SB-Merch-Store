import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer, isUuid } from '@/lib/supabaseServer';

export async function GET(request: NextRequest) {
    // Public read by order ID — the buyer polls their own order on the success
    // page. The UUID is unguessable and only payment_status is returned, so
    // this stays open; we just reject malformed IDs to avoid abuse.
    const orderId = request.nextUrl.searchParams.get('orderId');
    if (!isUuid(orderId)) {
        return NextResponse.json({ error: 'Invalid orderId' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
        .from('orders')
        .select('payment_status')
        .eq('id', orderId)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ payment_status: data.payment_status });
}
