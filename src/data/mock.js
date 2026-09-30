// Realistic mock data for the QFlow UI prototype. No backend — everything lives here.

export const categories = [
  { id: 'clinic', label: 'Clinic', icon: 'Stethoscope', tint: 'bg-brand-50 text-brand-600' },
  { id: 'salon', label: 'Salon', icon: 'Scissors', tint: 'bg-coral-50 text-coral-600' },
  { id: 'bank', label: 'Bank', icon: 'Landmark', tint: 'bg-mint-50 text-mint-600' },
  { id: 'diagnostics', label: 'Diagnostics', icon: 'Microscope', tint: 'bg-amber-50 text-amber-600' },
  { id: 'government', label: 'Gov. Service', icon: 'Building2', tint: 'bg-ink-100 text-ink-700' },
  { id: 'repair', label: 'Repair Center', icon: 'Wrench', tint: 'bg-success-50 text-success-600' },
  { id: 'restaurant', label: 'Restaurant', icon: 'UtensilsCrossed', tint: 'bg-coral-50 text-coral-500' },
]

export const businesses = [
  {
    id: 'citycare',
    name: 'CityCare Clinic',
    category: 'clinic',
    categoryLabel: 'Multi-speciality Clinic',
    initials: 'CC',
    logoBg: 'from-brand-500 to-brand-700',
    distance: '1.2 km',
    ahead: 12,
    wait: 24,
    open: true,
    rating: 4.8,
    reviews: 2184,
    verified: true,
    address: '42 Lakeview Avenue, Gulshan 2, Dhaka',
    hours: '8:00 AM – 9:00 PM',
    currentToken: 'A-024',
    waiting: 11,
    estWait: 22,
    cover: 'from-brand-600 via-brand-500 to-mint-400',
    services: [
      { id: 'gen', name: 'General Consultation', icon: 'Stethoscope', wait: 22, people: 11, prefix: 'A', duration: '10–15 min', fee: '৳ 800' },
      { id: 'dental', name: 'Dental', icon: 'Smile', wait: 35, people: 6, prefix: 'D', duration: '20–30 min', fee: '৳ 1,200' },
      { id: 'blood', name: 'Blood Test', icon: 'Droplet', wait: 8, people: 4, prefix: 'B', duration: '5 min', fee: '৳ 450' },
      { id: 'skin', name: 'Skin Specialist', icon: 'Sparkles', wait: 41, people: 9, prefix: 'S', duration: '15–20 min', fee: '৳ 1,500' },
    ],
  },
  {
    id: 'lumiere',
    name: 'Lumière Hair Studio',
    category: 'salon',
    categoryLabel: 'Hair & Beauty',
    initials: 'LH',
    logoBg: 'from-coral-500 to-amber-500',
    distance: '0.8 km',
    ahead: 4,
    wait: 15,
    open: true,
    rating: 4.9,
    reviews: 864,
    verified: true,
    address: '7 Road 11, Banani, Dhaka',
    hours: '10:00 AM – 10:00 PM',
    currentToken: 'H-112',
    waiting: 4,
    estWait: 15,
    cover: 'from-coral-500 via-amber-500 to-brand-400',
    services: [
      { id: 'cut', name: 'Haircut & Styling', icon: 'Scissors', wait: 15, people: 4, prefix: 'H', duration: '30 min', fee: '৳ 900' },
      { id: 'color', name: 'Hair Color', icon: 'Palette', wait: 40, people: 2, prefix: 'C', duration: '90 min', fee: '৳ 3,500' },
      { id: 'spa', name: 'Facial & Spa', icon: 'Flower2', wait: 20, people: 3, prefix: 'F', duration: '45 min', fee: '৳ 2,200' },
    ],
  },
  {
    id: 'meridian',
    name: 'Meridian Bank',
    category: 'bank',
    categoryLabel: 'Banking · Gulshan Branch',
    initials: 'MB',
    logoBg: 'from-mint-500 to-ink-800',
    distance: '2.4 km',
    ahead: 18,
    wait: 31,
    open: true,
    rating: 4.5,
    reviews: 3120,
    verified: true,
    address: '118 Gulshan Avenue, Dhaka',
    hours: '10:00 AM – 4:00 PM',
    currentToken: 'T-208',
    waiting: 18,
    estWait: 31,
    cover: 'from-ink-800 via-mint-600 to-mint-400',
    services: [
      { id: 'teller', name: 'Cash & Teller', icon: 'Banknote', wait: 31, people: 18, prefix: 'T', duration: '5 min', fee: 'Free' },
      { id: 'account', name: 'Account Opening', icon: 'UserPlus', wait: 25, people: 5, prefix: 'N', duration: '20 min', fee: 'Free' },
      { id: 'loan', name: 'Loan Desk', icon: 'FileText', wait: 45, people: 7, prefix: 'L', duration: '30 min', fee: 'Free' },
    ],
  },
  {
    id: 'precision',
    name: 'Precision Diagnostics',
    category: 'diagnostics',
    categoryLabel: 'Imaging & Lab',
    initials: 'PD',
    logoBg: 'from-amber-500 to-coral-500',
    distance: '3.1 km',
    ahead: 7,
    wait: 14,
    open: true,
    rating: 4.7,
    reviews: 1290,
    verified: true,
    address: '23 Satmasjid Road, Dhanmondi, Dhaka',
    hours: '7:00 AM – 11:00 PM',
    currentToken: 'X-051',
    waiting: 7,
    estWait: 14,
    cover: 'from-amber-500 via-coral-500 to-brand-500',
    services: [
      { id: 'xray', name: 'X-Ray', icon: 'ScanLine', wait: 14, people: 7, prefix: 'X', duration: '10 min', fee: '৳ 1,000' },
      { id: 'mri', name: 'MRI Scan', icon: 'Activity', wait: 55, people: 3, prefix: 'M', duration: '45 min', fee: '৳ 9,500' },
    ],
  },
  {
    id: 'passport',
    name: 'Regional Passport Office',
    category: 'government',
    categoryLabel: 'Government Service',
    initials: 'RP',
    logoBg: 'from-ink-700 to-ink-900',
    distance: '5.6 km',
    ahead: 46,
    wait: 72,
    open: false,
    rating: 4.1,
    reviews: 5402,
    verified: true,
    address: 'Agargaon Administrative Area, Dhaka',
    hours: '9:00 AM – 5:00 PM',
    currentToken: 'P-310',
    waiting: 46,
    estWait: 72,
    cover: 'from-ink-800 via-ink-600 to-brand-600',
    services: [
      { id: 'bio', name: 'Biometric Enrolment', icon: 'Fingerprint', wait: 72, people: 46, prefix: 'P', duration: '10 min', fee: 'Govt. fee' },
    ],
  },
  {
    id: 'fixhub',
    name: 'FixHub Device Repair',
    category: 'repair',
    categoryLabel: 'Phones & Laptops',
    initials: 'FH',
    logoBg: 'from-success-500 to-mint-500',
    distance: '1.9 km',
    ahead: 3,
    wait: 9,
    open: true,
    rating: 4.6,
    reviews: 742,
    verified: false,
    address: 'Level 4, Bashundhara City, Dhaka',
    hours: '10:00 AM – 8:00 PM',
    currentToken: 'R-044',
    waiting: 3,
    estWait: 9,
    cover: 'from-success-500 via-mint-400 to-brand-500',
    services: [
      { id: 'screen', name: 'Screen Replacement', icon: 'Smartphone', wait: 9, people: 3, prefix: 'R', duration: '40 min', fee: 'From ৳ 2,000' },
      { id: 'diag', name: 'Free Diagnosis', icon: 'Search', wait: 5, people: 2, prefix: 'Q', duration: '10 min', fee: 'Free' },
    ],
  },
  {
    id: 'saffron',
    name: 'Saffron Table',
    category: 'restaurant',
    categoryLabel: 'Modern Bengali Dining',
    initials: 'ST',
    logoBg: 'from-amber-500 to-coral-600',
    distance: '0.6 km',
    ahead: 6,
    wait: 20,
    open: true,
    rating: 4.8,
    reviews: 1988,
    verified: true,
    address: '15 Kemal Ataturk Ave, Banani',
    hours: '12:00 PM – 11:30 PM',
    currentToken: 'G-017',
    waiting: 6,
    estWait: 20,
    cover: 'from-amber-500 via-coral-500 to-coral-600',
    services: [
      { id: 'table2', name: 'Table for 1–2', icon: 'UtensilsCrossed', wait: 12, people: 3, prefix: 'G', duration: '—', fee: 'Free' },
      { id: 'table4', name: 'Table for 3–6', icon: 'Users', wait: 20, people: 3, prefix: 'G', duration: '—', fee: 'Free' },
    ],
  },
]

