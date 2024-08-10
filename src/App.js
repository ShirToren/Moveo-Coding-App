import "./index.css";
import LobbyPage from "./components/LobbyPage";
import CodeBlockPage from "./components/CodeBlockPage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/lobby" />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/codeblock/:id" element={<CodeBlockPage />} />
      </Routes>
    </Router>
  );
}

export default App;
