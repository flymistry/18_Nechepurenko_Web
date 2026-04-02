import { useState } from 'react'

export default function CurrencyPage() {
  const [amount, setAmount] = useState<number>(100)
  const [from, setFrom] = useState<string>('USD')
  const [to, setTo] = useState<string>('EUR')
  const [result, setResult] = useState<string>('')

  const convertCurrency = async () => {
    if (isNaN(amount) || amount <= 0) {
      setResult('<p class="error">Введите корректную сумму</p>')
      return
    }
    if (from === to) {
      setResult('<p class="error">Выберите разные валюты</p>')
      return
    }

    setResult('<p class="loading">Загружаем курс...</p>')

    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${from}`)
      if (!res.ok) throw new Error('Ошибка API')

      const data = await res.json()
      const rate = data.rates[to]
      const converted = (amount * rate).toFixed(2)

      setResult(`
        <div class="result-card currency-card">
          <div class="currency-main">
            <div class="currency-from-val">${amount} ${from}</div>
            <div class="currency-arrow">↓</div>
            <div class="currency-to-val">${converted} ${to}</div>
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
        <h1>Конвертер валют</h1>
      </div>
      <div className="section-content form-column">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder="Сумма"
        />
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          <option value="USD">USD — Доллар США</option>
          <option value="EUR">EUR — Евро</option>
          <option value="GBP">GBP — Фунт стерлингов</option>
          <option value="UAH">UAH — Гривна</option>
          <option value="RUB">RUB — Рубль</option>
          <option value="PLN">PLN — Злотый</option>
          <option value="CHF">CHF — Франк</option>
          <option value="JPY">JPY — Иена</option>
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="EUR">EUR — Евро</option>
          <option value="USD">USD — Доллар США</option>
          <option value="GBP">GBP — Фунт стерлингов</option>
          <option value="UAH">UAH — Гривна</option>
          <option value="RUB">RUB — Рубль</option>
          <option value="PLN">PLN — Злотый</option>
          <option value="CHF">CHF — Франк</option>
          <option value="JPY">JPY — Иена</option>
        </select>
        <button onClick={convertCurrency} className="btn">Конвертировать</button>
      </div>
      <div className="result-area" dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  )
}