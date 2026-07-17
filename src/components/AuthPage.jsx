import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('gustavo.alves199488@gmail.com')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', content: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', content: '' })

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage({
          type: 'success',
          content: 'Cadastro realizado com sucesso! Verifique seu e-mail para confirmação se necessário.',
        })
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message || 'Ocorreu um erro no processo.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl transition-all duration-300"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-light)',
        }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ backgroundColor: 'var(--color-accent-bg)' }}>
            <svg className="w-8 h-8" style={{ color: 'var(--color-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            {isRegister ? 'Criar uma conta' : 'Acesse seu painel'}
          </h2>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            {isRegister ? 'Cadastre-se para gerenciar suas tarefas' : 'Gerencie suas tarefas de forma simples e elegante'}
          </p>
        </div>

        {message.content && (
          <div
            className="p-4 mb-6 rounded-lg text-sm"
            style={{
              backgroundColor: message.type === 'error' ? 'var(--color-danger-bg)' : 'var(--color-cat-trabalho-bg)',
              color: message.type === 'error' ? 'var(--color-danger)' : 'var(--color-cat-trabalho)',
              border: `1px solid ${message.type === 'error' ? 'var(--color-danger)' : 'var(--color-cat-trabalho)'}`,
            }}
          >
            {message.content}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Endereço de e-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Sua senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-lg"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              border: 'none',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Processando...' : isRegister ? 'Cadastrar' : 'Entrar na Conta'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister)
              setMessage({ type: '', content: '' })
            }}
            className="text-xs font-semibold hover:underline cursor-pointer"
            style={{ color: 'var(--color-accent)' }}
          >
            {isRegister ? 'Já possui uma conta? Acesse' : 'Não tem conta? Cadastre-se gratuitamente'}
          </button>
        </div>
      </div>
    </div>
  )
}
