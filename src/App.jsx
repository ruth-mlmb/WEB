import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageAccueil from "./PageAccueil";
import SosValides  from "./SOS_validés";
import SosExpires  from "./SOS_expirés";
import ValiderSOS  from "./ValiderSOS";
import AjoutSos from "./ajout_SOS";
import Accueil from "./Fct_Accueil";
import { Profil, Liste, BDE, LoginUser, LoginCDP, LoginBDE } from "./Fct_login";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/home" element={<PageAccueil />} />
        <Route path="/valider/:id" element={<ValiderSOS />} />
        <Route path="/valides" element={<SosValides />} />
        <Route path="/expires" element={<SosExpires />} />
        <Route path="/ajout" element={<AjoutSos />} />

        <Route path="/login_user" element={<LoginUser />} />
        <Route path="/login_user/profil" element={<Profil />} />

        <Route path="/login_cdp" element={<LoginCDP />} />
        <Route path="/login_cdp/liste" element={<Liste />} />

        <Route path="/login_bde" element={<LoginBDE />} />
        <Route path="/login_bde/bde" element={<BDE />} />
      </Routes>
    </Router>
  );
}
