import {
  Building2,
  FileText,
  GraduationCap,
  Laptop,
  Stamp,
  Stethoscope,
} from 'lucide-react'
import type { AdmissionTaskIcon } from '../../types'

export const admissionIconMap: Record<AdmissionTaskIcon, typeof FileText> = {
  documents: FileText,
  medical: Stethoscope,
  online: Laptop,
  onboarding: Building2,
  visa: Stamp,
  courses: GraduationCap,
}
