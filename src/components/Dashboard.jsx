import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

function ProgressBar({ value, max }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="w-full bg-slate-900/60 border border-blue-500/20 rounded-full h-4 overflow-hidden">
      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function Dashboard({ userId, onReset }) {
  const [profile, setProfile] = useState(null)
  const [quest, setQuest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [p, q] = await Promise.all([
        api.getProfile(userId),
        api.getQuest(userId),
      ])
      setProfile(p)
      setQuest(q)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [userId])

  const handleCheckin = async () => {
    try {
      await api.checkin(userId)
      await loadAll()
    } catch (e) {
      alert(e.message)
    }
  }

  const handleCompleteQuest = async () => {
    try {
      await api.completeQuest(userId)
      await loadAll()
    } catch (e) {
      alert(e.message)
    }
  }

  const handleLogWorkout = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const workout_type = form.get('workout_type')
    const minutes = parseInt(form.get('minutes') || '0', 10)
    const difficulty = form.get('difficulty')
    if (!workout_type || minutes <= 0) {
      alert('Enter workout and minutes')
      return
    }
    try {
      await api.logWorkout({ user_id: userId, workout_type, minutes, difficulty })
      e.currentTarget.reset()
      await loadAll()
    } catch (e) {
      alert(e.message)
    }
  }

  if (loading) {
    return <div className="text-blue-200">Loading...</div>
  }
  if (error) {
    return (
      <div className="text-red-400">
        {error}
        <button onClick={loadAll} className="ml-3 px-3 py-1 rounded bg-slate-700 text-white">Retry</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-semibold">{profile.name}</h2>
          <p className="text-blue-200">{profile.title || 'Hunter'} • Streak {profile.streak}</p>
        </div>
        <button onClick={() => { localStorage.removeItem('hunter_id'); onReset() }} className="px-3 py-1 rounded bg-slate-700/60 text-white">Switch</button>
      </div>

      <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 space-y-3">
        <div className="flex items-baseline justify-between">
          <p className="text-blue-200">Level</p>
          <p className="text-white text-3xl font-bold">{profile.level}</p>
        </div>
        <ProgressBar value={profile.exp} max={profile.exp_to_next || 1} />
        <div className="flex justify-between text-sm text-blue-300">
          <span>{profile.exp} EXP</span>
          <span>{profile.exp_to_next} to next</span>
        </div>
        <button onClick={handleCheckin} className="mt-4 w-full py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">Daily Check-in</button>
      </div>

      {quest && (
        <div className="bg-slate-800/60 border border-amber-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white text-xl font-semibold">Daily Quest</h3>
            {quest.completed ? (
              <span className="text-emerald-400">Completed</span>
            ) : (
              <span className="text-amber-300">+{quest.exp_reward} EXP</span>
            )}
          </div>
          <p className="text-blue-100">{quest.title}</p>
          <p className="text-blue-300/80 text-sm mb-4">{quest.description}</p>
          {!quest.completed && (
            <button onClick={handleCompleteQuest} className="w-full py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold">Complete Quest</button>
          )}
        </div>
      )}

      <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6">
        <h3 className="text-white text-xl font-semibold mb-3">Log Workout</h3>
        <form onSubmit={handleLogWorkout} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input name="workout_type" placeholder="Workout (e.g., Run)" className="px-3 py-2 rounded bg-slate-900/60 text-white border border-blue-500/30 focus:outline-none" />
          <input name="minutes" type="number" min="1" placeholder="Minutes" className="px-3 py-2 rounded bg-slate-900/60 text-white border border-blue-500/30 focus:outline-none" />
          <select name="difficulty" className="px-3 py-2 rounded bg-slate-900/60 text-white border border-blue-500/30 focus:outline-none">
            <option value="easy">Easy</option>
            <option value="normal" defaultValue>Normal</option>
            <option value="hard">Hard</option>
          </select>
          <button className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold">Add</button>
        </form>
      </div>
    </div>
  )
}
