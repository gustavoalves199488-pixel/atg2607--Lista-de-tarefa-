import { getCategoryConfig, getPriorityConfig, formatDateShort } from '../utils/taskHelpers'

export default function TrashPage({ trashTasks, onRestore, onDeleteForever, onEmptyTrash }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            Lixeira
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Visualize, restaure ou exclua definitivamente suas tarefas excluídas
          </p>
        </div>
        {trashTasks.length > 0 && (
          <button
            onClick={onEmptyTrash}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            style={{
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              border: '1.5px solid var(--color-danger)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--color-danger)'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'var(--color-danger-bg)'
              e.currentTarget.style.color = 'var(--color-danger)'
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Esvaziar Lixeira
          </button>
        )}
      </div>

      {trashTasks.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1.5px dashed var(--color-border-light)',
          }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
            <svg className="w-8 h-8" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Sua lixeira está vazia
          </h3>
          <p className="text-sm mt-1 max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
            Tarefas que forem excluídas no painel inicial aparecerão aqui temporariamente
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {trashTasks.map(task => {
            const cat = getCategoryConfig(task.category)
            const pri = getPriorityConfig(task.priority)

            return (
              <div
                key={task.id}
                className="task-enter"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid var(--color-border-light)',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className="task-title text-sm font-semibold truncate mb-1.5"
                    style={{ color: 'var(--color-text-primary)', textDecoration: 'line-through', opacity: 0.6 }}
                  >
                    {task.title}
                  </p>

                  <div className="flex items-center flex-wrap gap-1.5">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: cat.bg, color: cat.color, opacity: 0.7 }}
                    >
                      {cat.label}
                    </span>

                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: pri.bg, color: pri.color, opacity: 0.7 }}
                    >
                      {pri.label}
                    </span>

                    {task.dueDate && (
                      <span
                        className="inline-flex items-center gap-1 text-xs ml-1"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDateShort(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Restaurar */}
                  <button
                    onClick={() => onRestore(task.id)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer"
                    style={{ color: 'var(--color-accent)', backgroundColor: 'transparent' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = 'var(--color-accent-subtle)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                    title="Restaurar tarefa"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
                    </svg>
                  </button>

                  {/* Excluir Definitivamente */}
                  <button
                    onClick={() => onDeleteForever(task.id)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer"
                    style={{ color: 'var(--color-text-muted)', backgroundColor: 'transparent' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = 'var(--color-danger)'
                      e.currentTarget.style.backgroundColor = 'var(--color-danger-bg)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'var(--color-text-muted)'
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                    title="Excluir permanentemente"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
