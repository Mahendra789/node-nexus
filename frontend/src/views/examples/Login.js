import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../../api/user";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Alert,
} from "reactstrap";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertState, setAlertState] = useState({
    visible: false,
    color: "",
    message: "",
  });

  const setAlert = (message, color) => {
    setAlertState({ visible: true, color, message });
    setTimeout(
      () => setAlertState((prev) => ({ ...prev, visible: false })),
      3000
    );
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setAlert("Please enter both email and password.", "danger");
      return;
    }
    try {
      setIsSubmitting(true);
      const data = await loginApi({
        email: form.email,
        password: form.password,
      });
      if (data?.token) window.localStorage.setItem("authToken", data.token);
      if (data?.userId) window.localStorage.setItem("userId", data.userId);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      setAlert(err?.message || "Login failed. Please try again.", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign In</small>
            </div>
            {alertState.visible && (
              <div className="mb-3">
                <Alert
                  color={alertState.color}
                  toggle={() =>
                    setAlertState((prev) => ({ ...prev, visible: false }))
                  }
                >
                  {alertState.message}
                </Alert>
              </div>
            )}
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange("email")}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange("password")}
                  />
                </InputGroup>
              </FormGroup>
              {/* Remember me removed */}
              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
