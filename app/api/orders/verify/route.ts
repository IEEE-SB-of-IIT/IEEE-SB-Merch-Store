import { NextResponse } from 'next/server';
import { supabaseServer, getAuthedUser, isUuid } from '../../../../lib/supabaseServer';
import { sendPaymentStatusEmail } from '../../../../lib/email';

export async function POST(request: Request) {
    try {
        // ── Auth gate: only a logged-in admin may change payment status ──
        const user = await getAuthedUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orderId, action } = await request.json(); // action: 'verify' | 'reject'

        if (!isUuid(orderId)) {
            return NextResponse.json({ error: 'Invalid orderId' }, { status: 400 });
        }
        if (action !== 'verify' && action !== 'reject') {
            return NextResponse.json({ error: "action must be 'verify' or 'reject'" }, { status: 400 });
        }

        const newPaymentStatus = action === 'verify' ? 'verified' : 'rejected';

        const { data: order, error } = await supabaseServer
            .from('orders')
            .update({ payment_status: newPaymentStatus })
            .eq('id', orderId)
            .select('id, customer_name, email, items, total')
            .single();

        if (error || !order) {
            return NextResponse.json({ error: error?.message ?? 'Order not found' }, { status: 500 });
        }

        // Best-effort notification — a failed email must not fail the verify.
        const emailSent = await sendPaymentStatusEmail(
            order,
            action === 'verify' ? 'verified' : 'rejected',
        );

        return NextResponse.json({ success: true, payment_status: newPaymentStatus, emailSent });

    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
