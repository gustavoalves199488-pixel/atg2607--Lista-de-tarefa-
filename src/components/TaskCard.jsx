import { getCategoryConfig, getPriorityConfig, formatDateShort, isOverdue, isToday } from '../utils/taskHelpers'

export default function TaskCard({ task, onToggle, onDelete, style }) {
  const cat = getCategoryConfig(task.category)
  const pri = getPriorityConfig(task.priority)
  const overdue = !task.completed && isOverdue(task.dueDate)
  const today = isToday(task.dueDate)

  return (
    <div
      className={`task-enter ${task.completed ? 'task-completed' : ''}`}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        border: `1px solid ${overdue ? 'var(--color-pri-alta)' : 'var(--color-border-light)'}`,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        transition: 'all 0.25s var(--ease-smooth)',
        ...style,
      }}
      onMouseEnter={e => {
        if (!task.completed) {
          e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Checkbox */}
      <div
        className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
        role="checkbox"
        aria-checked={task.completed}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(task.id) } }}
      >
        {task.completed && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <p
          className="task-title text-sm font-semibold truncate mb-1.5"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {task.title}
        </p>

        {/* Tags row */}
        <div className="flex items-center flex-wrap gap-1.5">
          {/* Category tag */}
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: cat.bg, color: cat.color }}
          >
            {cat.label}
          </span>

          {/* Priority tag */}
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: pri.bg, color: pri.color }}
          >
            {pri.label}
          </span>

          {/* Date */}
          {task.dueDate && (
            <span
              className="inline-flex items-center gap-1 text-xs ml-1"
              style={{
                color: overdue ? 'var(--color-danger)' : today ? 'var(--color-accent)' : 'var(--color-text-muted)',
                fontWeight: overdue || today ? 600 : 400,
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {overdue ? 'Atrasada' : today ? 'Hoje' : formatDateShort(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        id={`delete-task-${task.id}`}
        onClick={() => onDelete(task.id)}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer flex-shrink-0"
        style={{ color: 'var(--color-text-muted)', backgroundColor: 'transparent' }}
        onMouseEnter={e => {
          e.currentTarget.style.color = 'var(--color-danger)'
          e.currentTarget.style.backgroundColor = 'var(--color-danger-bg)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'var(--color-text-muted)'
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        aria-label="Excluir tarefa"
      >
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}
