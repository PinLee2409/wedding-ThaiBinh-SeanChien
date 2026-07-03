import { motion, useReducedMotion } from 'motion/react'
import { Plane } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * A small plane that flies across the screen, trailing a champagne contrail.
 * When motion is reduced it rests statically in the sky instead.
 */
export function FlyingPlane({ className }: { className?: string }) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div
        className={cn('pointer-events-none absolute right-8 top-[18%]', className)}
        aria-hidden="true"
      >
        <Plane className="h-7 w-7 rotate-45 text-navy/70" strokeWidth={1.5} />
      </div>
    )
  }

  return (
    <motion.div
      className={cn(
        'pointer-events-none absolute left-0 top-[20%] z-10 flex items-center gap-2',
        className,
      )}
      aria-hidden="true"
      initial={{ x: '-18vw' }}
      animate={{ x: '118vw', y: [-10, 6, -10] }}
      transition={{
        x: { duration: 17, repeat: Infinity, ease: 'linear', repeatDelay: 5 },
        y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <span className="h-px w-28 bg-gradient-to-l from-gold/70 to-transparent" />
      <Plane
        className="h-7 w-7 rotate-45 text-navy drop-shadow-[0_2px_4px_rgba(45,20,35,0.25)]"
        strokeWidth={1.5}
      />
    </motion.div>
  )
}
