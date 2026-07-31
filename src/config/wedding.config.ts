import type { Lang } from '../i18n/translations'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WEDDING CONFIG — the single source of truth for the whole invitation.
 * ─────────────────────────────────────────────────────────────────────────────
 *  The couple only needs to edit THIS file (and drop assets into /public).
 *
 *  Assets live in:
 *    public/images  →  referenced as "/images/xxx.jpg"
 *    public/videos  →  referenced as "/videos/xxx.mp4"
 *    public/music   →  referenced as "/music/xxx.mp3"
 *
 *  Any image path that does not exist yet will gracefully fall back to an
 *  elegant placeholder, so the site looks good even before real photos arrive.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface Person {
  /** Short display name, e.g. "Thảo Nhi" */
  name: string
  /** Optional full name shown in formal spots */
  fullName?: string
  /** e.g. "Cô dâu" / "Chú rể" */
  role: string
  /** Portrait photo in /public/images */
  photo?: string
}

export interface TimelineItem {
  /** Aviation phase label, e.g. "Check-in" */
  phase: string
  /** lucide-react icon name — see FlightTimeline for the mapping */
  icon: 'ticket' | 'plane-takeoff' | 'cloud' | 'plane-landing'
  date: string
  title: string
  description: string
  image?: string
}

export interface GalleryImage {
  src: string
  alt: string
  caption?: string
  /** Tailwind classes picking which part of the photo shows when its frame
   *  has a different aspect — object-position and optionally a zoom, e.g.
   *  'object-top' or 'object-[50%_20%] scale-[1.35] origin-[50%_15%]'. */
  focus?: string
}

export interface WeddingConfig {
  /** Per-repository identity, language availability and visible name order. */
  site: {
    enabledLanguages: readonly Lang[]
    defaultLanguage: Lang
    coupleOrder: readonly ['bride' | 'groom', 'bride' | 'groom']
    /** Canonical deployed URL encoded into the scannable invitation QR. */
    publicUrl: string
  }

  /** Names & flight code used across hero, boarding pass, etc. */
  event: {
    /** Big hero title */
    tagline: string
    /** e.g. "Save the Date" */
    kicker: string
    /** Airline-style brand shown on the boarding pass header */
    airline: string
    /** Flight number suffix — final flight is `LOVE-{flightCode}` */
    flightCode: string
  }

  couple: {
    bride: Person
    groom: Person
    /** Short "&" separator hashtag, optional */
    hashtag?: string
  }

  date: {
    /** ISO date-time WITH timezone offset. Powers countdown + calendar file. */
    iso: string
    /** Human date, e.g. "20 · 12 · 2026" */
    displayDate: string
    /** Day of week / lunar note, e.g. "Chủ Nhật" */
    weekday: string
    /** Boarding time text, e.g. "16:00" */
    time: string
    /** How long to block on the calendar (hours) */
    durationHours: number
  }

  venue: {
    name: string
    hall?: string
    address: string
    /** Google Maps embed URL (…/maps/embed?...). Empty string hides the map. */
    mapEmbedUrl: string
    /** Google Maps share/place URL for the "Open in Maps" button. */
    mapLink: string
  }

  hero: {
    /** Background image (jpg/png) OR poster for the video. */
    backgroundImage: string
    /** Optional background video; leave "" to use the image only. */
    backgroundVideo: string
  }

  timeline: TimelineItem[]

  gallery: {
    images: GalleryImage[]
    /** Pre-wedding video shown in a luxury frame. Leave "" to hide it. */
    video: string
    /** Poster frame for the video. */
    videoPoster: string
  }

  boardingPass: {
    /** Static poster used on the downloadable card (never a video). */
    poster: string
    from: string
    to: string
    /** Small print at the bottom of the pass. */
    footnote: string
  }

  loveMessage: {
    heading: string
    body: string[]
    signature: string
  }

  thankYou: {
    heading: string
    message: string
  }

  guestbook: {
    /** Optional Apps Script / API endpoint that stores + returns wishes as
     *  JSON `[{ name, message, ts }]`. Empty ⇒ wishes stay on the guest's
     *  device only (still a lovely keepsake, just not shared). */
    endpoint: string
    /** Short tag identifying this wedding in the shared wishes sheet, so the
     *  two invitation sites keep their guest books separate. */
    site: string
  }

  music: {
    /** Sequential background playlist in /public/music. Empty hides controls. */
    tracks: Array<{
      src: string
      title: string
      artist: string
    }>
    initialVolume: number
  }
}

