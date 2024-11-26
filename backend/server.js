const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const Movies = require("./models/Movies");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mydatabase")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection error:", err));

app.get("/movies", async (req, res) => {
  const movies = await Movies.find();
  res.json(movies);
});

app.get("/movies/:slug", async (req, res) => {
  const { slug } = req.params;
  const movie = await Movies.findOne({ slug });
  res.json(movie);
});

//cập nhật phim
app.put("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMovie = await Movies.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(updatedMovie);
  } catch (error) {
    console.error("Error updating movie:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the movie" });
  }
});

//xóa phim
app.delete("/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movies.findByIdAndDelete(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ message: "Movie deleted successfully", movie });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({
      message: "An error occurred while deleting the movie",
      error: error.message,
    });
  }
});

//xóa tập phim
app.delete("/movies/:movieId/episode/:episodeId", async (req, res) => {
  try {
    const { movieId, episodeId } = req.params;

    // Tìm movie và loại bỏ episode theo episodeId
    const updatedMovie = await Movies.findByIdAndUpdate(
      movieId,
      {
        $pull: {
          episode: { _id: episodeId }, // Loại bỏ episode có _id khớp với episodeId
        },
      },
      { new: true } // Trả về bản ghi đã được cập nhật
    );

    if (!updatedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(updatedMovie);
  } catch (error) {
    console.error("Error deleting episode:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the episode" });
  }
});

//cập nhật link từng tập phim
app.put("/movies/:movieId/episode/:episodeId", async (req, res) => {
  try {
    const { movieId, episodeId } = req.params;
    const episode = req.body;

    const updatedMovie = await Movies.findOneAndUpdate(
      { _id: movieId, "episode._id": episodeId },
      {
        $set: { "episode.$.link": episode.link },
      },
      { new: true }
    );

    if (!updatedMovie) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy phim hoặc tập phim!" });
    }

    res.json(updatedMovie);
  } catch (error) {
    console.error("Error updating episode:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the episode" });
  }
});

//thêm 1 tập phim mới
app.post("/movies/:movieId/episode", async (req, res) => {
  try {
    const { movieId } = req.params;
    const { name, link } = req.body;

    if (!name || !link) {
      return res.status(400).json({ error: "Name and link are required" });
    }

    const newEpisode = {
      name,
      link,
    };

    const updatedMovie = await Movies.findByIdAndUpdate(
      movieId,
      { $push: { episode: newEpisode } },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(updatedMovie);
  } catch (error) {
    console.error("Error adding episode:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the episode" });
  }
});

//them phim
app.post("/movies", async (req, res) => {
  try {
    const movies = new Movies(req.body);
    await movies.save();
    res.status(201).json(movies);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res.status(400).json({
        message: `Phim '${error.keyValue[field]}' đã tồn tại. Vui lòng nhập phim khác!`,
        field: field,
      });
    } else {
      res.status(500).json({ message: "An error occurred", error });
    }
  }
});

app.listen(5000, () =>
  console.log(`Server running on http://localhost:${5000}`)
);
