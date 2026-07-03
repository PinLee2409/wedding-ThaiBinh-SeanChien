import { Play } from 'lucide-react'
import type { WeddingConfig } from '../../config/wedding.config'
import { cn } from '../../lib/cn'
import { SectionHeading } from '../ui/SectionHeading'
import { SmartImage } from '../ui/SmartImage'
import { Reveal } from '../ui/Reveal'
import { SectionReveal, RevealItem } from '../ui/SectionReveal'

/** Give the grid gentle variety so it looks composed even with placeholders. */
const SPANS = [
  'row-span-2',
  '',
  '',
  '',
  'row-span-2',
  '',
]

export function MediaGallery({ config }: { config: WeddingConfig }) {
  const { images, video, videoPoster } = config.gallery

  return (
    <section
      id="gallery"
      className="bg-gradient-to-b from-warm-white to-ivory px-5 py-20"
      aria-label="Album ảnh cưới"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading
            kicker="Gallery"
            title="Khoảnh khắc yêu thương"
            subtitle="Những mảnh ghép đẹp nhất trên hành trình của chúng mình."
          />
        </Reveal>

        {/* Feature video frame */}
        {video && (
          <Reveal delay={0.05} className="mx-auto mt-12 max-w-3xl">
            <figure className="group relative overflow-hidden rounded-3xl border border-gold/25 bg-navy shadow-xl">
              <video
                className="aspect-video w-full object-cover"
                src={video}
                poster={videoPoster}
                controls
                playsInline
                preload="metadata"
              />
              <figcaption className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-navy/70 px-3 py-1 text-warm-white backdrop-blur-sm">
                <Play className="h-3.5 w-3.5 fill-current text-gold" />
                <span className="label-caps text-[9px]">Pre-wedding Film</span>
              </figcaption>
            </figure>
          </Reveal>
        )}

        {/* Image grid */}
        <SectionReveal className="mt-8 grid auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[180px] md:grid-cols-3">
          {images.map((image, i) => (
            <RevealItem
              key={image.src + i}
              className={cn('group h-full', SPANS[i % SPANS.length])}
            >
              <SmartImage
                src={image.src}
                alt={image.alt}
                label={`Ảnh ${i + 1}`}
                className="h-full w-full rounded-2xl border border-gold/15 shadow-sm transition-shadow duration-500 group-hover:shadow-[0_18px_36px_-20px_rgba(71,35,59,0.5)]"
                imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
            </RevealItem>
          ))}
        </SectionReveal>
      </div>
    </section>
  )
}
