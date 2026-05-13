import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";

const PROJECTS = [
  {
    id: "p01",
    title: "RAW SIGNAL",
    meta: "COMMERCIAL / 00:45",
    colour: "#f15a24",
    position: [-3.6, 1.35, 0.2],
    size: [2.65, 1.75],
    copy: "A kinetic launch film built from texture, product fragments and human movement.",
  },
  {
    id: "p02",
    title: "THE WHITE ROOM",
    meta: "MUSIC VIDEO / 03:10",
    colour: "#2563eb",
    position: [-0.85, -0.95, 0.35],
    size: [2.2, 1.55],
    copy: "A cold, hypnotic performance film where the room becomes the instrument.",
  },
  {
    id: "p03",
    title: "RITUAL OBJECT",
    meta: "EXPERIMENT / 01:20",
    colour: "#16a34a",
    position: [2.25, 0.9, 0.15],
    size: [2.5, 1.65],
    copy: "Animated fragments, photographic cut-outs and sculptural debris in collision.",
  },
  {
    id: "p04",
    title: "END OF DAY",
    meta: "FILM / 12:00",
    colour: "#dc2626",
    position: [4.45, -1.35, 0.25],
    size: [2.45, 1.7],
    copy: "A quiet rural story told through faces, weather and silence.",
  },
  {
    id: "p05",
    title: "PROCESS WALL",
    meta: "ARCHIVE / TESTS",
    colour: "#9333ea",
    position: [-5.25, -1.05, 0.1],
    size: [2.15, 1.45],
    copy: "A living archive of tests, accidents, sketches and unfinished collisions.",
  },
];

const MICRO = [
  ["FRAME 004", "grain / motion", "#111827"],
  ["STILL 022", "chemical bloom", "#b91c1c"],
  ["CUT 019", "soft violence", "#1d4ed8"],
  ["TEST 087", "broken lens", "#15803d"],
  ["LOOP 003", "false memory", "#a16207"],
  ["VOID 111", "micro film", "#6d28d9"],
];

