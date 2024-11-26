import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Movie.module.css";
import Episode from "./Episode";

export default function WatchMovie() {
  const { slug, tapphim } = useParams();
  const [movie, setMovie] = useState([]);
  const [episode, setEpisode] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await fetch(`http://localhost:5000/movies/${slug}`);
        const result = await response.json();
        setMovie(result);
        setEpisode(
          result.episode.find((item) => item.name.toString() === tapphim)
        );
      } catch (error) {
        console.error("Error fetching all movies: ", error);
      }
    };

    fetchApi();
  }, [slug]);

  useEffect(() => {
    setEpisode(movie.episode?.find((item) => item.name.toString() === tapphim));
  }, [tapphim]);

  const handleNext = () => {
    const currentIndex = movie.episode.findIndex(
      (item) => item.name.toString() === tapphim
    );
    const nextEpisode = movie.episode[currentIndex + 1];
    if (nextEpisode) {
      navigate(`/phim/${slug}/${nextEpisode.name}`);
    }
  };

  const handlePrevious = () => {
    const currentIndex = movie.episode.findIndex(
      (item) => item.name.toString() === tapphim
    );
    const prevEpisode = movie.episode[currentIndex - 1];
    if (prevEpisode) {
      navigate(`/phim/${slug}/${prevEpisode.name}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapperMovie}>
        <iframe
          className={styles.movie}
          src={episode?.link}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="Movie Video"
        ></iframe>
      </div>
      <div className={styles.actionsMovie}>
        <button onClick={handlePrevious}>
          <span>Tập trước</span>
        </button>
        <button onClick={handleNext}>
          <span>Tập tiếp theo</span>
        </button>
        <button>
          <span>Yêu thích</span>
        </button>
        <button>
          <span>Báo lỗi</span>
        </button>
      </div>
      <Episode movie={movie} />
    </div>
  );
}
