export default function FilterBar({ filter, onFilterChange, counts }) {
  const filters = [
    { id: 'todas', label: 'Todas', count: counts.total },
    { id: 'pendentes', label: 'Pendentes', count: counts.pending },
    { id: 'concluidas', label: 'Concluídas', count: counts.completed },
  ]

  return (
    <div className="flex gap-2">
      {filters.map(f => {
        const isActive = filter === f.id
        return (
          <button
            key={f.id}
            id={`filter-${f.id}`}
            onClick={() => onFilterChange(f.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-surface)',
              color: isActive ? 'white' : 'var(--color-text-secondary)',
              boxShadow: isActive ? 'none' : 'var(--shadow-sm)',
              border: isActive ? 'none' : '1px solid var(--color-border-light)',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'var(--color-accent)'
                e.currentTarget.style.color = 'var(--color-accent)'
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'var(--color-border-light)'
                e.currentTarget.style.color = 'var(--color-text-secondary)'
              }
            }}
          >
            {f.label}
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
              style={{
                backgroundColor: isActive ? 'hsla(0,0%,100%,0.25)' : 'var(--color-bg-secondary)',
                color: isActive ? 'white' : 'var(--color-text-muted)',
              }}
            >
              {f.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
