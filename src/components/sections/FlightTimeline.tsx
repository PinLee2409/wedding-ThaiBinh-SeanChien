import { Cloud, PlaneLanding, PlaneTakeoff, Ticket } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { TimelineItem, WeddingConfig } from '../../config/wedding.config'
import { cn } from '../../lib/cn'
import { easeLux } from '../../lib/motion'
import { SectionHeading } from '../ui/SectionHeading'
import { SmartImage } from '../ui/SmartImage'
import { Reveal } from '../ui/Reveal'

const ICONS: Record<TimelineItem['icon'], LucideIcon> = {
  ticket: Ticket,
  'plane-takeoff': PlaneTakeoff,
  cloud: Cloud,
  'plane-landing': PlaneLanding,
}

function TimelineRow({ item, index }: { item: TimelineItem; index: number }) {
  const Icon = ICONS[item.icon]
  const isLeft = index % 2 === 0

  return (
    <Reveal
      as="li"
      delay={index * 0.1}
      className="relative md:grid md:grid-cols-2 md:items-center md:gap-10"
    >
      {/* Node on the line */}
      <span
        className="group absolute left-6 top-0 z-10 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border-2 border-gold bg-warm-white text-gold shadow-[0_8px_20px_-10px_rgba(198,138,116,0.7)] md:left-1/2"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>

      {/* Text */}
      <div
        className={cn(
          'pl-16 md:row-start-1 md:pl-0',
          isLeft
            ? 'md:col-start-1 md:pr-12 md:text-right'
            : 'md:col-start-2 md:pl-12',
        )}
      >
        <span className="label-caps text-[10px] text-gold">{item.phase}</span>
        <p className="mt-1 font-mono text-xs text-navy-400">{item.date}</p>
        <h3 className="mt-1 font-display text-[clamp(1.4rem,4.5vw,2rem)] text-navy">
          {item.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-navy-400">
          {item.description}
        </p>
      </div>

      {/* Image */}
      <div
        className={cn(
          'group mt-4 overflow-hidden rounded-2xl border border-gold/20 shadow-sm md:row-start-1 md:mt-0',
          'ml-16 md:ml-0',
          isLeft ? 'md:col-start-2 md:ml-12' : 'md:col-start-1 md:mr-12',
        )}
      >
        <SmartImage
          src={item.image}
          alt={item.title}
          label={item.phase}
          className="aspect-[4/3] w-full"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
    </Reveal>
  )
}

export function FlightTimeline({ config }: { config: WeddingConfig }) {
  const reduce = useReducedMotion()

  return (
    <section
      id="timeline"
      className="bg-ivory px-5 py-24"
      aria-label="Hành trình tình yêu"
    >
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            kicker="Flight Journey"
            title="Hành trình của chúng mình"
            subtitle="Mỗi chặng bay là một dấu mốc yêu thương trên hành trình về chung một nhà."
          />
        </Reveal>

        <div className="relative mt-16">
          {/* The vertical route line — draws in on scroll */}
          <motion.span
            className="absolute bottom-0 left-6 top-0 w-px origin-top bg-gradient-to-b from-gold/15 via-gold/70 to-gold/15 md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.2, ease: easeLux }}
          />
          <ol className="flex flex-col gap-16">
            {config.timeline.map((item, i) => (
              <TimelineRow key={item.phase} item={item} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
