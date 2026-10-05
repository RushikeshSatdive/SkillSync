import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight,
  Award, BarChart3, Bell, BookOpen, Bookmark, BriefcaseBusiness, Calendar,
  Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, Clock3,
  Compass, Copy, Download, FileCheck2, Filter, Flame, GraduationCap,
  Heart, Info, LayoutDashboard, Lightbulb, ListFilter, Menu, MessageCircle,
  MoreHorizontal, Network, Pause, Play, Plus, RotateCcw, Search, Send,
  Settings2, Share2, ShieldCheck, Sparkles, Star, Target, TrendingUp,
  Trophy, Users, WalletCards, X, Zap,
} from 'lucide-react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis,
} from 'recharts'
import {
  activities, demoProfile, journeySteps, learningStages, navGroups, peers,
  routeTitles, skillGaps, skillTags, sourceFacts,
} from './data.js'
import { BrowserRouter, Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

const ToastContext = createContext(() => {})

function useToast() {
  return useContext(ToastContext)
}

function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const showToast = (message, tone = 'success') => {
    setToast({ message, tone, id: Date.now() })
  }
  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 3400)
    return () => window.clearTimeout(timer)
  }, [toast])
  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div className={`toast toast-${toast.tone}`} role="status" key={toast.id}>
          <span className="toast-icon"><Check size={16} /></span>
          <span>{toast.message}</span>
          <button className="icon-button toast-close" onClick={() => setToast(null)} aria-label="Dismiss notification"><X size={15} /></button>
        </div>
      )}
    </ToastContext.Provider>
  )
}

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(value)) } catch { /* local persistence is optional */ }
  }, [key, value])
  return [value, setValue]
}

function Button({ children, variant = 'primary', size = 'md', className = '', icon: Icon, ...props }) {
  return (
    <button className={`button button-${variant} button-${size} ${className}`} {...props}>
      {Icon && <Icon size={size === 'sm' ? 15 : 17} strokeWidth={2} />}
      <span>{children}</span>
    </button>
  )
}

function Badge({ children, tone = 'neutral', dot = false, className = '' }) {
  return <span className={`badge badge-${tone} ${className}`}>{dot && <i />}{children}</span>
}

function Card({ children, className = '', ...props }) {
  return <section className={`card ${className}`} {...props}>{children}</section>
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="section-heading-action">{action}</div>}
    </div>
  )
}

function PageSection({ title, eyebrow, children, action, className = '' }) {
  return (
    <section className={`page-section ${className}`}>
      {(title || eyebrow || action) && <SectionHeading title={title} eyebrow={eyebrow} action={action} />}
      {children}
    </section>
  )
}

function Modal({ open, onClose, title, subtitle, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.() }}>
      <div className={`modal modal-${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={19} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children, hint }) {
  return <label className="field"><span className="field-label">{label}</span>{children}{hint && <small>{hint}</small>}</label>
}

function TextInput(props) {
  return <input className="text-input" {...props} />
}

function Avatar({ peer, size = 'md', online = false }) {
  return <span className={`avatar avatar-${peer.color || 'purple'} avatar-${size}`}>{peer.initials || peer.name?.split(' ').map((x) => x[0]).join('').slice(0, 2)}{online && <i />}</span>
}

function SkillChip({ children, color = 'default', onRemove, onClick, className = '' }) {
  return (
    <span className={`skill-chip skill-${color} ${className}`}>
      {children}
      {onRemove && <button onClick={onRemove} aria-label={`Remove ${children}`}><X size={13} /></button>}
      {onClick && <button onClick={onClick} aria-label={`Open ${children}`}><ChevronRight size={13} /></button>}
    </span>
  )
}

function ProgressBar({ value, target, color = 'purple', label, showValue = true }) {
  return (
    <div className="progress-item">
      <div className="progress-meta"><span>{label}</span>{showValue && <span>{value}%{target ? <em> / {target}% target</em> : null}</span>}</div>
      <div className="progress-track"><span className={`progress-fill fill-${color}`} style={{ width: `${Math.min(value, 100)}%` }} /></div>
      {target && <div className="target-marker" style={{ left: `${Math.min(target, 100)}%` }} />}
    </div>
  )
}

function ProgressRing({ value, label, caption, color = '#6258ed', size = 138, small = false }) {
  return (
    <div className={`ring-wrap ${small ? 'ring-small' : ''}`}>
      <div className="progress-ring" style={{ '--ring-value': `${value}%`, '--ring-color': color, '--ring-size': `${size}px` }}>
        <div className="ring-inner"><strong>{value}%</strong><span>{label}</span></div>
      </div>
      {caption && <span className="ring-caption">{caption}</span>}
    </div>
  )
}

function EmptyChart({ label = 'Source data will appear here' }) {
  return <div className="empty-chart"><div className="empty-chart-mark"><BarChart3 size={23} /></div><span>{label}</span></div>
}

function DemoNotice({ children = 'Illustrative prototype data · not a validated product outcome.' }) {
  return <div className="demo-notice"><Info size={15} /><span>{children}</span></div>
}

function WorkbookNotice({ compact = false }) {
  return (
    <div className={`workbook-notice ${compact ? 'workbook-notice-compact' : ''}`}>
      <span className="workbook-icon"><FileCheck2 size={18} /></span>
      <div><strong>Workbook data not available in this workspace</strong><p>SkillSync_Numeric_Data.xlsx was not present with the project files. No market sizing, pricing, traction or financial figures have been fabricated. Add the source workbook to replace these placeholders.</p></div>
    </div>
  )
}

function Brand({ light = false, onClick }) {
  return (
    <button className={`brand ${light ? 'brand-light' : ''}`} onClick={onClick} aria-label="SkillSync home">
      <span className="brand-mark"><Network size={19} strokeWidth={2.2} /></span>
      <span className="brand-word">skill<span>sync</span></span>
    </button>
  )
}

function AnimatedMetric({ value, label, source, numeric, decimals = 0, suffix = '' }) {
  const [display, setDisplay] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = React.useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') { setDisplay(numeric); return undefined }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setStarted(true)
        observer.disconnect()
      }
    }, { threshold: 0.35 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [numeric])
  useEffect(() => {
    if (!started) return undefined
    const start = performance.now()
    const duration = 1000
    let frame
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(numeric * eased)
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [started, numeric])
  return (
    <div className="metric-card" ref={ref}>
      <strong>{display.toFixed(decimals)}{suffix}</strong>
      <span>{label}</span>
      <small>{source}</small>
    </div>
  )
}

function LandingPage() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const jumpToJourney = () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  return (
    <div className="landing-page">
      <header className="marketing-header">
        <div className="marketing-header-inner">
          <Brand onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          <nav className="marketing-nav"><a href="#why-skillsync">Why SkillSync</a><a href="#how-it-works">How it works</a><a href="#opportunity">Our point of view</a></nav>
          <div className="marketing-actions"><button className="text-button" onClick={jumpToJourney}>See the product <ArrowDownRight size={15} /></button><Button size="sm" onClick={() => navigate('/app/dashboard')}>Explore SkillSync <ArrowRight size={15} /></Button></div>
        </div>
      </header>
      <main>
        <section className="hero-section">
          <div className="hero-glow hero-glow-one" /><div className="hero-glow hero-glow-two" />
          <div className="hero-content">
            <div className="hero-copy">
              <div className="eyebrow-pill"><span className="eyebrow-sparkle"><Sparkles size={14} /></span> THE PEER-POWERED CAREER NETWORK</div>
              <h1>Find the Right Skill.<br /><span>Find the Right Person.</span><br />Build the Right Career.</h1>
              <p className="hero-description">An AI-powered skill development network that helps students identify skill gaps, connect with the right peers, exchange skills and progress toward their career goals.</p>
              <div className="hero-actions"><Button onClick={() => navigate('/app/dashboard')} icon={ArrowRight}>Explore SkillSync</Button><Button variant="outline" onClick={jumpToJourney} icon={Play}>See how it works</Button></div>
              <div className="hero-footnote"><span className="hero-footnote-avatars"><i>S</i><i>A</i><i>P</i></span><span>Built around the power of learning together</span></div>
            </div>
            <HeroNetwork />
          </div>
          <div className="hero-bottom"><span>DISCOVER YOUR NEXT STEP</span><span className="hero-bottom-line" /><span>01 / 03</span></div>
        </section>

        <section className="section-shell problem-section" id="why-skillsync">
          <div className="section-topline"><span>THE REAL GAP</span><span>01 — 03</span></div>
          <div className="problem-intro"><div><div className="eyebrow">CAREER GROWTH, REIMAGINED</div><h2>Students don’t have a learning problem.<br /><span>They have a matching problem.</span></h2></div><p>Information is everywhere. The harder part is knowing what matters next—and finding the right person to learn it with.</p></div>
          <div className="problem-grid">
            {[
              ['01', 'Career goal', 'Aspirations can feel big when the next step is unclear.', Target],
              ['02', 'Unknown skill gap', 'Students often lack a clear map from today’s skills to tomorrow’s role.', Search],
              ['03', 'Generic learning', 'Broad content may not connect to an individual goal or context.', BookOpen],
              ['04', 'The right person', 'Finding a peer with complementary skills takes more than scrolling.', Users],
              ['05', 'Limited practice', 'Concepts become capability when there is space to try, apply and reflect.', Activity],
              ['06', 'Weak skill proof', 'Learning deserves a clearer way to become visible and tangible.', Award],
            ].map(([number, title, body, Icon]) => <div className="problem-card" key={number}><div className="problem-card-top"><span>{number}</span><Icon size={19} /></div><h3>{title}</h3><p>{body}</p></div>)}
          </div>
          <div className="source-stats-row">
            <div className="source-stats-copy"><span className="eyebrow">THE CONTEXT IN INDIA</span><p>Education and employability context—not SkillSync traction.</p></div>
            <div className="source-metrics">{sourceFacts.map((fact, index) => <AnimatedMetric key={fact.label} label={fact.label} source={fact.source} numeric={[4.33, 28.4, 54.81][index]} decimals={[2, 1, 2][index]} suffix={index === 0 ? ' crore' : '%'} />)}</div>
          </div>
        </section>

        <section className="section-shell contrast-section" id="opportunity">
          <div className="section-topline"><span>THE LANDSCAPE</span><span>02 — 03</span></div>
          <div className="contrast-heading"><div><div className="eyebrow">ONE JOURNEY, CONNECTED</div><h2>Every existing option delivers one piece.<br /><span>SkillSync connects the journey.</span></h2></div><p>Each category can play a valuable role. SkillSync’s positioning thesis is to connect the moments between them.</p></div>
          <div className="landscape-grid">
            {[
              { title: 'CONTENT', icon: BookOpen, products: ['YouTube', 'Coursera', 'Udemy'], delivers: 'Information', tint: 'soft-lavender' },
              { title: 'MENTORSHIP', icon: Lightbulb, products: ['Experienced people', 'Career guides'], delivers: 'Guidance', tint: 'soft-peach' },
              { title: 'SOCIAL NETWORKS', icon: Network, products: ['LinkedIn', 'Communities'], delivers: 'Connections', tint: 'soft-blue' },
              { title: 'SKILL EXCHANGE', icon: ArrowLeft, products: ['Peer platforms', 'Study groups'], delivers: 'Exchange', tint: 'soft-mint' },
            ].map(({ title, icon: Icon, products, delivers, tint }) => <div className="landscape-card" key={title}><div className={`landscape-icon ${tint}`}><Icon size={20} /></div><span className="landscape-type">{title}</span><div className="landscape-products">{products.map((item) => <span key={item}>{item}</span>)}</div><div className="landscape-deliver"><span>Provides</span><strong>{delivers}</strong></div></div>)}
          </div>
          <div className="skillsync-positioning"><div className="positioning-mark"><Network size={22} /></div><div className="positioning-title"><span>THE CONNECTIVE LAYER</span><strong>SKILLSYNC</strong></div><div className="positioning-flow"><span>Discovery</span><b>+</b><span>Matching</span><b>+</b><span>Progress</span></div><p>SkillSync positioning thesis. Not a claim that alternatives lack personalization.</p><ArrowRight className="positioning-arrow" size={19} /></div>
        </section>

        <section id="how-it-works" className="section-shell journey-section">
          <div className="section-topline"><span>THE SKILLSYNC LOOP</span><span>03 — 03</span></div>
          <div className="journey-header"><div><div className="eyebrow">FROM INTENTION TO EVIDENCE</div><h2>A learning journey that<br /><span>moves with you.</span></h2></div><p>Explore each moment in the SkillSync experience. Every step is designed to connect learning to a real goal.</p></div>
          <div className="journey-layout">
            <div className="journey-steps">
              {journeySteps.map((step, index) => {
                const Icon = step.icon
                return <button key={step.title} className={`journey-step ${activeStep === index ? 'journey-step-active' : ''}`} onClick={() => setActiveStep(index)}><span className="journey-step-num">{String(index + 1).padStart(2, '0')}</span><span className="journey-step-icon"><Icon size={17} /></span><span className="journey-step-title">{step.title}</span><ChevronRight size={16} className="journey-chevron" /></button>
              })}
            </div>
            <div className="journey-detail-card"><div className="journey-detail-art"><div className="journey-art-orbit orbit-one" /><div className="journey-art-orbit orbit-two" /><div className="journey-art-core"><Sparkles size={27} /></div><span className="journey-art-dot dot-a" /><span className="journey-art-dot dot-b" /><span className="journey-art-dot dot-c" /></div><div className="eyebrow">STEP {String(activeStep + 1).padStart(2, '0')} / 09</div><h3>{journeySteps[activeStep].title}</h3><p>{journeySteps[activeStep].detail}</p><div className="journey-detail-footer"><span><CheckCircle2 size={16} />Designed around your career goal</span><button onClick={() => setActiveStep((activeStep + 1) % journeySteps.length)}>Next step <ArrowRight size={15} /></button></div></div>
          </div>
          <div className="landing-final-cta"><div><span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h2>Make your next skill<br />a shared journey.</h2></div><Button onClick={() => navigate('/app/dashboard')} icon={ArrowRight}>Explore the demo</Button><div className="cta-orb" /></div>
        </section>
      </main>
      <footer className="marketing-footer"><Brand onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} /><span>SkillSync · Frontend product prototype</span><button onClick={() => navigate('/app/dashboard')}>Explore the demo <ArrowRight size={14} /></button></footer>
    </div>
  )
}

function HeroNetwork() {
  const flow = [
    { label: 'Student', icon: GraduationCap, color: 'flow-indigo' },
    { label: 'Skill gap', icon: Target, color: 'flow-violet' },
    { label: 'AI matching', icon: Sparkles, color: 'flow-teal' },
    { label: 'Right peer', icon: Users, color: 'flow-blue' },
    { label: 'Learning', icon: BookOpen, color: 'flow-pink' },
    { label: 'Career goal', icon: Trophy, color: 'flow-indigo' },
  ]
  return (
    <div className="hero-visual">
      <div className="visual-topline"><span><i /> LIVE LEARNING LOOP</span><span>01 / 06</span></div>
      <div className="network-canvas">
        <div className="network-ring ring-large" /><div className="network-ring ring-smallest" />
        <svg className="network-lines" viewBox="0 0 540 370" aria-hidden="true"><path d="M270 42 C370 38 450 100 470 178 C456 275 370 325 270 330 C170 326 90 265 70 178 C84 85 174 45 270 42Z" /><path d="M270 42 L360 118 L470 178 L360 246 L270 330 L174 245 L70 178 L174 108Z" /><path d="M174 108 L360 246 M360 118 L174 245 M70 178 L360 118 M470 178 L174 245" /></svg>
        <div className="network-center"><span className="network-center-orbit" /><span className="network-center-mark"><Network size={31} /></span><strong>SKILLSYNC</strong><small>learning, in sync</small></div>
        {flow.map(({ label, icon: Icon, color }, index) => <div className={`flow-node flow-node-${index + 1} ${color}`} key={label}><span><Icon size={17} /></span><strong>{label}</strong></div>)}
        <div className="floating-skill floating-skill-a">Financial Analysis</div><div className="floating-skill floating-skill-b">Digital Marketing</div><div className="floating-skill floating-skill-c">Python</div><div className="floating-skill floating-skill-d">Data Analytics</div><div className="floating-skill floating-skill-e">Excel</div><div className="floating-skill floating-skill-f">Leadership</div><div className="floating-skill floating-skill-g">Communication</div><div className="floating-skill floating-skill-h">Product Management</div>
      </div>
      <div className="visual-bottom"><span><span className="pulse-dot" /> PERSONALIZED BY DESIGN</span><span>DISCOVER <ArrowRight size={13} /></span></div>
    </div>
  )
}

function Sidebar({ mobileOpen, onClose }) {
  const navigate = useNavigate()
  return (
    <>
      {mobileOpen && <button className="mobile-scrim" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand-row"><Brand light onClick={() => navigate('/')} /><button className="icon-button mobile-close" onClick={onClose} aria-label="Close menu"><X size={18} /></button></div>
        <div className="demo-label"><span className="demo-pulse" /> INTERACTIVE DEMO <span className="demo-label-end">LOCAL ONLY</span></div>
        <div className="sidebar-scroll">
          {navGroups.map((group) => <div className="nav-group" key={group.label}><div className="nav-group-label">{group.label}</div>{group.items.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive || (path === '/app/peer-matching' && window.location.pathname === '/app/peers/aarav') ? 'sidebar-link-active' : ''}`}>
              <Icon size={17} strokeWidth={1.85} /><span>{label}</span>{label === 'AI skill gap' && <span className="nav-new">AI</span>}
            </NavLink>
          ))}</div>)}
        </div>
        <div className="sidebar-bottom-card"><div className="sidebar-bottom-icon"><Sparkles size={16} /></div><div><strong>Small steps, big momentum.</strong><span>Your next skill is one peer away.</span></div><ChevronRight size={15} /></div>
        <button className="sidebar-profile" onClick={() => navigate('/app/skill-profile')}><span className="profile-avatar">SJ</span><span className="sidebar-profile-copy"><strong>Sakshi Jadhav</strong><small>Demo student profile</small></span><MoreHorizontal size={18} /></button>
      </aside>
    </>
  )
}