export const customer = {
  name: 'Alex Rahman',
  first: 'Alex',
  phone: '+880 1712-345 678',
  location: 'Gulshan 2, Dhaka',
}

export const myToken = {
  token: 'A-031',
  business: 'CityCare Clinic',
  businessId: 'citycare',
  service: 'General Consultation',
  date: 'Wed, 30 Sep 2026',
  joinedAt: '11:12 AM',
  estTime: '11:40 AM',
  ahead: 7,
  serving: 'A-024',
  wait: 18,
  counter: 'Counter 03',
  party: 1,
}

export const customerNotifications = [
  { id: 1, type: 'turn', title: 'It’s your turn — please proceed to Counter 03.', body: 'CityCare Clinic · Token A-031', time: 'Just now', unread: true },
  { id: 2, type: 'next', title: 'You’re next!', body: 'Head to the waiting area. Dr. Farhana will see you shortly.', time: '4 min ago', unread: true },
  { id: 3, type: 'almost', title: 'You’re almost there.', body: 'Only 3 people are ahead of you. Time to leave now.', time: '11 min ago', unread: false },
  { id: 4, type: 'ahead', title: 'Only 5 people are ahead of you.', body: 'Estimated turn 11:40 AM · 12 min', time: '16 min ago', unread: false },
  { id: 5, type: 'joined', title: 'You joined the queue at CityCare Clinic', body: 'Token A-031 · General Consultation', time: '28 min ago', unread: false },
  { id: 6, type: 'promo', title: 'Lumière Hair Studio has a short queue right now', body: 'Only 2 people waiting · 0.8 km away', time: 'Yesterday', unread: false },
]

