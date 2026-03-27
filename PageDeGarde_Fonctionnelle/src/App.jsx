import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css"
import { Profil, Liste, BDE, LoginUser, LoginCDP, LoginBDE } from './Fct_login';
import Accueil from './Fct_Accueil';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/login_user" element={<LoginUser />} />
        <Route path="/login_user/profil" element={<Profil />} />
        <Route path="/login_cdp" element={<LoginCDP />} />
        <Route path="/login_cdp/liste" element={<Liste />} />
        <Route path="/login_bde" element={<LoginBDE />} />
        <Route path="/login_bde/bde" element={<BDE />} />
      </Routes>
    </BrowserRouter>
  )
}


export default App
