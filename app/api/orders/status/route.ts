import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(request: NextRequest) {
    const orderId = request.nextUrl.searchParams.get('orderId');
    if (!orderId) {
        return NextResponse.json({ error: 'orderId required' }, { status: 400 });
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
