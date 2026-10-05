import {
  Activity, Award, BarChart3, BookOpen, BriefcaseBusiness, Compass,
  GraduationCap, Heart, LayoutDashboard, Lightbulb, Network, Sparkles,
  Users, WalletCards, Target, CircleDollarSign, TrendingUp, Rocket,
  Handshake, UserRound, ChartNoAxesCombined,
} from 'lucide-react'

export const demoProfile = {
  name: 'Sakshi Jadhav',
  goal: 'Investment Banking',
  teaches: ['Financial Analysis'],
  wants: ['Digital Marketing'],
  currentSkills: ['Financial Analysis', 'Excel', 'Business Analysis'],
}

export const sourceFacts = [
  { value: '4.33 crore', label: 'Enrolled higher-education students', source: 'AISHE 2021–22' },
  { value: '28.4%', label: 'Gross Enrolment Ratio', source: 'AISHE 2021–22' },
  { value: '54.81%', label: 'Graduates expected to be employable', source: 'India Skills Report 2025' },
]

export const skillTags = [
  'Financial Analysis', 'Digital Marketing', 'Python', 'Data Analytics',
  'Excel', 'Leadership', 'Communication', 'Product Management',
]

export const journeySteps = [
  { title: 'Create Skill Profile', icon: UserRound, detail: 'Map what you already know, what you enjoy, and the career you are working toward.' },
  { title: 'Add Skills I Can Teach', icon: Heart, detail: 'Turn your strengths into a practical way to help someone else move forward.' },
  { title: 'Add Skills I Want to Learn', icon: Lightbulb, detail: 'Be specific about the skills that would make your next career step feel more achievable.' },
  { title: 'Define Career Goal', icon: Target, detail: 'Choose a direction so recommendations can stay connected to a meaningful outcome.' },
  { title: 'AI Identifies Skill Gaps', icon: Sparkles, detail: 'A simulated product flow compares your current skill profile with a role-oriented skill map.' },
  { title: 'AI Recommends Peers', icon: Users, detail: 'Explore complementary learners who may be able to teach what you want to learn.' },
  { title: 'Learn + Practice', icon: BookOpen, detail: 'Use short activities, peer sessions, and real-world practice to build confidence.' },
  { title: 'Track Progress', icon: TrendingUp, detail: 'Keep your momentum visible through a personal, locally saved progress view.' },
  { title: 'Build Skill Proof', icon: Award, detail: 'Collect reflections and artifacts that help make learning concrete and shareable.' },
]

export const peers = [
  {
    id: 'aarav', name: 'Aarav Mehta', initials: 'AM', color: 'lavender',
    canTeach: ['Digital Marketing', 'SEO', 'Social Media Marketing'],
    wantsToLearn: ['Financial Analysis'], careerGoal: 'Brand Management',
    availability: 'Weekdays, 7 PM – 9 PM', availabilityFilter: 'Weekdays',
    learningStyle: 'Hands-on', skillLevel: 'Intermediate', fitLabel: 'Illustrative top match',
    score: 94, rating: '4.8/5', exchanged: 8, sessions: 24,
    intro: 'I like turning marketing ideas into experiments people can measure. Looking to learn the finance fundamentals behind strong brand decisions.',
  },
  {
    id: 'priya', name: 'Priya Shah', initials: 'PS', color: 'peach',
    canTeach: ['Python', 'Data Analytics'], wantsToLearn: ['Product Management'],
    careerGoal: 'Product Analytics', availability: 'Weekends, flexible', availabilityFilter: 'Weekends',
    learningStyle: 'Visual', skillLevel: 'Advanced', fitLabel: 'Strong fit',
    score: null, rating: 'Demo profile', exchanged: null, sessions: null,
    intro: 'I enjoy using data to make product questions easier to answer. I learn best through visual walkthroughs and small projects.',
  },
  {
    id: 'rahul', name: 'Rahul Kulkarni', initials: 'RK', color: 'blue',
    canTeach: ['Excel', 'Financial Modelling'], wantsToLearn: ['Digital Marketing'],
    careerGoal: 'Corporate Finance', availability: 'Weekday evenings', availabilityFilter: 'Weekdays',
    learningStyle: 'Hands-on', skillLevel: 'Intermediate', fitLabel: 'Good fit',
    score: null, rating: 'Demo profile', exchanged: null, sessions: null,
    intro: 'A spreadsheet-first learner exploring how finance and go-to-market decisions connect.',
  },
  {
    id: 'ananya', name: 'Ananya Deshmukh', initials: 'AD', color: 'mint',
    canTeach: ['Communication', 'Presentation Design'], wantsToLearn: ['Business Analysis'],
    careerGoal: 'Management Consulting', availability: 'Mornings', availabilityFilter: 'Mornings',
    learningStyle: 'Discussion-led', skillLevel: 'Intermediate', fitLabel: 'Good fit',
    score: null, rating: 'Demo profile', exchanged: null, sessions: null,
    intro: 'I love making complex ideas clear. Currently sharpening my structured problem-solving skills.',
  },
  {
    id: 'rohan', name: 'Rohan Patel', initials: 'RP', color: 'rose',
    canTeach: ['Product Management', 'User Research'], wantsToLearn: ['Data Analytics'],
    careerGoal: 'Product Management', availability: 'Weekends', availabilityFilter: 'Weekends',
    learningStyle: 'Project-based', skillLevel: 'Advanced', fitLabel: 'Relevant fit',
    score: null, rating: 'Demo profile', exchanged: null, sessions: null,
    intro: 'Building a toolkit for thoughtful product decisions, one small experiment at a time.',
  },
]

