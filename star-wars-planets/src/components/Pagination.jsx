export default function Pagination({
    next,
    previous,
    onPageChange,
    currentPage,
}) {
    return (
        <div className="pagination">
            <button
                className="button button-secondary"
                disabled={!previous}
                onClick={() => onPageChange(previous)}
            >
                ← Previous
            </button>

            <span className="page-label">Page {currentPage}</span>

            <button
                className="button button-primary"
                disabled={!next}
                onClick={() => onPageChange(next)}
            >
                Next →
            </button>
        </div>
    );
}