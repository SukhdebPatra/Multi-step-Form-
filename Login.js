import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  FormGroup,
  Input,
  Label,
  Button,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
} from "reactstrap";
import {
  Password,
  SignIn,
  EmailAddress,
  RememberPassword,
  ForgotPassword,
  CreateAccount,
  FIREBASE,
  AUTH0,
  JWT,
  LoginWithJWT,
} from "../../constant";
import { Form } from "react-bootstrap";
import { GitHub, Facebook, Twitter } from "react-feather";
import loginImage from "../../assets/images/login/register-v2.svg";
import { toast, ToastContainer } from "react-toastify";
import history from "../../assets/history/history";
import axios from "../../assets/axios/axios";
import { StoreUrl } from "../../assets/Api/api";

const LoginWithBgImage = (props) => {
  const [togglePassword, setTogglePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState("firebase");

  const handleChange = (e) => {
    setPassword(e.target.value);
  };
  const HideShowPassword = (tPassword) => {
    setTogglePassword(!tPassword);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      console.log("validity fails");
    } else {
      console.log("validity true");
      const data = { email: email, password: password };
      console.log(data);
      axios
        .post(`VendorAuth/Login`, data)
        .then((response) => {
          console.log(response);
          window.localStorage.setItem(
            "user",
            JSON.stringify(response.data.data)
          );
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.data.token;
          toast.info("loged in succesfuly!", {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: true,
            autoClose: 3000,
          });
          axios
            .get(`${StoreUrl}/GetAllVendorStores/${response.data.data.id}`)
            .then((response) => {
              console.log(response);
              window.localStorage.setItem(
                "store",
                JSON.stringify(response.data.data[0])
              );
              history.push("/vendor/dashboard");
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response) {
            toast.error(error.response.data.message, {
              position: toast.POSITION.TOP_CENTER,
              hideProgressBar: true,
              autoClose: 3000,
            });
          }
        });
    }

    setValidated(true);
  };
  return (
    <Container fluid={true}>
      <Row>
        <Col
          xl="7"
          className="b-center bg-size"
          style={{
            backgroundImage: `url(${loginImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "block",
          }}
        >
          <img
            className="bg-img-cover bg-center"
            style={{ display: "none" }}
            src={loginImage}
            alt="looginpage"
          />
        </Col>
        <Col xl="5" className="p-0">
          <div className="login-card">
            <div>
              <div>
                <a className="logo text-left" href="#javascript">
                  <img
                    className="img-fluid for-light"
                    src={require("../../assets/images/logo/login.png")}
                    alt="looginpage"
                  />
                  <img
                    className="img-fluid for-dark"
                    src={require("../../assets/images/logo/logo_dark.png")}
                    alt="looginpage"
                  />
                </a>
              </div>
              <div className="login-main login-tab">
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit}
                  className="theme-form login-validation"
                >
                  <h4>Sign in to account</h4>
                  <p>Enter your email & password to login</p>
                  <FormGroup>
                    <Label className="col-form-label">{EmailAddress}</Label>
                    <Input
                      className="form-control"
                      type="email"
                      required
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Please enter valid email address.
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label className="col-form-label">{Password}</Label>
                    <Input
                      className="form-control"
                      type={togglePassword ? "text" : "password"}
                      name="login[password]"
                      value={password}
                      onChange={(e) => handleChange(e)}
                      required
                      placeholder="*********"
                    />
                    <div className="invalid-feedback">
                      Please enter valid password.
                    </div>
                    <div
                      className="show-hide"
                      onClick={() => HideShowPassword(togglePassword)}
                    >
                      <span className={togglePassword ? "" : "show"}></span>
                    </div>
                  </FormGroup>
                  <FormGroup className="mb-0">
                    <div className="checkbox ml-3">
                      <Input id="checkbox1" type="checkbox" />
                      <Label className="text-muted" for="checkbox1">
                        {RememberPassword}
                      </Label>
                    </div>
                    <a className="link" href="#javascript">
                      {ForgotPassword}
                    </a>
                    <Button color="primary" className="btn-block" type="submit">
                      Sign in
                    </Button>
                  </FormGroup>
                  <p className="mt-4 mb-0">
                    {"Don't have account?"}
                    <a className="ml-2" href="/create-accountForm">
                      {CreateAccount}
                    </a>
                  </p>
                </Form>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default LoginWithBgImage;
