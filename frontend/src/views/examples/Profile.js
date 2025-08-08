import { useCallback, useEffect, useState } from "react";
// reactstrap components
import {
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { getFirstUser, updateUser as apiUpdateUser } from "../../api/user";

const Profile = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phone: "",
    country: "",
    about: "",
  });
  const [userId, setUserId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [initialUser, setInitialUser] = useState(null);
  const [alertState, setAlertState] = useState({
    visible: false,
    color: "",
    message: "",
  });

  const fetchUser = useCallback(async (isMounted) => {
    try {
      const fetchedUser = await getFirstUser();
      if (isMounted && fetchedUser) {
        setUserId(fetchedUser._id ?? null);
        const normalized = {
          username: fetchedUser.username ?? "",
          email: fetchedUser.email ?? "",
          firstName: fetchedUser.firstName ?? "",
          lastName: fetchedUser.lastName ?? "",
          address: fetchedUser.address ?? "",
          city: fetchedUser.city ?? "",
          country: fetchedUser.country ?? "",
          phone: fetchedUser.phone != null ? String(fetchedUser.phone) : "",
          about: fetchedUser.about ?? "",
        };
        setUser(normalized);
        setInitialUser(normalized);
        try {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...fetchedUser, ...normalized })
          );
          window.dispatchEvent(new Event("user-updated"));
        } catch (e) {
          // ignore storage errors
        }
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }, []);

  const updateUser = async (payload) => {
    const result = await apiUpdateUser(userId, payload);
    const updatedUser = result?.user ?? null;
    if (updatedUser) {
      const normalized = {
        username: updatedUser.username ?? "",
        email: updatedUser.email ?? "",
        firstName: updatedUser.firstName ?? "",
        lastName: updatedUser.lastName ?? "",
        address: updatedUser.address ?? "",
        city: updatedUser.city ?? "",
        country: updatedUser.country ?? "",
        phone: updatedUser.phone != null ? String(updatedUser.phone) : "",
        about: updatedUser.about ?? "",
      };
      setUser(normalized);
      return normalized;
    }
    return null;
  };

  const setAlert = (message, color) => {
    setAlertState({
      visible: true,
      color: color,
      message: message,
    });
    setTimeout(
      () => setAlertState((prev) => ({ ...prev, visible: false })),
      3000
    );
  };

  useEffect(() => {
    let isMounted = true;
    fetchUser(isMounted);
    return () => {
      isMounted = false;
    };
  }, [fetchUser]);

  const handleChange = (field) => (e) =>
    setUser((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!userId) {
      console.error("No userId available for update");
      return;
    }
    try {
      setIsSaving(true);
      const updated = await updateUser(user);
      if (updated) {
        setInitialUser(updated);
        try {
          localStorage.setItem("user", JSON.stringify(updated));
          window.dispatchEvent(new Event("user-updated"));
        } catch (e) {
          // ignore storage errors
        }
        setAlert("Profile updated successfully.", "success");
      } else {
        setAlert("Failed to update profile.", "danger");
      }
    } catch (err) {
      console.error("Failed to update user:", err);
      setAlert("Failed to update profile.", "danger");
    } finally {
      setIsSaving(false);
    }
  };

  const trackedFields = [
    "username",
    "email",
    "firstName",
    "lastName",
    "address",
    "city",
    "country",
    "phone",
    "about",
  ];

  const hasChanges = initialUser
    ? trackedFields.some(
        (key) => (user[key] ?? "") !== (initialUser[key] ?? "")
      )
    : false;

  return (
    <>
      <UserHeader firstName={user.firstName} />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="12">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {alertState.visible && (
                  <div className="pl-lg-4 pb-3">
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
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={user.email}
                            onChange={handleChange("email")}
                            id="input-email"
                            placeholder="jesse@example.com"
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Mobile
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-mobile-code"
                            placeholder="Mobile"
                            value={user.phone}
                            onChange={handleChange("phone")}
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            First name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={user.firstName}
                            onChange={handleChange("firstName")}
                            id="input-first-name"
                            placeholder="First name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Last name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={user.lastName}
                            onChange={handleChange("lastName")}
                            id="input-last-name"
                            placeholder="Last name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Contact information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Address
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={user.address}
                            onChange={handleChange("address")}
                            id="input-address"
                            placeholder="Home Address"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            City
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={user.city}
                            onChange={handleChange("city")}
                            id="input-city"
                            placeholder="City"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Country
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={user.country}
                            onChange={handleChange("country")}
                            id="input-country"
                            placeholder="Country"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small text-muted mb-4">About me</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label>About Me</label>
                      <Input
                        className="form-control-alternative"
                        placeholder="A few words about you ..."
                        rows="4"
                        value={user.about}
                        onChange={handleChange("about")}
                        type="textarea"
                      />
                    </FormGroup>
                  </div>
                  <div className="pl-lg-4 d-flex justify-content-end">
                    <Button
                      color="info"
                      type="button"
                      onClick={handleSave}
                      disabled={!userId || isSaving || !hasChanges}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
