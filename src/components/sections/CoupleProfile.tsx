import { Heart } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { Person, WeddingConfig } from '../../config/wedding.config'
import { cn } from '../../lib/cn'
import { getOrderedCouple } from '../../lib/couple'
import { easeLux } from '../../lib/motion'
import { useI18n } from '../../i18n/LanguageContext'
import { SmartImage } from '../ui/SmartImage'

function ProfileCard({
  person,
  role,
  entryX,
  delay,
  photoClassName,
}: {
  person: Person
  role: string
  entryX: number
  delay: number
  /** Extra crop/zoom tuning for this person's portrait. */
  photoClassName?: string
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={cn(
        'group relative flex h-full min-w-0 flex-col items-center rounded-3xl border border-gold/20 bg-warm-white/70 text-center',
        'p-[clamp(0.75rem,3.5vw,2rem)] shadow-sm backdrop-blur-sm transition duration-500',
        'hover:border-gold/50 hover:shadow-[0_22px_44px_-26px_rgba(198,138,116,0.65)]',
      )}
      initial={reduce ? false : { opacity: 0, x: entryX, scale: 0.97 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      whileHover={reduce ? undefined : { y: -4 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.78, ease: easeLux, delay }}
    >
      {/* Avatar with soft gold glow on hover */}
      <div className="relative">
        <span
          className="absolute -inset-1 rounded-full bg-gold/0 blur-md transition duration-500 group-hover:bg-gold/25"
          aria-hidden="true"
        />
        <SmartImage
          src={person.photo}
          alt={person.name}
          label=""
          className="relative aspect-square w-[clamp(4.5rem,22vw,9rem)] rounded-full border-2 border-gold/40 shadow-md"
          /* Portrait photos: keep the face (upper third) inside the circle. */
          imgClassName={cn('object-top', photoClassName)}
        />
      </div>

      <span className="label-caps mt-[clamp(0.65rem,2vw,1rem)] text-[clamp(0.55rem,2.2vw,0.7rem)] text-gold">
        {role}
      </span>
      <h3 className="mt-1 text-balance break-words font-display font-semibold leading-tight text-navy text-[clamp(1.05rem,3.6vw,1.7rem)]">
        {person.fullName ?? person.name}
      </h3>
    </motion.div>
  )
}

/** Couple portraits — repository-specific order, always two columns. */
export function CoupleProfile({ config }: { config: WeddingConfig }) {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const orderedCouple = getOrderedCouple(config)

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="grid grid-cols-2 items-stretch gap-[clamp(0.6rem,3.5vw,2.5rem)]">
        {orderedCouple.map(({ key, person }, index) => (
          <ProfileCard
            key={key}
            person={person}
            role={key === 'groom' ? t.couple.groomRole : t.couple.brideRole}
            entryX={index === 0 ? -22 : 22}
            delay={index * 0.12}
            /* Full-body photo — zoom in so the bride's face reads at a glance. */
            photoClassName={
              key === 'bride' ? 'scale-[2.5] origin-[41%_46%]' : undefined
            }
          />
        ))}
      </div>

      {/* Center heart accent (hidden on the smallest screens) */}
      <motion.span
        className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 place-items-center sm:grid"
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0, scale: 0.55 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{
          type: 'spring',
          stiffness: 210,
          damping: 14,
          delay: reduce ? 0 : 0.55,
        }}
      >
        <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-warm-white text-gold shadow-md">
          <motion.span
            className="inline-flex"
            animate={reduce ? undefined : { scale: [1, 1.16, 1] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatDelay: 2.4,
              ease: 'easeInOut',
            }}
          >
            <Heart className="h-5 w-5 fill-current" />
          </motion.span>
        </span>
      </motion.span>
    </div>
  )
}
