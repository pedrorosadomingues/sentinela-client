'use server'

import { headers } from 'next/headers'

import { stripe } from '@/lib/stripe/stripe'

export async function fetchClientSecret() {
  const origin = (headers()).get('origin')


  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of
        // the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1
      }
    ],
    mode: 'payment',
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  })

  return session.client_secret
}