function AppTopbar({ title, subtitle, onMenu }) {
  const [query, setQuery] = useState('')
  const [noticesOpen, setNoticesOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const navigate = useNavigate()
  const allPages = navGroups.flatMap((group) => group.items)
  const matches = query.trim() ? [
    ...allPages.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())).slice(0, 3).map((item) => ({ type: 'page', ...item })),
    ...peers.filter((peer) => peer.name.toLowerCase().includes(query.toLowerCase()) || [...peer.canTeach, ...peer.wantsToLearn].some((skill) => skill.toLowerCase().includes(query.toLowerCase()))).slice(0, 3).map((peer) => ({ type: 'peer', peer })),
  ].slice(0, 5) : []
  return (
    <header className="app-topbar">
      <div className="topbar-title-wrap"><button className="icon-button topbar-menu" onClick={onMenu} aria-label="Open navigation"><Menu size={20} /></button><div className="topbar-heading"><h1>{title}</h1><p>{subtitle}</p></div></div>
      <div className="topbar-actions">
        <div className="global-search"><Search size={17} /><input aria-label="Search SkillSync" placeholder="Search skills, people..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') setQuery('') }} /><kbd>⌘ K</kbd>{query && <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}
          {query && <div className="search-popover">{matches.length ? matches.map((match) => <button key={match.type === 'peer' ? match.peer.id : match.path} onClick={() => { navigate(match.type === 'peer' ? `/app/peers/${match.peer.id}` : match.path); setQuery('') }}>{match.type === 'peer' ? <><Avatar peer={match.peer} size="xs" /><span><strong>{match.peer.name}</strong><small>{match.peer.canTeach[0]} · peer</small></span></> : <><match.icon size={16} /><span><strong>{match.label}</strong><small>Open page</small></span></>}<ChevronRight size={14} /></button>) : <div className="search-empty">No matches yet. Try a skill or page name.</div>}</div>}
        </div>
        <div className="topbar-popover-wrap"><button className={`icon-button topbar-notification ${noticesOpen ? 'icon-button-active' : ''}`} onClick={() => { setNoticesOpen(!noticesOpen); setHelpOpen(false) }} aria-label="Notifications"><Bell size={18} /><i /></button>{noticesOpen && <div className="notification-popover"><div className="popover-heading"><strong>Updates</strong><Badge tone="purple">Demo</Badge></div><button onClick={() => { navigate('/app/peer-matching'); setNoticesOpen(false) }}><span className="notification-dot notification-lilac"><Users size={15} /></span><span><strong>A peer is ready to meet</strong><small>Explore complementary skills in your network.</small></span></button><button onClick={() => { navigate('/app/learning-path'); setNoticesOpen(false) }}><span className="notification-dot notification-mint"><Zap size={15} /></span><span><strong>Your next step is waiting</strong><small>Pick up your learning path where you left off.</small></span></button><div className="popover-foot">Notifications are part of this local demo</div></div>}</div>
        <div className="topbar-popover-wrap"><button className="icon-button help-button" onClick={() => setHelpOpen(!helpOpen)} aria-label="Help"><CircleHelp size={18} /></button>{helpOpen && <div className="help-popover"><strong>Need a hand?</strong><p>SkillSync is a frontend prototype. Interactions are simulated and saved in this browser only.</p><button onClick={() => { navigate('/app/about'); setHelpOpen(false) }}>About the prototype <ArrowRight size={14} /></button></div>}</div>
        <div className="topbar-demo-pill"><span /> Demo mode</div>
      </div>
    </header>
  )
}

function MobileDock() {
  const links = [
    { label: 'Home', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Skills', path: '/app/skill-gap', icon: Sparkles },
    { label: 'Peers', path: '/app/peer-matching', icon: Users },
    { label: 'Community', path: '/app/community', icon: Heart },
  ]
  return <nav className="mobile-dock">{links.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} className={({ isActive }) => `dock-link ${isActive ? 'dock-link-active' : ''}`}><Icon size={19} /><span>{label}</span></NavLink>)}</nav>
}

function AppShell() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const titleDetails = location.pathname.startsWith('/app/peers/') ? [`${peers.find((peer) => peer.id === location.pathname.split('/').pop())?.name || 'Peer'}’s profile`, 'A closer look at a potential learning exchange.'] : routeTitles[location.pathname] || routeTitles['/app/dashboard']
  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="app-main"><AppTopbar title={titleDetails[0]} subtitle={titleDetails[1]} onMenu={() => setMobileOpen(true)} /><div className="app-content"><Outlet /></div><MobileDock /></div>
    </div>
  )
}

function StatTile({ label, value, note, icon: Icon, tint = 'purple', trend }) {
  return <div className="stat-tile"><div className={`stat-icon stat-${tint}`}><Icon size={17} /></div><span className="stat-label">{label}</span><strong>{value}</strong><small>{note}{trend && <em><TrendingUp size={12} />{trend}</em>}</small></div>
}

const dashboardChartData = [
  { day: 'M', minutes: 22 }, { day: 'T', minutes: 38 }, { day: 'W', minutes: 29 },
  { day: 'T', minutes: 52 }, { day: 'F', minutes: 39 }, { day: 'S', minutes: 67 }, { day: 'S', minutes: 48 },
]

function DashboardPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [completedStages] = usePersistentState('skillsync-learning-completed', [])
  const [completedActivities] = usePersistentState('skillsync-activities-completed', [])
  const [profile] = usePersistentState('skillsync-profile', demoProfile)
  const [showAll, setShowAll] = useState(false)
  const progress = Math.min(100, Math.max(72, Math.round(72 + completedStages.length * 3)))
  const displayPeers = showAll ? peers : peers.slice(0, 3)
  return (
    <div className="page-stack dashboard-page">
      <div className="welcome-banner"><div className="welcome-orb welcome-orb-a" /><div className="welcome-orb welcome-orb-b" /><div className="welcome-copy"><span className="welcome-kicker"><Sparkles size={14} /> YOUR WEEKLY MOMENTUM</span><h2>Make your next move<br />a <span>shared one.</span></h2><p>Each skill you practice brings {profile.goal} a little closer.</p><Button size="sm" variant="light" onClick={() => navigate('/app/learning-path')} icon={ArrowRight}>Continue learning</Button></div><div className="welcome-ring"><ProgressRing value={progress} label="ready" caption="Career readiness" color="#b7f4df" size={144} /></div><div className="welcome-steps"><span><i className="step-dot step-done" />PROFILE</span><i className="step-line" /><span><i className="step-dot step-active" />PRACTICE</span><i className="step-line" /><span><i className="step-dot" />PROOF</span></div></div>
      <div className="demo-inline"><Info size={14} /> Demo student profile · Sample values are illustrative and do not represent verified product outcomes.</div>
      <div className="stat-grid">
        <StatTile label="Career readiness" value={`${progress}%`} note="Sample demo score" icon={Target} tint="purple" />
        <StatTile label="Learning streak" value="12 days" note="Demo profile value" icon={Flame} tint="orange" />
        <StatTile label="Skills completed" value={6 + completedStages.length} note="Progress updates locally" icon={Award} tint="teal" />
        <StatTile label="Practice hours" value="18.5 hrs" note="Demo profile value" icon={Clock3} tint="blue" />
        <StatTile label="Peer sessions" value="12" note="Illustrative profile value" icon={Users} tint="purple" />
      </div>
      <div className="dashboard-grid-main">
        <Card className="career-card"><div className="card-header-line"><div><span className="eyebrow">YOUR NORTH STAR</span><h3>{profile.goal}</h3><p>Career goal · Set in your skill profile</p></div><button className="icon-button" onClick={() => navigate('/app/skill-profile')} aria-label="Edit career goal"><Settings2 size={17} /></button></div><div className="career-card-content"><div className="career-readiness-ring"><ProgressRing value={progress} label="ready" caption="Career readiness" color="#635bff" size={156} /></div><div className="career-skill-list"><span className="mini-label">NEXT SKILLS TO BUILD</span>{skillGaps.map((skill) => <button key={skill.name} className="career-skill-row" onClick={() => navigate('/app/skill-gap')}><span className={`skill-bullet bullet-${skill.tone}`} /><span>{skill.name}</span><ArrowUpRight size={15} /></button>)}<Button variant="soft" size="sm" onClick={() => navigate('/app/skill-gap')}>Explore your skill gap <ArrowRight size={14} /></Button></div></div></Card>
        <Card className="activity-chart-card"><div className="card-header-line"><div><span className="eyebrow">YOUR PRACTICE RHYTHM</span><h3>A little progress, often.</h3></div><button className="chart-menu" onClick={() => toast('This chart shows an illustrative demo practice pattern.', 'info')} aria-label="About this chart"><MoreHorizontal size={18} /></button></div><div className="chart-legend"><span><i /> Practice pattern</span><Badge tone="neutral">Illustrative</Badge></div><div className="practice-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={dashboardChartData} margin={{ top: 12, right: 4, left: -22, bottom: 0 }}><defs><linearGradient id="practiceGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6a5af9" stopOpacity={0.23} /><stop offset="95%" stopColor="#6a5af9" stopOpacity={0.015} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#eef0f6" strokeDasharray="4 5" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9298aa', fontSize: 11 }} /><YAxis hide domain={[0, 80]} /><ChartTooltip cursor={{ stroke: '#c9c4ff', strokeDasharray: '4 4' }} contentStyle={{ borderRadius: 12, borderColor: '#e8e8f0', fontSize: 12 }} labelStyle={{ color: '#7d8293' }} formatter={(value) => [`${value} min`, 'Practice']} /><Area type="monotone" dataKey="minutes" stroke="#6258ed" strokeWidth={2.7} fill="url(#practiceGradient)" activeDot={{ r: 5, fill: '#6258ed', stroke: '#fff', strokeWidth: 2 }} /></AreaChart></ResponsiveContainer></div><div className="chart-footnote"><span><Clock3 size={13} /> Time blocks are illustrative demo data</span><button onClick={() => navigate('/app/progress')}>View progress <ArrowRight size={14} /></button></div></Card>
      </div>
      <div className="dashboard-grid-lower">
        <Card className="top-match-card"><div className="card-header-line"><div><span className="eyebrow">A COMPLEMENTARY SKILL</span><h3>Your top match</h3></div><Badge tone="mint" dot>Potential peer</Badge></div><div className="featured-peer"><Avatar peer={peers[0]} size="lg" online /><div className="featured-peer-info"><strong>{peers[0].name}</strong><span>Brand Management</span><div className="peer-skill-pair"><span>Teaches Digital Marketing</span><ArrowRight size={12} /><span>Wants Financial Analysis</span></div></div><div className="match-bubble"><strong>94%</strong><small>example</small></div></div><div className="match-reason"><Sparkles size={15} /><span>Complementary teach-and-learn skills</span></div><div className="card-bottom-actions"><Button size="sm" onClick={() => navigate('/app/peers/aarav')}>View profile <ArrowRight size={14} /></Button><button className="text-button" onClick={() => { navigator.clipboard?.writeText('SkillSync peer match: Aarav Mehta').catch(() => {}); toast('Demo match summary copied locally.') }}><Share2 size={14} /> Share</button></div><div className="mini-disclaimer">Match percentage is an illustrative product example.</div></Card>
        <Card className="recent-card"><div className="card-header-line"><div><span className="eyebrow">KEEP THE MOMENTUM</span><h3>Recent activity</h3></div><button className="text-button" onClick={() => navigate('/app/progress')}>See all <ArrowRight size={14} /></button></div><div className="recent-list"><div className="recent-item"><span className="recent-icon recent-purple"><Target size={15} /></span><div><strong>Career goal added</strong><span>{profile.goal}</span></div><small>Today</small></div><div className="recent-item"><span className="recent-icon recent-teal"><Users size={15} /></span><div><strong>Peer profile explored</strong><span>Aarav Mehta · skill exchange</span></div><small>Recent</small></div><div className="recent-item"><span className="recent-icon recent-blue"><CheckCircle2 size={15} /></span><div><strong>{completedActivities.length ? 'Activity completed' : 'A practice session is ready'}</strong><span>{completedActivities.length ? `${completedActivities.length} activity saved in this browser` : 'Choose a 20-minute activity'}</span></div><small>Next</small></div></div><button className="recent-activity-cta" onClick={() => navigate('/app/activities')}><span><Play size={14} fill="currentColor" /> Start a 20-minute activity</span><ChevronRight size={16} /></button></Card>
      </div>
      <PageSection title="Peers to learn with" eyebrow="YOUR NETWORK STARTS HERE" action={<button className="text-button" onClick={() => navigate('/app/peer-matching')}>Find your match <ArrowRight size={14} /></button>}>
        <div className="peer-preview-grid">{displayPeers.map((peer) => <PeerPreviewCard key={peer.id} peer={peer} onOpen={() => navigate(`/app/peers/${peer.id}`)} onConnect={() => toast('Connection request simulated successfully.')} />)}</div>
        {peers.length > 3 && <button className="load-more-link" onClick={() => setShowAll(!showAll)}>{showAll ? 'Show fewer peers' : 'Show more peers'} <ChevronDown size={15} className={showAll ? 'rotate-up' : ''} /></button>}
      </PageSection>
    </div>
  )
}

