import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import Logo from "../Logo/Logo";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const location = useLocation();

  const navigate = useNavigate();

  function handleClickFAQ() {
    const el = document.getElementById("faq");
    window.scrollTo({
      top: el.offsetTop,
      behavior: "smooth",
    });
  }

  return (
    <div className={styles.container}>
      <nav>
        <div
          className={styles.logo}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <h4>
            <Logo />
          </h4>
        </div>
        <ul className={styles.navLinks}>
          <li
            className={
              location.pathname === "/" && !location.pathname.includes("faq")
                ? styles.active
                : styles.navLink
            }
          >
            <Link to="/">Home</Link>
          </li>
          <li
            className={
              location.pathname.includes("faq") ? styles.active : styles.navLink
            }
          >
            <Link to="#faq" onClick={handleClickFAQ}>
              FAQs
            </Link>
          </li>
          <li>
            <Link to="/app/steps/1">
              <Button>App</Button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