export const history = [
  { id: 1, business: 'CityCare Clinic', initials: 'CC', logoBg: 'from-brand-500 to-brand-700', service: 'General Consultation', date: '30 Sep 2026', wait: '18 min', saved: '42 min', status: 'Active' },
  { id: 2, business: 'Meridian Bank', initials: 'MB', logoBg: 'from-mint-500 to-ink-800', service: 'Cash & Teller', date: '26 Sep 2026', wait: '11 min', saved: '38 min', status: 'Completed' },
  { id: 3, business: 'Lumière Hair Studio', initials: 'LH', logoBg: 'from-coral-500 to-amber-500', service: 'Haircut & Styling', date: '21 Sep 2026', wait: '6 min', saved: '51 min', status: 'Completed' },
  { id: 4, business: 'Precision Diagnostics', initials: 'PD', logoBg: 'from-amber-500 to-coral-500', service: 'X-Ray', date: '17 Sep 2026', wait: '—', saved: '—', status: 'Cancelled' },
  { id: 5, business: 'Regional Passport Office', initials: 'RP', logoBg: 'from-ink-700 to-ink-900', service: 'Biometric Enrolment', date: '12 Sep 2026', wait: '24 min', saved: '1h 46m', status: 'Completed' },
  { id: 6, business: 'Saffron Table', initials: 'ST', logoBg: 'from-amber-500 to-coral-600', service: 'Table for 3–6', date: '8 Sep 2026', wait: '—', saved: '—', status: 'No-show' },
  { id: 7, business: 'FixHub Device Repair', initials: 'FH', logoBg: 'from-success-500 to-mint-500', service: 'Screen Replacement', date: '3 Sep 2026', wait: '9 min', saved: '35 min', status: 'Completed' },
]

// ---------- Business dashboard ----------

const services = ['General Consultation', 'Dental', 'Blood Test', 'Skin Specialist']
export const businessServices = services

