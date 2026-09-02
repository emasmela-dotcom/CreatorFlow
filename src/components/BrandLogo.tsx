import Image from 'next/image'

const SIZES = {
  sm: 36,
  md: 48,
  lg: 80,
} as const

type BrandLogoProps = {
  size?: keyof typeof SIZES
  className?: string
}

export default function BrandLogo({ size = 'sm', className = '' }: BrandLogoProps) {
  const px = SIZES[size]
  return (
    <Image
      src="/creatorflow365-logo.png"
      alt=""
      width={px}
      height={px}
      className={`object-contain ${className}`}
      priority={size === 'lg'}
      aria-hidden
    />
  )
}
