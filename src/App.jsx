import { useMemo, useState } from "react";
import "./App.css";
import { films, siteConfig } from "./data/filmsData";

function Nav({ mode, onFilms, onPanel }) {
  const links = ["FILMS", "ABOUT", "MANIFESTO", "NEWS", "SHOP", "CONTACT"];

  return (
    <header className={`site-nav ${mode}`}>
      <button className="brand-wordmark" onClick={onFilms}>
        HOLY FLOCK FILMS
      </button>

      <nav className="nav-links" aria-label="Primary navigation">
        {links.slice(0, 3).map((link) => (
          <button
            key={link}
            className="nav-link"
            onClick={() => (link === "FILMS" ? onFilms() : onPanel(link.toLowerCase()))}
          >
            {link}
          </button>
        ))}

        <button className="nav-emblem" onClick={onFilms} aria-label="Return to films">
          <img src={siteConfig.logo} alt="" />
        </button>

        {links.slice(3).map((link) => (
          <button
            key={link}
            className="nav-link"
            onClick={() => onPanel(link.toLowerCase())}
          >
            {link}
          </button>
        ))}
      </nav>

      <div className="nav-year">MMXII</div>
    </header>
  );
}

function RayField({ mode }) {
  return (
    <div className={`ray-field ${mode}`} aria-hidden="true">
      {Array.from({ length: 31 }).map((_, i) => (
        <span key={i} style={{ "--i": i }} />
      ))}
    </div>
  );
}

function FilmStack({ film, onSelect }) {
  const stack = film.stackImages?.length ? film.stackImages : [film.mainImage];

  return (
    <article className="film-card">
      <button className="film-stack" onClick={() => onSelect(film.id)} aria-label={`Open ${film.title}`}>
        {stack.slice(0, 5).map((src, i) => {
          const offset = i - 2;
          return (
            <img
              key={`${src}-${i}`}
              className={`stack-img stack-img-${i}`}
              src={src}
              alt=""
              style={{
                "--offset": offset,
                "--depth": i,
              }}
            />
          );
        })}
        <img className="stack-img stack-main" src={film.mainImage} alt={film.title} />
      </button>

      <div className="film-caption">
        <p className="eyebrow">{film.type}</p>
        <h2>{film.title}</h2>
        <div className="rule" />
        <p className="logline">{film.logline}</p>
        <p className="meta">{film.year} <span>·</span> {film.runtime}</p>
      </div>
    </article>
  );
}

function FilmsPage({ onSelectFilm }) {
  return (
    <main className="films-page">
      <section className="hero-title">
        <h1>
          FILMS FOR THE DEVOTED <span>AND</span> THE DERANGED
        </h1>
        <div className="crosshair">+</div>
      </section>

      <section className="film-grid" aria-label="Film selection">
        {films.map((film) => (
          <FilmStack key={film.id} film={film} onSelect={onSelectFilm} />
        ))}
      </section>
    </main>
  );
}

function cleanVimeoUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("autoplay", "1");
    parsed.searchParams.set("muted", "0");
    parsed.searchParams.set("controls", "0");
    parsed.searchParams.set("title", "0");
    parsed.searchParams.set("byline", "0");
    parsed.searchParams.set("portrait", "0");
    parsed.searchParams.set("badge", "0");
    parsed.searchParams.set("dnt", "1");
    return parsed.toString();
  } catch {
    return url;
  }
}

function AssetMedia({ asset, large = false }) {
  if (asset.video && large) {
    return (
      <iframe
        className="asset-video"
        src={cleanVimeoUrl(asset.video)}
        title={asset.title}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        allowFullScreen
      />
    );
  }

  return <img src={asset.image} alt={asset.title} />;
}

