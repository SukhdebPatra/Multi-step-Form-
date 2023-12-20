import React, { useState } from "react";
import history from "../../assets/history/history";

const AccountStoreInformation = ({
  handleNext,
  handlePrevious,
  formData,
  handleInputChange,
  validated,
  handleSubmit,
}) => {
  // const [formData, setFormData] = useState({
  //   name: "",
  //   phone: "",
  //   email: "",
  //   address: "",
  // });
  // const [validated, setValidated] = useState(false);

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     console.log("validity false");
  //     setValidated(true);
  //     // history.push("account-sub-plan");
  //   } else {
  //     console.log("validity true");
  //     // history.push("/account-sub-plan");
  //     handleNext();
  //     console.log(formData, "form two");
  //     //   setFormData({
  //     //     name: "",
  //     //     phone: "",
  //     //     email: "",
  //     //     address: "",
  //     //   });
  //     // Clear form fields
  //     setValidated(false);
  //   }
  // };

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  return (
    <>
      <form
        className={`theme-form info-validation ${validated ? 'was-validated' : ''}`}
        id="dvStoreInfo"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="wizard-title mb-3">
          <h4>Key in your Store information</h4>
        </div>
        <div className="form-group mb-3 m-t-15">
          <label className="col-form-label pt-0">Store code and name</label>
          <div className="row g-2">
            <div className="col-12">
              <input
                className="form-control"
                id="txtStoreName"
                type="text"
                placeholder="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                name="name"
              />
              {validated && !formData.name && (
                <div className="invalid-feedback">
                  Please enter valid store name.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="form-group mb-3">
          <div className="row g-2">
            <div className="col-6">
              <label className="col-form-label pt-0">Mobile number</label>
              <input
                className="form-control"
                id="txtStoreMobileNumber"
                type="text"
                placeholder="99XXXXXXXX"
                data-bs-original-title=""
                title=""
                value={formData.phoneTwo}
                onChange={handleInputChange}
                required
                name="phoneTwo"
              />
              {validated && !formData.name && (
                <div className="invalid-feedback">
                  Please enter valid mobile number.
                </div>
              )}
            </div>
            <div className="col-6">
              <label className="col-form-label pt-0">Email</label>
              <input
                className="form-control"
                id="txtStoreEmail"
                type="text"
                placeholder="Email"
                value={formData.emailTwo}
                onChange={handleInputChange}
                required
                name="emailTwo"
              />
              {validated && !formData.name && (
                <div className="invalid-feedback">
                  Please enter valid email address.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="exampleInputPassword1">Address</label>
          <textarea
            className="form-control"
            id="txtAddress"
            placeholder="Enter address"
            value={formData.address}
            onChange={handleInputChange}
            required
            name="address"
            style={{ backgroundColor: "#f3f3ff" }}
          ></textarea>
          {validated && !formData.name && (
            <div className="invalid-feedback">
              Please enter valid store address.
            </div>
          )}
        </div>
        <label>&nbsp;</label>
        <button
          className="btn btn-warning"
          id="btnPreviousStore"
          type="button"
          data-bs-original-title=""
          onClick={handlePrevious}
          title=""
        >
          Previous
        </button>
        <button
          className="btn btn-primary pull-right"
          id="btnNextStore"
          type="submit"
          data-bs-original-title=""
          title=""
        >
          Next
        </button>
      </form>
    </>
  );
};

export default AccountStoreInformation;
