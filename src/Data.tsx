import { useEffect, useState } from "react";
import TorrentPlayer from "./TorrentPlayer";

const Data = () => {
  const [results, setResults] = useState([]);
  const url = "https://movies-api.accel.li/api/v2/list_movies.json";
  const sampleMagnet =
    "https://yts.pw/torrent/download/96EEB3DF6B2CDE4628A537BC32EC897DD5867159";
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
