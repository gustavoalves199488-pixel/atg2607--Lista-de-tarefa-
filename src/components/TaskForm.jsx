import { useState } from 'react'
import { CATEGORIES, PRIORITIES, createTask } from '../utils/taskHelpers'

export default function TaskForm({ onSave, onClose, editTask = null }) {
  const [title, setTitle] = useState(editTask?.title || '')
  const [category, setCategory] = useState(editTask?.category || 'trabalho')
  const [priority, setPriority] = useState(editTask?.priority || 'media')
  const [dueDate, setDueDate] = useState(editTask?.dueDate || '')
  const [errors, setErrors] = useState({})

  function validate() {
    const newErrors = {}
    if (!title.trim()) newErrors.title = 'Título é obrigatório'
    if (!dueDate) newErrors.dueDate = 'Data de vencimento é obrigatória'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    if (editTask) {
      onSave({ ...editTask, title: title.trim(), category, priority, dueDate })
    } else {
      onSave(createTask({ title: title.trim(), category, priority, dueDate }))
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-5 pb-4" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {editTask ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                Título da tarefa
              </label>
              <input
                id="task-title-input"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Finalizar relatório trimestral"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
                style={{
                  border: `1.5px solid ${errors.title ? 'var(--color-danger)' : 'var(--color-border)'}`,
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                }}
                onFocus={e => {
                  if (!errors.title) e.currentTarget.style.borderColor = 'var(--color-accent)'
                }}
                onBlur={e => {
                  if (!errors.title) e.currentTarget.style.borderColor = 'var(--color-border)'
                }}
                autoFocus
              />
              {errors.title && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{errors.title}</p>
              )}
            </div>

            {/* Categoria & Prioridade — row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                  Categoria
                </label>
                <select
                  id="task-category-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 cursor-pointer appearance-none"
                  style={{
                    border: '1.5px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text-primary)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '36px',
                  }}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                  Prioridade
                </label>
                <select
                  id="task-priority-select"
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 cursor-pointer appearance-none"
                  style={{
                    border: '1.5px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text-primary)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '36px',
                  }}
                >
                  {PRIORITIES.map(pri => (
                    <option key={pri.id} value={pri.id}>{pri.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Data */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                Data de vencimento
              </label>
              <input
                id="task-date-input"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 cursor-pointer"
                style={{
                  border: `1.5px solid ${errors.dueDate ? 'var(--color-danger)' : 'var(--color-border)'}`,
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                }}
                onFocus={e => {
                  if (!errors.dueDate) e.currentTarget.style.borderColor = 'var(--color-accent)'
                }}
                onBlur={e => {
                  if (!errors.dueDate) e.currentTarget.style.borderColor = 'var(--color-border)'
                }}
              />
              {errors.dueDate && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={{
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-secondary)',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="task-submit-btn"
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'white',
                border: 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
            >
              {editTask ? 'Salvar' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
