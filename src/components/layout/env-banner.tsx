'use client'

export function EnvBanner() {
  const env = process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV

  if (env === 'production') return null

  const label = env === 'development' ? 'Development' : 'Staging'
  const color = env === 'development' ? 'bg-amber-500' : 'bg-blue-500'

  return (
    <div className={`${color} px-2 py-1 text-center text-xs font-medium text-white`}>
      {label} environment
    </div>
  )
}
