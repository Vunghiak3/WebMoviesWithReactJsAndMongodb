import styles from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import { DetailMovie } from "./DetailMovie";

export default function DashboardPage() {
  const [movies, setMovies] = useState([]);
  const [movieDetail, setMovieDetail] = useState([]);
  const [currentMode, setCurrentMode] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await fetch("http://localhost:5000/movies");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (search !== "") {
          const filteredMovies = data.filter((movie) =>
            movie.name.toLowerCase().includes(search.toLowerCase())
          );
          setMovies(filteredMovies);
        } else {
          setMovies(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchApi();
  }, [search]);

  const handleShowDiaLog = () => {
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
        alert(`Error: ${errorData.message}`);
        return;
      }

      const result = await response.json();
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                    <button onClick={() => handleShowDetailMovie(movie)}>
                      Chi tiết
                    </button>
                    <button onClick={() => handleShowUpdateMovie(movie)}>
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
          <div className={styles.overlay} onClick={handleShowDiaLog}></div>
          <div className={styles.content}>
            <button
              className={styles.closeDetailMovie}
              onClick={handleShowDiaLog}
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

function toSlug(name) {
  return name
    .normalize("NFD") // Chuyển chuỗi về dạng chuẩn hóa tổ hợp ký tự
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/đ/g, "d") // Chuyển đổi 'đ' thành 'd'
    .replace(/Đ/g, "D") // Chuyển đổi 'Đ' thành 'D'
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Loại bỏ các ký tự đặc biệt
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .trim() // Loại bỏ khoảng trắng đầu/cuối chuỗi
    .toLowerCase(); // Chuyển tất cả về chữ thường
}

