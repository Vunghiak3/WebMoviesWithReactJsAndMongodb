import { useState } from "react";
import styles from "./AddMovie.module.css";
import { toSlug } from "../../hook/toSlug";

function AddMovie({ setMovies, setMode }) {
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
    <div style={{ padding: 30 }}>
      <h1 style={{ marginLeft: 10, color: "#ff8802" }}>Thêm phim:</h1>
      <table className={styles.tableAddMovie}>
        <tbody>
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
            <th className={styles.functionAdd}>
              <button
                className={styles.btnCancel}
                onClick={() => setMode(null)}
              >
                Hủy
              </button>
              <button className={styles.btnAdd} onClick={handleAddNewMovie}>
                Thêm phim
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AddMovie;
