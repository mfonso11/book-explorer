import { useEffect, useState } from 'react'
import BookCard from './components/BookCard'
import BookDetails from './components/BookDetails'
import bookLogo from './assets/book-finder.jpg'
import './App.css'

const BOOKS_PER_PAGE = 20

function App() {
  const [query, setQuery] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [books, setBooks] = useState([])
  const [totalBooks, setTotalBooks] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)

  useEffect(() => {
    if (!searchTerm.trim()) {
      setBooks([])
      setTotalBooks(0)
      setSelectedBook(null)
      return
    }

    const fetchBooks = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(
            searchTerm
          )}&page=${currentPage}&limit=${BOOKS_PER_PAGE}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch books.')
        }

        const data = await response.json()

        setBooks(data.docs || [])
        setTotalBooks(data.numFound || 0)

        if (data.docs && data.docs.length > 0) {
          setSelectedBook(data.docs[0])
        } else {
          setSelectedBook(null)
        }
      } catch (error) {
        setError(error.message)
        setBooks([])
        setTotalBooks(0)
        setSelectedBook(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [searchTerm, currentPage])

  const handleSearch = (event) => {
    event.preventDefault()

    if (!query.trim()) {
      return
    }

    setCurrentPage(1)
    setSearchTerm(query.trim())
  }

  const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE)

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return
    }

    setCurrentPage(page)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-title">
          <div className="logo">
            <img src={bookLogo} alt="Book Explorer logo" />
          </div>

          <div>
            <h1>Book Explorer</h1>
            <p>Discover your next great read.</p>
          </div>
        </div>
      </header>

      {/* Search */}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for a book or author..."
        />

        <button type="submit">Search</button>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="status">
          <div className="loader"></div>
          <p>Searching for books...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="status error">
          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && searchTerm && books.length === 0 && (
        <div className="status">
          <p>No books found.</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && books.length > 0 && (
        <div className="results-layout">
          {/* Books Section */}
          <div className="books-section">
            <div className="results-header">
              <h2>Search Results</h2>

              <span>
                Showing{' '}
                {(currentPage - 1) * BOOKS_PER_PAGE + 1}-
                {Math.min(
                  currentPage * BOOKS_PER_PAGE,
                  totalBooks
                )}{' '}
                of {totalBooks.toLocaleString()} books
              </span>
            </div>

            <div className="book-grid">
              {books.map((book, index) => (
                <BookCard
                  key={`${book.key}-${index}`}
                  book={book}
                  onClick={setSelectedBook}
                  isSelected={selectedBook?.key === book.key}
                />
              ))}
            </div>
          </div>

          {/* Details Section */}
          <aside className="details-section">
            {selectedBook ? (
              <BookDetails book={selectedBook} />
            ) : (
              <div className="details-placeholder">
                <div className="placeholder-icon">📖</div>

                <h2>Select a book</h2>

                <p>
                  Click on a book to see its details here.
                </p>
              </div>
            )}
          </aside>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <div className="pagination">
                {/* Previous */}
                <button
                  className="pagination-button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="page-numbers">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  )
                    .filter((page) => {
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 2
                      )
                    })
                    .map((page, index, pages) => {
                      const previousPage = pages[index - 1]

                      return (
                        <span key={page}>
                          {previousPage &&
                            page - previousPage > 1 && (
                              <span className="page-ellipsis">
                                ...
                              </span>
                            )}

                          <button
                            className={`page-button ${
                              currentPage === page
                                ? 'active'
                                : ''
                            }`}
                            onClick={() => goToPage(page)}
                          >
                            {page}
                          </button>
                        </span>
                      )
                    })}
                </div>

                {/* Next */}
                <button
                  className="pagination-button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>

              {/* Go To Page */}
              <div className="go-to-page">
                <label htmlFor="page-input">
                  Go to page:
                </label>

                <input
                  id="page-input"
                  type="number"
                  min="1"
                  max={totalPages}
                  placeholder={currentPage}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      const page = Number(event.target.value)

                      if (
                        page >= 1 &&
                        page <= totalPages
                      ) {
                        goToPage(page)
                        event.target.value = ''
                      }
                    }
                  }}
                />

                <button
                  className="go-to-page-button"
                  onClick={() => {
                    const input =
                      document.getElementById('page-input')

                    const page = Number(input.value)

                    if (
                      page >= 1 &&
                      page <= totalPages
                    ) {
                      goToPage(page)
                      input.value = ''
                    }
                  }}
                >
                  Go
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App