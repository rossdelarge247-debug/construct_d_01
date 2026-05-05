import {
  Header,
  HERO_VARIANTS,
  SELECTED_HERO_VARIANT,
  PictureBand,
  Journey,
  FooterMinimal,
} from '@/components/marketing'

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
