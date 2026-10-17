import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlanets, searchPlanets } from "../services/planetService";
import Pagination from "../components/Pagination";
import StatusMessage from "../components/StatusMessage";

export default function PlanetList() {
    const [planets, setPlanets] = useState([]);
    const [search, setSearch] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Debounce search input to avoid making a request for every keystroke.
    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveSearch(search.trim());
        }, 350);

        return () => clearTimeout(timer);
    }, [search]);

    const loadPlanets = useCallback(
        async (url = null, query = activeSearch) => {
            const controller = new AbortController();

            setLoading(true);
            setError("");

            try {
                const data = url
                    ? await getPlanets(url, controller.signal)
                    : query
                        ? await searchPlanets(query, controller.signal)
                        : await getPlanets(undefined, controller.signal);

                setPlanets(data.results);
                setNext(data.next);
                setPrevious(data.previous);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Failed to load planets.");
                    setPlanets([]);
                    setNext(null);
                    setPrevious(null);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }

            return () => controller.abort();
        },
        [activeSearch]
    );

    useEffect(() => {
        let cancelled = false;
        const controller = new AbortController();

        async function load() {
            setLoading(true);
            setError("");

            try {
                const data = activeSearch
                    ? await searchPlanets(activeSearch, controller.signal)
                    : await getPlanets(undefined, controller.signal);

                if (cancelled) return;

                setPlanets(data.results);
                setNext(data.next);
                setPrevious(data.previous);
                setCurrentPage(1);
            } catch (err) {
                if (!cancelled && err.name !== "AbortError") {
                    setError(err.message || "Failed to load planets.");
                    setPlanets([]);
                    setNext(null);
                    setPrevious(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [activeSearch]);

    async function handlePageChange(url) {
        if (!url) return;

        setLoading(true);
        setError("");

        const controller = new AbortController();

        try {
            const data = await getPlanets(url, controller.signal);

            setPlanets(data.results);
            setNext(data.next);
            setPrevious(data.previous);

            setCurrentPage((page) =>
                url === next ? page + 1 : Math.max(1, page - 1)
            );

            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            if (err.name !== "AbortError") {
                setError(err.message || "Failed to change page.");
            }
        } finally {
            setLoading(false);
        }
    }

    function handleRetry() {
        setActiveSearch((value) => value);
        // A retry must also work if the search text hasn't changed.
        setSearch((value) => value);
        loadPlanets(null, activeSearch);
    }

    return (
        <main className="page-container">
            <section className="hero">
                <p className="eyebrow">A GALAXY OF DISCOVERIES</p>
                <h1>Explore the <span>Planets</span></h1>
                <p className="hero-description">
                    Discover the worlds of Star Wars, from desert planets
                    to mysterious ocean worlds.
                </p>
            </section>

            <section className="list-section">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">THE GALACTIC DATABASE</p>
                        <h2>Planet Directory</h2>
                    </div>
                </div>

                <div className="search-box">
                    <span className="search-icon" aria-hidden="true">⌕</span>
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search planets by name..."
                        aria-label="Search planets by name"
                    />

                    {search && (
                        <button
                            className="clear-search"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {!loading && !error && (
                    <p className="results-count">
                        {planets.length > 0
                            ? `Showing ${planets.length} planet${planets.length === 1 ? "" : "s"}`
                            : "No matching planets"}
                    </p>
                )}

                {loading ? (
                    <StatusMessage message="Loading planets..." />
                ) : error ? (
                    <StatusMessage type="error" message={error} onRetry={handleRetry} />
                ) : planets.length === 0 ? (
                    <StatusMessage
                        type="empty"
                        message="No planets match your search. Try another name."
                    />
                ) : (
                    <>
                        <div className="table-wrapper">
                            <table className="planet-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Diameter</th>
                                        <th>Terrain</th>
                                        <th>Population</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {planets.map((planet) => {
                                        const id = planet.url
                                            .split("/")
                                            .filter(Boolean)
                                            .pop();

                                        return (
                                            <tr key={planet.url}>
                                                <td>
                                                    <Link
                                                        className="planet-name"
                                                        to={`/planets/${id}`}
                                                    >
                                                        {planet.name}
                                                    </Link>
                                                </td>

                                                <td>{planet.diameter} km</td>
                                                <td>
                                                    <span className="terrain-tag">
                                                        {planet.terrain}
                                                    </span>
                                                </td>
                                                <td>{planet.population}</td>
                                                <td>
                                                    <Link
                                                        className="details-link"
                                                        to={`/planets/${id}`}
                                                    >
                                                        View →
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            next={next}
                            previous={previous}
                            onPageChange={handlePageChange}
                            currentPage={currentPage}
                        />
                    </>
                )}
            </section>
        </main>
    );
}