import { useState } from 'react'

export default function DogsPage() {
  const [dog, setDog] = useState<{ message: string; breed: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const getRandomDog = async () => {
    setLoading(true)
    setDog(null)

    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random')
      const data = await res.json()

      const breedRaw = data.message.split('/breeds/')[1] || ''
      const breed = breedRaw
        .replace('-', ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())

      setDog({
        message: data.message,
        breed: breed || 'Случайная собака'
      })
    } catch (err) {
      alert('Ошибка загрузки фото собаки')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section">
      <div className="hero">
        <h1>Случайные собаки</h1>
        <p>Нажми кнопку, чтобы увидеть новую собаку</p>
      </div>
      <div className="section-content centered">
        <button onClick={getRandomDog} className="btn">Показать собаку</button>

        {loading && <div className="loading">Ищем собаку...</div>}

        {dog && (
          <div className="result-card dog-card">
            <h3>{dog.breed}</h3>
            <img src={dog.message} alt="Фото собаки" className="dog-img" />
            <button onClick={getRandomDog} className="btn dog-btn">Другую собаку</button>
          </div>
        )}
      </div>
    </div>
  )
}