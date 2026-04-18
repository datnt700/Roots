"use client"

import styled from "@emotion/styled"
import { HeroSection } from "@/components/hero-section"
import { ProblemSection } from "@/components/problem-section"
import { SolutionSection } from "@/components/solution-section"
import { CompetitiveSection } from "@/components/competitive-section"
import { TechSection } from "@/components/tech-section"
import { FinalCTASection } from "@/components/final-cta-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { theme } from "@/lib/theme"

const Main = styled.main({
  minHeight: '100vh',
  backgroundColor: theme.colors.background,
})

export default function Home() {
  return (
    <Main>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <CompetitiveSection />
      <TechSection />
      <FinalCTASection />
      <Footer />
    </Main>
  )
}
