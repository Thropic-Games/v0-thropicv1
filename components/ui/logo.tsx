import Image from "next/image"

interface LogoProps {
  size?: "small" | "medium" | "large"
  className?: string
}

export function Logo({ size = "medium", className = "" }: LogoProps) {
  const sizeClasses = {
    small: "w-28",
    medium: "w-40",
    large: "w-48",
  }

  return (
    <Image
      src="/images/tg_logov1.png"
      alt="Thropic Games"
      width={200}
      height={53}
      className={`h-auto ${sizeClasses[size]} ${className}`}
      style={{ objectFit: "contain" }}
      priority
    />
  )
}