export const initialQueue = [
  { id: 'A-027', customer: 'Nadia Islam', service: 'General Consultation', wait: 26, priority: 'none', status: 'serving', counter: 1, party: 1, type: 'Walk-in', phone: '+880 1711-220 481' },
  { id: 'A-028', customer: 'Tanvir Hossain', service: 'Blood Test', wait: 24, priority: 'elderly', status: 'serving', counter: 2, party: 1, type: 'Appointment', phone: '+880 1819-004 552' },
  { id: 'A-029', customer: 'Priya Sen', service: 'Dental', wait: 21, priority: 'none', status: 'called', counter: 3, party: 1, type: 'Walk-in', phone: '+880 1552-718 330' },
  { id: 'A-030', customer: 'Omar Faruk', service: 'General Consultation', wait: 19, priority: 'vip', status: 'called', counter: null, party: 2, type: 'Appointment', phone: '+880 1911-876 102' },
  { id: 'A-031', customer: 'Alex Rahman', service: 'General Consultation', wait: 18, priority: 'none', status: 'waiting', counter: null, party: 1, type: 'Remote', phone: '+880 1712-345 678' },
  { id: 'A-032', customer: 'Sadia Karim', service: 'Skin Specialist', wait: 15, priority: 'pregnant', status: 'waiting', counter: null, party: 1, type: 'Remote', phone: '+880 1678-221 904' },
  { id: 'A-033', customer: 'Rafiq Ahmed', service: 'General Consultation', wait: 13, priority: 'none', status: 'waiting', counter: null, party: 3, type: 'Walk-in', phone: '+880 1733-904 118' },
  { id: 'A-034', customer: 'Maya Chowdhury', service: 'Blood Test', wait: 11, priority: 'none', status: 'waiting', counter: null, party: 1, type: 'Remote', phone: '+880 1817-551 667' },
  { id: 'A-035', customer: 'Hasan Mahmud', service: 'General Consultation', wait: 9, priority: 'none', status: 'waiting', counter: null, party: 1, type: 'Walk-in', phone: '+880 1515-300 212' },
  { id: 'A-036', customer: 'Lina Akter', service: 'Dental', wait: 7, priority: 'none', status: 'waiting', counter: null, party: 1, type: 'Appointment', phone: '+880 1911-442 880' },
  { id: 'A-037', customer: 'Karim Uddin', service: 'General Consultation', wait: 4, priority: 'disabled', status: 'waiting', counter: null, party: 2, type: 'Remote', phone: '+880 1710-667 239' },
  { id: 'A-038', customer: 'Farzana Yasmin', service: 'Skin Specialist', wait: 2, priority: 'none', status: 'waiting', counter: null, party: 1, type: 'Remote', phone: '+880 1612-904 557' },
]

export const initialCompleted = [
  { id: 'A-026', customer: 'Imran Kabir', service: 'Dental', served: '11:08 AM', duration: '14 min', counter: 3 },
  { id: 'A-025', customer: 'Ruma Das', service: 'General Consultation', served: '11:02 AM', duration: '11 min', counter: 1 },
  { id: 'A-024', customer: 'Jamal Hossain', service: 'Blood Test', served: '10:57 AM', duration: '6 min', counter: 2 },
]

export const priorities = {
  none: { label: 'Standard', cls: 'bg-ink-100 text-ink-600' },
  elderly: { label: 'Elderly', cls: 'bg-amber-50 text-amber-600' },
  pregnant: { label: 'Pregnant', cls: 'bg-coral-50 text-coral-600' },
  disabled: { label: 'Accessibility', cls: 'bg-mint-50 text-mint-600' },
  emergency: { label: 'Emergency', cls: 'bg-coral-500 text-white' },
  vip: { label: 'VIP', cls: 'bg-brand-600 text-white' },
}

