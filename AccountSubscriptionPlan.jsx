import React, { useEffect } from "react";
import history from "../../assets/history/history";
import { useState } from "react";
import instance from "../../assets/axios/axios";
import CreateAccount from "./CreateAccount";
import AccountStoreInformation from "./AccountStoreInformation";
import OtpPage from "./OtpPage";
import { Button, Modal } from "react-bootstrap";
const version = "v1";

const adminCouponsUrl = `${version}/AdminCoupons`;

const subscriptionsUrl = `${version}/Subscriptions`;

const informatonUrl = `${version}/Information`;

const AccountSubscriptionPlan = ({
  handleNext,
  handlePrevious,
  formData,
  handleInputChange,
  validated,
  handleSubmit,
  setFormData,
  getSubscriptiondata,
  setGetSubscriptionData,
  getApplyCouponData,
  setGetApplyCouponData,
  subscriptions,
  setSubscriptions,
  bindCoupon,
  setBindCoupon,
  objCoupon,
  setObjCoupon,
  getSubscriptions,
  GetTermsAndCondition,
  GetSubscription,
  GetAdminCoupon,
  handleShow,
  show,
  setShow,
  handleClose,
  applyCoupon,
  removeItem,
  calculateTotalPayable,
  generateOtp
}) => {
  // const [subscriptions, setSubscriptions] = useState([]);
  // const [bindCoupon, setBindCoupon] = useState([]);

  // const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // const [objCoupon, setObjCoupon] = useState("");

  // const getSubscriptions = (event) => {
  //   instance
  //     .get(subscriptionsUrl + "/GetSubscriptions")
  //     .then((response) => {
  //       setSubscriptions(response.data.data);

  //       GetTermsAndCondition();
  //     })
  //     .catch((error) => {
  //       console.log(error, "from error");
  //     });
  // };

  // function GetTermsAndCondition() {
  //   instance
  //     .get(informatonUrl + "/GetSignupInformation")
  //     .then((response) => {
  //       console.log(response.data.data, "from get term condition");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }



  // function GetSubscription(e) {
  //   instance
  //     .get(subscriptionsUrl + "/GetSubscription/" + e.target.value)
  //     .then((response) => {
  //       console.log(response.data.data, "from get subscription");
  //       setGetSubscriptionData(response.data.data);
  //       // setSubscriptions(e.target.value);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  // function GetAdminCoupon(event) {
  //   event.preventDefault();
  //   instance
  //     .get(
  //       adminCouponsUrl +
  //         "/GetSubscriptionCoupon/" +
  //         getSubscriptiondata.id +
  //         "/0"
  //     )
  //     .then((response) => {
  //       console.log(response.data.data, "from coupon");
  //       setBindCoupon(response.data.data);
  //       handleShow();
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // const applyCoupon = (id) => {
  //   if (!objCoupon) {
  //     instance
  //       .get(`${adminCouponsUrl}/GetAdminCoupon/${id}`)
  //       .then((response) => {
  //         if (response.data) {
  //           setGetApplyCouponData(response.data.data);
  //           // console.log(response.data, "from apply coupon");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   } else {
  //     if (id === objCoupon.id) {
  //       const str = "Coupon already applied.";
  //       // Handle notify message or any alert logic here
  //       alert("Coupon already applied ");
  //       console.log(str);
  //     } else {
  //       instance
  //         .get(`${adminCouponsUrl}/GetAdminCoupon/${id}`)
  //         .then((response) => {
  //           if (response.data) {
  //             setGetApplyCouponData(response.data.data);
  //             console.log(
  //               response.data,
  //               "from apply coupon 2nd api call coupon already in use"
  //             );
  //           }
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //         });
  //     }
  //   }
  // };
  // const calculateTotalPrice = () => {
  //   const discountAmount =
  //     (getApplyCouponData.mrp * getApplyCouponData.discount) / 100;
  //   const totalPrice = getApplyCouponData.mrp - discountAmount;
  //   return totalPrice;
  // };

  // const removeItem = () => {
  //   setGetApplyCouponData("");
  // };

  // const calculateTotalPayable = () => {
  //   if (getSubscriptiondata.mrp) {
  //     const originalPrice = getSubscriptiondata.mrp;
  //     // console.log(originalPrice, "from orignal price");
  //     const discount =
  //       getApplyCouponData.discount || getApplyCouponData.discount;
  //     // console.log(discount, "from discpunt");
  //     const discountAmount = (originalPrice * discount) / 100;
  //     // console.log(discountAmount, "from discount amount");
  //     const totalPayable = originalPrice - discountAmount;
  //     // console.log(totalPayable, "from total paybel");
  //     return totalPayable.toFixed(2);
  //   } else {
  //   }
  // };

  // console.log(getApplyCouponData.id, "from  coupon id");
  // console.log(getSubscriptiondata.id, "from subscription id");

  return (
    <>
      <form
        className={`theme-form info-validation ${
          validated ? "was-validated" : ""
        }`}
        id="dvSubscriptionInfo"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="wizard-title mb-3">
          <h4>Choose subscription plan</h4>
        </div>
        <div className="form-group mb-3">
          <label className="form-label" htmlFor="validationTooltip04">
            Subscrption plan
          </label>
          <select
            className="form-control"
            id="ddlSubscription"
            onChange={GetSubscription}
            // value={formData.subscriptionPlan}
            // name="subscriptionPlan"
            required
          >
            <option>Select</option>
            {subscriptions.map((ele) => (
              <option key={ele.id} value={ele.id}>
                {ele.name}
              </option>
            ))}
          </select>
          {validated && !formData.subscriptionPlan && (
            <div className="invalid-feedback">
              Please select valid subscription plan
            </div>
          )}
        </div>
        <div id="show-hide-Details">
          <label className="form-label" htmlFor="validationTooltip04">
            <b>
              Subscrption name :
              <span id="spn-name">{getSubscriptiondata.name}</span>
            </b>
          </label>
          <br />
          <label className="form-label" htmlFor="validationTooltip04">
            <b>
              Description :
              <span id="spn-description">
                {getSubscriptiondata.description}
              </span>
            </b>
          </label>
          <br />
          <label className="form-label" htmlFor="validationTooltip04">
            <b>
              Duration :
              <span id="spn-duration">{getSubscriptiondata.duration}</span>
            </b>
          </label>
          <br />
          <label className="form-label" htmlFor="validationTooltip04">
            <b>
              Price :
              <span id="spn-sellingPrice">{getSubscriptiondata.mrp}</span>
            </b>
          </label>
          <hr />
          {bindCoupon.map((ele, id) => {
            return (
              <div key={ele.id}>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Coupons</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="modal-content">
                      <div className="modal-body">
                        <div
                          id="basic-1_wrapper"
                          className="dataTables_wrapper no-footer"
                        >
                          <table
                            className="display dataTable no-footer"
                            id="basic-1"
                            role="grid"
                            aria-describedby="basic-1_info"
                          >
                            <tbody id="tblCoupons">
                              <tr>
                                <td>{ele.couponCode}</td>
                                <td>
                                  <span style={{ fontSize: "15px" }}>
                                    {ele.couponName}
                                  </span>
                                </td>
                                <td>{ele.discount} (%) off</td>
                                <td>
                                  <button
                                    id="coupon"
                                    className="btn btn-primary"
                                    type="button"
                                    // onclick="ApplyCoupon(1)"
                                    onClick={() => applyCoupon(ele.id)}
                                  >
                                    Apply
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label className="col-form-label">
                                <b>Discount Amount</b> :
                                {getApplyCouponData.discount ? (
                                  <span>
                                    <b id="lblCouponDiscount">
                                      {getApplyCouponData.discount} off on total
                                      payable
                                      <i
                                        style={{ cursor: "pointer" }}
                                        onClick={removeItem}
                                        className="bi bi-x-circle-fill text-danger"
                                      ></i>
                                    </b>
                                  </span>
                                ) : null}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          className="btn btn-danger"
                          type="button"
                          data-bs-dismiss="modal"
                          data-bs-original-title=""
                          title=""
                          onClick={handleClose}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
                <label className="form-label" htmlFor="validationTooltip04">
                  <b>
                    Coupon discount :
                    <span id="spn-coupon-discount">
                      {getApplyCouponData.discount}
                    </span>
                  </b>
                </label>
                <br />

                <label className="form-label" htmlFor="validationTooltip04">
                  <b>
                    Total payable :
                    <span id="spn-payable">
                      {/* {Number(getApplyCouponData.sellingPrice) -
                        Number(getApplyCouponData.discount)} */}
                      {/* {
                        (getApplyCouponData.mrp =
                          getApplyCouponData.mrp * getApplyCouponData.discount/100)
                      } */}
                      {/* {((getApplyCouponData.mrp * getApplyCouponData.discount) / 100).toFixed(2)} */}
                      {/* {calculateTotalPayable()} */}
                      {Object.keys(getApplyCouponData).length > 0 ? (
                        <span id="spn-payable">{calculateTotalPayable()}</span>
                      ) : (
                        <span></span>
                      )}
                    </span>
                  </b>
                </label>

                <br />
                <label
                  className="form-label"
                  htmlFor="validationTooltip04"
                  id="show-hide-coupon-name"
                  style={{ display: "none" }}
                >
                  <b>
                    Applied coupon : <span id="coupon-name"></span>
                  </b>
                </label>
                <br />
              </div>
            );
          })}
          <label className="form-label" htmlFor="validationTooltip04">
            <span style={{ color: " #dc3545" }}>
              <b onClick={GetAdminCoupon}> Apply Coupon?</b>
            </span>
          </label>
        </div>
        <label>&nbsp;</label>

        <button
          className="btn btn-warning"
          onClick={handlePrevious}
          id="btnPreviousSubscription"
          type="button"
          data-bs-original-title=""
          title=""
        >
          Previous
        </button>
        <button
          className="btn btn-primary pull-right"
          id="btnNextSubscription"
          type="submit"
          data-bs-original-title=""
          title=""
          // onClick={handleNext}
          onClick={generateOtp}
        >
          Next
        </button>
      </form>
      {/* <OtpPage
        SubscriptionsId={subscriptions}
        AdminCouponsId={getApplyCouponData.id}
      /> */}
    </>
  );
};

export default AccountSubscriptionPlan;
