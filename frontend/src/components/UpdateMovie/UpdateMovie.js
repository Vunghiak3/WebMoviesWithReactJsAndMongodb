import { useEffect, useState } from "react";
import styles from "./UpdateMovie.module.css";
import { toSlug } from "../../hook/toSlug";

export default function UpdateMovie({ movie, setMovies, setMode }) {
  const [statusUpdate, setStatusUpdate] = useState(true);

  return (
    <div className={styles.wrapper}>
      <div className={styles.navbar}>
        <button
          onClick={() => setStatusUpdate(true)}
          className={statusUpdate ? styles.activeLog : undefined}
        >
          Cập nhật thông tin phim
        </button>
        <button
          onClick={() => setStatusUpdate(false)}
          className={!statusUpdate ? styles.activeLog : undefined}
        >
          Cập nhật tập phim
        </button>
      </div>
      <table className={styles.tableUpdate}>
        <tbody>
          {statusUpdate ? (
            <UpdateInfo movie={movie} setMovies={setMovies} setMode={setMode} />
          ) : (
            <ManagementEpisode movie={movie} setMovies={setMovies} />
          )}
        </tbody>
      </table>
    </div>
  );
}

function UpdateInfo({ movie, setMovies, setMode }) {
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

  return (
    <>
      <tr className={styles.groupInput}>
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
      <tr className={styles.groupInput}>
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
      <tr className={styles.groupInput}>
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
      <tr className={styles.groupInput}>
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
      <tr className={styles.groupInput}>
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
      <tr className={styles.groupInput}>
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
      <tr className={styles.groupInput}>
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
      <tr className={styles.groupInput}>
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
          <button className={styles.btnUpdate} onClick={handleUpdateMovie}>
            Cập nhật
          </button>
        </th>
      </tr>
    </>
  );
}

function ManagementEpisode({ movie, setMovies }) {
  const [episode, setEpisode] = useState(movie.episode);
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
        await response.json();
        alert("Cập nhật tập phim thành công!");
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

  const handleRemoveEpisode = async (episodeId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/movies/${movie._id}/episode/${episodeId}`,
        {
          method: "DELETE",
        }
      );

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
      const updatedMovie = await response.json();
      setEpisode(updatedMovie.episode);
      setNewEpisode("");
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie._id === updatedMovie._id ? updatedMovie : movie
        )
      );
      alert("Tập phim đã được thêm thành công!");
    } catch (error) {
      alert("Thêm tập phim thất bại!");
      console.error("Error adding episode:", error);
    }
  };

  return (
    <>
      {episode.map((item, index) => (
        <tr key={index} className={styles.groupInput}>
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
                    ep.name === item.name ? { ...ep, link: e.target.value } : ep
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
      <tr className={styles.groupInput}>
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
  );
}