export const weddingConfig: WeddingConfig = {
  site: {
    enabledLanguages: ['vi'],
    defaultLanguage: 'vi',
    coupleOrder: ['bride', 'groom'],
    publicUrl: 'https://pinlee2409.github.io/wedding-ThaiBinh-SeanChien/',
  },

  event: {
    tagline: 'Flight to Forever',
    kicker: 'Save the Date',
    airline: 'Forever Airlines',
    flightCode: '1220',
  },

  couple: {
    bride: {
      name: 'Thái Bình',
      fullName: 'Thái Bình',
      role: 'Cô dâu',
      photo: 'images/web/anh_nu.jpg',
    },
    groom: {
      name: 'Sean Chien',
      fullName: 'Sean Chien',
      role: 'Chú rể',
      photo: 'images/web/anh_nam.jpg',
    },
    hashtag: '#ChuyenBayHanhPhuc',
  },

  date: {
    iso: '2026-12-20T16:00:00+07:00',
    displayDate: '20 · 12 · 2026',
    weekday: 'Chủ Nhật',
    time: '16:00',
    durationHours: 4,
  },

  venue: {
    name: 'Trung tâm Hội nghị & Tiệc cưới Diamond Palace',
    hall: 'Sảnh Sapphire · Tầng 3',
    address: '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    // Replace with your own Google Maps "Embed a map" iframe src.
    mapEmbedUrl:
      'https://www.google.com/maps?q=Ho+Chi+Minh+City+Opera+House&output=embed',
    mapLink: 'https://maps.google.com/?q=Ho+Chi+Minh+City+Opera+House',
  },

  hero: {
    backgroundImage: 'images/hero.jpg',
    backgroundVideo: '',
  },

  // Deliberately free of dates and events we were never told. Only the landing
  // leg carries a real date — the wedding day. If the couple want their actual
  // milestones here, fill in `date`/`title`/`description` per leg (and the
  // matching entries in i18n `timeline.items`); a leg with an empty `date`
  // simply renders without one.
  // Photographs come from the gallery set via FlightTimeline's LEG_PHOTOS —
  // the old `images/timeline-*.jpg` paths were never supplied and rendered as
  // placeholders, which is why this section had been dropped from the page.
  timeline: [
    {
      phase: 'Check-in',
      icon: 'ticket',
      date: '',
      title: 'Chuẩn bị hành trang',
      description: 'Mọi chuyến bay đều bắt đầu bằng một lời hẹn.',
    },
    {
      phase: 'Take-off',
      icon: 'plane-takeoff',
      date: '',
      title: 'Cùng cất cánh',
      description: 'Hai hành khách chọn chung một đường bay.',
    },
    {
      phase: 'Cruising Altitude',
      icon: 'cloud',
      date: '',
      title: 'Đường bay chung',
      description: 'Qua nắng, qua mưa, qua những điều rất đời thường.',
    },
    {
      phase: 'Landing',
      icon: 'plane-landing',
      date: '20 · 12 · 2026',
      title: 'Ngày hạ cánh',
      description: 'Bến đỗ cuối cùng, và cũng là nơi bắt đầu.',
    },
  ],

  gallery: {
    images: [
      { src: 'images/web/anh_cuoi_1.jpg', alt: 'Ảnh cưới 1' },
      // Portrait photo in the wide panorama frame: start just below the top
      // (skips the dark headroom) and zoom in so the couple fills the frame.
      {
        src: 'images/web/anh_cuoi_2.jpg',
        alt: 'Ảnh cưới 2',
        focus: 'object-[50%_20%] translate-x-[3%] scale-[1.35] origin-[50%_15%]',
      },
      { src: 'images/web/anh_cuoi_3.jpg', alt: 'Ảnh cưới 3' },
      { src: 'images/web/anh_cuoi_4.jpg', alt: 'Ảnh cưới 4' },
      { src: 'images/web/anh_cuoi_5.jpg', alt: 'Ảnh cưới 5' },
      { src: 'images/web/anh_cuoi_6.jpg', alt: 'Ảnh cưới 6' },
      { src: 'images/web/anh_cuoi_7.jpg', alt: 'Ảnh cưới 7' },
      { src: 'images/web/anh_cuoi_8.jpg', alt: 'Ảnh cưới 8' },
    ],
    video: 'videos/prewedding.mp4',
    videoPoster: 'images/prewedding-poster.jpg',
  },

  boardingPass: {
    poster: 'images/web/anhcuoi_passcard.jpg',
    from: 'Single Life',
    to: 'Forever',
    footnote:
      'Kính mong Quý khách có mặt đúng giờ để không lỡ chuyến bay hạnh phúc ♥',
  },

  loveMessage: {
    heading: 'Đôi lời từ cô dâu và chú rể',
    body: [
      'Có những chuyến bay đưa con người đến những vùng đất mới, và có một chuyến bay đưa hai trái tim về bên nhau trọn đời.',
      'Xin trân trọng cảm ơn Quý khách đã dành thời gian đến chung vui. Sự hiện diện của Quý khách là niềm vinh hạnh và món quà quý giá đối với hai gia đình.',
    ],
    signature: 'Với tất cả yêu thương và lòng biết ơn,',
  },

  thankYou: {
    heading: 'Lời cảm ơn chân thành',
    message:
      'Cô dâu, chú rể và hai gia đình hân hạnh được đón tiếp Quý khách trong ngày trọng đại.',
  },

  guestbook: {
    // Google Apps Script "Loi chuc - Boarding wishes" — stores wishes in the
    // couple's "Lời chúc" sheet and returns them for every guest.
    endpoint:
      'https://script.google.com/macros/s/AKfycbxaqUXWH-XPnL8yfOCyVqLZm66DiJRJJps38RW8sBfoAP4UO4eElx6We2ne5fs6_iQB/exec',
    site: 'thaibinh',
  },

  music: {
    tracks: [
      {
        src: 'music/beautiful-in-white.mp3',
        title: 'Beautiful In White',
        artist: 'Shane Filan',
      },
      {
        src: 'music/young-and-beautiful.mp3',
        title: 'Young and Beautiful',
        artist: 'Lana Del Rey',
      },
      {
        src: 'music/souvenirs.mp3',
        title: 'Souvenirs',
        artist: 'van',
      },
    ],
    initialVolume: 0.55,
  },
}

export default weddingConfig
