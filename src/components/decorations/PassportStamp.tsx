import { Plane } from 'lucide-react'
import { cn } from '../../lib/cn'

interface PassportStampProps {
  top: string
  date: string
  bottom: string
  className?: string
}

/** A faux passport / boarding stamp — circular double ring with a plane. */
export function PassportStamp({ top, date, bottom, className }: PassportStampProps) {
  return (
    <div
      className={cn(
        'grid h-28 w-28 -rotate-12 place-items-center rounded-full border-2 border-gold/70 text-gold shadow-[inset_0_0_0_4px_rgba(198,138,116,0.12)]',
        className,
      )}
      aria-hidden="true"
    >
      <div className="grid h-[86%] w-[86%] place-items-center rounded-full border border-dashed border-gold/60">
        <div className="flex flex-col items-center leading-none">
          <span className="label-caps text-[7px]">{top}</span>
          <Plane className="my-1 h-4 w-4 rotate-45" strokeWidth={1.5} />
          <span className="font-display text-base font-semibold tracking-wide">
            {date}
          </span>
          <span className="label-caps mt-0.5 text-[7px]">{bottom}</span>
        </div>
      </div>
    </div>
  )
}
