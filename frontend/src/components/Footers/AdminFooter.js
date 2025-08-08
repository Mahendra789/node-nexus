// reactstrap components
import { Row, Col } from "reactstrap";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="12">
          <div className="copyright text-center text-xl-center text-muted">
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1"
              href="https://mahendra789.github.io"
              rel="noopener noreferrer"
              target="_blank"
            >
              Mahendra
            </a>
          </div>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
