import { useEffect, useState } from "react";
import "./Header.css";

export function Header() {
  return (
    <header className={"wrapper"}>
      <div className={"inner"}>
        <div className={"header"}>
          <div className={"logo"}>
            <a href={`/`}>
              <img src="" alt="Ảnh logo" />
            </a>
          </div>

          <Search />

          <div className={"actions"}>
            <button to={"/login"} className={"btn-login"}>
              Đăng nhập
            </button>
          </div>
        </div>

        <div className={"nav-menu"}>
          <a href={`/`} className={"menu-item"}>
            Trang chủ
          </a>
          <a href={`/danh-sach/phim-bo`} className={"menu-item"}>
            Phim bộ
          </a>
          <a href={`/danh-sach/phim-le`} className={"menu-item"}>
            Phim lẻ
          </a>
          <a href={`/danh-sach/tv-shows`} className={"menu-item"}>
            Shows
          </a>
          <a href={`/danh-sach/hoat-hinh`} className={"menu-item"}>
            Hoạt hình
          </a>
          <a href={`/danh-sach/phim-sap-chieu`} className={"menu-item"}>
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
  const debouncedValue = useDebounce(searchValue, 500);

  useEffect(() => {
    if (debouncedValue === "") {
      setSearchResult([]);
      setShowResult(false);
      return;
    }

    const fechApi = async () => {
      try {
        const response = await fetch(
          `https://ophim1.com/v1/api/tim-kiem?keyword=${debouncedValue}`
        );
        const result = await response.json();
        
        setSearchResult(result.data.items);
        setShowResult(true);
        
      } catch (error) {
        console.error("Error fetching search results: ", error);
      }
    };

    fechApi();
  }, [debouncedValue]);

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
  return (
    <a className={"movie-result"} href={`/phim/${movie.slug}`}>
      <div className={"img-movie"}>
        <img
          src={`https://img.ophim.live/uploads/movies/${movie.thumb_url}`}
          alt={movie.name}
        />
      </div>
      <div className={"title-movie"}>
        <p className={"name-movie"}>{movie.name}</p>
        <p className={"des-movie"}>
          {movie.episode_current + " - " + movie.quality}
        </p>
        <p className={"genre-movie"}>
          Thể loại: {movie.category.map((item) => item.name).join(", ")}
        </p>
      </div>
    </a>
  );
}


function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);
  }, [value]);

  return debouncedValue;
}

