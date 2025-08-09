/*eslint-disable*/

// reactstrap components
import { Container, Row, Col } from "reactstrap";
import React from "react";

const Login = () => {
  return (
    <>
      <footer className="py-5">
        <Container>
          <Row className="align-items-center justify-content-xl-between">
            <Col xl="12">
              <div className="copyright text-center text-xl-center text-muted">
                © {new Date().getFullYear()}{" "}
                <a className="font-weight-bold ml-1">Node Nexus</a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Login;
