import React from "react";

const MovieList = ({ movies }) => {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {movies.map((movie) => (
                <div key={movie._id} style={{ border: "1px solid #ccc", padding: "10px" }}>
                    <img src={movie.image} alt={movie.name} style={{ width: "100%" }} />
                    <h3>{movie.name}</h3>
                    <p>{movie.description}</p>
                </div>
            ))}
        </div>
    );
};

export default MovieList;
