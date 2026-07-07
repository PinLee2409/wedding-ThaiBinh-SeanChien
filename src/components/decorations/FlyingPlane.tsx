import { motion, useReducedMotion } from 'motion/react'
import { Plane } from 'lucide-react'
import { cn } from '../../lib/cn'

interface FlyingPlaneProps {
  className?: string
  /** Vertical position of the flight path. */
  top?: string
  /** Icon size in pixels. */
  size?: number
  /** Seconds for one crossing. */
  duration?: number
  /** Start offset in seconds (negative = already in flight). */
  delay?: number
  /** Pause between crossings. */
  repeatDelay?: number
  /** Travel direction. */
  direction?: 'ltr' | 'rtl'
  /** Tailwind text-colour class for the plane + trail. */
  tone?: string
  /** Contrail width utility class, e.g. "w-28". Empty hides the trail. */
  trailWidth?: string
}

/**
 * A plane that glides across the sky trailing a champagne contrail. Fully
 * configurable so a whole squadron can share one component. Rests statically
 * when the visitor prefers reduced motion.
 */
export function FlyingPlane({
  className,
  top = '20%',
  size = 28,
  duration = 17,
  delay = 0,
  repeatDelay = 5,
  direction = 'ltr',
  tone = 'text-navy',
  trailWidth = 'w-28',
}: FlyingPlaneProps) {
  const reduce = useReducedMotion()
  const rtl = direction === 'rtl'

  const trail = trailWidth ? (
    <span
      className={cn(
        'h-px',
        trailWidth,
        rtl
          ? 'bg-gradient-to-r from-current/60 to-transparent'
          : 'bg-gradient-to-l from-current/60 to-transparent',
      )}
    />
  ) : null

  const planeIcon = (
    <Plane
      width={size}
      height={size}
      strokeWidth={1.5}
      className={cn(
        'shrink-0 drop-shadow-[0_2px_4px_rgba(45,20,35,0.2)]',
        rtl ? '-rotate-45 -scale-x-100' : 'rotate-45',
      )}
    />
  )

  if (reduce) {
    return (
      <div
        className={cn('pointer-events-none absolute', tone, className)}
        style={{ top, right: rtl ? '10%' : undefined, left: rtl ? undefined : '10%' }}
        aria-hidden="true"
      >
        {planeIcon}
      </div>
    )
  }

  return (
    <motion.div
      className={cn(
        'pointer-events-none absolute left-0 z-10 flex items-center gap-2',
        tone,
        className,
      )}
      style={{ top }}
      aria-hidden="true"
      initial={{ x: rtl ? '118vw' : '-18vw' }}
      animate={{ x: rtl ? '-18vw' : '118vw', y: [-10, 6, -10] }}
      transition={{
        x: { duration, repeat: Infinity, ease: 'linear', repeatDelay, delay },
        y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      {rtl ? (
        <>
          {planeIcon}
          {trail}
        </>
      ) : (
        <>
          {trail}
          {planeIcon}
        </>
      )}
    </motion.div>
  )
}
