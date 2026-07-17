import { getTaskStats } from '../utils/taskHelpers'

function StatCard({ label, value, icon, color, bgColor }) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-border-light)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
          {label}
        </span>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
    </div>
  )
}

function BarChart({ data, label }) {
  const max = Math.max(...data.map(d => d.total), 1)

  return (
    <div
      className="p-5 rounded-xl"
      style={{
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-border-light)',
      }}
    >
      <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
        {label}
      </h3>
      <div className="space-y-3">
        {data.map(item => (
          <div key={item.id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: item.color }}>
                {item.label}
              </span>
              <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                {item.completed}/{item.total}
              </span>
            </div>
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--color-bg-secondary)' }}
            >
              {/* Total bar */}
              <div className="h-full relative rounded-full" style={{ width: `${(item.total / max) * 100}%` }}>
                {/* Background */}
                <div
                  className="absolute inset-0 rounded-full bar-animate"
                  style={{ backgroundColor: item.bg, width: '100%' }}
                />
                {/* Completed portion */}
                <div
                  className="absolute inset-y-0 left-0 rounded-full bar-animate"
                  style={{
                    backgroundColor: item.color,
                    width: item.total > 0 ? `${(item.completed / item.total) * 100}%` : '0%',
                    animationDelay: '0.3s',
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsPage({ tasks }) {
  const stats = getTaskStats(tasks)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Análises
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Acompanhe seu progresso e produtividade
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total"
          value={stats.total}
          color="var(--color-text-primary)"
          bgColor="var(--color-bg-secondary)"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: 'var(--color-text-secondary)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          label="Concluídas"
          value={stats.completed}
          color="var(--color-accent)"
          bgColor="var(--color-accent-light)"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--color-accent)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          }
        />
        <StatCard
          label="Pendentes"
          value={stats.pending}
          color="var(--color-pri-media)"
          bgColor="var(--color-pri-media-bg)"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: 'var(--color-pri-media)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Taxa"
          value={`${stats.rate}%`}
          color={stats.rate >= 70 ? 'var(--color-accent)' : stats.rate >= 40 ? 'var(--color-pri-media)' : 'var(--color-danger)'}
          bgColor={stats.rate >= 70 ? 'var(--color-accent-light)' : stats.rate >= 40 ? 'var(--color-pri-media-bg)' : 'var(--color-danger-bg)'}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
              style={{ color: stats.rate >= 70 ? 'var(--color-accent)' : stats.rate >= 40 ? 'var(--color-pri-media)' : 'var(--color-danger)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      {/* Progress Ring */}
      <div
        className="p-6 rounded-xl flex items-center gap-8 flex-wrap"
        style={{
          backgroundColor: 'var(--color-surface)',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--color-border-light)',
        }}
      >
        <div className="relative w-32 h-32 flex-shrink-0 mx-auto sm:mx-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path
              d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--color-bg-secondary)"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="3"
              strokeDasharray={`${stats.rate}, 100`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.8s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {stats.rate}%
            </span>
            <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
              concluído
            </span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Progresso Geral
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {stats.completed} {stats.completed === 1 ? 'tarefa concluída' : 'tarefas concluídas'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-bg-secondary)' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {stats.pending} {stats.pending === 1 ? 'tarefa pendente' : 'tarefas pendentes'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarChart data={stats.byCategory} label="Por Categoria" />
        <BarChart data={stats.byPriority} label="Por Prioridade" />
      </div>
    </div>
  )
}
