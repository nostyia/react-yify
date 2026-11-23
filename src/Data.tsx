import { useEffect, useState } from "react";
import TorrentPlayer from "./TorrentPlayer";

const Data = () => {
  const [results, setResults] = useState([]);
  const url = "https://movies-api.accel.li/api/v2/list_movies.json";
  const sampleMagnet =
    "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        const result = data.data.movies;
        setResults(result);
        console.log(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <TorrentPlayer magnetURI={sampleMagnet} />
      {results.map((m) => (
        <div className="movie" key={m.id}>
          <img src={m.medium_cover_image} alt="" />
          <h1>{m.title}</h1>
          <p>{m.description_full}</p>
        </div>
      ))}
    </>
  );
};

export default Data;
