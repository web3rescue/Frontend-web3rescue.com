import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
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
      <TawkMessengerReact
                propertyId="631def9437898912e9687714"
                widgetId="1gcmevnou"/>
      <GlobalContextProvider>
        <Routes>
          <Route path="/app/steps/:step" element={<MainApp />} />
        </Routes>
      </GlobalContextProvider>
    </Router>
  );
};

export default App;
