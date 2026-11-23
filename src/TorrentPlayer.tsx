import { useEffect, useRef, useState } from "react";
import WebTorrent from "webtorrent";

export default function TorrentPlayer({ magnetURI }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("Iniciando Service Worker...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!magnetURI) return;

    let client;
    let interval;
    let isCancelled = false;

    async function startStreaming() {
      try {
        // 1. Registrar el Service Worker de WebTorrent desde /public
        const controller = await navigator.serviceWorker.register(
          "/sw.min.js",
          {
            scope: "./",
          },
        );
        await navigator.serviceWorker.ready;

        if (isCancelled) return;

        // 2. Crear cliente y conectar el servidor al Service Worker
        client = new WebTorrent();
        client.createServer({ controller });

        setStatus("Conectando con pares...");

        // 3. Añadir el magnet URI
        client.add(magnetURI, (torrent) => {
          if (isCancelled) return;

          const file = torrent.files.find((f) => f.name.endsWith(".mp4"));
          if (!file) {
            setStatus("No se encontró ningún archivo .mp4 en el torrent.");
            return;
          }

          setStatus(`Reproduciendo: ${file.name}`);

          // 4. En v3 se usa file.streamTo() en lugar de renderTo()
          file.streamTo(videoRef.current);

          interval = setInterval(() => {
            setProgress(Math.round(torrent.progress * 100));
          }, 1000);

          torrent.on("done", () => {
            setProgress(100);
            clearInterval(interval);
          });
        });

        client.on("error", (err) => {
          console.error("Error en WebTorrent:", err);
          setStatus(`Error: ${err.message}`);
        });
      } catch (err) {
        console.error("Error iniciando Service Worker:", err);
        setStatus(`Error de Service Worker: ${err.message}`);
      }
    }

    startStreaming();

    return () => {
      isCancelled = true;
      if (interval) clearInterval(interval);
      if (client) client.destroy();
    };
  }, [magnetURI]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <p>
        {status} ({progress}%)
      </p>
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        style={{ width: "100%", backgroundColor: "#000" }}
      />
    </div>
  );
}
