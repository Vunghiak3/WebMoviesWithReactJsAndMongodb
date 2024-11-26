import React, { useState, useEffect } from "react";
import "./Header.css";


export function Header() {


  return (
    <header className="wrapper">
      <div className="inner">
        <div className="header">
          <div className="logo">
            <a href={`/`}>
              <img src="" alt="Ảnh logo" />
            </a>
          </div>

          <Search />

          <div className="actions">
            <button to={"/login"} className="btn-login">
              Đăng nhập
            </button>
          </div>
        </div>

        <div className="nav-menu">
          <a href={`/`} className="menu-item">
            Trang chủ
          </a>
          <a href={`/danh-sach/phim-bo`} className="menu-item">
            Phim bộ
          </a>
          <a href={`/danh-sach/phim-le`} className="menu-item">
            Phim lẻ
          </a>
          <a href={`/danh-sach/tv-shows`} className="menu-item">
            Shows
          </a>
          <a href={`/danh-sach/hoat-hinh`} className="menu-item">
            Hoạt hình
          </a>
          <a href={`/danh-sach/phim-sap-chieu`} className="menu-item">
            Sắp chiếu
          </a>
        </div>
      </div>
    </header>
  );
}

export function Search() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (searchValue === "") {
      setSearchResult([]);
      setShowResult(false);
      return;
    }

    const fetchApi = async () => {
      try {
        const response = await fetch(`http://localhost:5000/movies`);
        const result = await response.json();

        const filteredMovies = result.filter((movie) =>
          movie.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setSearchResult(filteredMovies);
        setShowResult(true);
      } catch (error) {
        console.error("Error fetching all movies: ", error);
      }
    };

    fetchApi();
  }, [searchValue]);

  const handelChange = (e) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
    }
  };

  return (
    <div>
      <div className={"wrapper-search"}>
        <div className={"search"}>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={handelChange}
          />
          <div className={"search-result"}>
            {showResult &&
              searchResult.map((movie) => {
                return (
                  <div key={movie._id} className={"item-wrapper"}>
                    <MovieItem movie={movie} />
                  </div>
                );
              })}
          </div>

          <a className={"btn-search"} href={`/tim-kiem/${searchValue}`}>
            Tìm kiếm
          </a>
        </div>
      </div>
    </div>
  );
}

export function MovieItem({ movie }) {

  console.log(movie);
  return (
    <a className={"movie-result"} href={`/phim/${movie.slug}`}>
      <div className={"img-movie"}>
        <img
          src={movie.image}
          alt={movie.name}
        />
      </div>
      <div className={"title-movie"}>
        <p className={"name-movie"}>{movie.name}</p>
        <p className={"des-movie"}>
          Trạng thái: {(movie.status === "??" &&
            `${movie.episode.length}/${movie.status}`) ||
            `${movie.status} (${movie.episode.length}/${movie.episode.length})`}
        </p>
      </div>

    </a>
  );
}
