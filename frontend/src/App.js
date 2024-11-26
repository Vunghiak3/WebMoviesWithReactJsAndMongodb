import DashboardPage from "./components/Dashboard";
import { Header } from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <div className="wrapper">
          <Header />
        </div>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/phim/:slug" element={<DashboardPage />} />
          <Route path="/phim/:slug/:tapphim" element={<DashboardPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
