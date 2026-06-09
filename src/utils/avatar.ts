export const AVATAR_COLORS = [
  '#2563EB', '#10B981', '#F59E0B', '#6366F1', '#EC4899',
  '#60A5FA', '#8B5CF6', '#EF4444', '#14B8A6', '#F97316',
]

export const getAvatarColor = (id: string) =>
  AVATAR_COLORS[parseInt(id) % AVATAR_COLORS.length]

export const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase()
