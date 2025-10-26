import NavDots from './components/NavDots'
import Header from './components/Header'
import SectionWrapper from './components/SectionWrapper'

import Landing from './sections/Landing'
import Education from './sections/Education'
import Experience from './sections/Experience'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import OpenFOAM from './sections/OpenFOAM'
import Events from './sections/Events'
import Footer from './components/Footer'

const sectionsMeta = [
  { id: 'home', label: 'Home' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'openfoam', label: 'OpenFOAM' },
  { id: 'events', label: 'Events' }
]

const sectionComponents = {
  home: Landing,
  education: Education,
  experience: Experience,
  skills: Skills,
  projects: Projects,
  openfoam: OpenFOAM,
  events: Events
}

export default function Home() {
  return (
    <>
      <Header />
      <NavDots sections={sectionsMeta} />
      
      <main id="sections" aria-label="Portfolio sections">
        {sectionsMeta.map((s, idx) => {
          const Comp = sectionComponents[s.id]
          return (
            <SectionWrapper key={s.id} id={s.id} index={idx}>
              <Comp />
            </SectionWrapper>
          )
        })}
        
        {/* Footer as last section */}
        <section 
          id="contact" 
          className="section" 
          style={{ 
            minHeight: 'auto', 
            height: 'auto',
            scrollSnapAlign: 'end',
            padding: 0 
          }}
        >
          <Footer />
        </section>
      </main>
    </>
  )
}