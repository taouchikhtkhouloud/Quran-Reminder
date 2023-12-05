import { Outlet, Route, Routes } from "react-router";
import Surahs from "./pages/SurahsList/SurahsList";
import Surah from "./pages/Surah/Surah";
import Home from "./pages/Home/Home";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <Routes>
        <Route path="/" >
          <Route index element={<Home />} />
          <Route path="/surahs" element={<Surahs />} />
          <Route path='/:surahNumber' element={<Surah />} />
        </Route>
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
