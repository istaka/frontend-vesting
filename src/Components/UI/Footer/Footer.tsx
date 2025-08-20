import { Container } from "react-bootstrap";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer-style">
      <Container>
        <p>
          iPAZA LABS {new Date().getFullYear()}-{new Date().getFullYear() + 1}{" "}
          All rights reserved
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
