import { useCallback, useState } from 'react'
import {
  applyThemeById,
  getSavedThemeId,
  saveThemeId,
  themes,
} from '../config/themes'

/**
 * Colour-scheme state. The active theme's CSS variables are applied to <html>
 * (see `applyThemeById`) and persisted to localStorage so the choice sticks.
 * The initial theme is applied in `main.tsx` before render to avoid a flash.
 * Switching cross-fades via the View Transitions API where available, so the
 * whole page melts into the new palette instead of snapping.
 */
export function useTheme() {
  const [themeId, setThemeId] = useState<string>(() => getSavedThemeId())

  const setTheme = useCallback((id: string) => {
    const apply = () => applyThemeById(id)
    const canTransition =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (canTransition) {
      ;(
        document as Document & {
          startViewTransition: (cb: () => void) => void
        }
      ).startViewTransition(apply)
    } else {
      apply()
    }
    saveThemeId(id)
    setThemeId(id)
  }, [])

  return { themeId, setTheme, themes }
}
