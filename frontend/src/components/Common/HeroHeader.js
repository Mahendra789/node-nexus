import React from "react";
import { Container, Row, Col } from "reactstrap";

const HeroHeader = ({
  title,
  subtitle,
  gradientClass = "bg-gradient-info",
}) => {
  return (
    <div className={`header ${gradientClass} py-7 py-lg-8`}>
      <Container>
        <div className="header-body text-center mb-7">
          <Row className="justify-content-center">
            <Col lg="6" md="8">
              <h1 className="text-white">{title}</h1>
              {subtitle ? (
                <p className="text-lead text-light">{subtitle}</p>
              ) : null}
            </Col>
          </Row>
        </div>
      </Container>
      <div className="separator separator-bottom separator-skew zindex-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          version="1.1"
          viewBox="0 0 2560 100"
          x="0"
          y="0"
        >
          <polygon className="fill-default" points="2560 0 2560 100 0 100" />
        </svg>
      </div>
    </div>
  );
};

export default HeroHeader;
