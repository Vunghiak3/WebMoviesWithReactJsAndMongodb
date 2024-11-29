import styles from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import { DetailMovie } from "../../components/DetailMovie/DetailMovie";
import AddMovie from "../../components/AddMovie/AddMovie";
import UpdateMovie from "../../components/UpdateMovie/UpdateMovie";

export default function DashboardPage() {
  const [movies, setMovies] = useState([]);
  const [movieDetail, setMovieDetail] = useState([]);
  const [currentMode, setCurrentMode] = useState(null);
  // const [search, setSearch] = useState("");

  const fetchApi = async () => {
    try {
      const response = await fetch("http://localhost:5000/movies");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // if (search !== "") {
      //   const filteredMovies = data.filter((movie) =>
      //     movie.name.toLowerCase().includes(search.toLowerCase())
      //   );
      //   setMovies(filteredMovies);
      // } else {
      // }
      setMovies(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const handleHideDiaLog = () => {
    setCurrentMode(null);
  };

  const handleShowDetailMovie = (movie) => {
    setMovieDetail(movie);
    setCurrentMode("detail");
  };

  const handleShowUpdateMovie = (movie) => {
    setMovieDetail(movie);
    setCurrentMode("update");
  };

  const handleShowAddMovie = () => {
    setCurrentMode("add");
  };

  const handleRemoveMovie = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/movies/${id}`, {
        method: "DELETE",
      });

      await response.json();
      setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== id));
      alert("Xóa phim thành công!");
    } catch (error) {
      alert("Xóa phim khong thành công! Vui lòng thử lại!");
      console.error("An error occurred while deleting the movie:", error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.actions}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            // value={search}
            // onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.btnWrapper}>
          <button className={styles.btnAdd} onClick={handleShowAddMovie}>
            Thêm Phim
          </button>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Phim</th>
              <th>Tình trạng phim</th>
              <th>Năm</th>
              <th>Thể loại</th>
              <th>Quốc gia</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie, index) => {
              return (
                <tr key={index}>
                  <td>
                    <div className={styles.movieItem}>
                      <img src={movie.image} alt={movie.name} />
                      <div>
                        <p>{movie.name}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {(movie.status === "??" &&
                      `${movie.episode.length}/${movie.status}`) ||
                      `${movie.status} (${movie.episode.length}/${movie.episode.length})`}
                  </td>
                  <td>{movie.year}</td>
                  <td>
                    {movie.category.map((category) => category).join(", ")}
                  </td>
                  <td>{movie.country.map((country) => country).join(", ")}</td>
                  <td>
                    <button
                      onClick={() => handleShowDetailMovie(movie)}
                      style={{ margin: "3px 0" }}
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handleShowUpdateMovie(movie)}
                      style={{ margin: "3px 0" }}
                    >
                      Sửa
                    </button>
                    <button onClick={() => handleRemoveMovie(movie._id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}></div>
      {currentMode && (
        <div className={styles.detailMovie}>
          <div className={styles.overlay} onClick={handleHideDiaLog}></div>
          <div className={styles.content}>
            <button
              className={styles.closeDetailMovie}
              onClick={handleHideDiaLog}
            >
              X
            </button>
            {currentMode === "detail" && (
              <DetailMovie
                movie={movieDetail}
                setMovies={setMovies}
                setMode={setCurrentMode}
              />
            )}
            {currentMode === "update" && (
              <UpdateMovie
                movie={movieDetail}
                setMovies={setMovies}
                setMode={setCurrentMode}
                resetMovies={fetchApi()}
              />
            )}
            {currentMode === "add" && (
              <AddMovie setMovies={setMovies} setMode={setCurrentMode} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
