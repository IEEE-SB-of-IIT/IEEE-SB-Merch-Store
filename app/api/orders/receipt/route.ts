import { NextResponse } from 'next/server';
import { supabaseServer, isUuid } from '../../../../lib/supabaseServer';

// Extension is derived from the validated MIME type, never from user input.
const EXT_BY_TYPE: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
};

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('receipt') as File | null;
        const orderId = formData.get('orderId') as string | null;

        if (!file || !orderId) {
            return NextResponse.json({ error: 'Missing file or orderId' }, { status: 400 });
        }
        if (!isUuid(orderId)) {
            return NextResponse.json({ error: 'Invalid orderId' }, { status: 400 });
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

        // The order must exist before we accept a file — stops anyone from
        // spraying uploads keyed to random order IDs.
        const { data: order, error: lookupError } = await supabaseServer
            .from('orders')
            .select('id')
            .eq('id', orderId)
            .single();

        if (lookupError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Derive extension from the trusted MIME type, not the uploaded filename.
        const ext = EXT_BY_TYPE[file.type] ?? 'bin';
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
