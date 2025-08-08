import React from "react";
import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

const NotAllowed = () => {
  const navigate = useNavigate();

  return (
    <div className="col-lg-6 col-md-8">
      <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5 text-center">
          <div className="mb-4">
            <i
              className="ni ni-lock-circle-open text-warning"
              style={{ fontSize: 48 }}
            />
          </div>
          <CardTitle tag="h2" className="mb-3">
            Access Not Allowed
          </CardTitle>
          <CardText className="mb-4">
            You don’t have permission to view this page. Please log in with the
            right account.
          </CardText>
          <div className="d-flex justify-content-center gap-2">
            <Button
              color="info"
              onClick={() => navigate("/auth/login", { replace: true })}
            >
              Go to Login
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default NotAllowed;
