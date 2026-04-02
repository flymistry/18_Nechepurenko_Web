import { useState } from 'react'

export default function JokesPage() {
  const [joke, setJoke] = useState<{ setup: string; punchline: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const getJoke = async () => {
    setLoading(true)
    setJoke(null)
    try {
      const res = await fetch('https://official-joke-api.appspot.com/jokes/random')
      setJoke(await res.json())
    } catch (err) {
      alert('Ошибка загрузки шутки')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section">
      <div className="hero">
        <h1>Случайная шутка</h1>
        <p>Нажми кнопку, чтобы получить новую шутку</p>
      </div>
      <div className="section-content centered">
        <button onClick={getJoke} className="btn">Получить шутку</button>
        {loading && <div className="loading">Загрузка шутки...</div>}
        {joke && (
          <div className="result-card">
            <p className="joke-setup">{joke.setup}</p>
            <p className="joke-punchline">{joke.punchline}</p>
          </div>
        )}
      </div>
    </div>
  )
}