import { useState } from 'react'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'
import FilterBar from './FilterBar'
import { filterTasks } from '../utils/taskHelpers'

export default function TaskList({ tasks, onToggle, onDelete, onAdd, onUpdate }) {
  const [filter, setFilter] = useState('todas')
  const [showForm, setShowForm] = useState(false)

  const filtered = filterTasks(tasks, filter)
  const counts = {
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }

  const sorted = [...filtered].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const priOrder = { alta: 0, media: 1, baixa: 2 }
    if (priOrder[a.priority] !== priOrder[b.priority]) return priOrder[a.priority] - priOrder[b.priority]
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate)
    if (a.dueDate) return -1
    if (b.dueDate) return 1
    return 0
  })

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <FilterBar filter={filter} onFilterChange={setFilter} counts={counts} />
        <button
          id="add-task-btn"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'white',
            boxShadow: '0 2px 8px hsla(172, 66%, 40%, 0.3)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 12px hsla(172, 66%, 40%, 0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 8px hsla(172, 66%, 40%, 0.3)'
          }}
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nova Tarefa
        </button>
      </div>

      {/* Task list */}
      {sorted.length > 0 ? (
        <div className="space-y-3">
          {sorted.map((task, i) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-16 rounded-2xl"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '2px dashed var(--color-border)',
          }}
        >
          <div className="pulse-gentle mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={0.8}
              style={{ color: 'var(--color-border)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
            {filter === 'todas'
              ? 'Nenhuma tarefa ainda'
              : filter === 'pendentes'
                ? 'Nenhuma tarefa pendente'
                : 'Nenhuma tarefa concluída'}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {filter === 'todas' ? 'Clique em "Nova Tarefa" para começar!' : 'Continue assim! 🎉'}
          </p>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <TaskForm
          onSave={onAdd}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
