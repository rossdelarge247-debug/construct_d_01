import { Header } from '@/components/marketing/sections/header'
import { HERO_VARIANTS, SELECTED_HERO_VARIANT } from '@/components/marketing/heroes'
import { PictureBand } from '@/components/marketing/sections/picture-band'
import { Journey } from '@/components/marketing/sections/journey'
import { FooterMinimal } from '@/components/marketing/sections/footer-minimal'

export default function MarketingLanding() {
  const Hero = HERO_VARIANTS[SELECTED_HERO_VARIANT]
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <PictureBand />
        <Journey />
      </main>
      <FooterMinimal />
    </>
  )
}
