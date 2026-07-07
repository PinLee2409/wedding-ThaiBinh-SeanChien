declare module 'canvas-confetti' {
  /** Opaque custom shape produced by shapeFromText / shapeFromPath. */
  interface ConfettiShape {
    type: string
  }

  type Shape = 'square' | 'circle' | 'star' | ConfettiShape

  interface ConfettiOptions {
    particleCount?: number
    angle?: number
    spread?: number
    startVelocity?: number
    decay?: number
    gravity?: number
    drift?: number
    ticks?: number
    origin?: { x?: number; y?: number }
    colors?: string[]
    shapes?: Shape[]
    scalar?: number
    zIndex?: number
    disableForReducedMotion?: boolean
  }

  interface ConfettiFn {
    (options?: ConfettiOptions): Promise<null> | null
    /** Rasterises text (e.g. an emoji) into a confetti particle shape. */
    shapeFromText(options: { text: string; scalar?: number }): ConfettiShape
    shapeFromPath(options: { path: string }): ConfettiShape
  }

  const confetti: ConfettiFn
  export default confetti
}
