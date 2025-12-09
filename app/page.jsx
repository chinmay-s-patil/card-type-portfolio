import NavDots from './components/NavDots'
import Header from './components/Header'
import LandingNormalized from './sections/LandingNormalized'
import EducationNormalized from './sections/EducationNormalized'
import ExperienceNormalized from './sections/ExperienceNormalized'
import SkillsNormalized from './sections/SkillsNormalized'
import ProjectsNormalized from './sections/ProjectsNormalized'
import OpenFOAMNormalized from './sections/OpenFOAMNormalized'
import EventsNormalized from './sections/EventsNormalized'
import Footer from './components/Footer'

const sectionsMeta = [
  { id: 'landing', label: 'Landing' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'openfoam', label: 'OpenFOAM' },
  { id: 'events', label: 'Events' },
]

export default function Page() {
  return (
    <>
      <Header />
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
        
        <section id="events" className="section">
          <EventsNormalized />
        </section>
        
        {/* Footer as final scroll section (no dot) */}
        <section id="contact" className="section" style={{ minHeight: 'auto', height: 'auto', padding: 0 }}>
          <Footer />
        </section>
      </main>
    </>
  )
}