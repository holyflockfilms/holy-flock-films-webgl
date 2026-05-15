import { useEffect, useState } from "react";
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
        {stack.slice(0, 4).map((src, i) => {
          const offsets = [-2, -1, 1, 2];
          const offset = offsets[i] ?? 0;

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
        <p className="meta">
          {film.year} <span>·</span> {film.runtime}
        </p>
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

function getAssetDisplay(asset) {
  if (asset.display) return asset.display;
  if (asset.video) return "video";
  if (asset.id === "poster") return "portrait";
  if (asset.id === "synopsis" || asset.id === "pitch") return "document";
  return "landscape";
}

function getAssetPreviewSrc(asset) {
  return asset.previewImage || asset.image || asset.fullImage || "";
}

function getAssetFullSrc(asset) {
  return asset.fullImage || asset.image || asset.previewImage || "";
}

function AssetMedia({ asset, large = false }) {
  const display = getAssetDisplay(asset);

  if (asset.video && large) {
    return (
      <iframe
        className={`asset-video asset-media-display-${display}`}
        src={cleanVimeoUrl(asset.video)}
        title={asset.title}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        allowFullScreen
      />
    );
  }

  const src = large ? getAssetFullSrc(asset) : getAssetPreviewSrc(asset);

  return (
    <img
      className={`asset-img asset-media-display-${display}`}
      src={src}
      alt={asset.title}
    />
  );
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
          <span className="asset-action">
            {asset.action} <span>→</span>
          </span>
        </button>
      ))}
    </section>
  );
}

function AssetModal({ film, activeId, setActiveId, onClose }) {
  const activeIndex = Math.max(0, film.assets.findIndex((asset) => asset.id === activeId));
  const active = film.assets[activeIndex] || film.assets[0];
  const display = getAssetDisplay(active);
  const metaEntries = Object.entries(active.meta || film.meta || {});

  return (
    <div
      className="asset-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`asset-modal asset-modal-${display}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${film.title} ${active.title}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="asset-modal-close" onClick={onClose}>
          CLOSE X
        </button>

        <div className="asset-modal-media-wrap">
          <div className={`asset-modal-media ${display}`}>
            <AssetMedia asset={active} large />
          </div>
        </div>

        <aside className="asset-modal-copy">
          <p className="eyebrow">{film.title}</p>
          <h1>{active.title}</h1>
          <p>{active.longDescription || active.description}</p>

          {metaEntries.length > 0 && (
            <dl>
              {metaEntries.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="asset-modal-selector" aria-label="Film option selector">
            {film.assets.map((asset) => (
              <button
                key={asset.id}
                className={asset.id === active.id ? "active" : ""}
                onClick={() => setActiveId(asset.id)}
              >
                {asset.title}
              </button>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

function FilmSelectedPage({ film, onBack }) {
  const [activeAsset, setActiveAsset] = useState(null);

  useEffect(() => {
    if (!activeAsset) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveAsset(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeAsset]);

  return (
    <main className="film-selected-page">
      <button className="back-button" onClick={onBack}>
        BACK TO FILMS
      </button>

      <section className="selected-title">
        <p className="eyebrow">{film.type}</p>
        <h1>{film.title}</h1>
        <p>{film.logline}</p>
      </section>

      <AssetGrid film={film} onChoose={setActiveAsset} />

      {activeAsset && (
        <AssetModal
          film={film}
          activeId={activeAsset}
          setActiveId={setActiveAsset}
          onClose={() => setActiveAsset(null)}
        />
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
      <button onClick={onClose} className="panel-close">
        CLOSE ×
      </button>
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
        <FilmsPage
          onSelectFilm={(id) => {
            setPanel(null);
            setSelectedFilmId(id);
          }}
        />
      )}

      <PanelOverlay panel={panel} onClose={() => setPanel(null)} />
    </div>
  );
}
