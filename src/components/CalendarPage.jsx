import { useState } from 'react'
import { getDaysInMonth, getFirstDayOfMonth, getTasksForDate, getCategoryConfig, formatDateShort } from '../utils/taskHelpers'

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function CalendarPage({ tasks }) {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0])

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const todayStr = today.toISOString().split('T')[0]

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(y => y - 1)
    } else {
      setCurrentMonth(m => m - 1)
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(y => y + 1)
    } else {
      setCurrentMonth(m => m + 1)
    }
  }

  function dateStr(day) {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const selectedTasks = getTasksForDate(tasks, selectedDate)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Calendário
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Visualize suas tarefas por data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar Grid */}
        <div
          className="lg:col-span-2 p-5 rounded-xl"
          style={{
            backgroundColor: 'var(--color-surface)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--color-border-light)',
          }}
        >
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map(day => (
              <div
                key={day}
                className="text-center text-xs font-semibold py-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const ds = dateStr(day)
              const dayTasks = getTasksForDate(tasks, ds)
              const isToday = ds === todayStr
              const isSelected = ds === selectedDate
              const hasTasks = dayTasks.length > 0

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(ds)}
                  className="aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-pointer relative"
                  style={{
                    backgroundColor: isSelected
                      ? 'var(--color-accent)'
                      : isToday
                        ? 'var(--color-accent-subtle)'
                        : 'transparent',
                    color: isSelected
                      ? 'white'
                      : isToday
                        ? 'var(--color-accent)'
                        : 'var(--color-text-primary)',
                    fontWeight: isToday || isSelected ? 700 : 400,
                    border: isToday && !isSelected ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = isToday ? 'var(--color-accent-subtle)' : 'transparent'
                    }
                  }}
                >
                  <span className="text-sm">{day}</span>
                  {hasTasks && (
                    <div className="flex gap-0.5">
                      {dayTasks.slice(0, 3).map((t, idx) => (
                        <div
                          key={idx}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: isSelected ? 'hsla(0,0%,100%,0.7)' : getCategoryConfig(t.category).color,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected day tasks */}
        <div
          className="p-5 rounded-xl"
          style={{
            backgroundColor: 'var(--color-surface)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--color-border-light)',
          }}
        >
          <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            {selectedDate === todayStr ? 'Hoje' : formatDateShort(selectedDate)}
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
            {selectedTasks.length} {selectedTasks.length === 1 ? 'tarefa' : 'tarefas'}
          </p>

          {selectedTasks.length > 0 ? (
            <div className="space-y-2.5">
              {selectedTasks.map(task => {
                const cat = getCategoryConfig(task.category)
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg ${task.completed ? 'task-completed' : ''}`}
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border-light)',
                    }}
                  >
                    <p
                      className={`text-sm font-medium mb-1 ${task.completed ? 'task-title' : ''}`}
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {task.completed ? '✓ ' : ''}{task.title}
                    </p>
                    <span
                      className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                      style={{ backgroundColor: cat.bg, color: cat.color }}
                    >
                      {cat.label}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg
                className="w-10 h-10 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={0.8}
                style={{ color: 'var(--color-border)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Sem tarefas nesta data
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
