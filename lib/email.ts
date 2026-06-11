import { Resend } from 'resend';
import { formatPrice } from './format';

/**
 * Transactional email via Resend. Server-only.
 *
 * Requires RESEND_API_KEY in the environment. Until a domain is verified in
 * the Resend dashboard, EMAIL_FROM must stay on onboarding@resend.dev (which
 * can only deliver to the Resend account owner's address) — set EMAIL_FROM to
 * e.g. "CodeSprint 11 <merch@codesprint.lk>" once the domain is verified.
 *
 * Sending is best-effort: callers must never fail an API response because an
 * email didn't go out.
 */

interface OrderEmailItem {
    name: string;
    selectedSize?: string;
    selectedColor?: string;
    quantity: number;
    price: string | number;
}

export interface OrderEmailPayload {
    id: string;
    customer_name: string | null;
    email: string | null;
    items: OrderEmailItem[] | null;
    total: number | null;
}

const ORANGE = '#ff6a3d';

function orderRef(id: string) {
    return `IEEE-${id.slice(-6).toUpperCase()}`;
}

function itemRows(items: OrderEmailItem[]) {
    return items.map(item => {
        const variant = [item.selectedSize, item.selectedColor !== 'Default' ? item.selectedColor : '']
            .filter(Boolean).join(' · ');
        return `
            <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eeeeee;font-size:14px;color:#111111;">
                    ${item.quantity}× ${item.name}
                    ${variant ? `<span style="color:#888888;font-size:12px;"> — ${variant}</span>` : ''}
                </td>
                <td style="padding:10px 0;border-bottom:1px solid #eeeeee;font-size:14px;color:#111111;text-align:right;white-space:nowrap;">
                    ${formatPrice(item.price)}
                </td>
            </tr>`;
    }).join('');
}

function emailShell(ref: string, heading: string, headingColor: string, body: string) {
    return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
        <tr><td align="center">
            <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
                <tr>
                    <td style="background:#000000;padding:24px 32px;">
                        <span style="font-size:18px;font-weight:800;letter-spacing:2px;color:#ffffff;">CODESPRINT<span style="color:${ORANGE};">11</span></span>
                        <span style="float:right;font-size:12px;color:rgba(255,255,255,0.5);line-height:24px;">Order ${ref}</span>
                    </td>
                </tr>
                <tr>
                    <td style="padding:32px;">
                        <h1 style="margin:0 0 12px;font-size:22px;color:${headingColor};">${heading}</h1>
                        ${body}
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 32px;border-top:1px solid #eeeeee;font-size:12px;color:#999999;">
                        CodeSprint 11 Merch — IEEE Student Branch of IIT.<br/>
                        Questions? Reply to this email with your order reference ${ref}.
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>`;
}

export function buildVerifiedEmail(order: OrderEmailPayload) {
    const ref = orderRef(order.id);
    const items = order.items ?? [];
    const body = `
        <p style="margin:0 0 20px;font-size:14px;color:#444444;line-height:1.6;">
            Hi ${order.customer_name ?? 'there'},<br/><br/>
            Great news — we've verified your payment and your order is now <strong>confirmed</strong>.
            We'll let you know once it ships.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
            ${itemRows(items)}
            <tr>
                <td style="padding:14px 0 0;font-size:15px;font-weight:700;color:#111111;">Total Paid</td>
                <td style="padding:14px 0 0;font-size:15px;font-weight:700;color:${ORANGE};text-align:right;">${formatPrice(order.total ?? 0)}</td>
            </tr>
        </table>`;
    return {
        subject: `Order confirmed — ${ref} | CodeSprint 11 Merch`,
        html: emailShell(ref, 'Your order is confirmed ✅', '#111111', body),
        text: `Hi ${order.customer_name ?? 'there'},\n\nYour payment has been verified and order ${ref} is confirmed.\n\n` +
            items.map(i => `  ${i.quantity}x ${i.name} (${[i.selectedSize, i.selectedColor].filter(Boolean).join(', ')}) — ${formatPrice(i.price)}`).join('\n') +
            `\n\nTotal paid: ${formatPrice(order.total ?? 0)}\n\nWe'll let you know once it ships.\n— CodeSprint 11 Merch, IEEE SB IIT`,
    };
}

export function buildRejectedEmail(order: OrderEmailPayload) {
    const ref = orderRef(order.id);
    const body = `
        <p style="margin:0 0 20px;font-size:14px;color:#444444;line-height:1.6;">
            Hi ${order.customer_name ?? 'there'},<br/><br/>
            We couldn't verify the payment receipt for order <strong>${ref}</strong>.
            Please check that the receipt is clear, shows the full transfer amount of
            <strong>${formatPrice(order.total ?? 0)}</strong>, and uses <strong>${ref}</strong> as the payment reference —
            then upload it again from your order confirmation page.
        </p>
        <p style="margin:0;font-size:14px;color:#444444;line-height:1.6;">
            If you believe this is a mistake, just reply to this email.
        </p>`;
    return {
        subject: `Action needed: receipt issue — ${ref} | CodeSprint 11 Merch`,
        html: emailShell(ref, 'We couldn\'t verify your receipt', '#b91c1c', body),
        text: `Hi ${order.customer_name ?? 'there'},\n\nWe couldn't verify the payment receipt for order ${ref}. Please re-upload a clear receipt showing the full ${formatPrice(order.total ?? 0)} transfer with reference ${ref}.\n\n— CodeSprint 11 Merch, IEEE SB IIT`,
    };
}

/**
 * Send the payment-verified ("order confirmed") or receipt-rejected email.
 * Returns true when the email was actually handed to Resend, false when
 * skipped (no key / no recipient) or failed. Never throws.
 */
export async function sendPaymentStatusEmail(
    order: OrderEmailPayload,
    kind: 'verified' | 'rejected',
): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn('[email] RESEND_API_KEY not set — skipping', kind, 'email for order', order.id);
        return false;
    }
    if (!order.email) {
        console.warn('[email] order has no customer email — skipping', order.id);
        return false;
    }

    const { subject, html, text } = kind === 'verified'
        ? buildVerifiedEmail(order)
        : buildRejectedEmail(order);

    try {
        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
            from: process.env.EMAIL_FROM ?? 'CodeSprint 11 Merch <onboarding@resend.dev>',
            to: order.email,
            subject,
            html,
            text,
        });
        if (error) {
            console.error('[email] Resend error for order', order.id, error);
            return false;
        }
        return true;
    } catch (err) {
        console.error('[email] failed to send for order', order.id, err);
        return false;
    }
}
