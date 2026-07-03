/** Client-side export of a DOM node (the boarding pass) → high-res PNG / PDF.
 *  html-to-image + jsPDF are dynamically imported so they only load on demand. */

const EXPORT_BG = '#f8f2f0' // ivory (soft blush)
const PIXEL_RATIO = 2

/**
 * Ensure webfonts are ready and every <img> inside the node is fully decoded
 * before we snapshot it — otherwise the export can miss images or fonts.
 */
export async function waitForImagesBeforeExport(node: HTMLElement): Promise<void> {
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready
    } catch {
      /* ignore */
    }
  }

  const images = Array.from(node.querySelectorAll('img'))
  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) {
        return img.decode?.().catch(() => undefined) ?? Promise.resolve()
      }
      return new Promise<void>((resolve) => {
        const done = () => resolve()
        img.addEventListener('load', done, { once: true })
        img.addEventListener('error', done, { once: true })
      })
    }),
  )

  // One more frame so layout/paint settles before capture.
  await new Promise((r) => requestAnimationFrame(() => r(null)))
}

async function nodeToPng(node: HTMLElement): Promise<string> {
  const { toPng } = await import('html-to-image')
  await waitForImagesBeforeExport(node)

  const options = {
    cacheBust: true,
    pixelRatio: PIXEL_RATIO,
    backgroundColor: EXPORT_BG,
    // Capture the node at its natural, un-transformed size.
    width: node.offsetWidth,
    height: node.offsetHeight,
  }

  try {
    return await toPng(node, options)
  } catch (err) {
    // Strict-CORS fallback: skip webfont embedding so the guest still gets a card.
    console.warn('Export: retrying without font embedding.', err)
    return toPng(node, { ...options, skipFonts: true })
  }
}

function triggerDownload(dataUrl: string, fileName: string): void {
  const anchor = document.createElement('a')
  anchor.href = dataUrl
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

function loadImageSize(dataUrl: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
    img.onerror = reject
    img.src = dataUrl
  })
}

/** Export the node as a PNG (≈ node width × pixelRatio). */
export async function exportElementToPng(
  node: HTMLElement,
  fileName: string,
): Promise<void> {
  const dataUrl = await nodeToPng(node)
  triggerDownload(dataUrl, `${fileName}.png`)
}

/** Export the node PNG centred on an A4 portrait page with clean margins. */
export async function exportElementToPdf(
  node: HTMLElement,
  fileName: string,
): Promise<void> {
  const dataUrl = await nodeToPng(node)
  const { jsPDF } = await import('jspdf')
  const { w: imgW, h: imgH } = await loadImageSize(dataUrl)

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const margin = 36

  // Fit the image within the printable area, preserving aspect ratio.
  const availW = pageW - margin * 2
  const availH = pageH - margin * 2
  const ratio = Math.min(availW / imgW, availH / imgH)
  const drawW = imgW * ratio
  const drawH = imgH * ratio
  const x = (pageW - drawW) / 2
  const y = (pageH - drawH) / 2

  // Warm background so the page matches the card.
  pdf.setFillColor(247, 241, 230)
  pdf.rect(0, 0, pageW, pageH, 'F')
  pdf.addImage(dataUrl, 'PNG', x, y, drawW, drawH, undefined, 'FAST')
  pdf.save(`${fileName}.pdf`)
}