function makeTexture({ title, meta, colour = "#111", muted = false, type = "project" }) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 700;
  const ctx = canvas.getContext("2d");

  const bg = muted ? "#e9e7e0" : "#f2f0e8";
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const g = ctx.createLinearGradient(0, 0, 1024, 700);
  g.addColorStop(0, muted ? "rgba(20,20,20,0.05)" : `${colour}33`);
  g.addColorStop(0.45, "rgba(255,255,255,0.65)");
  g.addColorStop(1, muted ? "rgba(20,20,20,0.1)" : `${colour}55`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 700);

  // photographic / graphic block
  ctx.save();
  ctx.translate(120, 80);
  ctx.rotate(-0.05);
  ctx.fillStyle = muted ? "rgba(0,0,0,0.18)" : `${colour}88`;
  ctx.fillRect(0, 0, 760, 420);
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = muted ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.55)";
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    const x = 40 + i * 62;
    const y = 35 + Math.sin(i) * 45;
    ctx.arc(x, y + 180, 30 + (i % 4) * 16, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = muted ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.65)";
  ctx.lineWidth = 8;
  ctx.strokeRect(0, 0, 760, 420);
  ctx.restore();

  // hand-drawn marks / wall energy
  ctx.strokeStyle = muted ? "rgba(0,0,0,0.24)" : "rgba(0,0,0,0.34)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 28; i++) {
    ctx.beginPath();
    const sx = Math.random() * 1024;
    const sy = Math.random() * 700;
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(
      sx + Math.random() * 120 - 60,
      sy + Math.random() * 120 - 60,
      sx + Math.random() * 200 - 100,
      sy + Math.random() * 200 - 100,
      sx + Math.random() * 260 - 130,
      sy + Math.random() * 260 - 130,
    );
    ctx.stroke();
  }

  // type
  ctx.fillStyle = "#111";
  ctx.font = type === "micro" ? "900 78px Arial" : "900 92px Arial";
  ctx.letterSpacing = "-2px";
  ctx.fillText(title, 54, 595);

  ctx.font = "700 32px Arial";
  ctx.fillStyle = muted ? "rgba(0,0,0,0.5)" : colour;
  ctx.fillText(meta, 58, 642);

  // film grain
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4 * 17) {
    const n = Math.random() * 22 - 11;
    data[i] += n;
    data[i + 1] += n;
    data[i + 2] += n;
  }
  ctx.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function makeDoodleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 900;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 3;
  ctx.font = "900 58px Arial";

  const words = ["IDEAS", "CUT", "DRAG", "PLAY", "MESS", "PROCESS", "LOOK", "SHOOT", "DRAW"];
  for (let i = 0; i < 65; i++) {
    ctx.save();
    ctx.translate(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.rotate(Math.random() * Math.PI * 2);
    if (i % 4 === 0) {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillText(words[i % words.length], 0, 0);
    } else {
      ctx.beginPath();
      const r = 18 + Math.random() * 90;
      if (i % 3 === 0) ctx.arc(0, 0, r, 0, Math.PI * 2);
      else ctx.rect(-r / 2, -r / 3, r, r * 0.7);
      ctx.stroke();
    }
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function Wall({ drawMode }) {
  const mesh = useRef();
  const texture = useMemo(() => makeDoodleTexture(), []);

  useFrame(({ clock, mouse }) => {
    if (!mesh.current) return;
    mesh.current.material.opacity = THREE.MathUtils.lerp(
      mesh.current.material.opacity,
      drawMode ? 0.25 : 0.55,
      0.04,
    );
    mesh.current.position.x = mouse.x * 0.08;
    mesh.current.position.y = mouse.y * 0.08;
    texture.offset.x = Math.sin(clock.elapsedTime * 0.05) * 0.015;
    texture.offset.y = Math.cos(clock.elapsedTime * 0.04) * 0.015;
  });

  return (
    <mesh ref={mesh} position={[0, 0, -1.15]}>
      <planeGeometry args={[18, 11]} />
      <meshBasicMaterial map={texture} transparent opacity={0.5} />
    </mesh>
  );
}

function FloatingCard({ project, index, activeProject, setActiveProject, setCursor }) {
  const ref = useRef();
  const dragging = useRef(false);
  const [pos, setPos] = useState(project.position);
  const [hovered, setHovered] = useState(false);
  const texture = useMemo(
    () => makeTexture({ title: project.title, meta: project.meta, colour: project.colour, muted: !hovered && activeProject !== project.id }),
    [project.title, project.meta, project.colour, hovered, activeProject, project.id],
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const targetScale = hovered || activeProject === project.id ? 1.08 : 1;
    ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.12);
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, targetScale, 0.12);
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, pos[0], 0.14);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, pos[1] + Math.sin(clock.elapsedTime * 0.8 + index) * 0.03, 0.12);
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, hovered ? 0.015 : Math.sin(index) * 0.035, 0.08);
  });

  return (
    <mesh
      ref={ref}
      position={pos}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setCursor({ label: "DRAG / OPEN", tone: project.colour });
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        if (!dragging.current) setCursor({ label: "MOVE", tone: "#111" });
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        dragging.current = true;
        e.target.setPointerCapture(e.pointerId);
        setActiveProject(project.id);
        setCursor({ label: "DRAGGING", tone: project.colour });
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        e.stopPropagation();
        setPos([e.point.x, e.point.y, project.position[2] + 0.45]);
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        dragging.current = false;
        e.target.releasePointerCapture(e.pointerId);
        setCursor({ label: "OPEN", tone: project.colour });
      }}
      onClick={(e) => {
        e.stopPropagation();
        setActiveProject(project.id);
      }}
    >
      <planeGeometry args={project.size} />
      <meshBasicMaterial map={texture} transparent opacity={1} />
    </mesh>
  );
}

