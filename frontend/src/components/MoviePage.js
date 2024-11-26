import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DetailMovie } from "./DetailMovie";

function MoviePage() {
    const { slug } = useParams();
    const [moive, setMovie] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const response = await fetch(`http://localhost:5000/movies/${slug}`);
                const result = await response.json();
                setMovie(result);
            } catch (error) {
                console.error("Error fetching all movies: ", error);
            }
        };

        fetchApi();
    }, [slug])

    return (
        <div style={{ backgroundColor: "#0f1416", margin: "10px auto", maxWidth: 1300 }}>
            <DetailMovie movie={moive} />
        </div>
    );
}
export default MoviePage