export function UpdateMovie({ movie, setMovies, setMode }) {
  const [image, setImage] = useState(movie.image);
  const [name, setName] = useState(movie.name);
  const [description, setDescription] = useState(movie.description);
  const [year, setYear] = useState(movie.year);
  const [status, setStatus] = useState(movie.status);
  const [country, setCountry] = useState(
    movie.country.map((country) => country).join(", ")
  );
  const [category, setCategory] = useState(
    movie.category.map((category) => category).join(", ")
  );
  const [actor, setActor] = useState(
    movie.actor.map((actor) => actor).join(", ")
  );
  const [episode, setEpisode] = useState(movie.episode);
  const [statusUpdate, setStatusUpdate] = useState(true);
  const [newEpisode, setNewEpisode] = useState("");
  const [updateEpisode, setUpdateEpisode] = useState(null);

  useEffect(() => {
    const fetchUpdateEpisode = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/movies/${movie._id}/episode/${updateEpisode?._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateEpisode),
          }
        );
        if (response.ok) {
          await response.json();
          alert("Cập nhật tập phim thành công!");
        } else {
          alert("Cập nhật tập phim thất bại!");
          console.error("Update failed:", response.statusText);
        }
      } catch (error) {
        alert("Cập nhật tập phim không thành công!");
        console.error("Error during update:", error);
      }
    };

    if (updateEpisode) {
      fetchUpdateEpisode();
    }
  }, [updateEpisode]);

  const handleUpdateEpisode = async (id) => {
    const episodeLink = episode.find((item) => item._id === id);
    setUpdateEpisode(episodeLink);
  };

  const handleUpdateMovie = async () => {
    const updateMovie = {
      name,
      slug: toSlug(name),
      description,
      image,
      year,
      status,
      category: category.split(",").map((item) => item.trim()),
      country: country.split(",").map((item) => item.trim()),
      actor: actor.split(",").map((item) => item.trim()),
    };

    try {
      const response = await fetch(
        `http://localhost:5000/movies/${movie._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateMovie),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setMovies((prevMovies) =>
          prevMovies.map((movie) => (movie._id === result._id ? result : movie))
        );
        alert("Cập nhật thành công!");
      } else {
        alert("Cập nhật thất bại!");
        console.error("Update failed:", response.statusText);
      }
    } catch (error) {
      alert("Cập nhật không thành công!");
      console.error("Error during update:", error);
    }
  };

  const handleRemoveEpisode = async (episodeId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/movies/${movie._id}/episode/${episodeId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedMovie = await response.json();
        setEpisode((prevEpisodes) =>
          prevEpisodes.filter((episode) => episode._id !== episodeId)
        );

        setMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie._id === updatedMovie._id ? updatedMovie : movie
          )
        );

        alert("Tập phim đã được xóa thành công!");
      } else {
        throw new Error("Failed to delete episode.");
      }
    } catch (error) {
      alert("Xóa tập phim không thành công!");
      console.error("Error during remove episode:", error);
    }
  };

  const handleAddNewEpisode = async (link) => {
    if (link === "") {
      alert("Chưa thêm đường dẫn tập phim!");
      return;
    }
    const newEpisode = {
      name: episode.length + 1,
      link,
    };
    try {
      const response = await fetch(
        `http://localhost:5000/movies/${movie._id}/episode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEpisode),
        }
      );
      if (response.ok) {
        const updatedMovie = await response.json();
        setEpisode(updatedMovie.episode);
        setNewEpisode("");
        setMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie._id === updatedMovie._id ? updatedMovie : movie
          )
        );
        alert("Tập phim đã được thêm thành công!");
      } else {
        throw new Error("Thêm tập phim thất bại");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi thêm tập phim!");
      console.error("Error adding episode:", error);
    }
  };

  return (
    <div className={styles.wrapperUpdate}>
      <div className={styles.headerUpdate}>
        <button
          onClick={() => setStatusUpdate(true)}
          className={statusUpdate ? styles.activeLog : undefined}
        >
          Thông tin phim
        </button>
        <button
          onClick={() => setStatusUpdate(false)}
          className={!statusUpdate ? styles.activeLog : undefined}
        >
          Tập phim
        </button>
      </div>
      <table className={styles.tableUpdate}>
        <tbody>
          {statusUpdate ? (
            <>
              <tr className={styles.groupUpdate}>
                <th>
                  <label htmlFor="imgMovie">Ảnh phim:</label>
                </th>
                <th>
                  <input
                    type="text"
                    placeholder="Nhập đường dẫn ảnh...."
                    id="imgMovie"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                  <img src={image} alt={name} />
                </th>
              </tr>
              <tr className={styles.groupUpdate}>
                <th>
                  <label htmlFor="name">Tên phim:</label>
                </th>
                <th>
                  <input
                    type="text"
                    id="name"
                    placeholder="Nhập tên phim...."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </th>
              </tr>
              <tr className={styles.groupUpdate}>
                <th>
                  <label htmlFor="description">Nội dung phim:</label>
                </th>
                <th>
                  <textarea
                    rows="3"
                    cols="50"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </th>
              </tr>
              <tr className={styles.groupUpdate}>
                <th>
                  <label>Năm phát hành:</label>
                </th>
                <th>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    step="1"
                    placeholder="YYYY"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </th>
              </tr>
              <tr className={styles.groupUpdate}>
                <th>
                  <label htmlFor="status">Tình trạng phim:</label>
                </th>
                <th>
                  <input
                    type="text"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </th>
              </tr>
              <tr className={styles.groupUpdate}>
                <th>
                  <label htmlFor="category">Thể loại:</label>
                </th>
                <th>
                  <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </th>
              </tr>
              <tr className={styles.groupUpdate}>
                <th>
                  <label htmlFor="actor">Diễn viên:</label>
                </th>
                <th>
                  <input
                    type="text"
                    id="actor"
                    value={actor}
                    onChange={(e) => setActor(e.target.value)}
                  />
                </th>
              </tr>
              <tr className={styles.groupUpdate}>
                <th>
                  <label htmlFor="country">Quốc gia:</label>
                </th>
                <th>
                  <input
                    type="text"
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </th>
              </tr>
              <tr>
                <th></th>
                <th className={styles.functionUpdate}>
                  <button
                    className={styles.btnCancelUpdate}
                    onClick={() => setMode(null)}
                  >
                    Hủy
                  </button>
                  <button
                    className={styles.btnUpdate}
                    onClick={handleUpdateMovie}
                  >
                    Cập nhật
                  </button>
                </th>
              </tr>
            </>
          ) : (
            <>
              {episode.map((item, index) => (
                <tr key={index} className={styles.groupUpdate}>
                  <th>
                    <label htmlFor={item._id}>Tập {item.name}:</label>
                  </th>
                  <th>
                    <input
                      id={item._id}
                      type="text"
                      value={item.link}
                      onChange={(e) =>
                        setEpisode((prev) =>
                          prev.map((ep) =>
                            ep.name === item.name
                              ? { ...ep, link: e.target.value }
                              : ep
                          )
                        )
                      }
                    />
                  </th>
                  <th>
                    <button
                      className={styles.btnUpdateEpisode}
                      onClick={() => handleUpdateEpisode(item._id)}
                    >
                      Sửa
                    </button>
                    {index === episode.length - 1 && (
                      <button
                        className={styles.btnRemoveEpisode}
                        onClick={() => handleRemoveEpisode(item._id)}
                      >
                        Xóa
                      </button>
                    )}
                  </th>
                </tr>
              ))}
              <tr className={styles.groupUpdate}>
                <td>
                  <label htmlFor="newEpisode">Thêm tập mới:</label>
                </td>
                <td>
                  <input
                    id="newEpisode"
                    value={newEpisode}
                    onChange={(e) => setNewEpisode(e.target.value)}
                  />
                </td>
                <td>
                  <button
                    className={styles.btnAddNewEpisode}
                    onClick={() => handleAddNewEpisode(newEpisode)}
                  >
                    Thêm
                  </button>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function AddMovie({ setMovies, setMode }) {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [actor, setActor] = useState("");

  const handleAddNewMovie = async () => {
    const newMovie = {
      name,
      slug: toSlug(name),
      description,
      image,
      year,
      status,
      category: category.split(",").map((item) => item.trim()),
      country: country.split(",").map((item) => item.trim()),
      actor: actor.split(",").map((item) => item.trim()),
    };
    try {
      const response = await fetch("http://localhost:5000/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovie),
      });
      if (response.ok) {
        const result = await response.json();
        setMovies((prevMovies) => [...prevMovies, result]);
        alert("Thêm phim thành công!");
        setMode(null);
      } else {
        const error = await response.json();
        if (error.field) {
          alert(`Error: ${error.message}`);
        } else {
          console.error("Add new movie failed:", response.statusText);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <table className={styles.tableUpdate}>
        <tbody>
          <tr className={styles.groupUpdate}>
            <th>
              <label htmlFor="imgMovie">Ảnh phim:</label>
            </th>
            <th>
              <input
                type="text"
                placeholder="Nhập đường dẫn ảnh...."
                id="imgMovie"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <img src={image} alt={name} />
            </th>
          </tr>
          <tr className={styles.groupUpdate}>
            <th>
              <label htmlFor="name">Tên phim:</label>
            </th>
            <th>
              <input
                type="text"
                id="name"
                placeholder="Nhập tên phim...."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </th>
          </tr>
          <tr className={styles.groupUpdate}>
            <th>
              <label htmlFor="description">Nội dung phim:</label>
            </th>
            <th>
              <textarea
                rows="3"
                cols="50"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </th>
          </tr>
          <tr className={styles.groupUpdate}>
            <th>
              <label>Năm phát hành:</label>
            </th>
            <th>
              <input
                type="number"
                min="1900"
                max="2100"
                step="1"
                placeholder="YYYY"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </th>
          </tr>
          <tr className={styles.groupUpdate}>
            <th>
              <label htmlFor="status">Tình trạng phim:</label>
            </th>
            <th>
              <input
                type="text"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </th>
          </tr>
          <tr className={styles.groupUpdate}>
            <th>
              <label htmlFor="category">Thể loại:</label>
            </th>
            <th>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </th>
          </tr>
          <tr className={styles.groupUpdate}>
            <th>
              <label htmlFor="actor">Diễn viên:</label>
            </th>
            <th>
              <input
                type="text"
                id="actor"
                value={actor}
                onChange={(e) => setActor(e.target.value)}
              />
            </th>
          </tr>
          <tr className={styles.groupUpdate}>
            <th>
              <label htmlFor="country">Quốc gia:</label>
            </th>
            <th>
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </th>
          </tr>
          <tr>
            <th></th>
            <th className={styles.functionUpdate}>
              <button
                className={styles.btnCancelUpdate}
                onClick={() => setMode(null)}
              >
                Hủy
              </button>
              <button className={styles.btnUpdate} onClick={handleAddNewMovie}>
                Thêm phim
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
