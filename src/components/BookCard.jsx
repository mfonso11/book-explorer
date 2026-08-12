function BookCard({ book, onClick, isSelected }) {
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null

  return (
    <div
      className={`book-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(book)}
    >
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={book.title || 'No Title'}
          className="book-cover"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
            event.currentTarget.nextSibling.style.display = 'flex'
          }}
        />
      ) : null}

      <div
        className="no-cover"
        style={{ display: coverUrl ? 'none' : 'flex' }}
      >
        No Cover
      </div>

      <div className="book-info">
        <h3>{book.title || 'No Title'}</h3>

        <p className="author">
          {book.author_name?.join(', ') || 'Unknown Author'}
        </p>

        <p className="year">
          {book.first_publish_year || 'Unknown'}
        </p>
      </div>
    </div>
  )
}

export default BookCard