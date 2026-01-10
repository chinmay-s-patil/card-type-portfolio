import dynamic from 'next/dynamic'
import NavDots from './components/NavDots'
import HeaderNormalized from './components/HeaderNormalized'
import Footer from './components/Footer'

// Lazy load heavy sections to reduce initial bundle size
const LandingNormalized = dynamic(() => import('./sections/LandingNormalized'), {
  loading: () => null,
})

const EducationNormalized = dynamic(() => import('./sections/EducationNormalized'), {
  loading: () => null,
})

const ExperienceNormalized = dynamic(() => import('./sections/ExperienceNormalized'), {
  loading: () => null,
})

const SkillsNormalized = dynamic(() => import('./sections/SkillsNormalized'), {
  loading: () => null,
})

const ProjectsNormalized = dynamic(() => import('./sections/ProjectsNormalized'), {
  loading: () => null,
})

const OpenFOAMNormalized = dynamic(() => import('./sections/OpenFOAMNormalized'), {
  loading: () => null,
})

const CADNormalized = dynamic(() => import('./sections/CADglTBNormalized'), {
  loading: () => null,
})

const VisualizationNormalized = dynamic(() => import('./sections/VisualizationNormalized'), {
  loading: () => null,
})

const EventsNormalized = dynamic(() => import('./sections/EventsNormalized'), {
  loading: () => null,
})

const sectionsMeta = [
  { id: 'landing', label: 'Landing' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'openfoam', label: 'OpenFOAM' },
  { id: 'cad', label: 'CAD' },
  { id: 'visualization', label: 'Visualization' },
  { id: 'events', label: 'Events' },
]

export default function Page() {
  return (
    <>
      <HeaderNormalized />
      <NavDots sections={sectionsMeta} />
      
      <main id="sections" aria-label="Portfolio sections">
        <section id="landing" className="section">
          <LandingNormalized />
        </section>

        <section id="education" className="section">
          <EducationNormalized />
        </section>

        <section id="experience" className="section">
          <ExperienceNormalized />
        </section>
        
        <section id="skills" className="section">
          <SkillsNormalized />
        </section>
        
        <section id="projects" className="section">
          <ProjectsNormalized />
        </section>
        
        <section id="openfoam" className="section">
          <OpenFOAMNormalized />
        </section>

        <section id="cad" className="section">
          <CADNormalized />
        </section>

        <section id="visualization" className="section">
          <VisualizationNormalized />
        </section>
        
        <section id="events" className="section">
          <EventsNormalized />
        </section>
        
        <section id="contact" className="section" style={{ minHeight: 'auto', height: 'auto', padding: 0 }}>
          <Footer />
        </section>
      </main>
    </>
  )
}