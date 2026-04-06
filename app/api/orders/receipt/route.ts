import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('receipt') as File | null;
        const orderId = formData.get('orderId') as string | null;

        if (!file || !orderId) {
            return NextResponse.json({ error: 'Missing file or orderId' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Please upload JPG, PNG, WEBP or PDF.' }, { status: 400 });
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
        }

        const ext = file.name.split('.').pop() ?? 'jpg';
        const fileName = `receipt_${orderId}_${Date.now()}.${ext}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const { error: uploadError } = await supabaseServer.storage
            .from('payment-receipts')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        const { data: { publicUrl } } = supabaseServer.storage
            .from('payment-receipts')
            .getPublicUrl(fileName);

        // Update the order with receipt URL and payment status
        const { error: updateError } = await supabaseServer
            .from('orders')
            .update({
                receipt_url: publicUrl,
                payment_status: 'receipt_uploaded',
            })
            .eq('id', orderId);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, receiptUrl: publicUrl });

    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
