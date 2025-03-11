'use server'

import { headers } from 'next/headers'

import { stripe } from '@/lib/stripe/stripe'

export async function fetchClientSecret(stripe_price_id: string): Promise<string> {
  const origin = (headers()).get('origin')


  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of
        // the product you want to sell
        price: stripe_price_id,
        quantity: 1
      }
    ],
    mode: 'subscription',
    return_url: `${origin}/checkout/payment-confirmation`
  })

  return session.client_secret ?? ''
}