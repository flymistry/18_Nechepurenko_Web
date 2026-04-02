import { useState, useEffect } from 'react'
import { useApiStore, type Thread } from '../store'

export default function ThreadsPage() {
  const { threads, isLoadingThreads, loadThreads, createThread, deleteThread, incrementViews } = useApiStore()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    loadThreads()
  }, [loadThreads])

  const handleCreate = async () => {
    if (!title || !body) return alert('Заполните заголовок и текст')
    await createThread(title, body)
    setTitle('')
    setBody('')
  }

  const handleOpen = (thread: Thread) => {
    incrementViews(thread.id)
    alert(`Открыт тред: "${thread.title}"\n\n${thread.body}\n\nПросмотров: ${thread.views + 1}`)
  }

  return (
    <div className="section">
      <div className="hero">
        <h1>Обсуждения</h1>
        <p>Создавай посты, редактируй и удаляй</p>
      </div>
      <div className="section-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Форма создания */}
        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Заголовок обсуждения"
            maxLength={120}
            style={{ marginBottom: '1rem' }}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Текст обсуждения..."
            rows={4}
            style={{ marginBottom: '1rem' }}
          />
          <button onClick={handleCreate} className="btn">Опубликовать</button>
        </div>

        <button onClick={loadThreads} className="btn" style={{ width: '100%', marginBottom: '1.5rem' }}>
          Загрузить обсуждения (GET)
        </button>

        <div id="threads-list" className="result-area">
          {isLoadingThreads ? (
            <p className="loading">Загружаем обсуждения...</p>
          ) : (
            threads.map((t) => (
              <div key={t.id} className="thread-card">
                <div className="thread-meta">
                  <span className="thread-author">{t.author}</span>
                  <span className="thread-time">только что</span>
                  <span className={`thread-tag tag-${t.tag}`}>{t.tagLabel}</span>
                </div>
                <div className="thread-title">{t.title}</div>
                <div className="thread-preview">
                  {t.body.substring(0, 180)}{t.body.length > 180 ? '...' : ''}
                </div>
                <div className="thread-footer">
                  <span className="thread-stat">{t.comments} комментариев</span>
                  <span className="thread-stat">{t.views} просмотров</span>
                </div>
                <div className="thread-actions">
                  <button onClick={() => handleOpen(t)} className="btn" style={{ background: '#FFBA87', color: '#1A1A1A' }}>
                    Открыть
                  </button>
                  <button onClick={() => deleteThread(t.id)} className="btn" style={{ background: '#E9A5A2' }}>
                    Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}