function BlackDot({ active, setMode, setCursor }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const s = active ? 1.85 + Math.sin(clock.elapsedTime * 1.4) * 0.03 : 1 + Math.sin(clock.elapsedTime * 1.2) * 0.05;
    ref.current.scale.setScalar(s);
    ref.current.rotation.z += 0.003;
  });

  return (
    <mesh
      ref={ref}
      position={[0.72, 0.18, 0.75]}
      onPointerOver={() => setCursor({ label: active ? "ESCAPE" : "DIVE", tone: "#000" })}
      onPointerOut={() => setCursor({ label: "MOVE", tone: "#111" })}
      onClick={(e) => {
        e.stopPropagation();
        setMode(active ? "overview" : "blackdot");
      }}
    >
      <circleGeometry args={[0.42, 96]} />
      <meshBasicMaterial color="black" />
    </mesh>
  );
}

function MicroGallery({ visible, setCursor }) {
  const group = useRef();
  const textures = useMemo(
    () =>
      MICRO.map(([title, meta, colour]) =>
        makeTexture({ title, meta, colour, muted: false, type: "micro" }),
      ),
    [],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.visible = visible;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.2) * 0.08;
    group.current.children.forEach((child, i) => {
      child.position.y += Math.sin(clock.elapsedTime * 1.2 + i) * 0.0008;
      child.rotation.z = Math.sin(clock.elapsedTime * 0.5 + i) * 0.06;
    });
  });

  if (!visible) return null;

  return (
    <group ref={group} position={[0.1, -0.15, 1.35]}>
      {textures.map((texture, i) => {
        const a = (i / textures.length) * Math.PI * 2;
        const r = 1.55 + (i % 2) * 0.55;
        return (
          <mesh
            key={MICRO[i][0]}
            position={[Math.cos(a) * r, Math.sin(a) * r, 0.3 + i * 0.02]}
            onPointerOver={() => setCursor({ label: "PULL", tone: MICRO[i][2] })}
            onPointerOut={() => setCursor({ label: "DIVE", tone: "#000" })}
          >
            <planeGeometry args={[1.25, 0.86]} />
            <meshBasicMaterial map={texture} />
          </mesh>
        );
      })}
    </group>
  );
}

function CameraRig({ mode }) {
  const { camera } = useThree();
  useFrame(({ mouse }) => {
    const targetZ = mode === "blackdot" ? 3.9 : 7.25;
    const targetX = mode === "blackdot" ? 0.6 : mouse.x * 0.22;
    const targetY = mode === "blackdot" ? 0.15 : mouse.y * 0.22;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.055);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.055);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.055);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene({ mode, setMode, activeProject, setActiveProject, setCursor }) {
  const drawMode = mode === "draw";
  return (
    <>
      <color attach="background" args={["#f4f1e8"]} />
      <CameraRig mode={mode} />
      <Wall drawMode={drawMode} />
      <group visible={mode !== "blackdot"}>
        {PROJECTS.map((project, index) => (
          <FloatingCard
            key={project.id}
            project={project}
            index={index}
            activeProject={activeProject}
            setActiveProject={setActiveProject}
            setCursor={setCursor}
          />
        ))}
      </group>
      <BlackDot active={mode === "blackdot"} setMode={setMode} setCursor={setCursor} />
      <MicroGallery visible={mode === "blackdot"} setCursor={setCursor} />
    </>
  );
}

function CustomCursor({ cursor }) {
  const ref = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (!ref.current) return;
      ref.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-50 hidden -translate-x-1/2 -translate-y-1/2 mix-blend-difference md:block"
    >
      <div
        className="flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 text-[10px] font-black uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-all duration-200"
        style={{ boxShadow: `0 0 0 9999px transparent`, background: "rgba(255,255,255,0.02)" }}
      >
        {cursor.label}
      </div>
    </div>
  );
}

