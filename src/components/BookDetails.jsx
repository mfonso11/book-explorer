function BookDetails({ book }) {
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : null

  return (
    <div className="book-details">
      <div className="details-cover-container">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={book.title || 'No Title'}
            className="details-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
              event.currentTarget.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}

        <div
          className="details-no-cover"
          style={{ display: coverUrl ? 'none' : 'flex' }}
        >
          No Cover
        </div>
      </div>

      <div className="details-content">
        <p className="details-label">SELECTED BOOK</p>

        <h2>{book.title || 'No Title'}</h2>

        <p className="details-author">
          {book.author_name?.join(', ') || 'Unknown Author'}
        </p>

        <div className="details-info">
          <div>
            <span>First Published</span>
            <strong>
              {book.first_publish_year || 'Unknown'}
            </strong>
          </div>

          <div>
            <span>Number of Editions</span>
            <strong>
              {book.edition_count || 0}
            </strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails