import { useEffect, useState } from "react";
import "./App.css";
import { films, siteConfig } from "./data/filmsData";

const LANDING_ASSETS = {
  landing01: {
    title: "/images/landingpage01/Landing_Page_01_HolyFlockFilms.png",
    eye: "/images/landingpage01/Landing_Page_01_Eye.png",
    sheep: "/images/landingpage01/Landing_Page_01_Sheep.png",
    enter: "/images/landingpage01/Landing_Page_01_EnterAtYourPeril.png",
  },
  landing02: {
    background: "/images/landingpage02/ChatGPT Image May 19, 2026, 12_08_40 PM.png",
    music: "/images/landingpage02/map-music (1).webp",
    join: "/images/landingpage02/map-join-the-flock.webp",
    film: "/images/landingpage02/map-film.webp",
    about: "/images/landingpage02/map-about.webp",
    pitch: "/images/landingpage02/map-pitch-slate.webp",
  },
};

function LandingPageOne({ onEnter }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" || event.key === " ") onEnter();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEnter]);

  return (
    <main className="landing-page landing-page-one" aria-label="Holy Flock Films entrance">
      <button className="landing-one-hit-area" onClick={onEnter}>
        <span className="landing-one-grain" aria-hidden="true" />
        <span className="landing-one-rays" aria-hidden="true" />

        <span className="landing-one-frame landing-one-frame-top" aria-hidden="true" />
        <span className="landing-one-frame landing-one-frame-bottom" aria-hidden="true" />
        <span className="landing-one-frame landing-one-frame-left" aria-hidden="true" />
        <span className="landing-one-frame landing-one-frame-right" aria-hidden="true" />

        <span className="landing-one-corner landing-one-corner-tl" aria-hidden="true">✣</span>
        <span className="landing-one-corner landing-one-corner-tr" aria-hidden="true">✣</span>
        <span className="landing-one-corner landing-one-corner-bl" aria-hidden="true">✣</span>
        <span className="landing-one-corner landing-one-corner-br" aria-hidden="true">✣</span>

        <span className="landing-side-word landing-side-word-left">
          <span>DEVOTED</span>
          <i aria-hidden="true" />
        </span>
        <span className="landing-side-word landing-side-word-right">
          <span>DERANGED</span>
          <i aria-hidden="true" />
        </span>

        <div className="landing-one-eye-code" aria-hidden="true">
          <EyeEmblem />
        </div>

        <img className="landing-one-title" src={LANDING_ASSETS.landing01.title} alt="Holy Flock Films" />
        <img className="landing-one-sheep" src={LANDING_ASSETS.landing01.sheep} alt="Holy Flock sheep" />
        <img className="landing-one-enter" src={LANDING_ASSETS.landing01.enter} alt="Enter at your peril" />

        <span className="landing-one-hint">CLICK TO ENTER</span>

        <div className="landing-one-footer" aria-hidden="true">
          <div className="landing-one-footer-cell">
            <span>FILMS FOR THE</span>
            <strong>DAMNED &amp; THE DEVOTED</strong>
            <em>+</em>
          </div>
          <span className="landing-one-footer-rule" />
          <div className="landing-one-footer-cell landing-one-footer-centre">
            <strong>CULT CINEMA. DIVINE VISION.</strong>
            <i />
          </div>
          <span className="landing-one-footer-rule" />
          <div className="landing-one-footer-cell">
            <strong>SOUND OFF</strong>
            <em className="landing-sound-mark">◖))</em>
          </div>
        </div>
      </button>
    </main>
  );
}

function LandingPageTwo({ onEnterFilms, onPanel, onBack }) {
  const mapItems = [
    {
      id: "music",
      label: "MUSIC",
      src: LANDING_ASSETS.landing02.music,
      className: "map-music",
      onClick: () => onPanel("music"),
    },
    {
      id: "join",
      label: "JOIN THE FLOCK",
      src: LANDING_ASSETS.landing02.join,
      className: "map-join",
      onClick: () => onPanel("join"),
    },
    {
      id: "film",
      label: "FILM",
      src: LANDING_ASSETS.landing02.film,
      className: "map-film",
      onClick: onEnterFilms,
    },
    {
      id: "about",
      label: "ABOUT",
      src: LANDING_ASSETS.landing02.about,
      className: "map-about",
      onClick: () => onPanel("about"),
    },
    {
      id: "pitch",
      label: "PITCH SLATE",
      src: LANDING_ASSETS.landing02.pitch,
      className: "map-pitch",
      onClick: () => onPanel("pitch"),
    },
  ];

  return (
    <main className="landing-page landing-page-map" aria-label="Holy Flock Films graphical menu">
      <button className="landing-map-back" onClick={onBack}>
        BACK
      </button>

      <img className="landing-map-background" src={LANDING_ASSETS.landing02.background} alt="" />

      <div className="landing-map-overlay" aria-hidden="true" />

      <section className="landing-map-objects" aria-label="Holy Flock navigation">
        {mapItems.map((item) => (
          <button key={item.id} className={`map-object ${item.className}`} onClick={item.onClick}>
            <img src={item.src} alt="" />
            <span>{item.label}</span>
          </button>
        ))}
      </section>
    </main>
  );
}


function EyeEmblem() {
  return (
    <svg
      className="eye-emblem-svg"
      viewBox="0 0 180 180"
      role="img"
      aria-label="All-seeing eye"
    >
      <g className="eye-rays" vectorEffect="non-scaling-stroke">
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = (i * 360) / 32;
          const isLong = i % 2 === 0;
          return (
            <line
              key={i}
              x1="90"
              y1={isLong ? "16" : "24"}
              x2="90"
              y2={isLong ? "0" : "7"}
              transform={`rotate(${angle} 90 90)`}
            />
          );
        })}
      </g>
      <circle className="eye-halo" cx="90" cy="90" r="55" />
      <path
        className="eye-outline"
        d="M29 90 C45 63, 69 50, 90 50 C111 50, 135 63, 151 90 C135 117, 111 130, 90 130 C69 130, 45 117, 29 90 Z"
      />
      <circle className="eye-iris" cx="90" cy="90" r="22" />
      <circle className="eye-pupil" cx="90" cy="90" r="9" />
      <circle className="eye-glint" cx="82" cy="82" r="4" />
      <path className="eye-lid" d="M44 91 C62 75, 77 69, 90 69 C103 69, 118 75, 136 91" />
      <path className="eye-lid lower" d="M47 91 C64 108, 78 114, 90 114 C102 114, 116 108, 133 91" />
    </svg>
  );
}

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
          <EyeEmblem />
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
    music: "Sounds, scores, mixtapes and devotional noise from the Holy Flock universe.",
    join: "A place for the faithful, the curious and the deranged. Sign-up details coming soon.",
    pitch: "A curated slate of film worlds, pitch materials, posters and strange invitations.",
    news: "News, fragments, process notes and signals from the flock.",
    shop: "Objects, shirts, print artefacts and strange devotional merchandise.",
    contact: "For films, collaborations, screenings and strange invitations.",
  };

  const titles = {
    join: "JOIN THE FLOCK",
    pitch: "PITCH SLATE",
  };

  const title = titles[panel] || panel.toUpperCase();

  return (
    <aside className="panel-overlay">
      <button onClick={onClose} className="panel-close">
        CLOSE ×
      </button>
      <p className="eyebrow">HOLY FLOCK</p>
      <h1>{title}</h1>
      <p>{copy[panel] || "Coming soon."}</p>
    </aside>
  );
}

export default function App() {
  const [introStage, setIntroStage] = useState("landing-one");
  const [selectedFilmId, setSelectedFilmId] = useState(null);
  const [panel, setPanel] = useState(null);

  const selectedFilm = films.find((film) => film.id === selectedFilmId);
  const mode = selectedFilm ? "dark" : "light";

  const enterFilmSite = () => {
    setPanel(null);
    setSelectedFilmId(null);
    setIntroStage("site");
  };

  const goFilms = () => {
    setPanel(null);
    setSelectedFilmId(null);
    setIntroStage("site");
  };

  if (introStage === "landing-one") {
    return <LandingPageOne onEnter={() => setIntroStage("landing-map")} />;
  }

  if (introStage === "landing-map") {
    return (
      <div className="landing-shell">
        <LandingPageTwo
          onBack={() => {
            setPanel(null);
            setIntroStage("landing-one");
          }}
          onEnterFilms={enterFilmSite}
          onPanel={setPanel}
        />
        <PanelOverlay panel={panel} onClose={() => setPanel(null)} />
      </div>
    );
  }

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
