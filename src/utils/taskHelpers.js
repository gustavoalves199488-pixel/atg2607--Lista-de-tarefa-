export const CATEGORIES = [
  { id: 'trabalho', label: 'Trabalho', color: 'var(--color-cat-trabalho)', bg: 'var(--color-cat-trabalho-bg)' },
  { id: 'pessoal', label: 'Pessoal', color: 'var(--color-cat-pessoal)', bg: 'var(--color-cat-pessoal-bg)' },
  { id: 'estudos', label: 'Estudos', color: 'var(--color-cat-estudos)', bg: 'var(--color-cat-estudos-bg)' },
]

export const PRIORITIES = [
  { id: 'alta', label: 'Alta', color: 'var(--color-pri-alta)', bg: 'var(--color-pri-alta-bg)' },
  { id: 'media', label: 'Média', color: 'var(--color-pri-media)', bg: 'var(--color-pri-media-bg)' },
  { id: 'baixa', label: 'Baixa', color: 'var(--color-pri-baixa)', bg: 'var(--color-pri-baixa-bg)' },
]

export function createTask({ title, category, priority, dueDate }) {
  return {
    id: crypto.randomUUID(),
    title,
    category,
    priority,
    dueDate,
    completed: false,
    createdAt: new Date().toISOString(),
  }
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateShort(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

export function isOverdue(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr + 'T00:00:00')
  return due < today
}

export function isToday(dateStr) {
  if (!dateStr) return false
  const today = new Date().toISOString().split('T')[0]
  return dateStr === today
}

export function getCategoryConfig(categoryId) {
  return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0]
}

export function getPriorityConfig(priorityId) {
  return PRIORITIES.find(p => p.id === priorityId) || PRIORITIES[2]
}

export function filterTasks(tasks, filter) {
  switch (filter) {
    case 'pendentes': return tasks.filter(t => !t.completed)
    case 'concluidas': return tasks.filter(t => t.completed)
    default: return tasks
  }
}

export function getTaskStats(tasks) {
  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const pending = total - completed
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0

  const byCategory = CATEGORIES.map(cat => ({
    ...cat,
    total: tasks.filter(t => t.category === cat.id).length,
    completed: tasks.filter(t => t.category === cat.id && t.completed).length,
  }))

  const byPriority = PRIORITIES.map(pri => ({
    ...pri,
    total: tasks.filter(t => t.priority === pri.id).length,
    completed: tasks.filter(t => t.priority === pri.id && t.completed).length,
  }))

  return { total, completed, pending, rate, byCategory, byPriority }
}

export function getTasksForDate(tasks, dateStr) {
  return tasks.filter(t => t.dueDate === dateStr)
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}