export const skillGaps = [
  { name: 'Financial Modelling', current: 45, target: 85, tone: 'purple' },
  { name: 'Valuation', current: 35, target: 80, tone: 'blue' },
  { name: 'Advanced Excel', current: 55, target: 90, tone: 'teal' },
]

export const learningStages = [
  { id: 'excel', title: 'Advanced Excel', subtitle: 'Build speed and structure in spreadsheet work.', tag: 'Practice activity', icon: BarChart3 },
  { id: 'modelling', title: 'Financial Modelling', subtitle: 'Connect assumptions, statements, and outputs.', tag: 'Peer session', icon: ChartNoAxesCombined },
  { id: 'valuation', title: 'Valuation', subtitle: 'Explore the logic behind common valuation approaches.', tag: 'Guided practice', icon: Target },
  { id: 'statements', title: 'Financial Statement Analysis', subtitle: 'Read the story behind key financial statements.', tag: 'Case activity', icon: BookOpen },
  { id: 'case', title: 'Case Practice', subtitle: 'Apply your thinking to a structured business case.', tag: 'Practice activity', icon: BriefcaseBusiness },
  { id: 'review', title: 'Peer Review', subtitle: 'Explain your approach and get a fresh perspective.', tag: 'Skill exchange', icon: Users },
  { id: 'proof', title: 'Skill Proof', subtitle: 'Capture a clear artifact that demonstrates your progress.', tag: 'Portfolio moment', icon: Award },
]

export const activities = [
  { id: 'model', title: 'Financial Modelling', category: 'Finance', description: 'Map a simple business assumption into a clean model structure.', color: 'violet', icon: ChartNoAxesCombined },
  { id: 'audit', title: 'Digital Marketing Audit', category: 'Marketing', description: 'Spot what is working and what is missing in a sample campaign.', color: 'mint', icon: Compass },
  { id: 'excel', title: 'Excel Dashboard Challenge', category: 'Data', description: 'Turn a small dataset into a focused, useful dashboard.', color: 'blue', icon: BarChart3 },
  { id: 'case', title: 'Marketing Case Breakdown', category: 'Strategy', description: 'Practice moving from a fuzzy brief to a sharp recommendation.', color: 'peach', icon: Lightbulb },
  { id: 'pitch', title: 'Pitch Your Product', category: 'Communication', description: 'Make a short, persuasive case for an idea you care about.', color: 'rose', icon: Sparkles },
]

export const navGroups = [
  {
    label: 'MY SKILLS',
    items: [
      { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
      { label: 'Skill profile', path: '/app/skill-profile', icon: UserRound },
      { label: 'AI skill gap', path: '/app/skill-gap', icon: Sparkles },
      { label: 'Learning path', path: '/app/learning-path', icon: BookOpen },
      { label: '20-min activities', path: '/app/activities', icon: Activity },
      { label: 'Progress & proof', path: '/app/progress', icon: Award },
    ],
  },
  {
    label: 'PEER NETWORK',
    items: [
      { label: 'Find a peer', path: '/app/peer-matching', icon: Network },
      { label: 'Peer profile', path: '/app/peers/aarav', icon: Users },
      { label: 'Skill exchange', path: '/app/skill-exchange', icon: Handshake },
      { label: 'Community', path: '/app/community', icon: Heart },
    ],
  },
  {
    label: 'THE OPPORTUNITY',
    items: [
      { label: 'Social impact', path: '/app/social-impact', icon: Heart },
      { label: 'Pricing / model', path: '/app/business-model', icon: WalletCards },
      { label: 'Market opportunity', path: '/app/market', icon: BarChart3 },
      { label: 'Unit economics', path: '/app/unit-economics', icon: CircleDollarSign },
      { label: 'Go-to-market', path: '/app/go-to-market', icon: Rocket },
      { label: 'Financial projections', path: '/app/financials', icon: TrendingUp },
      { label: 'Funding', path: '/app/funding', icon: WalletCards },
      { label: 'About / team', path: '/app/about', icon: GraduationCap },
    ],
  },
]

export const routeTitles = {
  '/app/dashboard': ['Good to see you, Sakshi', 'Your career journey, in sync.'],
  '/app/skill-profile': ['Your skill profile', 'A clear picture of what you can teach—and where you want to grow.'],
  '/app/skill-gap': ['AI skill gap analysis', 'See the bridge between your current skills and your career goal.'],
  '/app/peer-matching': ['Peer matching', 'Find someone whose strengths complement your next step.'],
  '/app/learning-path': ['Your learning path', 'A practical sequence, shaped around your investment banking goal.'],
  '/app/activities': ['20-minute activities', 'Small, focused practice sessions that fit into real student life.'],
  '/app/progress': ['Progress & skill proof', 'Make your learning visible, one practice moment at a time.'],
  '/app/skill-exchange': ['Skill exchange', 'A balanced exchange where both people teach and both people grow.'],
  '/app/community': ['SkillSync community', 'Share what you are learning and celebrate useful progress.'],
  '/app/social-impact': ['Social impact', 'A more connected path from learning to opportunity.'],
  '/app/business-model': ['Pricing & business model', 'A proposed model designed to keep peer learning accessible.'],
  '/app/market': ['Market opportunity', 'A large need. A focused starting point.'],
  '/app/unit-economics': ['Unit economics', 'The operating questions behind a sustainable learning network.'],
  '/app/go-to-market': ['Go-to-market', 'A proposed path from focused learning communities to repeatable adoption.'],
  '/app/financials': ['Financial projections', 'A transparent view of what is known—and what still needs a source.'],
  '/app/funding': ['Funding', 'Building the right foundations for a trusted, peer-powered network.'],
  '/app/about': ['Why SkillSync', 'A career journey should not have to happen alone.'],
}
