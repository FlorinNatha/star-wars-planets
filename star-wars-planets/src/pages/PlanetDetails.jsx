import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPlanetDetails } from "../services/planetService";
import StatusMessage from "../components/StatusMessage";

const detailsFields = [
    { key: "diameter", label: "Diameter", unit: "km" },
    { key: "terrain", label: "Terrain" },
    { key: "climate", label: "Climate" },
    { key: "population", label: "Population" },
    { key: "gravity", label: "Gravity" },
];

function formatValue(value) {
    if (value === undefined || value === null || value === "") {
        return "Unknown";
    }

    return value;
}

export default function PlanetDetails() {
    const { id } = useParams();

    const [planet, setPlanet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadDetails() {
            setLoading(true);
            setError("");
            setPlanet(null);

            try {
                const data = await getPlanetDetails(id, controller.signal);
                setPlanet(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Unable to load planet details.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadDetails();

        return () => controller.abort();
    }, [id]);

    function handleRetry() {
        // Changing the URL ID is not required; reload the page to retry.
        window.location.reload();
    }

    return (
        <main className="page-container details-page">
            <Link to="/" className="back-link">
                ← Back to Planet List
            </Link>

            {loading ? (
                <StatusMessage message="Loading planet details..." />
            ) : error ? (
                <StatusMessage
                    type="error"
                    message={error}
                    onRetry={handleRetry}
                />
            ) : planet ? (
                <>
                    <section className="details-hero">
                        <p className="eyebrow">PLANET PROFILE</p>
                        <h1>{planet.name}</h1>
                        <p>
                            Explore the characteristics of this world in the
                            Star Wars galaxy.
                        </p>
                    </section>

                    <section className="details-card">
                        <div className="details-card-heading">
                            <span className="planet-symbol">✦</span>
                            <div>
                                <p className="eyebrow">GALACTIC DATABASE</p>
                                <h2>{planet.name}</h2>
                            </div>
                        </div>

                        <div className="details-grid">
                            {detailsFields.map((field) => (
                                <div className="detail-item" key={field.key}>
                                    <span className="detail-label">{field.label}</span>
                                    <strong className="detail-value">
                                        {formatValue(planet[field.key])}
                                        {field.unit && planet[field.key] !== "unknown" &&
                                            planet[field.key] !== "n/a" &&
                                            planet[field.key] !== null &&
                                            planet[field.key] !== ""
                                            ? ` ${field.unit}`
                                            : ""}
                                    </strong>
                                </div>
                            ))}
                        </div>

                        <div className="details-footer">
                            Data provided by the Star Wars API (SWAPI).
                        </div>
                    </section>

                    <Link to="/" className="button button-primary back-button">
                        ← Return to All Planets
                    </Link>
                </>
            ) : (
                <StatusMessage
                    type="empty"
                    message="This planet could not be found."
                />
            )}
        </main>
    );
}