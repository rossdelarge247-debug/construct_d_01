'use client'

export function EnvBanner() {
  const env = process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV

  if (env === 'production') return null

  const label = env === 'development' ? 'Development' : 'Staging'

  return (
    <div className="bg-depth px-2 py-1 text-center text-xs font-medium text-cream">
      {label} environment
    </div>
  )
}
