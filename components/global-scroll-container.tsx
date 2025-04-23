"use client"

import { useRef, useEffect, type ReactNode } from "react"

interface GlobalScrollContainerProps {
  children: ReactNode
  className?: string
}

export function GlobalScrollContainer({ children, className = "" }: GlobalScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Handle global wheel events
    const handleWheel = (e: WheelEvent) => {
      // Prevent default only if we're scrolling the container
      if (container.contains(e.target as Node) || document.body.contains(e.target as Node)) {
        // Check if we're at the bottom of the scroll and trying to scroll down
        const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 5

        // Only prevent default if we're not at the bottom when scrolling down
        // or not at the top when scrolling up
        if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && container.scrollTop > 0)) {
          container.scrollTop += e.deltaY
          e.preventDefault()
        }
      }
    }

    // Add wheel event listener to document
    document.addEventListener("wheel", handleWheel, { passive: false })

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if our container or body has focus
      if (container.contains(document.activeElement) || document.activeElement === document.body) {
        const { scrollTop, scrollHeight, clientHeight } = container
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5
        const isAtTop = scrollTop <= 5

        switch (e.key) {
          case "ArrowDown":
            if (!isAtBottom) {
              container.scrollTop += 30
              e.preventDefault()
            }
            break
          case "ArrowUp":
            if (!isAtTop) {
              container.scrollTop -= 30
              e.preventDefault()
            }
            break
          case "PageDown":
            if (!isAtBottom) {
              container.scrollTop += clientHeight * 0.9
              e.preventDefault()
            }
            break
          case "PageUp":
            if (!isAtTop) {
              container.scrollTop -= clientHeight * 0.9
              e.preventDefault()
            }
            break
          case "Home":
            container.scrollTop = 0
            e.preventDefault()
            break
          case "End":
            container.scrollTop = scrollHeight - clientHeight
            e.preventDefault()
            break
          default:
            break
        }
      }
    }

    // Add keyboard event listener
    document.addEventListener("keydown", handleKeyDown)

    // Clean up
    return () => {
      document.removeEventListener("wheel", handleWheel)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="h-full w-full overflow-hidden">
      <div
        ref={containerRef}
        className={`screen-edge-scrollbar h-full w-full overflow-y-auto overscroll-contain ${className}`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>
    </div>
  )
}
