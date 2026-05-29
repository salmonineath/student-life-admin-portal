import type { User } from '../types'

export const AVATAR_COLORS = [
  '#2563EB', '#10B981', '#F59E0B', '#6366F1', '#EC4899',
  '#60A5FA', '#8B5CF6', '#EF4444', '#14B8A6', '#F97316',
]

export const getAvatarColor = (id: string) =>
  AVATAR_COLORS[parseInt(id) % AVATAR_COLORS.length]

export const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase()

export const mockUsers: User[] = [
  { id: '1',  name: 'Alice Johnson',    email: 'a.johnson@univers.edu',  role: 'student', status: 'active',    major: 'Computer Science',  joinedAt: '2024-09-01', lastActive: '2026-05-28' },
  { id: '2',  name: 'Benjamin Carter',  email: 'b.carter@univers.edu',   role: 'faculty', status: 'active',    department: 'Engineering',   joinedAt: '2023-01-15', lastActive: '2026-05-27' },
  { id: '3',  name: 'Clara Nguyen',     email: 'c.nguyen@univers.edu',   role: 'student', status: 'active',    major: 'Mathematics',        joinedAt: '2026-05-10', lastActive: '2026-05-26' },
  { id: '4',  name: 'David Okafor',     email: 'd.okafor@univers.edu',   role: 'staff',   status: 'active',    department: 'IT Support',    joinedAt: '2022-06-01', lastActive: '2026-05-25' },
  { id: '5',  name: 'Emma Williams',    email: 'e.williams@univers.edu', role: 'student', status: 'inactive',  major: 'Biology',            joinedAt: '2024-09-01', lastActive: '2026-03-15' },
  { id: '6',  name: 'Felix Martinez',   email: 'f.martinez@univers.edu', role: 'faculty', status: 'active',    department: 'Mathematics',   joinedAt: '2021-08-20', lastActive: '2026-05-27' },
  { id: '7',  name: 'Grace Kim',        email: 'g.kim@univers.edu',      role: 'student', status: 'active',    major: 'Computer Science',   joinedAt: '2026-05-18', lastActive: '2026-05-28' },
  { id: '8',  name: 'Henry Thompson',   email: 'h.thompson@univers.edu', role: 'student', status: 'suspended', major: 'History',            joinedAt: '2024-09-01', lastActive: '2026-04-01' },
  { id: '9',  name: 'Isabel Santos',    email: 'i.santos@univers.edu',   role: 'student', status: 'active',    major: 'Psychology',         joinedAt: '2026-05-05', lastActive: '2026-05-29' },
  { id: '10', name: 'James Lee',        email: 'j.lee@univers.edu',      role: 'student', status: 'active',    major: 'Economics',          joinedAt: '2023-09-01', lastActive: '2026-05-24' },
  { id: '11', name: 'Kira Patel',       email: 'k.patel@univers.edu',    role: 'faculty', status: 'active',    department: 'Physics',       joinedAt: '2020-01-05', lastActive: '2026-05-22' },
  { id: '12', name: 'Liam Anderson',    email: 'l.anderson@univers.edu', role: 'student', status: 'inactive',  major: 'Art',                joinedAt: '2024-09-01', lastActive: '2026-02-28' },
  { id: '13', name: 'Maya Robinson',    email: 'm.robinson@univers.edu', role: 'student', status: 'active',    major: 'Nursing',            joinedAt: '2026-04-20', lastActive: '2026-05-28' },
  { id: '14', name: 'Noah Wilson',      email: 'n.wilson@univers.edu',   role: 'staff',   status: 'suspended', department: 'Administration',joinedAt: '2022-03-15', lastActive: '2026-01-10' },
  { id: '15', name: 'Olivia Chen',      email: 'o.chen@univers.edu',     role: 'student', status: 'active',    major: 'Chemistry',          joinedAt: '2023-09-01', lastActive: '2026-05-27' },
  { id: '16', name: 'Paul Adeyemi',     email: 'p.adeyemi@univers.edu',  role: 'student', status: 'active',    major: 'Electrical Eng.',    joinedAt: '2025-01-10', lastActive: '2026-05-23' },
  { id: '17', name: 'Quinn Nakamura',   email: 'q.nakamura@univers.edu', role: 'staff',   status: 'active',    department: 'Finance',       joinedAt: '2023-07-01', lastActive: '2026-05-20' },
  { id: '18', name: 'Rosa Ferreira',    email: 'r.ferreira@univers.edu', role: 'student', status: 'active',    major: 'Architecture',       joinedAt: '2026-05-02', lastActive: '2026-05-29' },
  { id: '19', name: 'Samuel Owusu',     email: 's.owusu@univers.edu',    role: 'student', status: 'inactive',  major: 'Sociology',          joinedAt: '2024-01-15', lastActive: '2026-01-30' },
  { id: '20', name: 'Tina Zhao',        email: 't.zhao@univers.edu',     role: 'faculty', status: 'active',    department: 'Chemistry',     joinedAt: '2019-08-01', lastActive: '2026-05-28' },
]