function PeerPreviewCard({ peer, onOpen, onConnect }) {
  const [saved, setSaved] = usePersistentState('skillsync-saved-matches', [])
  const isSaved = saved.includes(peer.id)
  const toggleSave = () => setSaved(isSaved ? saved.filter((id) => id !== peer.id) : [...saved, peer.id])
  return <Card className="peer-preview-card"><div className="peer-preview-top"><Avatar peer={peer} size="md" /><button className={`icon-button save-icon ${isSaved ? 'saved' : ''}`} onClick={toggleSave} aria-label={isSaved ? 'Unsave peer' : 'Save peer'}><Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} /></button></div><strong>{peer.name}</strong><span className="peer-preview-goal">{peer.careerGoal}</span><div className="peer-mini-pair"><span className="mini-label">CAN TEACH</span><SkillChip color="lilac">{peer.canTeach[0]}</SkillChip></div><div className="peer-mini-pair"><span className="mini-label">WANTS TO LEARN</span><SkillChip color="mint">{peer.wantsToLearn[0]}</SkillChip></div><div className="peer-preview-actions"><button className="text-button" onClick={onOpen}>View profile <ArrowRight size={13} /></button><button className="icon-button small-connect" onClick={onConnect} aria-label={`Connect with ${peer.name}`}><ArrowUpRight size={15} /></button></div></Card>
}

