export default function Intro() {
  const SCALE = 0.75; // change this value as needed

  return (
    <div className="max-w-5xl mx-auto">
      <div style={{ transform: `scale(${SCALE})`, transformOrigin: 'center top' }}>
        <div className="kicker">Who I Am</div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          About Me
        </h2>
        
        <p className="muted text-lg md:text-xl leading-relaxed mb-8" style={{ maxWidth: '65ch' }}>
          I'm a mechanical engineer who transitioned into web development with a passion 
          for making complex data accessible. My work bridges the gap between computational 
          fluid dynamics and modern web technologies, creating tools that help teams 
          understand and explore simulation results without requiring deep technical expertise.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="card">
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--accent) / 0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 10L12 13L15 10" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-semibold text-xl mb-2">What I Do</h3>
            <p className="muted" style={{ lineHeight: '1.7' }}>
              CFD simulations, advanced meshing techniques, turbulence modeling, 
              post-processing automation, and interactive web-based visualization dashboards.
            </p>
          </div>

          <div className="card">
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--accent) / 0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-semibold text-xl mb-2">Core Tools</h3>
            <p className="muted" style={{ lineHeight: '1.7' }}>
              OpenFOAM · Ansys Fluent · Python · NumPy · Pandas · 
              Matplotlib · ParaView · Next.js · React · Tailwind CSS
            </p>
          </div>

          <div className="card">
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--accent) / 0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="hsl(var(--accent))" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="font-semibold text-xl mb-2">My Approach</h3>
            <p className="muted" style={{ lineHeight: '1.7' }}>
              Emphasis on reproducible workflows, clean documentation, 
              performance optimization, and user-centered design for technical applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
