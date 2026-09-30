import {
  Activity, Banknote, Building2, Circle, Droplet, FileText, Fingerprint, Flower2, Headset, Landmark,
  Microscope, Palette, ScanLine, Scissors, Search, Smartphone, Smile, Sparkles, Stethoscope, UserPlus,
  Users, UtensilsCrossed, Wrench,
} from 'lucide-react'

// Registry for icons referenced by name from mock data (keeps the bundle tree-shaken).
const registry = {
  Activity, Banknote, Building2, Droplet, FileText, Fingerprint, Flower2, Headset, Landmark, Microscope,
  Palette, ScanLine, Scissors, Search, Smartphone, Smile, Sparkles, Stethoscope, UserPlus, Users,
  UtensilsCrossed, Wrench,
}

export default function Icon({ name, ...props }) {
  const Cmp = registry[name] || Circle
  return <Cmp {...props} />
}