export const staff = [
  { id: 1, name: 'Dr. Sarah Karim', role: 'General Physician', avatar: 'SK', color: 'from-brand-400 to-brand-600', status: 'On duty', served: 38, rating: 4.9, avgTime: '9m 40s', counter: 1 },
  { id: 2, name: 'Rahim Chowdhury', role: 'Lab Technician', avatar: 'RC', color: 'from-mint-400 to-mint-600', status: 'On duty', served: 52, rating: 4.8, avgTime: '5m 12s', counter: 2 },
  { id: 3, name: 'Dr. Farhana Alam', role: 'Dentist', avatar: 'FA', color: 'from-coral-500 to-amber-500', status: 'On duty', served: 17, rating: 4.9, avgTime: '18m 05s', counter: 3 },
  { id: 4, name: 'Dr. Arif Hasan', role: 'Dermatologist', avatar: 'AH', color: 'from-amber-500 to-coral-500', status: 'On break', served: 12, rating: 4.7, avgTime: '16m 30s', counter: null },
  { id: 5, name: 'Nusrat Jahan', role: 'Front Desk', avatar: 'NJ', color: 'from-ink-600 to-ink-800', status: 'On duty', served: 64, rating: 4.8, avgTime: '2m 45s', counter: null },
  { id: 6, name: 'Dr. Kamal Uddin', role: 'General Physician', avatar: 'KU', color: 'from-success-500 to-mint-500', status: 'Off today', served: 0, rating: 4.6, avgTime: '11m 10s', counter: null },
]

export const initialCounters = [
  { id: 1, name: 'Counter 01', staff: 'Dr. Sarah Karim', status: 'active', service: 'General Consultation', servedToday: 38 },
  { id: 2, name: 'Counter 02', staff: 'Rahim Chowdhury', status: 'active', service: 'Blood Test', servedToday: 52 },
  { id: 3, name: 'Counter 03', staff: 'Dr. Farhana Alam', status: 'available', service: 'Dental', servedToday: 17 },
  { id: 4, name: 'Counter 04', staff: null, status: 'paused', service: 'Skin Specialist', servedToday: 12 },
]

export const appointments = [
  { time: '09:30', name: 'Shirin Akter', service: 'Dental', doctor: 'Dr. Farhana Alam', status: 'Completed' },
  { time: '10:00', name: 'Tanvir Hossain', service: 'Blood Test', doctor: 'Rahim Chowdhury', status: 'In service' },
  { time: '10:45', name: 'Omar Faruk', service: 'General Consultation', doctor: 'Dr. Sarah Karim', status: 'Checked in' },
  { time: '11:30', name: 'Lina Akter', service: 'Dental', doctor: 'Dr. Farhana Alam', status: 'Checked in' },
  { time: '12:00', name: 'Mehedi Hasan', service: 'Skin Specialist', doctor: 'Dr. Arif Hasan', status: 'Upcoming' },
  { time: '12:15', name: 'Anika Rahman', service: 'General Consultation', doctor: 'Dr. Sarah Karim', status: 'Upcoming' },
  { time: '13:00', name: 'Sabbir Ahmed', service: 'Blood Test', doctor: 'Rahim Chowdhury', status: 'Upcoming' },
  { time: '14:30', name: 'Tasnim Ferdous', service: 'Skin Specialist', doctor: 'Dr. Arif Hasan', status: 'Upcoming' },
  { time: '15:00', name: 'Rezaul Karim', service: 'General Consultation', doctor: 'Dr. Sarah Karim', status: 'Upcoming' },
]

export const customersDirectory = [
  { name: 'Nadia Islam', phone: '+880 1711-220 481', visits: 12, last: 'Today', avgWait: '14 min', tag: 'Regular', nps: 10 },
  { name: 'Tanvir Hossain', phone: '+880 1819-004 552', visits: 4, last: 'Today', avgWait: '9 min', tag: 'Elderly', nps: 9 },
  { name: 'Priya Sen', phone: '+880 1552-718 330', visits: 7, last: 'Today', avgWait: '17 min', tag: 'Regular', nps: 8 },
  { name: 'Omar Faruk', phone: '+880 1911-876 102', visits: 22, last: 'Today', avgWait: '6 min', tag: 'VIP', nps: 10 },
  { name: 'Alex Rahman', phone: '+880 1712-345 678', visits: 3, last: 'Today', avgWait: '18 min', tag: 'New', nps: 9 },
  { name: 'Sadia Karim', phone: '+880 1678-221 904', visits: 5, last: 'Today', avgWait: '12 min', tag: 'Priority', nps: 9 },
  { name: 'Imran Kabir', phone: '+880 1817-332 005', visits: 9, last: '2 days ago', avgWait: '21 min', tag: 'Regular', nps: 7 },
  { name: 'Ruma Das', phone: '+880 1715-889 441', visits: 2, last: '5 days ago', avgWait: '11 min', tag: 'New', nps: 10 },
  { name: 'Jamal Hossain', phone: '+880 1612-770 319', visits: 15, last: '1 week ago', avgWait: '8 min', tag: 'Regular', nps: 6 },
]