function SkillProfilePage() {
  const toast = useToast()
  const [profile, setProfile] = usePersistentState('skillsync-profile', demoProfile)
  const [newSkill, setNewSkill] = useState('')
  const [addingTo, setAddingTo] = useState('')
  const addSkill = (field) => {
    const clean = newSkill.trim()
    if (!clean) return
    if (!profile[field].some((item) => item.toLowerCase() === clean.toLowerCase())) setProfile({ ...profile, [field]: [...profile[field], clean] })
    setNewSkill('')
    setAddingTo('')
  }
  const removeSkill = (field, skill) => setProfile({ ...profile, [field]: profile[field].filter((item) => item !== skill) })
  return (
    <div className="page-stack">
      <div className="profile-cover"><div className="profile-cover-art"><span /><span /><span /><Network size={46} /></div><div className="profile-cover-copy"><Badge tone="purple">PERSONAL SKILL MAP</Badge><h2>Your strengths have a story.</h2><p>Make it easier for the right learning opportunities to find you.</p></div><div className="profile-cover-avatar">SJ<span><CheckCircle2 size={16} /></span></div></div>
      <div className="profile-columns"><div className="page-stack">
        <Card className="profile-edit-card"><div className="card-title-row"><div><h3>About your direction</h3><p>What are you working toward?</p></div><Badge tone="mint" dot>Saved locally</Badge></div><Field label="Career goal" hint="A career direction helps focus your skill gap and peer recommendations."><div className="input-with-icon"><Target size={16} /><TextInput value={profile.goal} onChange={(e) => setProfile({ ...profile, goal: e.target.value })} placeholder="e.g. Product Design" /></div></Field><Field label="Career context"><textarea className="text-area" defaultValue="I'm building practical skills for the next step in my career journey." onChange={(e) => window.localStorage.setItem('skillsync-profile-context', e.target.value)} /></Field><div className="profile-save-row"><span><ShieldCheck size={15} />Your profile stays in this browser.</span><Button size="sm" onClick={() => toast('Your skill profile is saved on this device.')}>Save changes <Check size={14} /></Button></div></Card>
        <Card className="skill-editor-card"><div className="card-title-row"><div><h3>Skills I can teach</h3><p>Share strengths that could help a peer move forward.</p></div><span className="skill-count-badge">{profile.teaches.length} skill{profile.teaches.length === 1 ? '' : 's'}</span></div><div className="editable-chip-list">{profile.teaches.map((skill) => <SkillChip key={skill} color="purple" onRemove={() => removeSkill('teaches', skill)}>{skill}</SkillChip>)}{addingTo === 'teaches' ? <form className="add-skill-form" onSubmit={(e) => { e.preventDefault(); addSkill('teaches') }}><input autoFocus value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Type a skill" onKeyDown={(e) => { if (e.key === 'Escape') setAddingTo('') }} /><button type="submit"><Check size={13} /></button><button type="button" onClick={() => setAddingTo('')}><X size={13} /></button></form> : <button className="add-chip-button" onClick={() => { setNewSkill(''); setAddingTo('teaches') }}><Plus size={14} /> Add skill</button>}</div></Card>
        <Card className="skill-editor-card"><div className="card-title-row"><div><h3>Skills I want to learn</h3><p>Be curious. Your learning goals help shape a balanced exchange.</p></div><span className="skill-count-badge">{profile.wants.length} skill{profile.wants.length === 1 ? '' : 's'}</span></div><div className="editable-chip-list">{profile.wants.map((skill) => <SkillChip key={skill} color="mint" onRemove={() => removeSkill('wants', skill)}>{skill}</SkillChip>)}{addingTo === 'wants' ? <form className="add-skill-form" onSubmit={(e) => { e.preventDefault(); addSkill('wants') }}><input autoFocus value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Type a skill" onKeyDown={(e) => { if (e.key === 'Escape') setAddingTo('') }} /><button type="submit"><Check size={13} /></button><button type="button" onClick={() => setAddingTo('')}><X size={13} /></button></form> : <button className="add-chip-button" onClick={() => { setNewSkill(''); setAddingTo('wants') }}><Plus size={14} /> Add skill</button>}</div></Card>
      </div><div className="page-stack profile-side-column"><Card className="profile-completeness"><span className="eyebrow">PROFILE SNAPSHOT</span><div className="profile-mini-ring"><ProgressRing value={84} label="complete" color="#23bca3" size={108} /></div><h3>You're off to a strong start.</h3><p>A more specific profile makes it easier to spot useful skill exchanges.</p><div className="profile-check-list"><span><CheckCircle2 size={15} />Career goal added</span><span><CheckCircle2 size={15} />Teaching skill added</span><span><CheckCircle2 size={15} />Learning goal added</span><span className="check-muted"><CircleHelp size={15} />Add a short introduction</span></div><DemoNotice>Profile completeness is illustrative demo UI, not a measured outcome.</DemoNotice></Card><Card className="profile-tip-card"><div className="tip-icon"><Lightbulb size={19} /></div><span className="eyebrow">PROFILE TIP</span><h3>Make it easy to say yes.</h3><p>A specific skill and an example of how you use it can help peers understand what you bring to an exchange.</p><button className="text-button" onClick={() => document.querySelector('.text-area')?.focus()}>Add a short intro <ArrowRight size={14} /></button></Card></div></div>
    </div>
  )
}

function SkillGapPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [activeSkill, setActiveSkill] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [generated, setGenerated] = usePersistentState('skillsync-path-generated', false)
  const [goal] = usePersistentState('skillsync-profile', demoProfile)
  const generate = () => {
    if (analyzing) return
    setAnalyzing(true)
    window.setTimeout(() => { setAnalyzing(false); setGenerated(true); toast('Personalized learning path generated.') }, 1550)
  }
  return (
    <div className="page-stack">
      <div className="gap-hero"><div className="gap-hero-orb"><div className="gap-orbit orbit-a" /><div className="gap-orbit orbit-b" /><div className="gap-orbit-center"><Sparkles size={25} /></div><span className="gap-orbit-dot" /></div><div className="gap-hero-copy"><Badge tone="purple" dot>SIMULATED ANALYSIS</Badge><h2>Your career goal is a direction.<br /><span>Let’s map the bridge.</span></h2><p>This product demo compares your current skills with a sample role-oriented skill map. It does not use live AI or external career data.</p><div className="gap-goal-line"><span>CAREER GOAL</span><strong><BriefcaseBusiness size={16} />{goal.goal}</strong><button className="text-button" onClick={() => navigate('/app/skill-profile')}>Edit <ArrowUpRight size={13} /></button></div></div><div className="gap-hero-side"><span className="gap-side-label">YOUR SKILL MAP</span><div className="gap-side-chips">{goal.currentSkills.map((skill, index) => <SkillChip key={skill} color={['purple', 'blue', 'mint'][index % 3]}>{skill}</SkillChip>)}</div><span className="gap-side-divider" /><span className="gap-side-label">ROLE-ALIGNED SKILLS</span><div className="gap-side-chips"><SkillChip color="orange">Financial Modelling</SkillChip><SkillChip color="rose">Valuation</SkillChip><SkillChip color="blue">Advanced Excel</SkillChip></div></div></div>
      <div className="analysis-header"><div><div className="eyebrow">YOUR CAREER SKILL GAP</div><h2>Current skills <ArrowRight size={17} /> role-aligned skills</h2></div><Badge tone="neutral"><Info size={13} /> Sample skill map</Badge></div>
      <div className="gap-grid">{skillGaps.map((skill, index) => <button key={skill.name} className={`gap-skill-card ${activeSkill === index ? 'gap-skill-card-open' : ''}`} onClick={() => setActiveSkill(activeSkill === index ? null : index)}><div className="gap-skill-card-head"><span className={`gap-skill-icon gap-icon-${skill.tone}`}>{index === 0 ? <BarChart3 size={17} /> : index === 1 ? <Target size={17} /> : <Activity size={17} />}</span><span className="gap-skill-title"><strong>{skill.name}</strong><small>Investment Banking skill map</small></span><ChevronDown size={16} className={activeSkill === index ? 'rotate-up' : ''} /></div><div className="gap-bars"><div className="gap-bar-meta"><span>Current profile</span><strong>{skill.current}%</strong></div><div className="progress-track"><span className={`progress-fill fill-${skill.tone}`} style={{ width: `${skill.current}%` }} /></div><div className="gap-bar-meta target-meta"><span>Illustrative target</span><strong>{skill.target}%</strong></div><div className="progress-track target-track"><span className={`progress-fill fill-${skill.tone} target-fill`} style={{ width: `${skill.target}%` }} /></div></div>{activeSkill === index && <div className="gap-expanded"><span><Sparkles size={14} />A suggested focus for your next learning cycle.</span><span>Tap to collapse <ChevronDown size={13} /></span></div>}</button>)}</div>
      <DemoNotice>Skill levels and targets are illustrative product examples. They are not assessments or validated role requirements.</DemoNotice>
      <div className="generate-path-panel"><div className="generate-panel-icon"><Sparkles size={22} /></div><div className="generate-panel-copy"><span className="eyebrow">YOUR NEXT STEP</span><h3>{generated ? 'Your learning path is ready.' : 'Turn your skill gap into a learning path.'}</h3><p>{generated ? 'A sample sequence is ready to explore. You can adjust progress as you practice.' : 'A simulated product interaction will shape a sample sequence around your selected career goal.'}</p></div><Button onClick={generated ? () => navigate('/app/learning-path') : generate} disabled={analyzing} icon={analyzing ? undefined : generated ? ArrowRight : Sparkles}>{analyzing ? <><span className="button-spinner" />AI is analyzing your career goal…</> : generated ? 'View learning path' : 'Generate learning path'}</Button></div>
      {analyzing && <div className="analysis-loading"><span className="loading-orb"><Sparkles size={18} /></span><span><strong>AI is analyzing your career goal…</strong><small>Comparing your demo skill profile with a sample role map.</small></span><span className="loading-dots"><i /><i /><i /></span></div>}
    </div>
  )
}

function MatchScoreCard() {
  const components = [
    ['Skill compatibility', 95, 'purple'], ['Career alignment', 92, 'blue'],
    ['Learning preference', 90, 'mint'], ['Availability', 88, 'orange'],
  ]
  return <Card className="match-score-card"><div className="match-score-head"><div><span className="eyebrow">MATCH SNAPSHOT</span><h3>Why this connection?</h3></div><span className="match-score-status"><span />Illustrative</span></div><div className="match-score-center"><div className="score-ring"><div><strong>94%</strong><span>Top match</span></div></div><div className="score-center-copy"><strong>A complementary exchange.</strong><span>Aarav can teach Digital Marketing and wants to learn Financial Analysis.</span></div></div><div className="match-score-breakdown">{components.map(([label, value, color]) => <div className="score-breakdown-row" key={label}><span>{label}</span><div className="score-mini-track"><i className={`fill-${color}`} style={{ width: `${value}%` }} /></div><strong>{value}%</strong></div>)}</div><div className="match-score-disclaimer"><Info size={14} />94% is an illustrative product example and not a validated outcome.</div></Card>
}

function PeerMatchingPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('skill') || '')
  const [skill, setSkill] = useState('')
  const [career, setCareer] = useState('')
  const [availability, setAvailability] = useState('')
  const [level, setLevel] = useState('')
  const [preference, setPreference] = useState('')
  const [sortBy, setSortBy] = useState('Highest Match')
  const [showFilters, setShowFilters] = useState(true)
  const [saved, setSaved] = usePersistentState('skillsync-saved-matches', [])
  const [profile] = usePersistentState('skillsync-profile', demoProfile)
  const filtered = useMemo(() => {
    let result = [...peers].filter((peer) => {
      const term = query.toLowerCase().trim()
      const matchesQuery = !term || peer.name.toLowerCase().includes(term) || peer.careerGoal.toLowerCase().includes(term) || [...peer.canTeach, ...peer.wantsToLearn].some((item) => item.toLowerCase().includes(term))
      const matchesSkill = !skill || [...peer.canTeach, ...peer.wantsToLearn].includes(skill)
      const matchesCareer = !career || peer.careerGoal === career
      const matchesAvailability = !availability || peer.availabilityFilter === availability
      const matchesLevel = !level || peer.skillLevel === level
      const matchesPreference = !preference || peer.learningStyle === preference
      return matchesQuery && matchesSkill && matchesCareer && matchesAvailability && matchesLevel && matchesPreference
    })
    if (sortBy === 'Highest Match') result.sort((a, b) => (b.score || -1) - (a.score || -1))
    if (sortBy === 'Most Relevant') result.sort((a, b) => Number(b.wantsToLearn.some((x) => profile.teaches.includes(x)) || b.canTeach.some((x) => profile.wants.includes(x))) - Number(a.wantsToLearn.some((x) => profile.teaches.includes(x)) || a.canTeach.some((x) => profile.wants.includes(x))))
    if (sortBy === 'Recently Added') result.reverse()
    return result
  }, [query, skill, career, availability, level, preference, sortBy, profile])
  const clearFilters = () => { setQuery(''); setSkill(''); setCareer(''); setAvailability(''); setLevel(''); setPreference(''); setParams({}) }
  const toggleSave = (id) => setSaved(saved.includes(id) ? saved.filter((savedId) => savedId !== id) : [...saved, id])
  const optionValues = (key) => [...new Set(peers.map((peer) => peer[key]))]
  return (
    <div className="page-stack">
      <div className="match-page-hero"><div className="match-page-hero-copy"><Badge tone="mint" dot>PEER-POWERED LEARNING</Badge><h2>Find the right person<br /><span>to learn forward with.</span></h2><p>Look for a complementary skill exchange, aligned career curiosity, and a learning style that feels right to you.</p><div className="match-search-large"><Search size={18} /><input placeholder="Search by skill, person or career goal" value={query} onChange={(e) => setQuery(e.target.value)} /><kbd>Enter</kbd></div><div className="match-hero-meta"><span><Users size={15} /> Example peer profiles</span><span><ShieldCheck size={15} /> Demo-only matching</span></div></div><div className="match-hero-art"><div className="match-art-orbit orbit-a" /><div className="match-art-orbit orbit-b" /><div className="match-art-person person-a"><Avatar peer={peers[0]} size="md" /></div><div className="match-art-person person-b"><span><span>Y</span></span></div><div className="match-art-center"><Network size={22} /><span>skills<br />in sync</span></div><div className="match-art-dot d-one" /><div className="match-art-dot d-two" /><div className="match-art-dot d-three" /></div></div>
      <div className="matching-layout"><div className="matching-main"><div className="matching-toolbar"><div><span className="eyebrow">PEOPLE TO LEARN WITH</span><h2>Peer matches <span>{filtered.length} examples</span></h2></div><div className="matching-toolbar-actions"><button className={`filter-toggle ${showFilters ? 'filter-toggle-on' : ''}`} onClick={() => setShowFilters(!showFilters)}><Filter size={15} /> Filters <ChevronDown size={14} /></button><label className="select-wrap sort-select"><ListFilter size={14} /><select value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option>Highest Match</option><option>Most Relevant</option><option>Recently Added</option></select><ChevronDown size={14} /></label></div></div>
        {showFilters && <div className="filter-bar"><label className="select-wrap"><span>Skill</span><select value={skill} onChange={(e) => setSkill(e.target.value)}><option value="">Any skill</option>{[...new Set(peers.flatMap((peer) => [...peer.canTeach, ...peer.wantsToLearn]))].sort().map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></label><label className="select-wrap"><span>Career goal</span><select value={career} onChange={(e) => setCareer(e.target.value)}><option value="">Any goal</option>{optionValues('careerGoal').map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></label><label className="select-wrap"><span>Availability</span><select value={availability} onChange={(e) => setAvailability(e.target.value)}><option value="">Any time</option>{optionValues('availabilityFilter').map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></label><label className="select-wrap"><span>Skill level</span><select value={level} onChange={(e) => setLevel(e.target.value)}><option value="">Any level</option>{optionValues('skillLevel').map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></label><label className="select-wrap"><span>Learning style</span><select value={preference} onChange={(e) => setPreference(e.target.value)}><option value="">Any style</option>{optionValues('learningStyle').map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></label><button className="clear-filter" onClick={clearFilters}>Clear</button></div>}
        {filtered.length ? <div className="match-cards-grid">{filtered.map((peer, index) => <PeerMatchCard key={peer.id} peer={peer} isSaved={saved.includes(peer.id)} onSave={() => toggleSave(peer.id)} onProfile={() => navigate(`/app/peers/${peer.id}`)} onConnect={() => toast('Connection request simulated successfully.')} featured={index === 0 && peer.id === 'aarav'} />)}</div> : <div className="no-results"><Search size={24} /><h3>No peers match those filters yet.</h3><p>Try broadening the skill or availability filters.</p><Button variant="soft" size="sm" onClick={clearFilters}>Clear all filters</Button></div>}
        <DemoNotice>Peer profiles are illustrative examples. Match scores are shown only where explicitly labeled as a demo example.</DemoNotice>
      </div><div className="matching-side"><MatchScoreCard /><Card className="match-preferences-card"><div className="mini-icon-bubble"><Sparkles size={16} /></div><span className="eyebrow">A GOOD MATCH IS MUTUAL</span><h3>It’s more than a score.</h3><p>SkillSync is designed to surface complementary strengths—not to replace a conversation or your own judgment.</p><div className="match-values"><span><Check size={14} />What you can share</span><span><Check size={14} />What you want to learn</span><span><Check size={14} />How you like to learn</span></div><button className="text-button" onClick={() => navigate('/app/skill-profile')}>Tune your profile <ArrowRight size={14} /></button></Card></div></div>
    </div>
  )
}

function PeerMatchCard({ peer, isSaved, onSave, onProfile, onConnect, featured }) {
  return <Card className={`peer-match-card ${featured ? 'peer-match-featured' : ''}`}><div className="peer-card-top"><Avatar peer={peer} size="lg" online /><button className={`icon-button save-icon ${isSaved ? 'saved' : ''}`} onClick={onSave} aria-label={isSaved ? 'Remove saved match' : 'Save match'}><Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} /></button></div><div className="peer-match-identity"><div><h3>{peer.name}</h3><p>{peer.careerGoal}</p></div>{peer.score ? <div className="peer-score"><strong>{peer.score}%</strong><small>illustrative</small></div> : <Badge tone="mint">{peer.fitLabel}</Badge>}</div><div className="peer-match-swap"><div><span>CAN TEACH</span>{peer.canTeach.slice(0, 2).map((item) => <SkillChip key={item} color="lilac">{item}</SkillChip>)}</div><ArrowDown size={15} /><div><span>WANTS TO LEARN</span>{peer.wantsToLearn.slice(0, 2).map((item) => <SkillChip key={item} color="mint">{item}</SkillChip>)}</div></div><div className="peer-match-meta"><span><Calendar size={14} />{peer.availability}</span><span><BookOpen size={14} />{peer.learningStyle} learner</span></div>{featured && <div className="peer-match-why"><Sparkles size={14} /><span>Complementary teaching and learning skills · Aligned learning preferences · Compatible availability</span></div>}<div className="peer-match-actions"><Button size="sm" variant="outline" onClick={onProfile}>View profile</Button><Button size="sm" onClick={onConnect} icon={ArrowRight}>Connect</Button></div></Card>
}

function PeerProfilePage() {
  const { peerId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const peer = peers.find((item) => item.id === peerId) || peers[0]
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [sessionFocus, setSessionFocus] = useState(peer.canTeach[0])
  const [scheduleTime, setScheduleTime] = useState('Weekday evening')
  const [tab, setTab] = useState('About')
  return (
    <div className="page-stack">
      <button className="back-link" onClick={() => navigate('/app/peer-matching')}><ArrowLeft size={15} /> Back to peer matching</button>
      <div className="peer-profile-hero"><div className="peer-profile-cover-shapes"><span /><span /><span /><i /></div><div className="peer-profile-main"><Avatar peer={peer} size="xl" online /><div className="peer-profile-name"><div className="peer-profile-name-row"><h2>{peer.name}</h2><Badge tone="mint" dot>Open to exchange</Badge></div><p>{peer.careerGoal} <span>·</span> {peer.skillLevel} learner</p><div className="peer-profile-loc"><span><Calendar size={14} />{peer.availability}</span><span><Lightbulb size={14} />{peer.learningStyle} learning style</span></div></div><div className="peer-profile-buttons"><Button size="sm" onClick={() => toast('Connection request simulated successfully.')} icon={ArrowRight}>Connect</Button><Button size="sm" variant="outline" onClick={() => setScheduleOpen(true)} icon={Calendar}>Schedule activity</Button></div></div><div className="peer-profile-stats"><div><strong>{peer.rating}</strong><span>Peer rating</span></div><div><strong>{peer.exchanged ?? '—'}</strong><span>Skills exchanged</span></div><div><strong>{peer.sessions ?? '—'}</strong><span>Sessions completed</span></div><div className="peer-profile-stat-note"><Info size={14} />Example peer profile values</div></div></div>
      <div className="peer-profile-tabs">{['About', 'Skill exchange', 'Learning style'].map((item) => <button key={item} className={tab === item ? 'peer-tab-active' : ''} onClick={() => setTab(item)}>{item}</button>)}</div>
      <div className="peer-profile-content"><div className="peer-profile-primary"><Card className="peer-about-card"><span className="eyebrow">{tab === 'About' ? 'A NOTE FROM' : tab.toUpperCase()}</span><h3>{tab === 'About' ? `Meet ${peer.name.split(' ')[0]}.` : tab === 'Skill exchange' ? 'A balanced exchange.' : 'How they like to learn.'}</h3><p>{tab === 'About' ? peer.intro : tab === 'Skill exchange' ? `${peer.name.split(' ')[0]} can share ${peer.canTeach.join(', ')} and is curious about ${peer.wantsToLearn.join(', ')}. SkillSync is designed so the exchange can support both people’s learning goals.` : `${peer.name.split(' ')[0]} prefers a ${peer.learningStyle.toLowerCase()} learning experience. A good first session can be a small, practical activity followed by a conversation.`}</p><div className="peer-profile-divider" /><div className="peer-skill-columns"><div><div className="mini-label">CAN TEACH</div><div className="profile-skill-list">{peer.canTeach.map((item) => <SkillChip key={item} color="lilac">{item}</SkillChip>)}</div></div><div><div className="mini-label">WANTS TO LEARN</div><div className="profile-skill-list">{peer.wantsToLearn.map((item) => <SkillChip key={item} color="mint">{item}</SkillChip>)}</div></div></div></Card><Card className="peer-first-step-card"><div className="peer-first-step-icon"><Zap size={19} /></div><div><span className="eyebrow">A SIMPLE FIRST STEP</span><h3>Try a 20-minute skill activity together.</h3><p>Keep the first exchange focused, practical, and easy to schedule.</p></div><Button variant="soft" size="sm" onClick={() => setScheduleOpen(true)}>Plan activity <ArrowRight size={14} /></Button></Card></div><div className="peer-profile-side"><MatchScoreCard /><Card className="peer-profile-safety"><ShieldCheck size={18} /><div><strong>Keep it comfortable.</strong><p>Choose a pace, activity, and format that feels right. Connecting here is simulated.</p></div></Card></div></div>
      <Modal open={scheduleOpen} onClose={() => setScheduleOpen(false)} title="Schedule a skill activity" subtitle={`Plan a first learning moment with ${peer.name}.`}><form className="modal-form" onSubmit={(e) => { e.preventDefault(); setScheduleOpen(false); toast('Activity request saved locally. No invitation was sent.') }}><Field label="Skill focus"><select className="text-input" value={sessionFocus} onChange={(e) => setSessionFocus(e.target.value)}>{peer.canTeach.map((skill) => <option key={skill}>{skill}</option>)}{peer.wantsToLearn.map((skill) => <option key={skill}>{skill}</option>)}</select></Field><Field label="Preferred time"><select className="text-input" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)}><option>Weekday evening</option><option>Weekend morning</option><option>Weekend afternoon</option><option>Let’s decide together</option></select></Field><Field label="Add a note"><textarea className="text-area" placeholder="What would you like to practice together?" /></Field><div className="modal-form-foot"><span><Info size={14} />Saved only on this device</span><Button type="submit" icon={Send}>Save activity request</Button></div></form></Modal>
    </div>
  )
}

function LearningPathPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const [profile] = usePersistentState('skillsync-profile', demoProfile)
  const [completed, setCompleted] = usePersistentState('skillsync-learning-completed', [])
  const [expanded, setExpanded] = useState('excel')
  const progress = Math.round(completed.length / learningStages.length * 100)
  const toggleComplete = (id) => {
    const isComplete = completed.includes(id)
    setCompleted(isComplete ? completed.filter((x) => x !== id) : [...completed, id])
    toast(isComplete ? 'Stage reopened in your local learning path.' : 'Stage marked complete. Your progress updated.')
  }
  return (
    <div className="page-stack">
      <div className="learning-hero"><div className="learning-hero-main"><span className="eyebrow"><Target size={14} /> YOUR CAREER GOAL</span><h2>{profile.goal}</h2><p>A structured path to practice the skills that support your goal. Take it at your own pace and adjust it as you learn.</p><div className="learning-hero-tags"><Badge tone="purple">Personalized demo path</Badge><Badge tone="neutral"><Info size={12} />Illustrative sequence</Badge></div></div><div className="learning-hero-progress"><ProgressRing value={progress} label="complete" caption={`${completed.length} of ${learningStages.length} stages`} color="#b9f6e5" size={132} /><button className="text-button" onClick={() => navigate('/app/skill-gap')}>Review skill gaps <ArrowRight size={14} /></button></div></div>
      <div className="learning-path-body"><div className="learning-stage-list">{learningStages.map((stage, index) => { const Icon = stage.icon; const isDone = completed.includes(stage.id); const firstIncomplete = !isDone && learningStages.slice(0, index).every((item) => completed.includes(item.id)); const isExpanded = expanded === stage.id; return <div className={`learning-stage ${isDone ? 'stage-complete' : ''} ${firstIncomplete ? 'stage-current' : ''}`} key={stage.id}><div className="stage-rail"><span className="stage-node">{isDone ? <Check size={15} /> : <Icon size={15} />}</span>{index < learningStages.length - 1 && <span className="stage-connector" />}</div><Card className="stage-card"><button className="stage-card-main" onClick={() => setExpanded(isExpanded ? '' : stage.id)}><span className="stage-card-number">STEP {String(index + 1).padStart(2, '0')}</span><span className="stage-card-title"><strong>{stage.title}</strong><small>{stage.subtitle}</small></span><span className="stage-card-state">{isDone ? <Badge tone="mint"><Check size={12} />Complete</Badge> : firstIncomplete ? <Badge tone="purple" dot>Up next</Badge> : <Badge tone="neutral">In your path</Badge>}</span><ChevronDown size={16} className={isExpanded ? 'rotate-up' : ''} /></button>{isExpanded && <div className="stage-expanded"><div className="stage-expanded-detail"><div><span className="mini-label">PRACTICE MOMENT</span><strong>{stage.tag}</strong><small>Self-paced · suggested 20-minute starter activity</small></div><button onClick={() => navigate('/app/activities')}>Choose an activity <ArrowUpRight size={14} /></button></div><div className="stage-expanded-foot"><span><Clock3 size={14} />Suggested effort: start with one focused practice block</span><Button size="sm" variant={isDone ? 'soft' : 'primary'} onClick={() => toggleComplete(stage.id)}>{isDone ? 'Reopen stage' : 'Mark complete'} {isDone ? <RotateCcw size={14} /> : <Check size={14} />}</Button></div></div>}</Card></div>})}</div><aside className="learning-aside"><Card className="learning-aside-card"><div className="learning-aside-art"><div className="learning-aside-orbit" /><span><Target size={23} /></span></div><span className="eyebrow">MAKE IT YOURS</span><h3>A path is a guide, not a rulebook.</h3><p>Mark stages as complete when they feel complete to you. Your progress stays in this browser.</p><div className="learning-aside-checks"><span><CheckCircle2 size={14} />Practice at your pace</span><span><CheckCircle2 size={14} />Revisit any stage</span><span><CheckCircle2 size={14} />Build proof as you go</span></div><DemoNotice>Suggested learning path · not an assessed curriculum.</DemoNotice></Card><Card className="learning-next-card"><span className="mini-icon-bubble"><Sparkles size={16} /></span><span className="eyebrow">NEED A STUDY PARTNER?</span><h3>Try your next skill with a peer.</h3><button className="text-button" onClick={() => navigate('/app/peer-matching')}>Find a peer <ArrowRight size={14} /></button></Card></aside></div>
    </div>
  )
}

function ActivityTimerModal({ activity, open, onClose, onComplete }) {
  const [seconds, setSeconds] = useState(20 * 60)
  const [running, setRunning] = useState(false)
  useEffect(() => { setSeconds(20 * 60); setRunning(false) }, [activity?.id, open])
  useEffect(() => {
    if (!running) return undefined
    const timer = window.setInterval(() => setSeconds((remaining) => {
      if (remaining <= 1) { window.clearInterval(timer); setRunning(false); return 0 }
      return remaining - 1
    }), 1000)
    return () => window.clearInterval(timer)
  }, [running])
  if (!activity) return null
  const minute = String(Math.floor(seconds / 60)).padStart(2, '0')
  const second = String(seconds % 60).padStart(2, '0')
  return <Modal open={open} onClose={onClose} title={activity.title} subtitle="A focused practice block. This timer runs locally in your browser." size="sm"><div className="timer-modal-content"><div className={`timer-icon timer-${activity.color}`}><activity.icon size={23} /></div><Badge tone="purple">{activity.category} · 20 min</Badge><div className={`timer-display ${running ? 'timer-running' : ''}`} aria-live="polite">{minute}<span>:</span>{second}</div><p>{seconds === 0 ? 'Nice work. You completed the practice block.' : running ? 'Stay with one small, useful next step.' : activity.description}</p><div className="timer-controls">{seconds === 0 ? <Button onClick={() => onComplete(activity.id)} icon={Check}>Complete activity</Button> : <><Button onClick={() => setRunning(!running)} icon={running ? Pause : Play}>{running ? 'Pause' : 'Start'}</Button><Button variant="soft" onClick={() => { setRunning(false); setSeconds(20 * 60) }} icon={RotateCcw}>Reset</Button><button className="timer-complete-link" onClick={() => onComplete(activity.id)}>Finish early</button></>}</div><div className="timer-progress"><span style={{ width: `${((20 * 60 - seconds) / (20 * 60)) * 100}%` }} /></div><small className="timer-private-note"><ShieldCheck size={13} />Activity status is saved only in this browser.</small></div></Modal>
}

function ActivitiesPage() {
  const toast = useToast()
  const [completed, setCompleted] = usePersistentState('skillsync-activities-completed', [])
  const [activeActivity, setActiveActivity] = useState(null)
  const finishActivity = (id) => { if (!completed.includes(id)) setCompleted([...completed, id]); setActiveActivity(null); toast('Activity completed and saved in this browser.') }
  return (
    <div className="page-stack">
      <div className="activities-hero"><div className="activities-hero-orbit"><span><Clock3 size={26} /></span><i /><i /><i /></div><div><Badge tone="mint" dot>SHORT ON TIME? START SMALL.</Badge><h2>20 minutes.<br /><span>One useful step.</span></h2><p>Focused activities make practice easier to begin. Pause, reset, or finish whenever you need.</p></div><div className="activity-hero-side"><span>FOCUS TIMER</span><strong>20<span>:00</span></strong><small>Made for a learning sprint</small></div></div>
      <div className="activity-list-header"><div><span className="eyebrow">CHOOSE YOUR PRACTICE</span><h2>Pick a skill to work on.</h2></div><Badge tone="neutral"><Clock3 size={13} />20 minutes each</Badge></div>
      <div className="activities-grid">{activities.map((activity, index) => { const Icon = activity.icon; const done = completed.includes(activity.id); return <Card className="activity-card" key={activity.id}><div className={`activity-card-art art-${activity.color}`}><div className="activity-card-art-grid" /><span><Icon size={23} /></span><small>0{index + 1}</small></div><div className="activity-card-body"><div className="activity-category-row"><Badge tone={activity.color === 'mint' ? 'mint' : activity.color === 'peach' || activity.color === 'rose' ? 'orange' : 'purple'}>{activity.category}</Badge><span><Clock3 size={13} />20 min</span></div><h3>{activity.title}</h3><p>{activity.description}</p><button className={`activity-start-button ${done ? 'activity-start-done' : ''}`} onClick={() => setActiveActivity(activity)}>{done ? <><CheckCircle2 size={15} />Done · Start again</> : <>Start activity <ArrowRight size={15} /></>}</button></div></Card>})}</div>
      <div className="activity-footer-note"><Info size={14} /><span>Activities are illustrative prompts. Completing one records a local demo status—it does not certify a skill.</span></div>
      <ActivityTimerModal activity={activeActivity} open={Boolean(activeActivity)} onClose={() => setActiveActivity(null)} onComplete={finishActivity} />
    </div>
  )
}

function ProgressPage() {
  const toast = useToast()
  const [profile] = usePersistentState('skillsync-profile', demoProfile)
  const [completedStages] = usePersistentState('skillsync-learning-completed', [])
  const [completedActivities] = usePersistentState('skillsync-activities-completed', [])
  const [proofs, setProofs] = usePersistentState('skillsync-proofs', [])
  const [proofOpen, setProofOpen] = useState(false)
  const [proofTitle, setProofTitle] = useState('')
  const [proofBody, setProofBody] = useState('')
  const [tab, setTab] = useState('Overview')
  const [shareOpen, setShareOpen] = useState(false)
  const score = Math.min(100, 72 + completedStages.length * 3)
  const createProof = (e) => { e.preventDefault(); if (!proofTitle.trim()) return; setProofs([{ id: Date.now(), title: proofTitle.trim(), body: proofBody.trim(), date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) }, ...proofs]); setProofTitle(''); setProofBody(''); setProofOpen(false); toast('Skill proof draft saved in this browser.') }
  const downloadProof = () => {
    const payload = { name: profile.name, careerGoal: profile.goal, proofItems: proofs, note: 'SkillSync frontend prototype — locally saved demo data.' }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a'); link.href = url; link.download = 'skillsync-skill-proof.json'; link.click(); URL.revokeObjectURL(url)
    toast('A local skill-proof summary was downloaded.')
  }
  return (
    <div className="page-stack">
      <div className="progress-overview-hero"><div className="progress-overview-copy"><Badge tone="purple" dot>YOUR LEARNING, MADE VISIBLE</Badge><h2>Progress is built<br />one proof point <span>at a time.</span></h2><p>Track what you have practiced and collect evidence you are proud to share.</p><div className="progress-hero-actions"><Button size="sm" onClick={() => setProofOpen(true)} icon={Plus}>Create skill proof</Button><button className="text-button text-button-light" onClick={() => setShareOpen(true)}><Share2 size={14} /> Preview portfolio</button></div></div><div className="progress-overview-ring"><ProgressRing value={score} label="readiness" caption="Illustrative readiness" color="#bff6e3" size={146} /></div><div className="progress-hero-deco"><span /><span /><span /></div></div>
      <div className="progress-toolbar"><div className="progress-tabs">{['Overview', 'Skill proof'].map((item) => <button key={item} className={tab === item ? 'progress-tab-active' : ''} onClick={() => setTab(item)}>{item}{item === 'Skill proof' && <span>{proofs.length}</span>}</button>)}</div><Badge tone="neutral"><Info size={13} />Prototype progress</Badge></div>
      {tab === 'Overview' ? <div className="progress-dashboard-grid"><div className="page-stack"><Card className="progress-breakdown-card"><div className="card-header-line"><div><span className="eyebrow">SKILL MOMENTUM</span><h3>Progress that belongs to you.</h3></div><button className="icon-button" onClick={() => toast('Progress on this page is stored locally in your browser.')}><CircleHelp size={17} /></button></div><div className="progress-breakdown-rows">{skillGaps.map((skill) => <div className="skill-momentum-row" key={skill.name}><div className={`momentum-icon fill-bg-${skill.tone}`}>{skill.name.includes('Valuation') ? <Target size={16} /> : skill.name.includes('Excel') ? <BarChart3 size={16} /> : <BriefcaseBusiness size={16} />}</div><div className="momentum-main"><div className="momentum-meta"><strong>{skill.name}</strong><span>Demo profile skill level</span></div><ProgressBar label="" value={skill.current} color={skill.tone} showValue /></div><button className="icon-button" onClick={() => toast('Skill levels are illustrative in this prototype.')} aria-label={`About ${skill.name}`}><Info size={15} /></button></div>)}</div><DemoNotice>Skill levels are sample values specified for this demo—not verified assessments.</DemoNotice></Card><Card className="proof-card"><div className="card-header-line"><div><span className="eyebrow">YOUR PROOF SPACE</span><h3>Show the work behind the skill.</h3></div><Button variant="soft" size="sm" onClick={() => setProofOpen(true)} icon={Plus}>Add proof</Button></div>{proofs.length ? <div className="proof-list">{proofs.map((proof) => <div className="proof-list-item" key={proof.id}><span className="proof-document"><FileCheck2 size={17} /></span><div><strong>{proof.title}</strong><span>{proof.body || 'Personal skill proof draft'} · saved {proof.date}</span></div><Badge tone="mint">Draft</Badge></div>)}</div> : <div className="proof-empty"><div className="proof-empty-icon"><Award size={22} /></div><div><strong>No proof points yet.</strong><span>Add a project, reflection, or practice artifact to get started.</span></div><button onClick={() => setProofOpen(true)}>Create your first proof <ArrowRight size={14} /></button></div>}</Card></div><div className="page-stack progress-side-stack"><Card className="progress-count-card"><span className="eyebrow">THIS DEMO PROFILE</span><div className="progress-count-row"><div><strong>{completedStages.length}</strong><span>Learning stages completed</span></div><div><strong>{completedActivities.length}</strong><span>Activities completed</span></div></div><div className="progress-count-footer"><CheckCircle2 size={14} />Updates as you interact with the prototype</div></Card><Card className="proof-prompt-card"><div className="proof-prompt-art"><Sparkles size={22} /></div><span className="eyebrow">A SMALL REFLECTION</span><h3>What changed after you practiced?</h3><p>A short reflection can turn a completed activity into a meaningful proof point.</p><button className="text-button" onClick={() => setProofOpen(true)}>Write a reflection <ArrowRight size={14} /></button></Card><Card className="progress-note-card"><ShieldCheck size={18} /><div><strong>Private by default</strong><p>Your progress and proof drafts stay in this browser. Nothing is uploaded.</p></div></Card></div></div> : <Card className="proof-gallery"><div className="card-header-line"><div><span className="eyebrow">SKILL PROOF</span><h3>Artifacts, projects and reflections.</h3></div><div className="proof-gallery-actions"><Button variant="soft" size="sm" onClick={() => setProofOpen(true)} icon={Plus}>Add proof</Button><button className="icon-button" onClick={downloadProof} aria-label="Download proof"><Download size={16} /></button></div></div>{proofs.length ? <div className="proof-gallery-grid">{proofs.map((proof) => <div className="proof-gallery-item" key={proof.id}><div className="proof-gallery-top"><div className="proof-document"><FileCheck2 size={18} /></div><Badge tone="mint">Draft</Badge></div><h4>{proof.title}</h4><p>{proof.body || 'A skill reflection saved locally.'}</p><span>{proof.date} · {profile.goal}</span></div>)}</div> : <div className="proof-gallery-empty"><div className="proof-empty-icon"><Award size={23} /></div><h3>Your proof portfolio starts with one moment.</h3><p>Capture a useful practice result, a project, or a reflection.</p><Button size="sm" onClick={() => setProofOpen(true)} icon={Plus}>Create skill proof</Button></div>}</Card>}
      <Modal open={proofOpen} onClose={() => setProofOpen(false)} title="Create a skill proof" subtitle="Capture a project, practice artifact, or learning reflection."><form className="modal-form" onSubmit={createProof}><Field label="Proof title"><TextInput value={proofTitle} onChange={(e) => setProofTitle(e.target.value)} placeholder="e.g. My first valuation case" required /></Field><Field label="What did you do or learn?"><textarea className="text-area" rows="4" value={proofBody} onChange={(e) => setProofBody(e.target.value)} placeholder="Describe the skill you practiced and what you would like to remember." /></Field><div className="modal-form-foot"><span><Info size={14} />This creates a local draft, not a certificate.</span><Button type="submit" icon={Check}>Save draft</Button></div></form></Modal>
      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Portfolio preview" subtitle="A private, local preview of your SkillSync proof space."><div className="portfolio-preview"><div className="portfolio-preview-head"><span className="portfolio-monogram">SJ</span><div><strong>{profile.name}</strong><span>{profile.goal} · Learning profile</span></div><Badge tone="purple">Preview</Badge></div><div className="portfolio-preview-skills">{profile.currentSkills.map((skill) => <SkillChip key={skill} color="lilac">{skill}</SkillChip>)}</div><div className="portfolio-preview-line" /><strong>Skill proof</strong>{proofs.length ? proofs.map((proof) => <div className="portfolio-proof-row" key={proof.id}><FileCheck2 size={15} /><span>{proof.title}</span></div>) : <p className="portfolio-empty-message">Your proof items will appear here after you add a draft.</p>}<div className="portfolio-private"><ShieldCheck size={14} />Not published · visible only in this browser</div><Button variant="soft" size="sm" onClick={downloadProof} icon={Download}>Download local summary</Button></div></Modal>
    </div>
  )
}

