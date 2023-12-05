import { Container, Row } from "react-bootstrap";
import style from "./SurahsList.module.css";
import SurahItem from "../../components/surahItem/surahItem";
import { useContext } from "react";
import { SurahsContext } from "../../contexts/SurahsContext";
import Header from "../../components/Header/Header";
import About from "../../components/About/About";
import Services from "../../components/Services/Services";
const Home = () => {
  const {surahs} = useContext(SurahsContext);
  console.log(surahs);
  return (
   < >

   <Header style={{backgroundColor: '#fae1ce'}}></Header>
   <About></About>
   <Services></Services>
   </>
        
  );
};

export default Home;
