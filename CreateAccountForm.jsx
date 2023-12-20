import React, { useEffect } from "react";
import AccountStoreInformation from "./AccountStoreInformation";
import CreateAccount from "./CreateAccount";
import { useState } from "react";
import OtpPage from "./OtpPage";
import AccountSubscriptionPlan from "./AccountSubscriptionPlan";
import instance from "../../assets/axios/axios";

var vendorAuthUrl = "/VendorAuth";
const version = "v1";

const adminCouponsUrl = `${version}/AdminCoupons`;

const subscriptionsUrl = `${version}/Subscriptions`;

const informatonUrl = `${version}/Information`;

const CreateAccountForm = () => {
  const [step, setStep] = useState(1);

  const [formDataStep1, setFormDataStep1] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    name: "",
    phoneTwo: "",
    emailTwo: "",
    address: "",
    subscriptionPlan: "",
    otp1: "",
    otp2: "",
    otp3: "",
    checkBox: false,
  });
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpVerification, setOtpverification] = useState();
  const [getApplyCouponData, setGetApplyCouponData] = useState({});
  const [getSubscriptiondata, setGetSubscriptionData] = useState({});

  const [subscriptions, setSubscriptions] = useState([]);
  const [bindCoupon, setBindCoupon] = useState([]);

  const [objCoupon, setObjCoupon] = useState("");
  const [show, setShow] = useState(false);

  const [paymentDetails, setPaymentDetails] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      console.log("validity false");
      setValidated(true);
    } else {
      // console.log("validity true", formDataStep1, "from form one");
      handleNext();
      setValidated(false);
      // generateOtp();
      SaveVendor();
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChangeStep1 = (e) => {
    const { name, value, checked, type } = e.target;
    setFormDataStep1((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const generateOtp = (event) => {
    // debugger

    const data = {
      firstName: formDataStep1.firstName,
      lastName: formDataStep1.lastName,
      email: formDataStep1.email,
      mobileNumber: formDataStep1.phone,
    };

    instance
      .post(`${vendorAuthUrl}/ValidateEmail`, data)
      .then((response) => {
        console.log(response.data.data.otp, "from otp");
        setOtpverification(response.data.data.otp);
      })
      .catch((error) => {
        const message = error.response.data.message;
        alert(message);
        // setFormDataStep1({
        //   firstName: "",
        //   lastName: "",
        //   email: "",
        //   phone: "",
        //   password: "",
        //   name: "",
        //   phoneTwo: "",
        //   emailTwo: "",
        //   address: "",
        //   subscriptionPlan: "",
        //   otp1: "",
        //   otp2: "",
        //   otp3: "",
        //   checkBox: false,
        // });
      });
  };

  // console.log(getSubscriptiondata.mrp,'from mrp')

  const getSubscriptions = (event) => {
    instance
      .get(subscriptionsUrl + "/GetSubscriptions")
      .then((response) => {
        setSubscriptions(response.data.data);

        GetTermsAndCondition();
      })
      .catch((error) => {
        console.log(error, "from error");
      });
  };
  function GetTermsAndCondition() {
    instance
      .get(informatonUrl + "/GetSignupInformation")
      .then((response) => {
        console.log(response.data.data, "from get term condition");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function GetSubscription(e) {
    instance
      .get(subscriptionsUrl + "/GetSubscription/" + e.target.value)
      .then((response) => {
        console.log(response.data.data, "from get subscription");
        setGetSubscriptionData(response.data.data);
        // setSubscriptions(e.target.value);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getSubscriptions();
  }, []);

  function GetAdminCoupon(event) {
    event.preventDefault();
    instance
      .get(
        adminCouponsUrl +
          "/GetSubscriptionCoupon/" +
          getSubscriptiondata.id +
          "/0"
      )
      .then((response) => {
        console.log(response.data.data, "from coupon");
        setBindCoupon(response.data.data);
        handleShow();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const applyCoupon = (id) => {
    if (!objCoupon) {
      instance
        .get(`${adminCouponsUrl}/GetAdminCoupon/${id}`)
        .then((response) => {
          if (response.data) {
            setGetApplyCouponData(response.data.data);
            // console.log(response.data, "from apply coupon");
            // generateOtp();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      if (id === objCoupon.id) {
        const str = "Coupon already applied.";
        // Handle notify message or any alert logic here
        alert("Coupon already applied ");
        console.log(str);
      } else {
        instance
          .get(`${adminCouponsUrl}/GetAdminCoupon/${id}`)
          .then((response) => {
            if (response.data) {
              setGetApplyCouponData(response.data.data);
              console.log(
                response.data,
                "from apply coupon 2nd api call coupon already in use"
              );
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  const removeItem = () => {
    setGetApplyCouponData("");
  };

  const calculateTotalPayable = () => {
    if (getSubscriptiondata.mrp) {
      const originalPrice = getSubscriptiondata.mrp;
      // console.log(originalPrice, "from orignal price");
      const discount =
        getApplyCouponData.discount || getApplyCouponData.discount;
      // console.log(discount, "from discpunt");
      const discountAmount = (originalPrice * discount) / 100;
      // console.log(discountAmount, "from discount amount");
      const totalPayable = originalPrice - discountAmount;
      // console.log(totalPayable, "from total paybel");
      return totalPayable.toFixed(2);
    } else {
    }
  };
  const handlePayment = (event) => {
    // event.preventDefault();
    const options = {
      key: paymentDetails.Key,
      amount: Number(paymentDetails.totalAmount) * 100,
      currency: "INR",
      name: "Infuse Nutrient",
      description: "Always at your service!",
      image: "../assets/images/logo/logo.png",
      order_id: paymentDetails.RazorPayOrderId,
      prefill: {
        name: formDataStep1.name,
        email: formDataStep1.emailTwo,
        contact: formDataStep1.phoneTwo,
      },
      handler: function (response) {
        const razorPayPaymentId = response.razorpay_payment_id;
        Capture(razorPayPaymentId);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      const message = "Payment failed";
      // Notify or handle the failed payment as needed
      console.log(message);
    });

    rzp.open();
  };

  function Capture(razorPayPaymentId) {
    var key = paymentDetails.Key;
    var secret = paymentDetails.Secret;
    instance
      .post(
        vendorAuthUrl +
          "/CaptureRazorpayPayment/" +
          key +
          "/" +
          secret +
          "/" +
          razorPayPaymentId +
          "/" +
          paymentDetails.subscriptionOrdersId
      )
      .then((response) => {
        console.log(response.data.data);
        AddVendor();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function AddVendor(event) {
    // event.preventDefault();
    instance
      .post(vendorAuthUrl + "/AddVendor")
      .then((response) => {
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function SaveVendor(event) {
    // event.preventDefault();
    var data = {
      SubscriptionsId: getSubscriptiondata.id,
      AdminCouponsId: getApplyCouponData.id,
      subscriptionAmount: getSubscriptiondata.mrp,
      email: formDataStep1.email,
    };

    var otpCode = formDataStep1.otp1 + formDataStep1.otp2 + formDataStep1.otp3;
    if (otpCode == otpVerification) {
      instance
        .post(vendorAuthUrl + "/AddSubscriptionOrder", data)
        .then((response) => {
          console.log(response.data.data, "from save vendor");
          setPaymentDetails(response.data.data);

          if (objCoupon) {
            paymentDetails.RazorPayOrderId = response.data.razorPayOrderId;
            paymentDetails.Key = response.data.key;
            paymentDetails.Secret = response.data.secret;
            paymentDetails.subscriptionOrdersId = response.data.id;
            if (response.data.grandTotal > 0) {
              handlePayment();
            } else {
              AddVendor();
            }
          } else {
            if (Number(objCoupon.discount) < 100) {
              paymentDetails.RazorPayOrderId = response.data.razorPayOrderId;
              paymentDetails.Key = response.data.key;
              paymentDetails.Secret = response.data.secret;
              paymentDetails.subscriptionOrdersId = response.data.id;
              handlePayment();
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-xl-5 b-center bg-size"
            //  style="background-image: url(&quot;../assets/images/login/register-v2.svg&quot;); background-size: cover; background-position: center center; display: block;"
          >
            {/* <img className="img-fluid for-light" src="/static/media/login.b12bc843.png" alt="looginpage"></img> */}
            <img
              className="bg-img-cover bg-center"
              src="build/assets/register-v2.svg"
              alt="looginpage"
              style={{ display: "none" }}
            />
          </div>
          <div className="col-xl-7 p-0">
            <div className="login-card">
              <div>
                <div>
                  <a
                    className="logo text-center"
                    href="index.html"
                    data-bs-original-title=""
                    title=""
                  >
                    <img
                      src="newFile/assets/images/logo/logo.png"
                      alt="logo"
                      width="100"
                    />
                  </a>
                </div>
                <div className="login-main">
                  <div>
                    {step === 1 && (
                      <CreateAccount
                        handleNext={handleNext}
                        formData={formDataStep1}
                        handleInputChange={handleInputChangeStep1}
                        validated={validated}
                        handleSubmit={handleSubmit}
                        showPassword={showPassword}
                        toggleShowPassword={toggleShowPassword}
                      />
                    )}
                  </div>
                  {step === 2 && (
                    <div>
                      {" "}
                      <AccountStoreInformation
                        handleNext={handleNext}
                        handlePrevious={handlePrevious}
                        formData={formDataStep1}
                        handleInputChange={handleInputChangeStep1}
                        validated={validated}
                        handleSubmit={handleSubmit}
                      />
                    </div>
                  )}
                  {step === 3 && (
                    <div>
                      <AccountSubscriptionPlan
                        handleNext={handleNext}
                        handlePrevious={handlePrevious}
                        formData={formDataStep1}
                        handleInputChange={handleInputChangeStep1}
                        validated={validated}
                        handleSubmit={handleSubmit}
                        setFormData={setFormDataStep1}
                        setGetSubscriptionData={setGetSubscriptionData}
                        getSubscriptiondata={getSubscriptiondata}
                        getApplyCouponData={getApplyCouponData}
                        setGetApplyCouponData={setGetApplyCouponData}
                        subscriptions={subscriptions}
                        setSubscriptions={setSubscriptions}
                        bindCoupon={bindCoupon}
                        setBindCoupon={setBindCoupon}
                        objCoupon={objCoupon}
                        setObjCoupon={setObjCoupon}
                        GetTermsAndCondition={GetTermsAndCondition}
                        getSubscriptions={getSubscriptions}
                        GetSubscription={GetSubscription}
                        GetAdminCoupon={GetAdminCoupon}
                        handleClose={handleClose}
                        handleShow={handleShow}
                        applyCoupon={applyCoupon}
                        setShow={setShow}
                        show={show}
                        calculateTotalPayable={calculateTotalPayable}
                        removeItem={removeItem}
                        generateOtp={generateOtp}
                      />
                    </div>
                  )}
                  {step === 4 && (
                    <div>
                      <OtpPage
                        handleSubmit={handleSubmit}
                        formData={formDataStep1}
                        handleInputChange={handleInputChangeStep1}
                        validated={validated}
                        otpVerification={otpVerification}
                        // objCoupon={objCoupon}
                        // setSubscriptions={setSubscriptions}
                        getSubscriptiondata={getSubscriptiondata}
                        getApplyCouponData={getApplyCouponData}
                        SaveVendor={SaveVendor}
                        setShow={setShow}
                        show={show}
                        handleClose={handleClose}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAccountForm;
