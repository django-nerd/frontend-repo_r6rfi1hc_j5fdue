import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function HunterSetup({ onReady }) {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('Shadow Hunter')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [existing, setExisting] = useState([])

  useEffect(() => {
    // Load existing hunters to pick from quickly
    api.listHunters().then(setExisting).catch(() => {})
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Enter a name')
      return
    }
    setLoading(true)
    try {
      const hunter = await api.createHunter({ name, title })
      const id = hunter.id || hunter._id
      localStorage.setItem('hunter_id', id)
      onReady(id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (id) => {
    localStorage.setItem('hunter_id', id)
    onReady(id)
  }

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6">
      <h2 className="text-white text-2xl font-semibold mb-4">Create your Hunter</h2>
      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-blue-200 text-sm mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sung Jinwoo"
            className="w-full px-4 py-2 rounded bg-slate-900/60 text-white border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-blue-200 text-sm mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded bg-slate-900/60 text-white border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          disabled={loading}
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Begin the Awakening'}
        </button>
      </form>

      {existing?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-blue-200 mb-2 text-sm">Or continue as:</h3>
          <div className="flex flex-wrap gap-2">
            {existing.map(h => (
              <button key={h.id || h._id} onClick={() => handleSelect(h.id || h._id)} className="px-3 py-1 rounded bg-slate-700/60 text-white hover:bg-slate-700">
                {h.name} • Lv {h.level}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
