import { Play } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import type { WeddingConfig } from '../../config/wedding.config'
import { cn } from '../../lib/cn'
import { SectionHeading } from '../ui/SectionHeading'
import { SmartImage } from '../ui/SmartImage'
import { Reveal } from '../ui/Reveal'
import { SectionReveal, RevealItem } from '../ui/SectionReveal'

/**
 * Each photo gets its own frame personality — arch, oval, tilted polaroid,
 * wide panorama — so the wall reads like a curated exhibition rather than a
 * uniform grid. Cycles if the couple adds more than six photos.
 */
type FrameKind = 'arch' | 'wide' | 'oval' | 'polaroid' | 'standard'

interface FrameDef {
  kind: FrameKind
  /** Grid placement classes. */
  span: string
  /** Polaroid handwriting caption (script font). */
  caption?: string
  /** Polaroid resting angle; straightens on hover. */
  tilt?: string
}

// Spans sum to a full 3×3 pack on md (dense flow), hole-free on mobile too.
const FRAMES: FrameDef[] = [
  { kind: 'arch', span: 'row-span-2' },
  { kind: 'wide', span: 'col-span-2' },
  { kind: 'oval', span: '' },
  { kind: 'polaroid', span: 'md:row-span-2', caption: 'Yêu thương', tilt: '-rotate-2' },
  { kind: 'standard', span: '' },
  { kind: 'polaroid', span: '', caption: 'Mãi mãi', tilt: 'rotate-2' },
]

function GalleryFrame({
  frame,
  index,
  src,
  alt,
}: {
  frame: FrameDef
  index: number
  src?: string
  alt: string
}) {
  const label = `Ảnh ${index + 1}`

  if (frame.kind === 'polaroid') {
    // A white-bordered polaroid resting at a slight angle; straightens on hover.
    return (
      <figure
        className={cn(
          'group flex h-full flex-col rounded-lg bg-warm-white p-2.5 pb-2 shadow-[0_14px_30px_-16px_rgba(27,42,74,0.35)] transition-transform duration-500 ease-out hover:rotate-0',
          frame.tilt,
        )}
      >
        <SmartImage
          src={src}
          alt={alt}
          label={label}
          className="min-h-0 flex-1 rounded-sm"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <figcaption className="shrink-0 pt-2 text-center font-script text-xl leading-none text-navy-600">
          {frame.caption}
        </figcaption>
      </figure>
    )
  }

  return (
    <SmartImage
      src={src}
      alt={alt}
      label={label}
      className={cn(
        'h-full w-full border border-gold/15 shadow-sm transition-shadow duration-500 group-hover:shadow-[0_18px_36px_-20px_rgba(71,35,59,0.5)]',
        frame.kind === 'arch' && 'rounded-t-[999px] rounded-b-3xl',
        frame.kind === 'oval' && 'rounded-[50%]',
        frame.kind === 'wide' && 'rounded-3xl',
        frame.kind === 'standard' && 'rounded-2xl',
      )}
      imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
    />
  )
}

export function MediaGallery({ config }: { config: WeddingConfig }) {
  const { images, video, videoPoster } = config.gallery
  const reduce = useReducedMotion()
  // Duplicate the set so the -50% marquee loops without a visible seam.
  const strip = [...images, ...images]

  return (
    <section
      id="gallery"
      className="overflow-hidden bg-gradient-to-b from-warm-white to-ivory px-5 py-20"
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

        {/* Exhibition wall: arch, panorama, oval, polaroid — every frame its
            own shape so the collection feels curated, not templated. */}
        <SectionReveal className="mt-10 grid grid-flow-dense auto-rows-[150px] grid-cols-2 gap-4 sm:auto-rows-[180px] md:grid-cols-3">
          {images.map((image, i) => {
            const frame = FRAMES[i % FRAMES.length]
            return (
              <RevealItem
                key={image.src + i}
                className={cn('group h-full', frame.span)}
              >
                <GalleryFrame frame={frame} index={i} src={image.src} alt={image.alt} />
              </RevealItem>
            )
          })}
        </SectionReveal>
      </div>

      {/* Film-strip: a slow, endless fly-past of the same memories. Static
          scrollable row under reduced motion. */}
      <Reveal delay={0.1} className="mt-10">
        <div
          className={cn(
            'relative',
            !reduce &&
              '[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]',
          )}
        >
          <div
            className={cn(
              'flex w-max gap-3',
              reduce ? 'w-full overflow-x-auto' : 'animate-marquee',
            )}
          >
            {(reduce ? images : strip).map((image, i) => (
              <SmartImage
                key={image.src + i}
                src={image.src}
                alt=""
                label={`Ảnh ${(i % images.length) + 1}`}
                className="h-24 w-36 shrink-0 rounded-xl border border-gold/15 sm:h-28 sm:w-44"
              />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
