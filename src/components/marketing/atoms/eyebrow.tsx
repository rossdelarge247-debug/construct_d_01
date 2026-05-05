interface EyebrowProps {
  children: React.ReactNode
  color?: string
}

export function Eyebrow({ children, color }: EyebrowProps) {
  return (
    <div
      className="label-xs"
      style={color ? { color } : undefined}
    >
      {children}
    </div>
  )
}
