import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, constructEvent } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature') || '';

    let event;
    try {
      event = await constructEvent(body, signature);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id;

        if (!userId) {
          console.error('No user ID in session');
          break;
        }

        // Update user subscription
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            stripePriceId: session.line_items?.data[0]?.price?.id,
          },
          update: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            stripePriceId: session.line_items?.data[0]?.price?.id,
          },
        });

        // Update user plan based on price
        const priceId = session.line_items?.data[0]?.price?.id;
        let plan = 'FREE';
        if (priceId === process.env.STRIPE_PRICE_CREATOR_MONTHLY) {
          plan = 'CREATOR';
        } else if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) {
          plan = 'PRO';
        } else if (priceId === process.env.STRIPE_PRICE_AGENCY_MONTHLY) {
          plan = 'AGENCY';
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: plan as any,
            planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        // Find user by customer ID
        const subscription = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId as string },
        });

        if (subscription) {
          // Could send email notification here
          console.log(`Payment failed for user ${subscription.userId}`);
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Find user and downgrade to free
        const userSubscription = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId as string },
        });

        if (userSubscription) {
          await prisma.user.update({
            where: { id: userSubscription.userId },
            data: {
              plan: 'FREE',
              planExpiresAt: null,
            },
          });
        }

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const userSubscription = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId as string },
        });

        if (userSubscription) {
          // Update subscription details
          await prisma.subscription.update({
            where: { userId: userSubscription.userId },
            data: {
              stripeCurrentPeriodStart: new Date(subscription.current_period_start * 1000),
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
