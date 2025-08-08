import React from "react";
import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="col-lg-6 col-md-8">
      <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5 text-center">
          <div className="mb-4">
            <i
              className="ni ni-fat-remove text-danger"
              style={{ fontSize: 48 }}
            />
          </div>
          <CardTitle tag="h2" className="mb-3">
            404 - Page Not Found
          </CardTitle>
          <CardText className="mb-4">
            The page you are looking for doesn’t exist or has been moved.
          </CardText>
          <div className="text-center">
            <Button
              color="primary"
              onClick={() => navigate("/admin/dashboard", { replace: true })}
            >
              Go to Dashboard
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default NotFound;
