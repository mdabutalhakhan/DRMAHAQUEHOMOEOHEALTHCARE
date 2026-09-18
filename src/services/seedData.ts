import { Appointment, InventoryItem, UserProfile } from '../types';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user-admin-default',
    email: 'admin@homoeo.com',
    full_name: 'Md Abutalha Khan',
    role: 'admin',
    phone: '9933506514',
  },
  {
    id: 'user-admin-1',
    email: 'admin@homoeohealthcare.com',
    full_name: 'Md Abutalha Khan',
    role: 'admin',
    phone: '9933506514',
  },
  {
    id: 'user-doc-1',
    email: 'dr.haque@homoeohealthcare.com',
    full_name: 'Dr. M. A. Haque, M.D. (Homoeo)',
    role: 'doctor',
    phone: '9933506514',
  },
  {
    id: 'user-staff-1',
    email: 'reception@homoeohealthcare.com',
    full_name: 'Clinic Front Desk Staff',
    role: 'staff',
    phone: '9933506514',
  },
];

// Pure empty array - strictly no hardcoded mock patients
export const INITIAL_APPOINTMENTS: Appointment[] = [];

// Pure empty array - strictly no hardcoded mock inventory
export const INITIAL_INVENTORY: InventoryItem[] = [];
