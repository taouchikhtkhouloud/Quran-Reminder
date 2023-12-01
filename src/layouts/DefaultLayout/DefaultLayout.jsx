import { Outlet } from "react-router";
import style from "./DefaultLayout.module.css";
import NavBar from "../../components/NavBar/NavBar";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
const DefaultLayout = () => {
  return (
    <div className={style.DefaultLayout}>
      <div className="d-flex flex-column  ">
        <div className="d-flex flex-row justify-content-end w-100 ">

        <NavBar ></NavBar>
        </div>
        <Container className={style.Home}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, duration: 1.2 }}
            className={` w-100 ${style.inner}`}
          >
            
            <Outlet />
          </motion.div>
        </Container>
      </div>
      <footer className={style.footer}>
        <p className="m-0 pb-2 text-center fw-bold">  dksknndononfn oendon     © {(new Date()).getFullYear()} Quran App</p>
      </footer>
    </div>
  );
};

export default DefaultLayout;
