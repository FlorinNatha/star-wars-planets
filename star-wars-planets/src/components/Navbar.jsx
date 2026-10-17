import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="navbar">
            <Link to="/" className="brand">
                <span className="brand-icon">✦</span>
                <span>STAR<span className="brand-accent">WARS</span></span>
                <span className="brand-subtitle">PLANET EXPLORER</span>
            </Link>

            <Link to="/" className="nav-link">
                Explore Planets
            </Link>
        </header>
    );
}