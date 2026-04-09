import { useState } from 'react'

export function Login({ onLogin }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (onLogin(pwd)) {
      setError(false)
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setPwd('')
    }
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '0.5px solid var(--border2)',
        borderRadius: 16,
        padding: '40px 48px',
        width: 380,
        textAlign: 'center',
        animation: shake ? 'shake 0.4s ease' : 'none',
      }}>
        {/* Logo */}
        <div style={{
          width: 56, height: 56,
          background: '#003189',
          borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: 22, fontWeight: 700, color: 'white',
          letterSpacing: 1,
        }}>A</div>

        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>
          Atos — Sales Playbook
        </div>
        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 28 }}>
          Accès réservé aux Alliance Managers DWP
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Mot de passe"
            value={pwd}
            onChange={e => { setPwd(e.target.value); setError(false) }}
            autoFocus
            style={{
              width: '100%',
              padding: '10px 14px',
              border: `1px solid ${error ? '#E24B4A' : 'var(--border2)'}`,
              borderRadius: 8,
              fontSize: 14,
              background: 'var(--surface)',
              color: 'var(--text)',
              fontFamily: 'inherit',
              outline: 'none',
              marginBottom: 8,
              textAlign: 'center',
              letterSpacing: 3,
            }}
          />
          {error && (
            <div style={{ fontSize: 11, color: '#E24B4A', marginBottom: 10 }}>
              Mot de passe incorrect
            </div>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              background: '#003189',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
              marginTop: error ? 0 : 8,
            }}
          >
            Accéder au Playbook
          </button>
        </form>

        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 20 }}>
          Atos Digital Workplace Partners · Usage interne
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}
