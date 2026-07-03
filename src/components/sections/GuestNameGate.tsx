import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plane, Ticket } from 'lucide-react'

interface GuestNameGateProps {
  open: boolean
  onSubmit: (name: string) => void
  onSkip: () => void
}

/**
 * Elegant modal shown when the URL has no `?guest=`. Lets the visitor type
 * their name to "unlock" the personalised invitation.
 */
export function GuestNameGate({ open, onSubmit, onSkip }: GuestNameGateProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Autofocus the field and lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // `preventScroll` stops mobile browsers from scrolling the page to keep the
    // caret in view (the modal is centred, so that would jump the page down).
    const focusTimer = window.setTimeout(
      () => inputRef.current?.focus({ preventScroll: true }),
      260,
    )

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = original
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onSkip])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) onSubmit(trimmed)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gate-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
            onClick={onSkip}
            aria-hidden="true"
          />

          <motion.form
            onSubmit={handleSubmit}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-gold/40 bg-warm-white shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Ticket header strip */}
            <div className="flex items-center justify-between bg-navy px-6 py-3 text-warm-white">
              <span className="label-caps text-[10px] text-sky-soft">
                Boarding Pass
              </span>
              <Plane className="h-4 w-4 rotate-45 text-gold" strokeWidth={1.5} />
            </div>

            <div className="flex flex-col items-center gap-4 px-6 py-7 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/40 text-gold">
                <Ticket className="h-6 w-6" strokeWidth={1.4} />
              </span>

              <div>
                <h2
                  id="gate-title"
                  className="font-display text-2xl text-navy"
                >
                  Chào mừng quý khách
                </h2>
                <p className="mt-1 text-sm text-navy-400">
                  Nhập tên của bạn để mở thiệp mời
                </p>
              </div>

              <label htmlFor="guest-name" className="sr-only">
                Tên của bạn
              </label>
              <input
                id="guest-name"
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ví dụ: Anh Tuấn & Chị Lan"
                autoComplete="name"
                className="w-full rounded-xl border border-navy/15 bg-ivory px-4 py-3 text-center text-navy outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
              />

              <button
                type="submit"
                disabled={!value.trim()}
                className="btn btn-primary w-full"
              >
                Mở thiệp mời
                <Plane className="h-4 w-4 rotate-45" strokeWidth={1.6} />
              </button>

              <button
                type="button"
                onClick={onSkip}
                className="text-xs text-navy-400 underline-offset-4 transition hover:text-navy hover:underline"
              >
                Xem thiệp mà không cần nhập tên
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
