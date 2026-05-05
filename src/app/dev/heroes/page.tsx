import {
  HeroAtmospheric,
  HeroDeclarative,
  HeroDiagrammatic,
  HeroEditorial,
  HeroTypographic,
} from '@/components/marketing/heroes'

interface GalleryEntry {
  slug: string
  Component: () => React.JSX.Element
  designTitle: string
}

const GALLERY: ReadonlyArray<GalleryEntry> = [
  {
    slug: 'editorial',
    Component: HeroEditorial,
    designTitle: 'Calm editorial (close to current)',
  },
  {
    slug: 'declarative',
    Component: HeroDeclarative,
    designTitle: 'Confident / declarative · big type, minimal furniture',
  },
  {
    slug: 'typographic',
    Component: HeroTypographic,
    designTitle: 'Typographic · let the headline carry it',
  },
  {
    slug: 'atmospheric',
    Component: HeroAtmospheric,
    designTitle: 'Atmospheric · soft orb, dark background, ambient',
  },
  {
    slug: 'diagrammatic',
    Component: HeroDiagrammatic,
    designTitle: 'Diagrammatic · journey-as-system illustration',
  },
]

export default function HeroGalleryPage() {
  return (
    <main>
      {GALLERY.map(({ slug, Component, designTitle }) => (
        <section key={slug} aria-label={`Hero variant: ${slug}`}>
          <h2
            style={{
              padding: '40px 56px 12px',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--ds-color-text-muted)',
              borderTop: '1px dashed var(--ds-color-border)',
            }}
          >
            <span>{slug}</span>
            <span
              style={{
                marginLeft: 12,
                fontWeight: 400,
                textTransform: 'none',
                letterSpacing: 0,
                color: 'var(--ds-color-text-sub)',
              }}
            >
              {designTitle}
            </span>
          </h2>
          <Component />
        </section>
      ))}
    </main>
  )
}
