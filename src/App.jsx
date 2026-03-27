import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageAccueil from "./PageAccueil";
import SosValides  from "./SOS_validés";
import SosExpires  from "./SOS_expirés";
import ValiderSOS  from "./ValiderSOS";
import AjoutSos from "./ajout_SOS";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"            element={<PageAccueil />} />
        <Route path="/valider/:id" element={<ValiderSOS />} />
        <Route path="/valides"     element={<SosValides />} />
        <Route path="/expires"     element={<SosExpires />} />
        <Route path="/ajout"     element={<AjoutSos />} />
      </Routes>
    </Router>
  );
}
