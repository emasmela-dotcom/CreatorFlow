/** Single source of truth for additional post packages. Used by home page, dashboard (via API), and purchase-posts API. */
export const POST_PACKAGES = [
  { quantity: 5, price: 4.00, savings: '0%', perPost: '$0.80/post' },
  { quantity: 10, price: 8.00, savings: '0%', perPost: '$0.80/post' },
  { quantity: 15, price: 12.00, savings: '0%', perPost: '$0.80/post' },
  { quantity: 20, price: 15.00, savings: '6%', perPost: '$0.75/post' },
  { quantity: 24, price: 18.00, savings: '10%', perPost: '$0.75/post' },
] as const
