import React, { useEffect, useState } from "react";
import instance from "../../assets/axios/axios";
import { vendorAuthUrl } from "../../assets/Api/api";
import { useRef } from "react";

const OtpPage = ({
  handleSubmit,
  formData,
  handleInputChange,
  validated,
  otpVerification,
  getSubscriptiondata,
  getApplyCouponData,
  SaveVendor,
}) => {
  //   const [formFour, setFormFour] = useState({
  //     otp1: "",
  //     otp2: "",
  //     otp3: "",
  //     checkBox: false,
  //   });
  //   const [validated, setValidated] = useState(false);

  const inputs = {
    otp1Ref: useRef(null),
    otp2Ref: useRef(null),
    otp3Ref: useRef(null),
  };

  useEffect(() => {
    const focusNextInput = (currentInput, nextInput) => {
      if (
        currentInput &&
        currentInput.value.length === currentInput.maxLength
      ) {
        nextInput.focus();
      }
    };

    focusNextInput(inputs.otp1Ref.current, inputs.otp2Ref.current);
    focusNextInput(inputs.otp2Ref.current, inputs.otp3Ref.current);
  }, [formData]);

  //   const handleOtpSubmit = (event) => {
  //     event.preventDefault();
  //     const form = event.currentTarget;
  //     if (form.checkValidity() === false) {
  //       console.log("validity false");
  //       setValidated(true);
  //     } else {
  //       console.log("validity true");
  //       console.log(formFour);
  //       handleSubmit();
  //       setValidated(false);
  //     }
  //   };

  //   const handleInputChangeFour = (event) => {
  //     const { name, value } = event.target;
  //     setFormFour({ ...formFour, [name]: value });
  //   };

  //   const handleInputChangeFour = (e) => {
  //     const { name, value, checked, type } = e.target;

  //     setFormFour((prevState) => ({
  //       ...prevState,
  //       [name]: type === "checkbox" ? checked : value,
  //     }));
  //   };

  // console.log(getApplyCouponData.id, "from  coupon id");
  // console.log(getSubscriptiondata.id, "from subscription id");

  // function SaveVendor() {
  //   var data = {
  //     SubscriptionsId: getSubscriptiondata.id,
  //     AdminCouponsId: getApplyCouponData.id,
  //     subscriptionAmount: "",
  //     email: formData.email,
  //   };

  //   var otpCode = formData.otp1 + formData.otp2 + formData.otp3;
  //   if (otpCode == otpVerification) {
  //     instance
  //       .post(vendorAuthUrl + "/AddSubscriptionOrder", data)
  //       .then((response) => {
  //         console.log(response.data.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // }

  return (
    <>
      <form
        className={`theme-form info-validation ${
          validated ? "was-validated" : ""
        }`}
        id="dvOtpInfo"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="wizard-title mb-3">
          <h5 className="text-muted mb-4">Enter your OTP to verify</h5>
          <div className="mt-4 mb-4">
            <span className="reset-password-link">
              If don't receive OTP?&nbsp;&nbsp;
              <a
                className="btn-link text-danger"
                href="#"
                // onclick="GenerateOtp()"
                data-bs-original-title=""
                title=""
              >
                Resend
              </a>
            </span>
          </div>
          <div className="form-group">
            <label className="col-form-label pt-0">Enter OTP</label>
            <div className="row">
              <div className="col">
                <input
                  className="form-control text-center opt-text"
                  type="text"
                  id="txtOtp1"
                  ref={inputs.otp1Ref}
                  placeholder="00"
                  maxLength="2"
                  required
                  data-bs-original-title=""
                  title=""
                  onChange={handleInputChange}
                  value={formData.otp1}
                  name="otp1"
                />
                {validated && !formData.otp1 && (
                  <div className="invalid-feedback">
                    Please enter valid otp.
                  </div>
                )}
              </div>
              <div className="col">
                <input
                  className="form-control text-center opt-text"
                  type="text"
                  id="txtOtp2"
                  ref={inputs.otp2Ref}
                  placeholder="00"
                  maxLength="2"
                  required
                  data-bs-original-title=""
                  title=""
                  onChange={handleInputChange}
                  value={formData.otp2}
                  name="otp2"
                />
                {validated && !formData.otp2 && (
                  <div className="invalid-feedback">
                    Please enter valid otp.
                  </div>
                )}
              </div>
              <div className="col">
                <input
                  className="form-control text-center opt-text"
                  type="text"
                  id="txtOtp3"
                  placeholder="00"
                  ref={inputs.otp3Ref}
                  maxLength="2"
                  required
                  data-bs-original-title=""
                  title=""
                  onChange={handleInputChange}
                  value={formData.otp3}
                  name="otp3"
                />
                {validated && !formData.otp3 && (
                  <div className="invalid-feedback">
                    Please enter valid otp.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="form-group m-t-15">
            <div className="checkbox checkbox-primary">
              <input
                id="checkbox-primary-1"
                type="checkbox"
                style={{ borderColor: "#80cf00" }}
                className="form-control"
                data-bs-original-title=""
                title=""
                onChange={handleInputChange}
                value={formData.checkBox}
                name="checkBox"
                required
              />
              {validated && !formData.checkBox && (
                <div className="invalid-feedback"> Please Accept T&C.</div>
              )}
              <label htmlFor="checkbox-primary-1">
                I Agree to the{" "}
                <a
                  href="#"
                  // onclick="showInformation()"
                  data-bs-original-title=""
                  title=""
                >
                  Terms and conditions
                </a>
              </label>
            </div>
          </div>
          <div className="form-group mb-0">
            <button
              className="btn btn-primary btn-block w-100"
              type="submit"
              id="btnSaveVendor"
              data-bs-original-title=""
              title=""
              onClick={SaveVendor}
            >
              Submit and proceed to payment
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default OtpPage;
