export type UserRole = 'student' | 'faculty' | 'staff'
export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  major?: string
  department?: string
  joinedAt: string
  lastActive: string
}
