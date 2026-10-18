import { NextResponse } from 'next/server';
import crypto from 'crypto';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  try {
    const signatureHeader = req.headers.get('x-gateway-signature') || '';
    const rawBody = await req.text();

    // If webhook secret is configured, verify HMAC signature
    if (RAZORPAY_WEBHOOK_SECRET && signatureHeader) {
      const actualSig = signatureHeader.replace('sha256=', '');
      const expectedSig = crypto
        .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      if (actualSig !== expectedSig) {
        console.warn('[Webhook] Signature mismatch — rejecting payload.');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const { paymentId, orderId, status, amount, method, completedAt } = payload;

    console.log(`[Webhook] Payment ${paymentId} — Status: ${status}, Amount: ${amount}, Order: ${orderId}`);

    // TODO: Update your database with the payment status
    // e.g. await db.payments.upsert({ paymentId, orderId, status, amount, method, completedAt });

    // For now, just log and acknowledge
    return NextResponse.json({ received: true, paymentId, status });
  } catch (err: any) {
    console.error('[Webhook] Error processing webhook:', err.message);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
