import type { SVGProps } from 'react'

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number
  sw?: number
}

function Ic({
  size = 16,
  sw = 1.75,
  children,
  ...rest
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const ArrowRight = (p: IconProps) => (
  <Ic {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </Ic>
)

export const ArrowDown = (p: IconProps) => (
  <Ic {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="6 13 12 19 18 13" />
  </Ic>
)

export const ArrowUpRight = (p: IconProps) => (
  <Ic {...p}>
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="9 7 17 7 17 15" />
  </Ic>
)

export const Plus = (p: IconProps) => (
  <Ic {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Ic>
)

export const Shield = (p: IconProps) => (
  <Ic {...p}>
    <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z" />
  </Ic>
)

export const Lock = (p: IconProps) => (
  <Ic {...p}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Ic>
)

export const Check = (p: IconProps) => (
  <Ic {...p}>
    <polyline points="5 12 10 17 19 7" />
  </Ic>
)

export const Coins = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="9" cy="9" r="6" />
    <path d="M15 8a6 6 0 1 1 0 8" />
  </Ic>
)

export const ChildrenIcon = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="6" r="2.5" />
    <path d="M7 22v-7l-2-3 4-3 3 3 3-3 4 3-2 3v7" />
  </Ic>
)

export const Home = (p: IconProps) => (
  <Ic {...p}>
    <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
  </Ic>
)

export const Compass = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="12" r="9" />
    <polygon points="15 9 11 13 9 15 13 11" />
  </Ic>
)