// ---------- Analytics ----------
export const hourlyVolume = [
  { h: '8a', v: 14 }, { h: '9a', v: 28 }, { h: '10a', v: 46 }, { h: '11a', v: 58 }, { h: '12p', v: 52 },
  { h: '1p', v: 34 }, { h: '2p', v: 30 }, { h: '3p', v: 36 }, { h: '4p', v: 41 }, { h: '5p', v: 38 },
  { h: '6p', v: 26 }, { h: '7p', v: 18 }, { h: '8p', v: 9 },
]

export const weekServed = [
  { d: 'Mon', served: 162, wait: 21 }, { d: 'Tue', served: 208, wait: 26 }, { d: 'Wed', served: 184, wait: 18 },
  { d: 'Thu', served: 176, wait: 19 }, { d: 'Fri', served: 121, wait: 14 }, { d: 'Sat', served: 196, wait: 23 },
  { d: 'Sun', served: 170, wait: 20 },
]

export const monthTrend = [132, 141, 138, 150, 147, 162, 158, 171, 166, 180, 176, 188, 184, 192, 186, 201, 197, 210, 204, 199, 212, 220, 215, 226, 219, 232, 228, 240, 236, 248]
export const waitTrend = [31, 30, 29, 30, 28, 27, 28, 26, 25, 26, 24, 24, 23, 22, 23, 21, 21, 20, 21, 19, 20, 19, 18, 19, 18, 17, 18, 17, 18, 18]

// 7 days × 13 hours heat map (queue volume index 0..1)
export const heatmap = [
  [0.1, 0.3, 0.55, 0.7, 0.62, 0.4, 0.35, 0.42, 0.5, 0.45, 0.3, 0.2, 0.1],
  [0.15, 0.35, 0.7, 0.95, 1.0, 0.6, 0.4, 0.45, 0.55, 0.5, 0.32, 0.22, 0.12],
  [0.12, 0.3, 0.6, 0.78, 0.7, 0.45, 0.38, 0.4, 0.52, 0.46, 0.3, 0.2, 0.1],
  [0.1, 0.28, 0.58, 0.74, 0.66, 0.42, 0.36, 0.44, 0.5, 0.44, 0.28, 0.18, 0.08],
  [0.05, 0.18, 0.35, 0.42, 0.3, 0.12, 0.2, 0.3, 0.36, 0.34, 0.26, 0.2, 0.12],
  [0.14, 0.34, 0.66, 0.82, 0.76, 0.55, 0.48, 0.5, 0.56, 0.5, 0.4, 0.3, 0.16],
  [0.08, 0.22, 0.46, 0.6, 0.55, 0.4, 0.34, 0.38, 0.42, 0.38, 0.28, 0.18, 0.08],
]

export const servicePerformance = [
  { name: 'General Consultation', served: 96, avg: 11, target: 12, sat: 4.8 },
  { name: 'Blood Test', served: 52, avg: 5, target: 6, sat: 4.9 },
  { name: 'Dental', served: 21, avg: 18, target: 15, sat: 4.7 },
  { name: 'Skin Specialist', served: 15, avg: 16, target: 15, sat: 4.6 },
]

export const counterPerformance = [
  { name: 'Counter 01', value: 38, util: 0.92 },
  { name: 'Counter 02', value: 52, util: 0.88 },
  { name: 'Counter 03', value: 17, util: 0.71 },
  { name: 'Counter 04', value: 12, util: 0.34 },
]

export const satisfaction = { score: 4.8, responses: 1284, breakdown: [72, 19, 6, 2, 1] }

