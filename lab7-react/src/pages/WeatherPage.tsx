import { useState } from 'react'

export default function WeatherPage() {
  const [lat, setLat] = useState<number>(48.21)
  const [lon, setLon] = useState<number>(16.37)
  const [result, setResult] = useState<string>('')

  const getWindDirection = (deg: number): string => {
    const dirs = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ']
    return dirs[Math.round(deg / 45) % 8]
  }

  const getWeather = async () => {
    if (isNaN(lat) || isNaN(lon)) {
      setResult('<p class="error">Введите корректные координаты</p>')
      return
    }

    setResult('<p class="loading">Загрузка погоды...</p>')

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Ошибка API')

      const data = await res.json()
      const w = data.current_weather

      setResult(`
        <div class="result-card weather-card">
          <div class="weather-temp">${w.temperature}°C</div>
          <div class="weather-details">
            <div class="weather-detail-item">
              <span class="weather-label">Скорость ветра</span>
              <span class="weather-value">${w.windspeed} км/ч</span>
            </div>
            <div class="weather-detail-item">
              <span class="weather-label">Направление</span>
              <span class="weather-value">${getWindDirection(w.winddirection)} (${w.winddirection}°)</span>
            </div>
          </div>
        </div>
      `)
    } catch (err) {
      setResult(`<p class="error">Ошибка: ${(err as Error).message}</p>`)
    }
  }

  return (
    <div className="section">
      <div className="hero">
        <h1>Погода сейчас</h1>
        <p>Введите координаты, чтобы увидеть погоду</p>
      </div>
      <div className="section-content form-column">
        <input
          type="number"
          value={lat}
          onChange={(e) => setLat(parseFloat(e.target.value))}
          placeholder="Широта (например, 48.21)"
        />
        <input
          type="number"
          value={lon}
          onChange={(e) => setLon(parseFloat(e.target.value))}
          placeholder="Долгота (например, 16.37)"
        />
        <button onClick={getWeather} className="btn">Получить погоду</button>
      </div>
      <div className="result-area" dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  )
}