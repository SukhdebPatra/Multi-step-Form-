import React, { useState } from "react";
import history from "../../assets/history/history";
import axios from "axios";
import { useEffect } from "react";

const version = "v1";
var vendorAuthUrl = "api/VendorAuth";
const subscriptionsUrl = `api/${version}/Subscriptions`;
const adminCouponsUrl = `api/${version}/AdminCoupons`;
const informatonUrl = `api/${version}/Information`;
var OTP = "";
var objRazorPaymentDetails = {};
var objSubscription = {};
var objCoupon = {};

const CreateAccount = ({
  handleNext,
  formData,
  handleInputChange,
  validated,
  handleSubmit,
  showPassword,
  toggleShowPassword,
}) => {
  // const [formData, setFormData] = useState({
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   phone: "",
  //   password: "",
  // });
  // const [validated, setValidated] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     console.log("validity false");
  //     setValidated(true);
  //   } else {
  //     console.log("validity true", formData,'from form one');
  //     handleNext();

  //     setValidated(false);
  //   }
  // };

  // const handleclick = () => {};
  // const toggleShowPassword = () => {
  //   setShowPassword(!showPassword);
  // };

  return (
    <>
      <form
      className={`theme-form info-validation ${validated ? 'was-validated' : ''}`}
        id="dvBasicInfo"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="wizard-title mb-3">
          <h4>Sign up to account</h4>
        </div>
        <div className="form-group mb-3">
          <div className="row g-2">
            <div className="col-6">
              <label className="col-form-label pt-0">First name</label>
              <input
                className="form-control"
                id="txtFirstName"
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                name="firstName"
              />
              {validated && !formData.name && (
                <div className="invalid-feedback">
                  Please enter valid first name.
                </div>
              )}
            </div>
            <div className="col-6">
              <label className="col-form-label pt-0">Last name</label>
              <input
                className="form-control"
                id="txtLastName"
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                name="lastName"
              />
              {validated && !formData.name && (
                <div className="invalid-feedback">
                  Please enter valid last name.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="form-group mb-3">
          <label className="col-form-label">Email Address</label>
          <input
            className="form-control"
            id="txtEmail"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            name="email"
          />
          {validated && !formData.name && (
            <div className="invalid-feedback">
              Please enter valid email address.
            </div>
          )}
        </div>
        <div className="form-group mb-3">
          <label className="col-form-label">Mobile Number</label>
          <input
            className="form-control"
            id="txtMobileNumber"
            type="number"
            placeholder="123213123"
            value={formData.phone}
            onChange={handleInputChange}
            required
            name="phone"
          />
          {validated && !formData.name && (
            <div className="invalid-feedback">
              Please enter valid mobile number.
            </div>
          )}
        </div>
        <div className="form-group mb-3">
          <label className="col-form-label">Password</label>
          <div className="form-input position-relative">
            <input
              className="form-control"
              id="txtPassword"
              value={formData.password}
              onChange={handleInputChange}
              required
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="*********"
            />
            <div className="show-hide">
              <span
                onClick={toggleShowPassword}
                style={{ cursor: "pointer" }}
                className="show"
              ></span>
            </div>
            {validated && !formData.name && (
              <div className="invalid-feedback">
                Please enter valid password.
              </div>
            )}
          </div>
        </div>
        <p className="mt-4 mb-0">
          Already have an account?
          <a
            className="ms-2"
            href="vendor/index.html"
            data-bs-original-title=""
            title=""
          >
            
            Sign in
          </a>
        </p>
        <label>&nbsp;</label>
        <button
          className="btn btn-primary pull-right"
          id="btnInfoNext"
          type="submit"
          data-bs-original-title=""
          title=""
          // onClick={handleNext}
        >
          Next
        </button>
      </form>
    </>
  );
};

export default CreateAccount;
