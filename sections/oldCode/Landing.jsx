export default function Landing() {
  const SCALE = 1; // change this value as needed

  return (
    <div className="split">
      <div
        className="hero-content"
        style={{
          transform: `scale(${SCALE})`,
          transformOrigin: 'center top',
        }}
      >
        <div className="kicker">Hello — I'm</div>
        <h1 className="h1">
          Chinmay Patil
          <br />
          <span
            style={{
              background:
                'linear-gradient(135deg, hsl(var(--accent)) 0%, #14ffc8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Fluid Simulations
          </span>{' '}
          & Visual Interfaces
        </h1>
        <p className="h-sub">
          CFD engineer specializing in OpenFOAM and advanced visualization. I
          create reproducible simulation pipelines and build intuitive web
          interfaces that transform complex data into actionable insights for
          engineers and stakeholders.
        </p>

        <div className="cta-row">
          <a className="btn bg-white text-slate-900" href="#projects">
            <span>Explore Projects</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3L8 13M8 13L13 8M8 13L3 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a className="btn bg-white/6 border border-white/10" href="#experience">
            <span>View Experience</span>
          </a>
        </div>

        <div style={{ height: '2rem' }} />

        <div className="cards">
          <div className="card">
            <strong
              style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem' }}
            >
              Core Focus
            </strong>
            <div className="muted" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
              CFD · OpenFOAM · Python · Next.js · Data Visualization
            </div>
          </div>
          <div className="card">
            <strong
              style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem' }}
            >
              Current Status
            </strong>
            <div className="muted" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'hsl(var(--accent))',
                  marginRight: '0.5rem',
                  animation: 'pulse 2s infinite',
                }}
              />
              Available for freelance & collaboration
            </div>
          </div>
        </div>
      </div>

      <aside className="portrait" aria-label="Chinmay Patil">
        <img
          src="/portrait.jpg"
          alt="Chinmay Patil - CFD Engineer and Developer"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </aside>
    </div>
  );
}