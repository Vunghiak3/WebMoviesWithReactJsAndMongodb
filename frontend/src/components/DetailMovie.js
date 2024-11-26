import styles from './DetailMovie.module.css'
import Episode from './Episode';

export function DetailMovie({ movie }) {
  return (
    <div className={styles.wrapperDetailMovie}>
      <div className={styles.innerMovieDetail}>
        <div className={styles.imgDetailMovie}>
          <img src={movie.image} alt={movie.name} />
        </div>
        <div className={styles.contentDetailMovie}>
          <div className={styles.titleDetailMovie}>
            <h1>{movie.name}</h1>
          </div>
          <table className={styles.tableDetailMovie}>
            <tbody>
              <tr>
                <th>Trạng thái:</th>
                <td>{movie.status}</td>
              </tr>
              <tr>
                <th>Số tập:</th>
                <td>
                  {movie.episode?.length > 0
                    ? movie.episode?.slice(-1)[0].name
                    : "Chưa có tập phim"}
                </td>
              </tr>
              <tr>
                <th>Năm Phát Hành:</th>
                <td>{movie.year}</td>
              </tr>
              <tr>
                <th>Diễn Viên:</th>
                <td>{movie.actor?.map((actor) => actor).join(", ")}</td>
              </tr>
              <tr>
                <th>Thể Loại:</th>
                <td>{movie.category?.map((category) => category).join(", ")}</td>
              </tr>
              <tr>
                <th>Quốc Gia:</th>
                <td>{movie.country?.map((country) => country).join(", ")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.descriptionDetailMovie}>
        <h2>Nội dung phim</h2>
        <p>{movie.description}</p>
      </div>

      <Episode movie={movie} />
    </div>
  );
}
