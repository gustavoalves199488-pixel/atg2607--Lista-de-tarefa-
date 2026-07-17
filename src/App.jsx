import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import TaskList from './components/TaskList'
import AnalyticsPage from './components/AnalyticsPage'
import CalendarPage from './components/CalendarPage'
import AuthPage from './components/AuthPage'
import TrashPage from './components/TrashPage'
import { supabase } from './utils/supabaseClient'

export default function App() {
  const [activePage, setActivePage] = useState('tarefas')
  const [session, setSession] = useState(null)
  const [tasks, setTasks] = useState([])
  const [trashTasks, setTrashTasks] = useState([])
  const [loading, setLoading] = useState(true)

  // Ouvir o estado da autenticação
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchTasks()
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchTasks()
      } else {
        setTasks([])
        setTrashTasks([])
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Carregar tarefas do Supabase
  async function fetchTasks() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Separar tarefas normais das deletadas
      const normal = []
      const trashed = []

      ;(data || []).forEach(t => {
        const item = {
          id: t.id,
          title: t.title,
          category: t.category,
          priority: t.priority,
          dueDate: t.due_date,
          completed: t.completed,
          createdAt: t.created_at,
          deletedAt: t.deleted_at
        }

        if (t.deleted_at) {
          trashed.push(item)
        } else {
          normal.push(item)
        }
      })

      setTasks(normal)
      setTrashTasks(trashed)
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addTask(task) {
    if (!session?.user) return
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: task.title,
          category: task.category,
          priority: task.priority,
          due_date: task.dueDate,
          completed: false,
          user_id: session.user.id
        }])
        .select()

      if (error) throw error

      if (data && data[0]) {
        const t = data[0]
        const newTask = {
          id: t.id,
          title: t.title,
          category: t.category,
          priority: t.priority,
          dueDate: t.due_date,
          completed: t.completed,
          createdAt: t.created_at
        }
        setTasks(prev => [newTask, ...prev])
      }
    } catch (err) {
      console.error('Erro ao adicionar tarefa:', err)
    }
  }

  async function toggleTask(id) {
    const taskToToggle = tasks.find(t => t.id === id)
    if (!taskToToggle) return

    const newCompleted = !taskToToggle.completed

    // Otimista
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t)
    )

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: newCompleted })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err)
      // Reverter se falhar
      setTasks(prev =>
        prev.map(t => t.id === id ? { ...t, completed: !newCompleted } : t)
      )
    }
  }

  // Soft delete (mover para lixeira)
  async function deleteTask(id) {
    const taskToDelete = tasks.find(t => t.id === id)
    if (!taskToDelete) return

    const deletedAtIso = new Date().toISOString()
    const updatedTask = { ...taskToDelete, deletedAt: deletedAtIso }

    // Otimista
    setTasks(prev => prev.filter(t => t.id !== id))
    setTrashTasks(prev => [updatedTask, ...prev])

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ deleted_at: deletedAtIso })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Erro ao mover tarefa para lixeira:', err)
      // Reverter
      setTasks(prev => [taskToDelete, ...prev])
      setTrashTasks(prev => prev.filter(t => t.id !== id))
    }
  }

  // Restaurar tarefa da lixeira
  async function restoreTask(id) {
    const taskToRestore = trashTasks.find(t => t.id === id)
    if (!taskToRestore) return

    const restoredTask = { ...taskToRestore, deletedAt: null }

    // Otimista
    setTrashTasks(prev => prev.filter(t => t.id !== id))
    setTasks(prev => [restoredTask, ...prev])

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ deleted_at: null })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Erro ao restaurar tarefa:', err)
      // Reverter
      setTrashTasks(prev => [taskToRestore, ...prev])
      setTasks(prev => prev.filter(t => t.id !== id))
    }
  }

  // Deletar permanentemente
  async function deleteForever(id) {
    const previousTrash = [...trashTasks]
    setTrashTasks(prev => prev.filter(t => t.id !== id))

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Erro ao excluir definitivamente a tarefa:', err)
      setTrashTasks(previousTrash)
    }
  }

  // Esvaziar Lixeira
  async function emptyTrash() {
    if (trashTasks.length === 0 || !session?.user) return
    const confirmation = window.confirm('Deseja realmente esvaziar a lixeira permanentemente?')
    if (!confirmation) return

    const previousTrash = [...trashTasks]
    setTrashTasks([])

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .not('deleted_at', 'is', null)
        .eq('user_id', session.user.id)

      if (error) throw error
    } catch (err) {
      console.error('Erro ao esvaziar lixeira:', err)
      setTrashTasks(previousTrash)
    }
  }

  async function updateTask(updated) {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: updated.title,
          category: updated.category,
          priority: updated.priority,
          due_date: updated.dueDate,
          completed: updated.completed
        })
        .eq('id', updated.id)

      if (error) throw error

      setTasks(prev =>
        prev.map(t => t.id === updated.id ? updated : t)
      )
    } catch (err) {
      console.error('Erro ao editar tarefa:', err)
    }
  }

  if (!session) {
    return <AuthPage />
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Navbar activePage={activePage} onNavigate={setActivePage} session={session} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Carregando tarefas...</span>
          </div>
        ) : (
          <>
            {activePage === 'tarefas' && (
              <TaskList
                tasks={tasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onAdd={addTask}
                onUpdate={updateTask}
              />
            )}
            {activePage === 'analises' && (
              <AnalyticsPage tasks={tasks} />
            )}
            {activePage === 'calendario' && (
              <CalendarPage tasks={tasks} />
            )}
            {activePage === 'lixeira' && (
              <TrashPage
                trashTasks={trashTasks}
                onRestore={restoreTask}
                onDeleteForever={deleteForever}
                onEmptyTrash={emptyTrash}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
