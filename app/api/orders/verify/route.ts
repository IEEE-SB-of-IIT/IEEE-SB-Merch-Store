import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';

export async function POST(request: Request) {
    try {
        const { orderId, action } = await request.json(); // action: 'verify' | 'reject'

        if (!orderId || !action) {
            return NextResponse.json({ error: 'Missing orderId or action' }, { status: 400 });
        }

        const newPaymentStatus = action === 'verify' ? 'verified' : 'rejected';

        const { error } = await supabaseServer
            .from('orders')
            .update({ payment_status: newPaymentStatus })
            .eq('id', orderId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, payment_status: newPaymentStatus });

    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
