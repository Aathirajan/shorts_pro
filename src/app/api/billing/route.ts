import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe, createCheckoutSession, createPortalSession, STRIPE_PRICES } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

// POST /api/billing/checkout - Create checkout session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan, billingCycle } = body;

    if (!plan || !billingCycle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const priceId = STRIPE_PRICES[plan as keyof typeof STRIPE_PRICES]?.[billingCycle as 'monthly' | 'yearly'];
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Get or create customer
    let subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email || '',
        name: session.user.name || '',
      });
      customerId = customer.id;

      // Save customer ID
      await prisma.subscription.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          stripeCustomerId: customerId,
        },
        update: {
          stripeCustomerId: customerId,
        },
      });
    }

    const checkoutSession = await createCheckoutSession(
      customerId,
      priceId,
      `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      `${process.env.NEXTAUTH_URL}/settings?canceled=true`
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// GET /api/billing/portal - Create billing portal session
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userSubscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!userSubscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    const portalSession = await createPortalSession(
      userSubscription.stripeCustomerId,
      `${process.env.NEXTAUTH_URL}/settings`
    );

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Failed to create portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
