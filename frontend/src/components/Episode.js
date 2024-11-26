import { useState } from "react";
import styles from "./Episode.module.css";
import { useParams } from "react-router-dom";

export default function Episode({ movie }) {
  const { slug } = useParams();
  return (
    <div className={styles.episodeDetailMovie}>
      <h2>Tập phim</h2>
      <div className={styles.listButton}>
        {movie.episode?.map((item, index) => (
          <a href={`${slug}/${item.name}`} key={index}>{item.name}</a>
        ))}
      </div>
    </div>
  );
}