function DrawLayer({ active }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef([0, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const get = (e) => [e.clientX, e.clientY];
  const start = (e) => {
    if (!active) return;
    drawing.current = true;
    last.current = get(e);
  };
  const move = (e) => {
    if (!active || !drawing.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const [x, y] = get(e);
    ctx.strokeStyle = "rgba(0,0,0,0.76)";
    ctx.lineWidth = e.shiftKey ? 18 : 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current[0], last.current[1]);
    ctx.lineTo(x, y);
    ctx.stroke();
    last.current = [x, y];
  };
  const end = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 z-20 ${active ? "pointer-events-auto" : "pointer-events-none"}`}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
      />
      <AnimatePresence>
        {active && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={clear}
            className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-black bg-[#f4f1e8]/80 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md hover:bg-black hover:text-white"
          >
            clear wall
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

function ProjectPanel({ project, onClose }) {
  if (!project) return null;
  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="fixed bottom-5 right-5 z-40 max-w-sm rounded-2xl border border-black/20 bg-[#f4f1e8]/80 p-5 shadow-2xl backdrop-blur-xl"
    >
      <div className="mb-8 flex items-center justify-between gap-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/55">selected work</p>
        <button onClick={onClose} className="rounded-full border border-black px-3 py-1 text-[10px] font-black uppercase hover:bg-black hover:text-white">
          close
        </button>
      </div>
      <h2 className="text-4xl font-black uppercase leading-[0.88] tracking-[-0.08em]">{project.title}</h2>
      <p className="mt-3 text-xs font-black uppercase tracking-[0.22em]" style={{ color: project.colour }}>
        {project.meta}
      </p>
      <p className="mt-5 text-sm leading-6 text-black/75">{project.copy}</p>
      <button className="mt-6 w-full rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-white hover:opacity-80">
        open case study
      </button>
    </motion.aside>
  );
}

function IntroOverlay({ dismissed, setDismissed }) {
  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#f4f1e8] p-6"
        >
          <div className="max-w-4xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 text-xs font-black uppercase tracking-[0.42em] text-black/50"
            >
              WebGL process wall prototype
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-6xl font-black uppercase leading-[0.82] tracking-[-0.09em] text-black md:text-8xl"
            >
              A living wall for film, process and experiments.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mx-auto mt-7 max-w-xl text-base leading-7 text-black/65"
            >
              Drag the work around, dive into the black dot, draw on the surface, or use the stripped-back menu. Replace the placeholder textures with your own stills and footage.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              onClick={() => setDismissed(true)}
              className="mt-10 rounded-full bg-black px-8 py-4 text-xs font-black uppercase tracking-[0.26em] text-white hover:opacity-75"
            >
              enter wall
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileFallback() {
  return (
    <div className="fixed inset-0 z-[70] hidden items-center justify-center bg-black p-8 text-center text-white max-md:flex">
      <div>
        <p className="mb-5 text-xs font-black uppercase tracking-[0.4em] text-white/50">best viewed wide</p>
        <h2 className="text-5xl font-black uppercase leading-[0.86] tracking-[-0.08em]">Turn your device</h2>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-white/60">
          This prototype is intentionally spatial and cursor-led. A mobile HTML fallback should be built for production.
        </p>
      </div>
    </div>
  );
}

export default function DveinInspiredWebGLSite() {
  const [mode, setMode] = useState("overview");
  const [activeProject, setActiveProject] = useState(null);
  const [cursor, setCursor] = useState({ label: "MOVE", tone: "#111" });
  const [dismissed, setDismissed] = useState(false);

  const selectedProject = PROJECTS.find((p) => p.id === activeProject);

  const chooseMode = useCallback((next) => {
    setMode(next);
    if (next !== "overview") setActiveProject(null);
  }, []);

  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") {
        setMode("overview");
        setActiveProject(null);
      }
      if (e.key === "ArrowRight") {
        const current = Math.max(0, PROJECTS.findIndex((p) => p.id === activeProject));
        setActiveProject(PROJECTS[(current + 1) % PROJECTS.length].id);
      }
      if (e.key === "ArrowLeft") {
        const current = Math.max(0, PROJECTS.findIndex((p) => p.id === activeProject));
        setActiveProject(PROJECTS[(current - 1 + PROJECTS.length) % PROJECTS.length].id);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [activeProject]);

  return (
    <div className="relative h-screen w-screen cursor-none overflow-hidden bg-[#f4f1e8] text-black">
      <Canvas camera={{ position: [0, 0, 7.25], fov: 45 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: false }}>
        <Scene mode={mode} setMode={setMode} activeProject={activeProject} setActiveProject={setActiveProject} setCursor={setCursor} />
      </Canvas>

      <DrawLayer active={mode === "draw"} />
      <CustomCursor cursor={cursor} />
      <MobileFallback />
      <IntroOverlay dismissed={dismissed} setDismissed={setDismissed} />

      <header className="pointer-events-none fixed left-5 top-5 z-40 right-5 flex items-start justify-between gap-6 mix-blend-multiply">
        <button
          onClick={() => chooseMode("overview")}
          className="pointer-events-auto text-left text-4xl font-black uppercase leading-[0.8] tracking-[-0.08em] hover:opacity-50"
        >
          Studio<br />Wall
        </button>

        <nav className="pointer-events-auto flex flex-wrap justify-end gap-2 rounded-full border border-black/20 bg-[#f4f1e8]/55 p-2 text-[10px] font-black uppercase tracking-[0.22em] backdrop-blur-md">
          {[
            ["overview", "overview"],
            ["draw", "draw"],
            ["blackdot", "black dot"],
            ["about", "about"],
          ].map(([key, label]) => (
            <button
              key={key}
              onPointerOver={() => setCursor({ label: "CLICK", tone: "#111" })}
              onClick={() => chooseMode(key)}
              className={`rounded-full px-4 py-2 transition ${mode === key ? "bg-black text-white" : "hover:bg-black/10"}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <div className="pointer-events-none fixed bottom-6 left-6 z-30 max-w-xs mix-blend-multiply">
        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-black/45">cursor-led interface</p>
        <p className="mt-2 text-sm leading-5 text-black/60">
          Drag project surfaces. Click the black dot. Press Esc to reset. Use arrows to move through selected work.
        </p>
      </div>

      <AnimatePresence>
        {mode === "about" && (
          <motion.section
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            className="fixed right-5 top-24 z-40 max-w-md rounded-3xl border border-black/20 bg-[#f4f1e8]/85 p-7 shadow-2xl backdrop-blur-xl"
          >
            <p className="mb-6 text-[10px] font-black uppercase tracking-[0.35em] text-black/45">about the system</p>
            <h2 className="text-5xl font-black uppercase leading-[0.82] tracking-[-0.08em]">Interface as process.</h2>
            <p className="mt-6 text-sm leading-7 text-black/70">
              This is a WebGL-led portfolio shell: a whiteboard of live work, sketch material, film stills and strange objects. The main site should load real media from a CMS, generate texture atlases for performance, and use an HTML fallback for smaller screens.
            </p>
            <button
              onClick={() => chooseMode("overview")}
              className="mt-7 rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-white hover:opacity-80"
            >
              back to wall
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mode === "blackdot" && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="pointer-events-none fixed left-1/2 top-10 z-30 -translate-x-1/2 text-center mix-blend-difference"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.42em] text-white/60">inside the black dot</p>
            <h2 className="mt-2 text-5xl font-black uppercase leading-[0.82] tracking-[-0.08em] text-white">micro footage archive</h2>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && mode === "overview" && <ProjectPanel project={selectedProject} onClose={() => setActiveProject(null)} />}
      </AnimatePresence>
    </div>
  );
}
