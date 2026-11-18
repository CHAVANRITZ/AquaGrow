
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import PumpControl from "./pages/PumpControl";
import IrrigationSettings from "./pages/IrrigationSettings";
import Devices from "./pages/Devices";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />

<Routes>
  <Route path="/" element={<Dashboard />} />

  <Route path="/pump" element={<PumpControl />} />

  <Route path="/settings" element={<IrrigationSettings />} />

  <Route path="/devices" element={<Devices />} />

  <Route path="/analytics" element={<Analytics />} />

  <Route
    path="*"
    element={<Navigate to="/" replace />}
  />

</Routes>
      </main>
    </div>
  );
}

export default App;
