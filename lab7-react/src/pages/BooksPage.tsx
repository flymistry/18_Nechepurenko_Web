import { useEffect } from 'react'
import { useApiStore, type Book } from '../store'

export default function BooksPage() {
  const { books, isLoadingBooks, loadBooks } = useApiStore()

  useEffect(() => {
    loadBooks()
  }, [loadBooks])

  return (
    <div className="section">
      <div className="hero">
        <h1>Книги Стивена Кинга</h1>
        <p>Загрузи список книг через API</p>
      </div>
      <div className="section-content centered">
        <button onClick={loadBooks} className="btn">Загрузить список книг</button>
      </div>

      <div className="result-area">
        {isLoadingBooks ? (
          <p className="loading">Загрузка книг...</p>
        ) : (
          <div className="books-grid">
            {books.map((book: Book, index: number) => (
              <div key={index} className="book-card">
                <div className="book-year">{book.Year}</div>
                <div className="book-title">{book.Title}</div>
                {book.Pages && <div className="book-pages">{book.Pages} стр.</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}