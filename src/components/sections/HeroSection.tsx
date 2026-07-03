import { motion, useReducedMotion } from 'motion/react'
import { ChevronDown, Plane } from 'lucide-react'
import type { WeddingConfig } from '../../config/wedding.config'
import { fadeUp, staggerContainer } from '../../lib/motion'
import { Clouds } from '../decorations/Clouds'
import { FlyingPlane } from '../decorations/FlyingPlane'
import { RunwayLights } from '../decorations/RunwayLights'
import { Countdown } from '../ui/Countdown'
import { MusicToggle } from '../ui/MusicToggle'
import { SmartImage } from '../ui/SmartImage'

interface HeroSectionProps {
  config: WeddingConfig
  guestName: string
  isMusicPlaying: boolean
  onToggleMusic: () => void
  musicEnabled: boolean
}

export function HeroSection({
  config,
  guestName,
  isMusicPlaying,
  onToggleMusic,
  musicEnabled,
}: HeroSectionProps) {
  const reduce = useReducedMotion()
  const { event, couple, date, hero } = config

  return (
    <section
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-navy px-5 py-16 text-center text-warm-white"
      aria-label="Trang bìa thiệp cưới"
    >
      {/* Background: video if provided, otherwise a poster image. */}
      <div className="absolute inset-0">
        {hero.backgroundVideo ? (
          <video
            className="h-full w-full object-cover"
            src={hero.backgroundVideo}
            poster={hero.backgroundImage}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <SmartImage
            src={hero.backgroundImage}
            alt=""
            loading="eager"
            placeholder="bare"
            className="h-full w-full"
          />
        )}
        {/* Legibility gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/45 to-navy/85" />
      </div>

      {/* Ambient sky */}
      <Clouds className="opacity-40" />
      <FlyingPlane />

      {/* "Airplane window" frame */}
      <div className="pointer-events-none absolute inset-3 rounded-[2rem] border border-warm-white/15 sm:inset-5" />

      {/* Music toggle — top right */}
      {musicEnabled && (
        <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
          <MusicToggle
            isPlaying={isMusicPlaying}
            onToggle={onToggleMusic}
            variant="inline"
          />
        </div>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 flex max-w-xl flex-col items-center gap-5"
        variants={staggerContainer}
        initial={reduce ? 'visible' : 'hidden'}
        animate="visible"
      >
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 text-sky-soft"
        >
          <span className="h-px w-8 bg-sky-soft/60" />
          <Plane className="h-4 w-4 rotate-45" strokeWidth={1.5} />
          <span className="label-caps text-[11px]">{event.airline}</span>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="label-caps text-xs text-gold sm:text-sm"
        >
          {event.kicker}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="text-display font-display font-semibold uppercase tracking-wide"
        >
          Flight to{' '}
          <span className="block text-gold-shimmer">Forever</span>
        </motion.h1>

        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center gap-4 font-display text-[clamp(1.5rem,6vw,2.5rem)]"
        >
          <span>{couple.groom.name}</span>
          <Plane className="h-5 w-5 rotate-45 text-gold" strokeWidth={1.5} />
          <span>{couple.bride.name}</span>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col items-center gap-1">
          <p className="label-caps text-sm text-warm-white/90">
            {date.weekday} · {date.displayDate}
          </p>
        </motion.div>

        {/* Personalised greeting */}
        <motion.div
          variants={fadeUp}
          className="mt-1 flex flex-col items-center rounded-2xl border border-gold/30 bg-white/10 px-6 py-4 backdrop-blur-sm"
        >
          {guestName ? (
            <>
              <span className="label-caps text-[11px] text-sky-soft">
                Kính mời
              </span>
              <span className="mt-1.5 font-display text-2xl font-semibold text-gold-shimmer sm:text-3xl">
                {guestName}
              </span>
            </>
          ) : (
            <span className="font-display text-xl font-semibold text-gold sm:text-2xl">
              Trân trọng kính mời
            </span>
          )}
          <p className="mt-2 text-xs text-sky-soft sm:text-sm">
            Cùng lên chuyến bay hạnh phúc của chúng mình.
          </p>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Countdown iso={date.iso} tone="light" className="mt-2" />
        </motion.div>
      </motion.div>

      {/* Runway lights + scroll cue */}
      <div className="absolute bottom-6 left-0 right-0 z-10 flex flex-col items-center gap-3">
        <RunwayLights count={10} className="opacity-80" />
        {!reduce && (
          <motion.div
            className="flex flex-col items-center text-warm-white/70"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="label-caps text-[9px]">Cuộn xuống</span>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        )}
      </div>
    </section>
  )
}
