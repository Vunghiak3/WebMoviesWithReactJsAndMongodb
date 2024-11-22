import DashboardPage from "./components/Dashboard";
import { Header } from "./components/Header";

function App() {
  return (
    <div>
      <div className={"wrapper"}>
        <Header />
      </div>
      <DashboardPage />
    </div>
  );
}

export default App;
