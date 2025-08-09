import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/user";
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  Alert,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
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

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    if (!password || password.length < 6) return false;
    // must include at least one number or special character
    const hasNumberOrSpecial = /[0-9\W]/.test(password);
    return hasNumberOrSpecial;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = form;

    // Required fields check
    if (!firstName || !lastName || !email || !password) {
      setAlert("All fields are required.", "danger");
      return;
    }

    // Email validation
    if (!isValidEmail(email)) {
      setAlert("Please enter a valid email address.", "danger");
      return;
    }

    // Password validation
    if (!isValidPassword(password)) {
      setAlert(
        "Password must be at least 6 characters and include a number or special character.",
        "danger"
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await createUser({ firstName, lastName, email, password });
      setAlert("User registered successfully.", "success");
      setForm({ firstName: "", lastName: "", email: "", password: "" });
      setTimeout(() => navigate("/auth/login"), 800);
    } catch (err) {
      console.error("Registration failed:", err);
      setAlert("Registration failed. Please try again.", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign up</small>
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
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Firstname"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange("firstName")}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Lastname"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange("lastName")}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
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
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange("password")}
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-muted font-italic">
                <small>
                  password strength:{" "}
                  <span className="text-success font-weight-700">strong</span>
                </small>
              </div>

              <div className="text-center">
                <Button
                  className="mt-4"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create account"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <div className="mt-3 text-center">
          <a className="text-light" href="/auth/login">
            <small>Already have an account? Sign in</small>
          </a>
        </div>
      </Col>
    </>
  );
};

export default Register;
