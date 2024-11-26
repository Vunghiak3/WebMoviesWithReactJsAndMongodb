import styles from "./Episode.module.css";

export default function Episode({ movie }) {
  return (
    <div className={styles.episodeDetailMovie}>
      <h2>Tập phim</h2>
      <div className={styles.listButton}>
        {movie.episode?.map((item, index) => (
          <a href={`/phim/${movie.slug}/${item.name}`} key={index}>{item.name}</a>
        ))}
      </div>
    </div>
  );
}