function SkillExchangePage() {
  const toast = useToast()
  const navigate = useNavigate()
  const [reverse, setReverse] = useState(false)
  const [profile] = usePersistentState('skillsync-profile', demoProfile)
  const [savedProposal, setSavedProposal] = usePersistentState('skillsync-exchange-proposal', null)
  const [modalOpen, setModalOpen] = useState(false)
  const peer = peers[0]
  const student = { name: 'Sakshi Jadhav', teaches: profile.teaches[0] || 'Add a skill to teach', wants: profile.wants[0] || 'Add a learning goal', initials: 'SJ', color: 'purple' }
  const peerCard = { name: peer.name, teaches: peer.canTeach[0], wants: peer.wantsToLearn[0], initials: peer.initials, color: peer.color }
  const left = reverse ? peerCard : student
  const right = reverse ? student : peerCard
  return (
    <div className="page-stack">
      <div className="exchange-hero"><div className="exchange-hero-art"><div className="exchange-art-circle circle-left"><span>YOU</span><i><Users size={18} /></i></div><div className="exchange-art-circle circle-right"><span>PEER</span><i><Lightbulb size={18} /></i></div><div className="exchange-art-center"><Network size={20} /></div><span className="exchange-flow-line line-teach"><ArrowRight size={15} /></span><span className="exchange-flow-line line-learn"><ArrowLeft size={15} /></span></div><div className="exchange-hero-copy"><Badge tone="mint" dot>GIVE A SKILL. GAIN A SKILL.</Badge><h2>Everyone brings<br /><span>something to the table.</span></h2><p>A peer exchange gives both people a chance to teach with confidence and learn with curiosity.</p><Button size="sm" onClick={() => navigate('/app/peer-matching')} icon={Users}>Find more peers</Button></div></div>
      <PageSection eyebrow="A TWO-WAY LEARNING MOMENT" title="A skill swap that works both ways" action={<button className="text-button" onClick={() => setReverse(!reverse)}><RotateCcw size={14} /> Reverse view</button>}>
        <div className="exchange-board"><div className="exchange-person-panel"><div className="exchange-person-head"><Avatar peer={{ ...left }} size="md" /><div><span className="eyebrow">LEARNER A</span><strong>{left.name}</strong></div><Badge tone={reverse ? 'mint' : 'purple'}>{reverse ? 'Potential peer' : 'You'}</Badge></div><div className="exchange-lane exchange-teach"><span className="exchange-lane-icon"><ArrowUpRight size={16} /></span><div><span>I TEACH</span><strong>{left.teaches}</strong></div><span className="exchange-direction">Share</span></div><div className="exchange-lane exchange-learn"><span className="exchange-lane-icon"><ArrowDownRight size={16} /></span><div><span>I WANT TO LEARN</span><strong>{left.wants}</strong></div><span className="exchange-direction">Grow</span></div></div><button className="exchange-swap-button" onClick={() => setReverse(!reverse)} aria-label="Switch exchange direction"><ArrowRight size={20} /><span>balanced<br />exchange</span><ArrowLeft size={20} /></button><div className="exchange-person-panel exchange-peer-panel"><div className="exchange-person-head"><Avatar peer={{ ...right }} size="md" /><div><span className="eyebrow">LEARNER B</span><strong>{right.name}</strong></div><Badge tone={reverse ? 'purple' : 'mint'}>{reverse ? 'You' : 'Potential peer'}</Badge></div><div className="exchange-lane exchange-teach"><span className="exchange-lane-icon"><ArrowUpRight size={16} /></span><div><span>I TEACH</span><strong>{right.teaches}</strong></div><span className="exchange-direction">Share</span></div><div className="exchange-lane exchange-learn"><span className="exchange-lane-icon"><ArrowDownRight size={16} /></span><div><span>I WANT TO LEARN</span><strong>{right.wants}</strong></div><span className="exchange-direction">Grow</span></div></div></div>
      </PageSection>
      <div className="exchange-bottom-grid"><Card className="exchange-idea-card"><div className="mini-icon-bubble"><Sparkles size={17} /></div><span className="eyebrow">AARAV MEHTA · ILLUSTRATIVE PEER EXAMPLE</span><h3>{peer.canTeach[0]} ↔ {profile.teaches[0] || 'a skill you can teach'}</h3><p>Aarav can share marketing fundamentals while learning the {profile.teaches[0] || 'skills you already know'}. That is the idea behind a complementary skill exchange.</p><div className="exchange-topic-pills"><SkillChip color="lilac">{peer.canTeach[0]}</SkillChip><span>⇄</span><SkillChip color="mint">{profile.teaches[0] || 'Add a teaching skill'}</SkillChip></div><Button onClick={() => setModalOpen(true)} icon={ArrowRight}>{savedProposal ? 'Update exchange idea' : 'Propose this skill swap'}</Button></Card><Card className="exchange-guidelines-card"><span className="eyebrow">MAKE IT A GOOD EXPERIENCE</span><h3>Start with a shared plan.</h3><div className="exchange-guideline-list"><div><span>01</span><p><strong>Choose one outcome.</strong><small>What would feel useful by the end?</small></p></div><div><span>02</span><p><strong>Keep the first activity light.</strong><small>One 20-minute practice is a strong start.</small></p></div><div><span>03</span><p><strong>Make space for both voices.</strong><small>Teaching and learning move in both directions.</small></p></div></div></Card></div>
      {savedProposal && <div className="exchange-saved-banner"><CheckCircle2 size={16} /><span>Your exchange idea is saved locally: <strong>{savedProposal.focus}</strong></span><button onClick={() => setSavedProposal(null)}>Remove</button></div>}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Propose a skill exchange" subtitle="Keep the first idea simple and easy to respond to."><form className="modal-form" onSubmit={(e) => { e.preventDefault(); const form = new FormData(e.currentTarget); setSavedProposal({ focus: form.get('focus'), note: form.get('note') }); setModalOpen(false); toast('Skill exchange idea saved locally. No message was sent.') }}><Field label="Start with this skill"><select className="text-input" name="focus"><option>Digital Marketing</option><option>Financial Analysis</option><option>20-minute starter activity</option></select></Field><Field label="A note for your first conversation"><textarea className="text-area" name="note" placeholder="What would you be excited to teach or learn?" /></Field><div className="modal-form-foot"><span><Info size={14} />No message is sent from this prototype.</span><Button type="submit" icon={Send}>Save exchange idea</Button></div></form></Modal>
    </div>
  )
}

