import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // This assumes you have a table named 'orders' in Supabase
        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    customer_name: body.customerName,
                    email: body.email,
                    address: body.address,
                    city: body.city,
                    postal_code: body.postalCode,
                    items: body.items,
                    total: body.total,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, order: data[0] });

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
