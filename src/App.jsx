import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, MainApp } from "./pages";
import "./App.module.scss";
import "./App.css";
import GlobalContextProvider from "./utils/contexts/GlobalContext";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <GlobalContextProvider>
        <Routes>
          <Route path="/app/steps/:step" element={<MainApp />} />
        </Routes>
      </GlobalContextProvider>
    </Router>
  );
};

export default App;
