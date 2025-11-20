import { useEffect, useState } from 'react'
import HunterSetup from './components/HunterSetup'
import Dashboard from './components/Dashboard'

function App() {
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const id = localStorage.getItem('hunter_id')
    if (id) setUserId(id)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="relative min-h-screen p-6">
        <header className="max-w-3xl mx-auto pt-6 pb-8 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/flame-icon.svg" alt="Flames" className="w-14 h-14 drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Solo Leveling Fitness</h1>
          <p className="text-blue-200">Gamified daily training • Level up your hunter</p>
        </header>

        <main className="max-w-3xl mx-auto">
          {!userId ? (
            <HunterSetup onReady={(id) => setUserId(id)} />
          ) : (
            <Dashboard userId={userId} onReset={() => setUserId(null)} />
          )}
        </main>

        <footer className="max-w-3xl mx-auto mt-12 text-center text-blue-300/60 text-sm">
          Backend connected via secure API • Your data persists in the cloud
        </footer>
      </div>
    </div>
  )
}

export default App
