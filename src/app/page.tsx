import { HeroSection } from '@/components/hero-section'
import { ProblemSection } from '@/components/problem-section'
import { SolutionSection } from '@/components/solution-section'
import { CompetitiveSection } from '@/components/competitive-section'
import { TechSection } from '@/components/tech-section'
import { FinalCTASection } from '@/components/final-cta-section'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <CompetitiveSection />
      <TechSection />
      <FinalCTASection />
      <Footer />
    </main>
  )
}
