import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import HomeLeader from "./features/admin/pages/homeLeader";

import Login from "./features/auth/pages/login";
import ChangePassword from "./features/auth/pages/ChangePassword";
import Registro from "./features/auth/pages/registro";
import ForgotPassword from "./features/auth/pages/forgotPassword";

import SongSeachPublic from "./features/songs/pages/searchPublicSongs";
import VistaPublicaCancion from "./features/songs/pages/vistaPublicaCancion";

import Home from "./pages/home";




function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Layout principal */}
        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/search-public-songs" element={<SongSeachPublic />} />
          <Route path="/vista-cancion-publica/:id" element={<VistaPublicaCancion />} />


        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
