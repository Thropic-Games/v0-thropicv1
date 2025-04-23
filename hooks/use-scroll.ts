"use client"

import { useState, useEffect, useRef } from "react"

export function useScroll(elementId?: string, threshold = 100) {
  const [scrolled, setScrolled] = useState(false)
  const scrollableRef = useRef<Element | null>(null)

  useEffect(() => {
    // Find the main scrollable container - now it's inside the GlobalScrollContainer
    scrollableRef.current = document.querySelector(".screen-edge-scrollbar")

    if (!scrollableRef.current) return

    const handleScroll = () => {
      if (!scrollableRef.current) return

      const scrollTop = scrollableRef.current.scrollTop

      if (elementId) {
        // Check if the specified element is out of view
        const element = document.getElementById(elementId)
        if (element) {
          const rect = element.getBoundingClientRect()
          // Element is considered out of view when its bottom is above the viewport
          setScrolled(rect.bottom < 0)
        }
      } else {
        // Default behavior: check against threshold
        setScrolled(scrollTop > threshold)
      }
    }

    const currentRef = scrollableRef.current
    currentRef.addEventListener("scroll", handleScroll, { passive: true })

    // Initial check
    handleScroll()

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll)
      }
    }
  }, [elementId, threshold])

  return scrolled
}
