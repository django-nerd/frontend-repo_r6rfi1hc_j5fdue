// Simple API client using VITE_BACKEND_URL
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })
  if (!res.ok) {
    let detail
    try {
      const data = await res.json()
      detail = data?.detail || JSON.stringify(data)
    } catch (e) {
      detail = await res.text()
    }
    throw new Error(`${res.status} ${res.statusText} - ${detail}`)
  }
  try {
    return await res.json()
  } catch (e) {
    return null
  }
}

export const api = {
  BASE_URL,
  // Hunters
  createHunter: (payload) => request('/api/hunters', { method: 'POST', body: JSON.stringify(payload) }),
  listHunters: () => request('/api/hunters'),

  // Profile
  getProfile: (userId) => request(`/api/profile?user_id=${encodeURIComponent(userId)}`),

  // Check-in
  checkin: (userId) => request(`/api/checkin?user_id=${encodeURIComponent(userId)}`, { method: 'POST' }),

  // Quests
  getQuest: (userId) => request(`/api/quests?user_id=${encodeURIComponent(userId)}`),
  completeQuest: (userId, date) => request('/api/quests/complete', { method: 'POST', body: JSON.stringify({ user_id: userId, date }) }),

  // Workouts
  logWorkout: (payload) => request('/api/workouts', { method: 'POST', body: JSON.stringify(payload) }),
}