const initialPosts = [
  { id: 1, initials: 'AM', author: 'Aarav Mehta', role: 'Exploring Brand Management', time: 'Recently', color: 'lavender', tag: 'LEARNING NOTE', title: 'A question I’m taking into my next marketing audit', body: 'How do you tell the difference between a campaign that is memorable and one that actually changes a decision? I’m trying to make my next review more evidence-led.', reactions: [], replies: [] },
  { id: 2, initials: 'AD', author: 'Ananya Deshmukh', role: 'Learning structured problem solving', time: 'This week', color: 'mint', tag: 'SMALL WIN', title: 'Made my first messy idea into a clear one-page story.', body: 'The hardest part was choosing what to leave out. Sharing the outline with a peer helped me find the question the presentation was really trying to answer.', reactions: [], replies: [] },
  { id: 3, initials: 'RK', author: 'Rahul Kulkarni', role: 'Growing in Corporate Finance', time: 'Recently', color: 'blue', tag: 'ASK THE COMMUNITY', title: 'What makes a spreadsheet genuinely useful to someone else?', body: 'I’m working on cleaner assumptions and better notes. Curious about the small habits that make a model easier to review.', reactions: [], replies: [] },
]

function CommunityPage() {
  const toast = useToast()
  const [profile] = usePersistentState('skillsync-profile', demoProfile)
  const [posts, setPosts] = usePersistentState('skillsync-community-posts', initialPosts)
  const [postOpen, setPostOpen] = useState(false)
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  const [activeTab, setActiveTab] = useState('For you')
  const [replyPost, setReplyPost] = useState(null)
  const [replyText, setReplyText] = useState('')
  const addPost = (e) => { e.preventDefault(); if (!postTitle.trim() || !postBody.trim()) return; const next = { id: Date.now(), initials: 'SJ', author: 'Sakshi Jadhav', role: `Working toward ${profile.goal}`, time: 'Just now', color: 'purple', tag: 'YOUR LEARNING NOTE', title: postTitle.trim(), body: postBody.trim(), reactions: [], replies: [] }; setPosts([next, ...posts]); setPostOpen(false); setPostTitle(''); setPostBody(''); setActiveTab('For you'); toast('Your community post was added to this local demo.') }
  const toggleReaction = (postId) => setPosts(posts.map((post) => post.id === postId ? { ...post, reactions: post.reactions.includes('Sakshi') ? post.reactions.filter((x) => x !== 'Sakshi') : [...post.reactions, 'Sakshi'] } : post))
  const addReply = (postId) => { if (!replyText.trim()) return; setPosts(posts.map((post) => post.id === postId ? { ...post, replies: [...post.replies, { id: Date.now(), author: 'Sakshi', text: replyText.trim() }] } : post)); setReplyText(''); setReplyPost(null); toast('Reply saved locally.') }
  const filteredPosts = activeTab === 'For you' ? posts : activeTab === 'Learning notes' ? posts.filter((post) => post.tag.includes('LEARNING') || post.tag.includes('ASK')) : posts.filter((post) => post.tag.includes('WIN'))
  return (
    <div className="page-stack">
      <div className="community-hero"><div className="community-hero-art"><span className="community-bubble bubble-one"><Lightbulb size={16} /></span><span className="community-bubble bubble-two"><Heart size={16} /></span><span className="community-bubble bubble-three"><MessageCircle size={16} /></span><div className="community-center"><Network size={27} /><span>learn<br />together</span></div><i className="community-ring ring-a" /><i className="community-ring ring-b" /></div><div><Badge tone="mint" dot>SMALL STEPS, SHARED</Badge><h2>A community for<br /><span>curious learners.</span></h2><p>Share a question, a small win, or a learning note. The best kind of growth is the kind we can talk about.</p><Button size="sm" onClick={() => setPostOpen(true)} icon={Plus}>Share a learning note</Button></div></div>
      <div className="community-layout"><div className="community-feed"><div className="community-feed-head"><div><span className="eyebrow">COMMUNITY FEED</span><h2>Conversations in progress</h2></div><Button variant="outline" size="sm" onClick={() => setPostOpen(true)} icon={Plus}>Create post</Button></div><div className="community-tabs">{['For you', 'Learning notes', 'Small wins'].map((tab) => <button key={tab} className={activeTab === tab ? 'community-tab-active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div><div className="community-post-list">{filteredPosts.map((post) => <Card className="community-post" key={post.id}><div className="community-post-head"><Avatar peer={{ initials: post.initials, color: post.color }} size="sm" /><div><strong>{post.author}</strong><span>{post.role} <i>·</i> {post.time}</span></div><button className="icon-button" onClick={() => toast('Post options are part of the local demo.')} aria-label="Post options"><MoreHorizontal size={18} /></button></div><Badge tone={post.tag.includes('WIN') ? 'orange' : 'purple'}>{post.tag}</Badge><h3>{post.title}</h3><p>{post.body}</p><div className="community-post-actions"><button className={post.reactions.includes('Sakshi') ? 'reacted' : ''} onClick={() => toggleReaction(post.id)}><Heart size={15} fill={post.reactions.includes('Sakshi') ? 'currentColor' : 'none'} />Applaud{post.reactions.includes('Sakshi') ? 'd' : ''}</button><button onClick={() => { setReplyPost(replyPost === post.id ? null : post.id); setReplyText('') }}><MessageCircle size={15} />Reply</button><button onClick={() => { navigator.clipboard?.writeText(post.title).catch(() => {}); toast('Post title copied locally.') }}><Share2 size={15} />Share</button></div>{post.replies.map((reply) => <div className="community-reply" key={reply.id}><span className="reply-avatar">SJ</span><p><strong>{reply.author}</strong>{reply.text}</p></div>)}{replyPost === post.id && <div className="community-reply-form"><input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a thoughtful reply..." onKeyDown={(e) => { if (e.key === 'Enter') addReply(post.id) }} /><button onClick={() => addReply(post.id)} aria-label="Send reply"><Send size={15} /></button></div>}</Card>)}{!filteredPosts.length && <div className="no-results"><MessageCircle size={23} /><h3>No posts in this view yet.</h3><p>Share a note and start the conversation.</p><Button size="sm" onClick={() => setPostOpen(true)}>Create a post</Button></div>}</div></div><div className="page-stack community-side"><Card className="community-prompt-card"><div className="prompt-card-icon"><Lightbulb size={19} /></div><span className="eyebrow">A PROMPT TO START</span><h3>What is one skill you used this week?</h3><p>It can be something small: asking a clearer question, explaining an idea, or trying a new tool.</p><button className="text-button" onClick={() => { setPostTitle('One skill I used this week'); setPostOpen(true) }}>Write a learning note <ArrowRight size={14} /></button></Card><Card className="community-guidelines"><span className="eyebrow">COMMUNITY NOTES</span><h3>Make room for learning.</h3><div><CheckCircle2 size={15} /><span>Share questions without fear of getting it perfect.</span></div><div><CheckCircle2 size={15} /><span>Give feedback with care and curiosity.</span></div><div><CheckCircle2 size={15} /><span>Celebrate progress, not just outcomes.</span></div><DemoNotice>Local-only demo feed. No posts are published online.</DemoNotice></Card><div className="community-community-card"><div className="community-community-icon"><Users size={19} /></div><span className="eyebrow">YOUR PEER NETWORK</span><strong>Learning feels lighter together.</strong><button onClick={() => window.location.assign('/app/peer-matching')}>Find a peer <ArrowRight size={13} /></button></div></div></div>
      <Modal open={postOpen} onClose={() => setPostOpen(false)} title="Share a learning note" subtitle="Add a question, a small win, or an idea that might help a peer."><form className="modal-form" onSubmit={addPost}><Field label="Your headline"><TextInput value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder="What’s on your mind?" required /></Field><Field label="Your note"><textarea className="text-area" rows="5" value={postBody} onChange={(e) => setPostBody(e.target.value)} placeholder="Share a little context, a question, or what you learned." required /></Field><div className="modal-form-foot"><span><Info size={14} />Saved only in this browser</span><Button type="submit" icon={Send}>Add to demo feed</Button></div></form></Modal>
    </div>
  )
}

function SocialImpactPage() {
  const navigate = useNavigate()
  return (
    <div className="page-stack">
      <div className="impact-hero"><div className="impact-hero-orb"><span className="impact-orb-inner"><Heart size={26} /></span><span className="impact-orbit orbit-1" /><span className="impact-orbit orbit-2" /><i className="impact-dot dot-1" /><i className="impact-dot dot-2" /></div><div className="impact-hero-copy"><Badge tone="mint" dot>THE OPPORTUNITY TO LEARN TOGETHER</Badge><h2>Access to learning is stronger<br />when <span>we build together.</span></h2><p>SkillSync is designed to help students turn existing strengths into a shared resource—and make career-focused practice feel more within reach.</p><div className="impact-hero-actions"><Button onClick={() => navigate('/app/skill-exchange')} icon={ArrowRight}>Explore skill exchange</Button><span><ShieldCheck size={14} />No live impact claims</span></div></div></div>
      <div className="impact-context-head"><div><span className="eyebrow">EDUCATION & EMPLOYABILITY CONTEXT</span><h2>India’s student opportunity, in context.</h2><p>These are external context figures—not SkillSync user, reach, or outcome numbers.</p></div><Badge tone="neutral"><Info size={13} />Sources shown per metric</Badge></div>
      <div className="impact-metric-grid">{sourceFacts.map((fact, index) => <Card className={`impact-metric-card impact-metric-${index}`} key={fact.label}><div className="impact-metric-icon">{index === 0 ? <GraduationCap size={19} /> : index === 1 ? <BarChart3 size={19} /> : <BriefcaseBusiness size={19} />}</div><span className="impact-metric-source">{fact.source}</span><strong>{fact.value}</strong><h3>{fact.label}</h3><span className="impact-context-tag">Context figure · not traction</span></Card>)}</div>
      <DemoNotice>Figures supplied in the product brief. They are context statistics and do not describe SkillSync's usage or impact.</DemoNotice>
      <div className="impact-model-grid"><Card className="impact-path-card"><span className="eyebrow">HOW THE PRODUCT COULD HELP</span><h3>Connect small actions to meaningful access.</h3><div className="impact-flow-list"><div><span className="impact-flow-icon flow-1"><Target size={16} /></span><p><strong>Clarity</strong><small>Make career-oriented skill needs easier to explore.</small></p></div><div className="impact-flow-arrow"><ArrowDown size={14} /></div><div><span className="impact-flow-icon flow-2"><Users size={16} /></span><p><strong>Reciprocity</strong><small>Help peers exchange skills they already hold.</small></p></div><div className="impact-flow-arrow"><ArrowDown size={14} /></div><div><span className="impact-flow-icon flow-3"><Award size={16} /></span><p><strong>Evidence</strong><small>Encourage practice artifacts and learner confidence.</small></p></div></div><span className="impact-model-label">Intended product logic · outcomes not yet measured</span></Card><Card className="impact-principles-card"><span className="eyebrow">DESIGN PRINCIPLES</span><h3>Keep the learner at the center.</h3><div className="impact-principle"><span><Users size={16} /></span><div><strong>Peer-powered, not peer-dependent</strong><small>Support thoughtful connections and clear learning boundaries.</small></div></div><div className="impact-principle"><span><BookOpen size={16} /></span><div><strong>Practice, not just content</strong><small>Make room for application, reflection, and skill proof.</small></div></div><div className="impact-principle"><span><ShieldCheck size={16} /></span><div><strong>Honest about evidence</strong><small>Distinguish product intent from demonstrated outcomes.</small></div></div></Card></div>
      <WorkbookNotice compact />
    </div>
  )
}

function BusinessModelPage() {
  const toast = useToast()
  const [activePlan, setActivePlan] = useState('Student')
  const [detailPlan, setDetailPlan] = useState(null)
  const plans = [
    { name: 'Student', badge: 'START WITH ACCESS', price: 'Free to explore', note: 'Proposed entry point', text: 'A low-friction way to build a skill profile, explore peers, and practice independently.', features: ['Personal skill profile', 'Peer matching exploration', 'Learning path and practice prompts'], icon: GraduationCap, tone: 'purple' },
    { name: 'Learner Plus', badge: 'PROPOSED', price: 'Pricing to validate', note: 'Not a set price', text: 'A potential paid tier for learners who want more guided practice and richer proof tools.', features: ['Structured practice collections', 'Progress and proof portfolio', 'Optional guided learning moments'], icon: Sparkles, tone: 'blue' },
    { name: 'Campus', badge: 'INSTITUTIONAL HYPOTHESIS', price: 'Partnership model', note: 'Commercial terms not set', text: 'A possible institution-facing offer that supports student communities and career readiness programming.', features: ['Campus community spaces', 'Program-level insights (future)', 'Cohort learning experiences'], icon: BriefcaseBusiness, tone: 'mint' },
  ]
  return (
    <div className="page-stack">
      <div className="model-hero"><div className="model-hero-graphic"><span className="model-orbit o1" /><span className="model-orbit o2" /><div className="model-core"><Network size={25} /><span>value<br />exchange</span></div><i className="model-node node-a"><Users size={14} /></i><i className="model-node node-b"><BookOpen size={14} /></i><i className="model-node node-c"><Building2Icon /></i></div><div><Badge tone="purple" dot>PROPOSED BUSINESS MODEL</Badge><h2>Accessible for learners.<br /><span>Sustainable by design.</span></h2><p>A working hypothesis: keep core exploration approachable, then test sustainable value from deeper learner and campus experiences.</p><div className="model-hero-caveat"><Info size={14} />No prices or revenue are stated without the source workbook.</div></div></div>
      <div className="pricing-head"><div><span className="eyebrow">PRICING HYPOTHESES</span><h2>Potential ways to create value.</h2><p>These are proposed product packages for discussion—not confirmed prices or validated demand.</p></div><div className="pricing-plan-tabs">{plans.map((plan) => <button key={plan.name} className={activePlan === plan.name ? 'pricing-tab-active' : ''} onClick={() => setActivePlan(plan.name)}>{plan.name}</button>)}</div></div>
      <div className="business-plan-grid">{plans.map((plan) => { const Icon = plan.icon; return <Card className={`business-plan-card ${activePlan === plan.name ? 'business-plan-active' : ''}`} key={plan.name} onClick={() => setActivePlan(plan.name)}><div className="business-plan-top"><span className={`business-plan-icon plan-${plan.tone}`}><Icon size={19} /></span><Badge tone={plan.tone === 'mint' ? 'mint' : plan.tone}>{plan.badge}</Badge></div><h3>{plan.name}</h3><strong className="business-price">{plan.price}</strong><span className="business-price-note">{plan.note}</span><p>{plan.text}</p><div className="business-feature-list">{plan.features.map((feature) => <span key={feature}><Check size={14} />{feature}</span>)}</div><button className="plan-explore" onClick={(e) => { e.stopPropagation(); setDetailPlan(plan) }}>Explore this hypothesis <ArrowRight size={14} /></button></Card>})}</div>
      <DemoNotice>Plan concepts are proposed assumptions. No validated pricing, conversion, revenue, or customer data is included.</DemoNotice>
      <div className="model-revenue-card"><div><span className="eyebrow">POTENTIAL VALUE STREAMS</span><h3>Where a sustainable model might emerge.</h3><p>These streams are hypotheses to validate with learners, institutions, and the source financial model.</p></div><div className="revenue-streams"><div><span><Users size={16} /></span><strong>Learner subscriptions</strong><small>Deeper practice and proof experiences</small></div><div><span><Building2Icon /></span><strong>Institution partnerships</strong><small>Campus programs and community access</small></div><div><span><Sparkles size={16} /></span><strong>Learning experiences</strong><small>Optional guided or project-based offers</small></div></div></div>
      <WorkbookNotice compact />
      <Modal open={Boolean(detailPlan)} onClose={() => setDetailPlan(null)} title={`${detailPlan?.name || 'Plan'} — working hypothesis`} subtitle="A product concept to validate, not a confirmed commercial offer."><div className="hypothesis-modal"><Badge tone="orange">PROPOSED ASSUMPTION</Badge><p>{detailPlan?.text}</p><div className="hypothesis-list">{detailPlan?.features.map((feature) => <span key={feature}><CheckCircle2 size={15} />{feature}</span>)}</div><p className="hypothesis-caveat"><Info size={14} />Pricing and willingness to pay should be validated before any launch claim.</p><Button onClick={() => { setDetailPlan(null); toast('Thanks — this pricing hypothesis is saved for discussion in the prototype.') }}>Got it</Button></div></Modal>
    </div>
  )
}

function Building2Icon() {
  return <BriefcaseBusiness size={15} />
}

function MarketPage() {
  const navigate = useNavigate()
  const contextData = [
    { title: 'Higher education scale', fact: sourceFacts[0], text: 'A broad education context—not the addressable SkillSync market.' },
    { title: 'Participation context', fact: sourceFacts[1], text: 'A system-level indicator—not a user acquisition estimate.' },
    { title: 'Employability context', fact: sourceFacts[2], text: 'An external graduate employability figure—not a SkillSync outcome.' },
  ]
  return (
    <div className="page-stack">
      <div className="market-hero"><div className="market-hero-copy"><Badge tone="purple" dot>MARKET OPPORTUNITY</Badge><h2>Start with a clear need.<br /><span>Size it with evidence.</span></h2><p>SkillSync sits at the intersection of higher education, employability, peer learning, and career development. Market sizing belongs in the model—not in guesswork.</p><div className="market-hero-tags"><span><GraduationCap size={14} />Higher education</span><span><Users size={14} />Peer learning</span><span><BriefcaseBusiness size={14} />Career readiness</span></div></div><div className="market-hero-visual"><div className="market-layer layer-outer"><span>INDIA · EDUCATION CONTEXT</span><div className="market-layer layer-middle"><span>CAREER-FOCUSED LEARNING</span><div className="market-layer layer-inner"><span><Network size={17} /> SKILLSYNC WEDGE</span></div></div></div><small>Conceptual map · not to scale</small></div></div>
      <div className="market-source-header"><div><span className="eyebrow">SOURCE CONTEXT</span><h2>Signals that frame the opportunity.</h2><p>Figures below are the context statistics supplied in the product brief.</p></div><span className="market-source-badge"><FileCheck2 size={15} />Context sources cited</span></div>
      <div className="market-context-grid">{contextData.map((item, index) => <Card className="market-context-card" key={item.title}><div className={`market-context-icon mc-${index}`}><span>{index === 0 ? <GraduationCap size={19} /> : index === 1 ? <BarChart3 size={19} /> : <BriefcaseBusiness size={19} />}</span><Badge tone="neutral">{item.fact.source}</Badge></div><strong>{item.fact.value}</strong><h3>{item.title}</h3><p>{item.text}</p></Card>)}</div>
      <DemoNotice>These source facts provide context only. They are not TAM, SAM, SOM, reachable users, or SkillSync traction.</DemoNotice>
      <div className="market-approach-grid"><Card className="market-approach-card"><span className="eyebrow">HOW WE WOULD SIZE IT</span><h3>A transparent market model.</h3><div className="market-size-steps"><div><span>01</span><div><strong>Define the learner segment</strong><small>Start with a specific institution, course, or career-transition context.</small></div><span className="market-step-state">To validate</span></div><div><span>02</span><div><strong>Map the reachable channels</strong><small>Use credible institution and distribution inputs—not broad enrolment alone.</small></div><span className="market-step-state">To validate</span></div><div><span>03</span><div><strong>Model realistic adoption</strong><small>Separate addressable need from willingness to adopt and pay.</small></div><span className="market-step-state">To validate</span></div></div><button className="text-button" onClick={() => navigate('/app/go-to-market')}>See the proposed entry path <ArrowRight size={14} /></button></Card><Card className="market-blank-card"><div className="market-blank-icon"><BarChart3 size={21} /></div><span className="eyebrow">TAM / SAM / SOM</span><h3>Awaiting source-backed inputs.</h3><p>We have not filled the market-size layers with invented values. The Excel source workbook was not available in this project workspace.</p><span className="market-blank-foot"><ShieldCheck size={14} />No market estimate shown as fact</span></Card></div>
      <WorkbookNotice compact />
    </div>
  )
}

function UnitEconomicsPage() {
  const toast = useToast()
  const [values, setValues] = usePersistentState('skillsync-unit-economics-inputs', { revenue: '', variableCost: '', acquisitionCost: '', conversion: '' })
  const revenue = Number(values.revenue)
  const variableCost = Number(values.variableCost)
  const acquisitionCost = Number(values.acquisitionCost)
  const hasContribution = values.revenue !== '' && values.variableCost !== ''
  const contribution = hasContribution ? revenue - variableCost : null
  const payback = revenue > 0 && acquisitionCost > 0 ? (acquisitionCost / revenue) : null
  const clear = () => { setValues({ revenue: '', variableCost: '', acquisitionCost: '', conversion: '' }); toast('Your local scenario has been cleared.') }
  const inputRows = [
    ['Revenue per learner (₹)', 'revenue', 'Potential recurring or one-time revenue per learner.'],
    ['Variable cost per learner (₹)', 'variableCost', 'Direct support, delivery, or infrastructure cost.'],
    ['Acquisition cost per learner (₹)', 'acquisitionCost', 'Acquisition cost assumption per learner.'],
    ['Paid conversion assumption (%)', 'conversion', 'A scenario assumption, not a measured rate.'],
  ]
  return (
    <div className="page-stack">
      <div className="unit-hero"><div className="unit-hero-icon"><div className="unit-orbit" /><CircleDollarSignIcon /><i /></div><div><Badge tone="blue" dot>TRANSPARENT BY DESIGN</Badge><h2>Understand the engine<br /><span>before scaling it.</span></h2><p>Unit economics explain what it takes to create learner value sustainably. Start with source data; use the calculator only for clearly labeled assumptions.</p></div><div className="unit-hero-ribbon"><span>MODEL STATUS</span><strong>Awaiting workbook inputs</strong><small>No actuals or validated rates loaded</small></div></div>
      <WorkbookNotice />
      <div className="unit-economics-layout"><Card className="unit-calculator"><div className="card-header-line"><div><span className="eyebrow">OPTIONAL SCENARIO BUILDER</span><h3>Enter your own assumptions.</h3><p>Values below stay on this device and are never presented as actuals.</p></div><button className="text-button" onClick={clear}>Clear <RotateCcw size={13} /></button></div><div className="assumption-field-grid">{inputRows.map(([label, key, hint]) => <Field key={key} label={label} hint={hint}><div className="assumption-input-wrap"><span>{key === 'conversion' ? '%' : '₹'}</span><input type="number" min="0" className="text-input" value={values[key]} onChange={(e) => setValues({ ...values, [key]: e.target.value })} placeholder="Enter an assumption" /></div></Field>)}</div><div className="assumption-foot"><Badge tone="orange">YOUR ASSUMPTIONS</Badge><span>These are not source workbook values or validated projections.</span></div></Card><div className="page-stack unit-results"><Card className="unit-result-card"><span className="eyebrow">CONTRIBUTION PER LEARNER</span><strong>{contribution === null ? '—' : `₹${contribution.toLocaleString('en-IN')}`}</strong><p>{contribution === null ? 'Add revenue and variable cost assumptions to preview the formula.' : 'Revenue assumption − variable cost assumption'}</p><div className="unit-formula"><span>Revenue / learner</span><b>−</b><span>Variable cost / learner</span></div></Card><Card className="unit-result-card unit-result-blue"><span className="eyebrow">ACQUISITION PAYBACK</span><strong>{payback === null ? '—' : `${payback.toFixed(1)}×`}</strong><p>{payback === null ? 'Add revenue and acquisition cost assumptions to preview a simple ratio.' : 'Acquisition cost divided by revenue per learner (simple proxy)'}</p><div className="unit-formula"><span>Acquisition cost</span><b>÷</b><span>Revenue / learner</span></div></Card></div></div>
      <div className="unit-levers-grid"><div className="unit-levers-intro"><span className="eyebrow">WHAT TO VALIDATE</span><h3>Good unit economics begin with good questions.</h3><p>Use the workbook and customer evidence to understand the levers before making a scale decision.</p></div><div className="unit-lever"><span><Users size={16} /></span><strong>Acquisition</strong><small>How are learners reached and what does it cost?</small></div><div className="unit-lever"><span><Sparkles size={16} /></span><strong>Activation</strong><small>Which product moments help a learner experience value?</small></div><div className="unit-lever"><span><Heart size={16} /></span><strong>Retention</strong><small>What keeps a peer learning loop useful over time?</small></div><div className="unit-lever"><span><WalletCards size={16} /></span><strong>Contribution</strong><small>Which offer supports access and sustainable service?</small></div></div>
    </div>
  )
}

function CircleDollarSignIcon() {
  return <WalletCards size={24} />
}

function GoToMarketPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const phases = [
    { key: 'Focus', title: 'Start with a focused learner need', body: 'Explore one clearly defined student context and a tangible career skill journey. Learn directly from the people the product is meant to serve.', icon: Target, deliverable: 'Validated problem narrative', status: 'Proposed first move' },
    { key: 'Prototype', title: 'Make the learning loop tangible', body: 'Test the profile → gap → peer → practice journey in a lightweight, measurable prototype. Observe where learners feel clarity and where they get stuck.', icon: Sparkles, deliverable: 'Observed learner journey', status: 'Product hypothesis' },
    { key: 'Pilot', title: 'Build with a learning community', body: 'Invite a small, intentional community to try real skill exchanges and practice moments. Gather feedback before making adoption claims.', icon: Users, deliverable: 'Qualitative pilot learning', status: 'Future validation' },
    { key: 'Repeat', title: 'Turn learning into a repeatable playbook', body: 'Refine onboarding, trust, community operations, and institutional fit based on evidence from the pilot.', icon: TrendingUp, deliverable: 'Repeatable adoption motion', status: 'Future target' },
  ]
  const CurrentIcon = phases[active].icon
  return (
    <div className="page-stack">
      <div className="gtm-hero"><div className="gtm-hero-graphic"><div className="gtm-road"><span /><span /><span /><span /></div><div className="gtm-road-car"><Network size={17} /></div><div className="gtm-map-pin pin-one"><Target size={15} /></div><div className="gtm-map-pin pin-two"><Users size={15} /></div><div className="gtm-map-pin pin-three"><Award size={15} /></div><span className="gtm-graphic-label">LEARN → REFINE → GROW</span></div><div className="gtm-hero-copy"><Badge tone="purple" dot>PROPOSED GO-TO-MARKET</Badge><h2>Prove the learning loop.<br /><span>Then earn the right to scale.</span></h2><p>A focused, evidence-first route from learner insight to a repeatable campus and community motion.</p><div className="gtm-hero-status"><Info size={14} />Strategic hypothesis · not a current launch claim</div></div></div>
      <div className="gtm-strategy-head"><div><span className="eyebrow">A LEARN-FIRST PATH</span><h2>Progress through evidence, not assumptions.</h2></div><button className="text-button" onClick={() => toast('This go-to-market sequence is saved as a proposed strategy concept.')}>Save strategy note <Bookmark size={14} /></button></div>
      <div className="gtm-main-grid"><div className="gtm-phase-rail">{phases.map((phase, index) => <button key={phase.key} className={`gtm-phase-button ${active === index ? 'gtm-phase-active' : ''}`} onClick={() => setActive(index)}><span className="gtm-phase-number">0{index + 1}</span><span className="gtm-phase-dot"><phase.icon size={15} /></span><span className="gtm-phase-text"><strong>{phase.key}</strong><small>{phase.status}</small></span><ChevronRight size={15} /></button>)}</div><Card className="gtm-phase-detail"><div className="gtm-detail-top"><Badge tone="purple">PHASE 0{active + 1}</Badge><span className="gtm-detail-status"><i />{phases[active].status}</span></div><div className="gtm-detail-icon"><CurrentIcon size={22} /></div><h3>{phases[active].title}</h3><p>{phases[active].body}</p><div className="gtm-deliverable"><span><CheckCircle2 size={15} />Learning deliverable</span><strong>{phases[active].deliverable}</strong></div><div className="gtm-phase-controls"><button className="text-button" onClick={() => setActive((active + phases.length - 1) % phases.length)}><ArrowLeft size={14} />Previous</button><button className="text-button" onClick={() => setActive((active + 1) % phases.length)}>Next phase <ArrowRight size={14} /></button></div></Card></div>
      <div className="gtm-guardrails"><div><span><ShieldCheck size={17} /></span><div><strong>Measure the right things.</strong><small>Learning quality, mutual value, and trust—not vanity traction.</small></div></div><div><span><MessageCircle size={17} /></span><div><strong>Listen before scaling.</strong><small>Use feedback to refine what the product promises.</small></div></div><div><span><Info size={17} /></span><div><strong>Keep claims evidence-based.</strong><small>Distinguish future targets from observed outcomes.</small></div></div></div>
      <div className="gtm-bottom-cta"><div><span className="eyebrow">EXPLORE THE PRODUCT JOURNEY</span><h3>See the learner experience in action.</h3></div><Button size="sm" onClick={() => navigate('/app/dashboard')} icon={ArrowRight}>Open student demo</Button></div>
    </div>
  )
}

function FinancialsPage() {
  const toast = useToast()
  const [scenarioRows, setScenarioRows] = usePersistentState('skillsync-financial-scenario', [])
  const [formOpen, setFormOpen] = useState(false)
  const [period, setPeriod] = useState('')
  const [revenue, setRevenue] = useState('')
  const [cost, setCost] = useState('')
  const addRow = (e) => { e.preventDefault(); if (!period.trim() || revenue === '' || cost === '') return; setScenarioRows([...scenarioRows, { id: Date.now(), period: period.trim(), revenue: Number(revenue), cost: Number(cost) }]); setPeriod(''); setRevenue(''); setCost(''); setFormOpen(false); toast('Illustrative scenario row added locally.') }
  const clearRows = () => { setScenarioRows([]); toast('Local scenario rows cleared.') }
  const totalData = useMemo(() => scenarioRows.map((row) => ({ period: row.period, revenue: row.revenue, cost: row.cost })), [scenarioRows])
  return (
    <div className="page-stack">
      <div className="financials-hero"><div className="financials-hero-copy"><Badge tone="blue" dot>FINANCIAL PROJECTIONS</Badge><h2>Clear numbers.<br /><span>Clear labels.</span></h2><p>Actuals, assumptions, targets, and projections should never blur together. This page is intentionally source-led.</p><div className="financial-status-strip"><span className="status-dot" />Source workbook missing <i /> No actuals loaded <i /> No projections invented</div></div><div className="financials-hero-art"><div className="fin-chart-bars"><i /><i /><i /><i /><i /><i /></div><div className="fin-chart-line"><svg viewBox="0 0 180 80" aria-hidden="true"><path d="M2 65 C38 54 42 58 66 44 S105 51 126 27 S157 30 178 8" /></svg></div><div className="fin-chart-label"><BarChart3 size={17} /><span>Source-first model</span></div><span className="fin-chart-dash dash-one" /><span className="fin-chart-dash dash-two" /></div></div>
      <WorkbookNotice />
      <div className="finance-section-head"><div><span className="eyebrow">PROJECTION VIEW</span><h2>No source-backed projections loaded.</h2><p>Financial figures are withheld until the workbook is available. You may add a separate, clearly labeled scenario below.</p></div><div className="finance-legend"><span><i className="legend-actual" />Source actual</span><span><i className="legend-projection" />Projection / assumption</span></div></div>
      <Card className="projection-chart-card"><div className="projection-chart-top"><div><strong>Illustrative scenario builder</strong><span>Only values you enter are plotted; they are not workbook data.</span></div><div className="projection-actions">{scenarioRows.length > 0 && <button className="text-button" onClick={clearRows}>Clear scenario <RotateCcw size={13} /></button>}<Button size="sm" onClick={() => setFormOpen(true)} icon={Plus}>Add scenario row</Button></div></div>{scenarioRows.length ? <div className="projection-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={totalData} margin={{ top: 15, right: 12, left: -12, bottom: 0 }}><defs><linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5f57eb" stopOpacity={0.2} /><stop offset="95%" stopColor="#5f57eb" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#eceef5" strokeDasharray="4 5" /><XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#8b90a1', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b90a1', fontSize: 11 }} /><ChartTooltip contentStyle={{ borderRadius: 12, borderColor: '#e8e8f0', fontSize: 12 }} formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Scenario']} /><Area type="monotone" dataKey="revenue" stroke="#635bdb" fill="url(#revenueGradient)" strokeWidth={2.4} name="Revenue assumption" /><Area type="monotone" dataKey="cost" stroke="#2fbda3" fill="transparent" strokeWidth={2.4} name="Cost assumption" /></AreaChart></ResponsiveContainer></div> : <EmptyChart label="No projection data loaded · Add your own clearly labeled scenario rows" />}<div className="projection-table-wrap">{scenarioRows.length > 0 && <table className="projection-table"><thead><tr><th>Period</th><th>Revenue assumption</th><th>Cost assumption</th><th>Net scenario</th><th /></tr></thead><tbody>{scenarioRows.map((row) => <tr key={row.id}><td>{row.period}</td><td>₹{row.revenue.toLocaleString('en-IN')}</td><td>₹{row.cost.toLocaleString('en-IN')}</td><td>₹{(row.revenue - row.cost).toLocaleString('en-IN')}</td><td><button className="icon-button table-remove" onClick={() => setScenarioRows(scenarioRows.filter((item) => item.id !== row.id))} aria-label={`Remove ${row.period}`}><X size={14} /></button></td></tr>)}</tbody></table>}</div><div className="projection-caption"><Info size={14} /><span>User-entered scenario only · not a forecast, target, or actual</span></div></Card>
      <div className="financial-classification-grid"><div><span className="classification-mark mark-actual"><CheckCircle2 size={16} /></span><strong>Actual</strong><small>Observed and traceable to a credible source.</small><Badge tone="neutral">Not loaded</Badge></div><div><span className="classification-mark mark-assumption"><Lightbulb size={16} /></span><strong>Assumption</strong><small>An explicit input used to explore a possible scenario.</small><Badge tone="blue">Optional user input</Badge></div><div><span className="classification-mark mark-target"><Target size={16} /></span><strong>Future target</strong><small>A goal, not a result. Must be labeled and justified.</small><Badge tone="neutral">Not supplied</Badge></div><div><span className="classification-mark mark-projection"><TrendingUp size={16} /></span><strong>Projection</strong><small>A modeled future scenario, dependent on stated assumptions.</small><Badge tone="neutral">Not supplied</Badge></div></div>
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Add an illustrative scenario row" subtitle="Your entries stay local and are not represented as workbook data."><form className="modal-form" onSubmit={addRow}><Field label="Period or scenario label"><TextInput value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="e.g. Scenario A" required /></Field><div className="scenario-input-row"><Field label="Revenue assumption (₹)"><input type="number" min="0" className="text-input" value={revenue} onChange={(e) => setRevenue(e.target.value)} required /></Field><Field label="Cost assumption (₹)"><input type="number" min="0" className="text-input" value={cost} onChange={(e) => setCost(e.target.value)} required /></Field></div><div className="modal-form-foot"><span><Info size={14} />This is an assumption, not a forecast.</span><Button type="submit" icon={Plus}>Add scenario</Button></div></form></Modal>
    </div>
  )
}

function FundingPage() {
  const toast = useToast()
  const [interest, setInterest] = usePersistentState('skillsync-funding-interest', false)
  const [showNotes, setShowNotes] = useState(false)
  const fundingAreas = [
    ['Product & learning experience', 'Develop a thoughtful, focused learner journey.', Sparkles],
    ['Trust & community design', 'Establish safe, reciprocal peer learning patterns.', Users],
    ['Pilot learning', 'Test the experience and learn from real feedback.', Target],
    ['Evidence & operations', 'Build the foundations for responsible measurement.', BarChart3],
  ]
  return (
    <div className="page-stack">
      <div className="funding-hero"><div className="funding-sky"><span className="funding-star star-a" /><span className="funding-star star-b" /><span className="funding-star star-c" /><div className="funding-center"><Network size={27} /><span>build<br />with intent</span></div><div className="funding-orbit funding-orbit-a" /><div className="funding-orbit funding-orbit-b" /></div><div className="funding-hero-copy"><Badge tone="purple" dot>FUNDING NARRATIVE</Badge><h2>Build the infrastructure<br />for <span>learning together.</span></h2><p>SkillSync is an early product concept focused on peer-powered skill growth. The next step is to validate the learner need, the exchange experience, and a sustainable model.</p><div className="funding-stage-pill"><span /><strong>Stage framing</strong><small>Prototype / validation concept · no raise amount stated</small></div></div></div>
      <WorkbookNotice />
      <div className="funding-body-grid"><Card className="funding-thesis-card"><span className="eyebrow">THE INVESTMENT THESIS</span><h3>Unlock value already inside the student community.</h3><p>Students bring skills to teach and questions they want help answering. SkillSync proposes a connective layer that can map gaps, surface complementary peers, and turn learning into practical evidence.</p><div className="funding-thesis-tags"><span><Check size={14} />Career-oriented</span><span><Check size={14} />Peer-powered</span><span><Check size={14} />Practice-led</span></div><button className="funding-source-link" onClick={() => setShowNotes(!showNotes)}><Info size={14} />{showNotes ? 'Hide model notes' : 'View assumptions & open questions'} <ChevronDown size={14} className={showNotes ? 'rotate-up' : ''} /></button>{showNotes && <div className="funding-notes"><strong>Open questions to validate</strong><span>Which learner segment feels this need most acutely?</span><span>What makes a peer exchange safe and consistently useful?</span><span>Which revenue model can sustain access and support?</span><span>What does the source workbook indicate about capital needs?</span></div>}</Card><Card className="funding-uses-card"><span className="eyebrow">POTENTIAL USES OF CAPITAL</span><h3>Invest in learning, not vanity metrics.</h3><p>Illustrative focus areas—no allocation percentages or funding ask supplied.</p><div className="funding-areas">{fundingAreas.map(([title, desc, Icon]) => <div className="funding-area" key={title}><span><Icon size={16} /></span><div><strong>{title}</strong><small>{desc}</small></div><ChevronRight size={15} /></div>)}</div></Card></div>
      <DemoNotice>Funding stage and use-of-funds language is a proposed narrative only. It is not an investment offer or a confirmed raise plan.</DemoNotice>
      <div className="funding-bottom-cta"><div><span className="eyebrow">KEEP THE CONVERSATION GROUNDED</span><h3>Every number needs a source. Every ambition needs a plan.</h3><p>The project brief mentions an Excel workbook; it was not available alongside this frontend.</p></div><Button variant={interest ? 'soft' : 'primary'} onClick={() => { setInterest(!interest); toast(interest ? 'Funding note removed from your local prototype.' : 'Funding follow-up noted locally. No contact details were collected.') }} icon={interest ? Check : Bookmark}>{interest ? 'Noted in this demo' : 'Save funding note'}</Button></div>
    </div>
  )
}

function AboutPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [activeValue, setActiveValue] = useState('Reciprocity')
  const values = [
    { title: 'Clarity', icon: Target, body: 'Help students turn an ambitious career goal into a next skill worth practicing.' },
    { title: 'Reciprocity', icon: Heart, body: 'Treat every learner as someone who has something to teach—and something to learn.' },
    { title: 'Proof', icon: Award, body: 'Make room for real practice and tangible evidence, not just content completion.' },
  ]
  const current = values.find((item) => item.title === activeValue) || values[0]
  const CurrentIcon = current.icon
  return (
    <div className="page-stack">
      <div className="about-hero"><div className="about-hero-pattern"><span /><span /><span /><div className="about-hero-center"><Network size={28} /><small>SKILLSYNC</small></div></div><div className="about-hero-copy"><Badge tone="mint" dot>OUR POINT OF VIEW</Badge><h2>Careers aren’t built<br />in isolation. <span>Skills shouldn’t be either.</span></h2><p>SkillSync starts with a simple belief: students are not just consumers of learning. They are a network of knowledge, capability, and possibility.</p><Button size="sm" onClick={() => navigate('/app/peer-matching')} icon={ArrowRight}>Explore peer matching</Button></div></div>
      <div className="about-mission-grid"><Card className="mission-statement"><span className="eyebrow">THE MISSION</span><div className="mission-quote-mark">“</div><h3>Make career growth feel more human, practical, and within reach.</h3><p>By connecting career direction to peer-powered practice, SkillSync aims to help learners make progress with the skills—and people—already around them.</p><span className="mission-foot"><span />A product ambition · not an impact claim</span></Card><Card className="about-values-card"><span className="eyebrow">WHAT GUIDES THE EXPERIENCE</span><div className="about-values-list">{values.map((item) => { const Icon = item.icon; return <button key={item.title} className={activeValue === item.title ? 'about-value-active' : ''} onClick={() => setActiveValue(item.title)}><span><Icon size={16} /></span><strong>{item.title}</strong><ChevronRight size={15} /></button>})}</div><div className="about-value-detail"><span><CurrentIcon size={18} /></span><strong>{current.title}</strong><p>{current.body}</p></div></Card></div>
      <div className="about-team-section"><div className="about-team-heading"><div><span className="eyebrow">ABOUT / TEAM</span><h2>People and perspective<br /><span>make the product.</span></h2><p>Team identities and biographies were not supplied, so this prototype does not invent them.</p></div><button className="team-source-badge" onClick={() => toast('Team details were not included in the project brief.')}><Info size={14} />Team details not provided</button></div><div className="about-team-cards"><Card className="team-open-card"><div className="team-open-icon"><Users size={20} /></div><span className="eyebrow">THE TEAM BEHIND SKILLSYNC</span><h3>Founder & team profiles</h3><p>Add verified names, backgrounds, and contributions here when the team details are ready to share.</p><Badge tone="neutral">Details awaited</Badge></Card><Card className="team-role-card"><span className="eyebrow">THE WORK TO BRING TOGETHER</span><div className="team-role"><span><Lightbulb size={16} /></span><div><strong>Learning experience</strong><small>Translate career goals into meaningful practice.</small></div></div><div className="team-role"><span><Network size={16} /></span><div><strong>Peer community</strong><small>Design for trust, reciprocity, and human connection.</small></div></div><div className="team-role"><span><BarChart3 size={16} /></span><div><strong>Evidence & sustainability</strong><small>Measure outcomes honestly and build with discipline.</small></div></div></Card></div></div>
      <div className="about-bottom-cta"><div><span className="eyebrow">SKILLSYNC</span><h3>Find the right skill. Find the right person. Build the right career.</h3></div><Button onClick={() => navigate('/app/dashboard')} icon={ArrowRight}>Explore the student demo</Button></div>
    </div>
  )
}

function BusinessOrImpactRoute() {
  return <Navigate to="/app/business-model" replace />
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="skill-profile" element={<SkillProfilePage />} />
            <Route path="skill-gap" element={<SkillGapPage />} />
            <Route path="peer-matching" element={<PeerMatchingPage />} />
            <Route path="peers/:peerId" element={<PeerProfilePage />} />
            <Route path="learning-path" element={<LearningPathPage />} />
            <Route path="activities" element={<ActivitiesPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="skill-exchange" element={<SkillExchangePage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="social-impact" element={<SocialImpactPage />} />
            <Route path="business-model" element={<BusinessModelPage />} />
            <Route path="market" element={<MarketPage />} />
            <Route path="unit-economics" element={<UnitEconomicsPage />} />
            <Route path="go-to-market" element={<GoToMarketPage />} />
            <Route path="financials" element={<FinancialsPage />} />
            <Route path="funding" element={<FundingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
