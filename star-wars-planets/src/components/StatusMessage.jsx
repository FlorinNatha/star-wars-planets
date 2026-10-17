export default function StatusMessage({
    type = "loading",
    message,
    onRetry,
}) {
    if (type === "loading") {
        return (
            <div className="status-container" role="status">
                <div className="spinner" />
                <h3>{message || "Loading planets..."}</h3>
                <p>Please wait while we contact the galaxy.</p>
            </div>
        );
    }

    if (type === "error") {
        return (
            <div className="status-container" role="alert">
                <div className="status-icon">!</div>
                <h3>Something went wrong</h3>
                <p>{message || "Unable to load data from the API."}</p>

                {onRetry && (
                    <button className="button button-primary" onClick={onRetry}>
                        Try Again
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="status-container">
            <div className="status-icon">⌕</div>
            <h3>No planets found</h3>
            <p>{message || "Try searching with another planet name."}</p>
        </div>
    );
}