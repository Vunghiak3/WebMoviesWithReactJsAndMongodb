import DashboardPage from "./components/Dashboard";
import { Header } from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoviePage from "./components/MoviePage";
import WatchMovie from "./components/WatchMovie";

function App() {
  return (
    <div>
      <Router>
        <div className="wrapper">
          <Header />
        </div>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/phim/:slug" element={<MoviePage />} />
          <Route path="/phim/:slug/:tapphim" element={<WatchMovie />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