function AssetGrid({ film, onChoose }) {
  return (
    <section className="asset-grid" aria-label={`${film.title} options`}>
      {film.assets.map((asset) => (
        <button key={asset.id} className="asset-card" onClick={() => onChoose(asset.id)}>
          <h2>{asset.title}</h2>
          <div className="asset-image">
            <AssetMedia asset={asset} />
          </div>
          <p>{asset.description}</p>
          <span className="asset-action">{asset.action} <span>→</span></span>
        </button>
      ))}
    </section>
  );
}

function AssetDetail({ film, activeId, setActiveId }) {
  const activeIndex = Math.max(0, film.assets.findIndex((asset) => asset.id === activeId));
  const active = film.assets[activeIndex];

  const ordered = useMemo(() => {
    return film.assets.map((asset, index) => ({
      ...asset,
      position: index - activeIndex,
    }));
  }, [film.assets, activeIndex]);

  return (
    <section className="asset-detail" aria-label={`${film.title} ${active.title}`}>
      <div className="asset-carousel">
        {ordered.map((asset) => {
          const isActive = asset.id === active.id;
          return (
            <button
              key={asset.id}
              className={`detail-item ${isActive ? "active" : "side"}`}
              style={{ "--pos": asset.position }}
              onClick={() => setActiveId(asset.id)}
            >
              <h2>{asset.title}</h2>
              <div className="detail-media">
                <AssetMedia asset={asset} large={isActive} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="detail-copy">
        <div>
          <p className="eyebrow">{film.type}</p>
          <h1>{active.title}</h1>
          <p>{active.longDescription || active.description}</p>
        </div>

        <dl>
          {Object.entries(active.meta || film.meta || {}).map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function FilmSelectedPage({ film, onBack }) {
  const [activeAsset, setActiveAsset] = useState(null);

  return (
    <main className="film-selected-page">
      <button className="back-button" onClick={onBack}>← BACK TO FILMS</button>

      {!activeAsset ? (
        <>
          <section className="selected-title">
            <p className="eyebrow">{film.type}</p>
            <h1>{film.title}</h1>
            <p>{film.logline}</p>
          </section>
          <AssetGrid film={film} onChoose={setActiveAsset} />
        </>
      ) : (
        <AssetDetail film={film} activeId={activeAsset} setActiveId={setActiveAsset} />
      )}
    </main>
  );
}

function PanelOverlay({ panel, onClose }) {
  if (!panel) return null;

  const copy = {
    about: "A living style sheet for the films, choices, attitude and taste of Holy Flock Films.",
    manifesto: "For the devoted and the deranged. Films built as belief systems, artefacts and fever dreams.",
    news: "News, fragments, process notes and signals from the flock.",
    shop: "Objects, shirts, print artefacts and strange devotional merchandise.",
    contact: "For films, collaborations, screenings and strange invitations.",
  };

  return (
    <aside className="panel-overlay">
      <button onClick={onClose} className="panel-close">CLOSE ×</button>
      <p className="eyebrow">{panel}</p>
      <h1>{panel.toUpperCase()}</h1>
      <p>{copy[panel] || "Coming soon."}</p>
    </aside>
  );
}

export default function App() {
  const [selectedFilmId, setSelectedFilmId] = useState(null);
  const [panel, setPanel] = useState(null);

  const selectedFilm = films.find((film) => film.id === selectedFilmId);
  const mode = selectedFilm ? "dark" : "light";

  const goFilms = () => {
    setPanel(null);
    setSelectedFilmId(null);
  };

  return (
    <div className={`app-shell ${mode}`}>
      <div className="page-bg" />
      <RayField mode={mode} />

      <Nav mode={mode} onFilms={goFilms} onPanel={setPanel} />

      {selectedFilm ? (
        <FilmSelectedPage film={selectedFilm} onBack={goFilms} />
      ) : (
        <FilmsPage onSelectFilm={(id) => {
          setPanel(null);
          setSelectedFilmId(id);
        }} />
      )}

      <PanelOverlay panel={panel} onClose={() => setPanel(null)} />
    </div>
  );
}
