"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useInView } from "react-intersection-observer"

interface CarouselProps {
  autoSlideInterval?: number
  className?: string
  height?: number
}

// Hero images with added game names and descriptions
const heroImages = [
  {
    src: "/images/hero/mastershero.jpg",
    alt: "Masters Tournament",
    gameName: "Masters Tournament 2024",
    description: "Join the excitement of golf's most prestigious event and support youth golf programs nationwide.",
  },
  {
    src: "/images/hero/nbahero.jpg",
    alt: "NBA Playoffs",
    gameName: "NBA Playoffs Bracket Challenge",
    description:
      "Create your perfect bracket and compete while supporting basketball programs in underserved communities.",
  },
  {
    src: "/images/hero/hockeyhero.jpg",
    alt: "Stanley Cup Playoffs",
    gameName: "Stanley Cup Playoffs Pool",
    description: "Predict the winners of each series and help fund hockey equipment for youth programs.",
  },
  {
    src: "/images/hero/mlbhero.jpg",
    alt: "MLB All-Star Week",
    gameName: "MLB All-Star Fantasy Draft",
    description: "Draft your dream team of all-stars and contribute to baseball development in rural communities.",
  },
]

export function Carousel({ autoSlideInterval = 8000, className = "", height = 400 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0])) // Start with first image loaded
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Use intersection observer to detect if carousel is visible
  const { ref: carouselRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  const prev = useCallback(() => {
    const newIndex = currentIndex === 0 ? heroImages.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    // Preload the image
    setLoadedImages((prev) => new Set(prev).add(newIndex))
  }, [currentIndex])

  const next = useCallback(() => {
    const newIndex = currentIndex === heroImages.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    // Preload the image
    setLoadedImages((prev) => new Set(prev).add(newIndex))
  }, [currentIndex])

  // Preload adjacent images
  useEffect(() => {
    // Preload next image
    const nextIndex = (currentIndex + 1) % heroImages.length
    // Preload previous image
    const prevIndex = currentIndex === 0 ? heroImages.length - 1 : currentIndex - 1

    setLoadedImages((prev) => {
      const newSet = new Set(prev)
      newSet.add(nextIndex)
      newSet.add(prevIndex)
      return newSet
    })
  }, [currentIndex])

  // Start or stop the autoplay based on hover state and visibility
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Only start a new interval if not hovering and carousel is in view
    if (!isHovering && inView) {
      intervalRef.current = setInterval(next, autoSlideInterval)
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovering, inView, autoSlideInterval, next])

  return (
    <div
      ref={carouselRef}
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ height: `${height}px` }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {heroImages.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0 h-full relative rounded-xl overflow-hidden">
            {/* Only render images that are loaded or need to be loaded */}
            {loadedImages.has(index) && (
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                loading={index === 0 ? "eager" : "lazy"}
              />
            )}

            {/* Text Box */}
            <div className="absolute bottom-8 left-8 right-8 md:right-auto md:max-w-md bg-black bg-opacity-40 rounded-xl p-4">
              <h2 className="text-white font-bold text-xl mb-2">{image.gameName}</h2>
              <p className="text-white text-sm md:text-base">{image.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full z-10"
        onClick={prev}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous slide</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full z-10"
        onClick={next}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next slide</span>
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full ${currentIndex === index ? "bg-white" : "bg-white/50"}`}
            onClick={() => {
              setCurrentIndex(index)
              setLoadedImages((prev) => new Set(prev).add(index))
            }}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
