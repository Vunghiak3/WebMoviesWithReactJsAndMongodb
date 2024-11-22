const { default: mongoose } = require("mongoose");

const MoviesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  image: String,
  year: String,
  status: String,
  category: [],
  country: [],
  actor: [],
  episode: [
    {
      name: Number,
      link: String,
    },
  ],
});

const Movies = mongoose.model("Movies", MoviesSchema);

module.exports = Movies;
