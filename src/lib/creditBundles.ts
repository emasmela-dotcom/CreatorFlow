export const CREDIT_BUNDLES = [
  { id: 'starter', name: 'Starter Bundle', credits: 50, price: 5.00, perCredit: '$0.10/credit', description: 'Perfect for trying premium tools' },
  { id: 'popular', name: 'Popular Bundle', credits: 100, price: 10.00, perCredit: '$0.10/credit', description: 'Best value for regular users' },
  { id: 'power', name: 'Power Bundle', credits: 250, price: 20.00, perCredit: '$0.08/credit', savings: 'Save $5 (20% off)', description: 'Best for power users' },
] as const

export type CreditBundleId = typeof CREDIT_BUNDLES[number]['id']
