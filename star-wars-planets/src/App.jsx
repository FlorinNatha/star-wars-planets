import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PlanetList from "./pages/PlanetList";
import PlanetDetails from "./pages/PlanetDetails";
import "./App.css";

function NotFound() {
  return (
    <main className="page-container not-found">
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a className="button button-primary" href="/">
        Return Home
      </a>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<PlanetList />} />
          <Route path="/planets/:id" element={<PlanetDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer className="footer">
          <p>STAR WARS PLANET EXPLORER</p>
          <span>Built with React and SWAPI</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}