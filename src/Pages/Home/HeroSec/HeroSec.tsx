import { Col, Container, Row } from "react-bootstrap";
import hero_sec_img from "../../../Assets/Images/hero_sec_img.png";
import "./HeroSec.scss";

const HeroSec = () => {
  return (
    <section className="hero-sec">
      <Container>
        <Row>
          <Col md={6} className="order-md-last">
            <div className="hero-sec__img">
              <img src={hero_sec_img} alt="hero-sec-img" />
            </div>
          </Col>
          <Col md={6}>
            <div className="hero-sec__content">
              <h1>
                Use this token now to access{" "}
                <span className="text-secondary">rewards,</span> benefits, and
                exclusive <span className="text-secondary">offers</span>
              </h1>
              <p>
                By presenting this unique token, you unlock a world of
                opportunities. This token serves as your key to accessing
                exclusive rewards, benefits, and privileges. Seize the chance to
                claim what's rightfully yours.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSec;
