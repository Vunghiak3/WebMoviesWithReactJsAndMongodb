import styles from "./Episode.module.css";

export default function Episode({ movie }) {
  return (
    <div className={styles.episodeDetailMovie}>
      <h2>Tập phim</h2>
      <div className={styles.listButton}>
        {movie.episode.map((item, index) => (
          <button key={index}>{item.name}</button>
        ))}
      </div>
    </div>
  );
}
