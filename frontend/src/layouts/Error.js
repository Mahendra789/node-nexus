import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import HeroHeader from "components/Common/HeroHeader";

import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";

import NotFound from "views/errors/NotFound";
import NotAllowed from "views/errors/NotAllowed";

const ErrorLayout = () => {
  const mainContent = React.useRef(null);

  React.useEffect(() => {
    document.body.classList.add("bg-default");
    return () => {
      document.body.classList.remove("bg-default");
    };
  }, []);

  React.useEffect(() => {
    // Update title based on error route
    const path = window.location.pathname.replace("/error", "");
    let page = "Error";
    if (path.startsWith("/not-found")) page = "Not Found";
    else if (path.startsWith("/not-allowed")) page = "Not Allowed";
    document.title = `Node Nexus - ${page}`;
  }, []);

  return (
    <>
      <div className="main-content" ref={mainContent}>
        <AuthNavbar />
        <HeroHeader
          title="There was a problem"
          subtitle="The page you requested is unavailable or access is restricted."
        />
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Routes>
              <Route path="not-found" element={<NotFound />} />
              <Route path="not-allowed" element={<NotAllowed />} />
              <Route path="*" element={<Navigate to="not-found" replace />} />
            </Routes>
          </Row>
        </Container>
      </div>
      <AuthFooter />
    </>
  );
};

export default ErrorLayout;