// ---------- Marketing ----------
export const testimonials = [
  {
    quote: 'Our waiting room used to have 60 people on a Tuesday morning. Now it has twelve — and they all arrive right on time. Patients actually thank the front desk.',
    name: 'Dr. Sarah Karim',
    role: 'Medical Director, CityCare Clinic',
    avatar: 'SK',
    color: 'from-brand-400 to-brand-600',
    metric: '−63%',
    metricLabel: 'lobby crowding',
  },
  {
    quote: 'We rolled QFlow out to 14 branches in a week. Average teller wait dropped from 31 to 12 minutes and our complaints desk got very quiet.',
    name: 'Imtiaz Rahman',
    role: 'Head of Retail Ops, Meridian Bank',
    avatar: 'IR',
    color: 'from-mint-400 to-mint-600',
    metric: '2.6×',
    metricLabel: 'faster service',
  },
  {
    quote: 'Clients join the queue from the café next door and walk in exactly when their stylist is ready. It feels like a luxury service — without the extra staff.',
    name: 'Camille Duarte',
    role: 'Owner, Lumière Hair Studio',
    avatar: 'CD',
    color: 'from-coral-500 to-amber-500',
    metric: '+41%',
    metricLabel: 'repeat bookings',
  },
]

export const pricing = [
  {
    name: 'Starter',
    price: { monthly: 0, yearly: 0 },
    tagline: 'For single-counter shops getting started.',
    features: ['1 location · 1 counter', 'Up to 300 tokens / month', 'QR queue join', 'SMS + push notifications', 'Basic analytics'],
    cta: 'Start free',
  },
  {
    name: 'Growth',
    price: { monthly: 49, yearly: 39 },
    tagline: 'For busy clinics, salons and service centers.',
    features: ['Up to 3 locations · 10 counters', 'Unlimited tokens', 'Appointments + walk-in hybrid', 'Priority & group queues', 'TV display mode', 'WhatsApp notifications', 'Advanced analytics'],
    cta: 'Start 14-day trial',
    featured: true,
  },
  {
    name: 'Business',
    price: { monthly: 149, yearly: 119 },
    tagline: 'For banks, hospitals and multi-branch networks.',
    features: ['Unlimited locations & counters', 'AI Queue Assistant', 'Custom branding & domain', 'SSO, roles & audit logs', 'API & webhooks', 'Dedicated success manager'],
    cta: 'Talk to sales',
  },
]

export const faqs = [
  { q: 'Do my customers need to download an app?', a: 'No. Customers can scan a QR code at your entrance or open a link and get a token in under 10 seconds — no account and no install. QFlow also works as an installable PWA for regulars.' },
  { q: 'What happens to customers who don’t have a smartphone?', a: 'Your front desk can add walk-in customers in one click and print a paper token. They appear on the same live queue and on the TV display alongside remote customers.' },
  { q: 'How is the estimated waiting time calculated?', a: 'QFlow learns each service’s real handling time per counter and staff member, then combines it with live queue length, no-show probability and open counters. Estimates update in real time over WebSockets.' },
  { q: 'Can we combine appointments with walk-ins?', a: 'Yes. The hybrid queue slots booked appointments into the live flow at their scheduled time while keeping walk-in waits fair and predictable.' },
  { q: 'Which notification channels are supported?', a: 'Push notifications, SMS and WhatsApp. You decide when customers are notified — for example when 5 people are ahead, when they are next, and when it’s their turn.' },
  { q: 'Is customer data secure?', a: 'All data is encrypted in transit and at rest. We collect only what’s needed to run the queue, and businesses control their own retention policies.' },
]

export const industries = [
  { name: 'Clinics & Hospitals', icon: 'Stethoscope', stat: '38 min', statLabel: 'avg. saved per visit' },
  { name: 'Banks', icon: 'Landmark', stat: '2.6×', statLabel: 'faster teller flow' },
  { name: 'Salons & Spas', icon: 'Scissors', stat: '+41%', statLabel: 'repeat bookings' },
  { name: 'Diagnostic Centers', icon: 'Microscope', stat: '−52%', statLabel: 'lobby crowding' },
  { name: 'Government Offices', icon: 'Building2', stat: '1h 46m', statLabel: 'saved per citizen' },
  { name: 'Restaurants', icon: 'UtensilsCrossed', stat: '+28%', statLabel: 'table turnover' },
  { name: 'Repair Centers', icon: 'Wrench', stat: '4.9★', statLabel: 'customer rating' },
  { name: 'Service Centers', icon: 'Headset', stat: '−47%', statLabel: 'walk-outs' },
]
