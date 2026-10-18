import { NextResponse } from 'next/server';

const RAZORPAY_API_URL = process.env.RAZORPAY_API_URL || 'http://localhost:6100';
const RAZORPAY_CHECKOUT_URL = process.env.RAZORPAY_CHECKOUT_URL || 'http://localhost:7000';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, description, orderId, customerName, customerEmail, customerPhone } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const finalOrderId = orderId || `BS-${Date.now()}`;

    // Call the Razorpay Core API to create a payment session
    const res = await fetch(`${RAZORPAY_API_URL}/api/v1/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: finalOrderId,
        amount: Number(amount),
        currency: 'INR',
        description: description || 'BhashaSchool Course Payment',
        customer: {
          fullName: customerName || '',
          email: customerEmail || '',
          phoneNumber: customerPhone || '',
        },
        returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/student/payments?status=success`,
        metadata: {
          source: 'bhashaschool',
          description,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.checkoutUrl) {
      console.error('[Pay API] Razorpay create payment failed:', data);
      return NextResponse.json(
        { error: data.error || data.message || 'Failed to create payment session' },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json({
      paymentId: data.paymentId,
      orderId: data.orderId,
      checkoutUrl: data.checkoutUrl,
      amount: data.amount,
      status: data.status,
    });
  } catch (err: any) {
    console.error('[Pay API] Error:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

