import DashboardPage from "./page/Dashboard/DashboardPage";
import { Header } from "./components/Header/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WatchMoviePage from "./page/WatchMovie/WatchMoviePage";
import DetailMoviePage from "./page/DetailMovie/DetailMoviePage";

function App() {
  return (
    <div>
      <Router>
        <div className="wrapper">
          <Header />
        </div>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/phim/:slug" element={<DetailMoviePage />} />
          <Route path="/phim/:slug/:tapphim" element={<WatchMoviePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
