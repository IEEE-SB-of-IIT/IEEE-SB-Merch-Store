import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { data, error } = await supabaseServer
            .from('orders')
            .insert([{
                customer_name: body.customerName,
                email: body.email,
                address: body.address,
                city: body.city,
                postal_code: body.postalCode,
                items: body.items,
                total: body.total,
                status: 'pending',
                payment_status: 'awaiting_payment',
                receipt_url: null,
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, orderId: data[0].id, order: data[0] });

    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
