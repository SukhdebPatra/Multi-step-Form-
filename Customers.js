import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { TabPane, TabContent } from "reactstrap";
import {
  accessPermissionUrl,
  appointmentsUrl,
  customerMealPlansUrl,
  customerOrdersUrl,
  customerPreferenceUrl,
  customerSlotWisePortionsUrl,
  customersUrl,
} from "../../assets/Api/api";
import axios from "../../assets/axios/axios";
import AccountLayout from "../../layout/account-layout/AccountLayout";
import BodyContainer from "../../layout/body-container/BodyContainer";
import BodyHeader from "../../layout/body-header/BodyHeader";
export default function Customers() {
  const user = JSON.parse(window.localStorage.getItem("user"));
  const store = JSON.parse(window.localStorage.getItem("store"));
  const pdata = {
    pageNo: 1,
    pageSize: 5,
    storeid: store.id,
    name: "",
    mobileNumber: "",
    status: "",
  };
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [accountModal, setAccountModal] = useState(false);
  const [postData, setPostData] = useState(pdata);
  const [customers, setCustomers] = useState();
  const [search, setSearch] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [appointments, setAppointments] = useState();
  const [mealPlans, setMealPlans] = useState([]);
  const [preference, setPreference] = useState();
  const [validated, setValidate] = useState(false);
  const [validateAccount, setValidateAccount] = useState(false);
  const [orders, setOrders] = useState();
  const [nutritionist, setNutritionist] = useState([]);
  const [customerPortion, setCustomerPortion] = useState([]);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState("1");
  const [validateOtp, setValidateOtp] = useState(false);
  const [togglePassword, setTooglePassword] = useState(false);
  const [otp, setOtp] = useState();
  const [customerInfoData, setCustomerInfoData] = useState({
    id: "",
    vendorsId: "",
    dob: "",
    status: "",
  });
  const [signupDetails, setSignupDetails] = useState({
    // storeName: store.name,
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
  });
  const [inputOtp, setInputOtp] = useState({
    otp1: "",
    otp2: "",
    otp3: "",
  });

  const toogle = () => setShow(!show);
  const toogleOtp = () => setShowOtp(!showOtp);
  const toogleAccount = () => setAccountModal(!accountModal);
  const HideShowPassword = () => setTooglePassword(!togglePassword);

  const getData = (data) => {
    setLoader(true);
    axios
      .post(`${customersUrl}/GetCustomersOnFilter`, data)
      .then((response) => {
        console.log(response);
        setCustomers(response.data.data);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        console.log(error.response);
      });
  };

  useEffect(() => {
    getData(postData);
    const data = {
      pageNo: 1,
      pageSize: 5,
      roleId: 4,
      storeId: store.id,
    };
    axios
      .post(`${accessPermissionUrl}/GetNutritionistsOnFilter`, data)
      .then((response) => {
        console.log(response);
        setNutritionist(response.data.data.users);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSearch = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const searchOnFilter = () => {
    getData(postData);
    setSelectedCustomer();
  };
  const clearFilter = () => {
    getData(pdata);
    setPostData(pdata);
  };
  const getCustomerDetials = (id) => {
    setLoader(true);
    setTab("1");
    axios
      .get(`${customersUrl}/GetCustomer/${id}`)
      .then((response) => {
        console.log(response);
        setSelectedCustomer(response.data.data);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };

  const getCustomerMealPlans = () => {
    axios
      .get(
        `${customerMealPlansUrl}/GetAllCustomerMealPlansByStoreId/${store.id}/${selectedCustomer.id}`
      )
      .then((response) => {
        console.log(response);
        setMealPlans(response.data.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const getCustomerAppointments = () => {
    const data = {
      pageNo: 1,
      pageSize: 5,
      storesId: store.id,
      customerId: selectedCustomer.id,
    };
    axios
      .post(`${appointmentsUrl}/GetAppointmentsOnFilter`, data)
      .then((response) => {
        console.log(response);
        setAppointments(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCustomerOrders = () => {
    let data = {
      pageNo: 1,
      pageSize: 5,
      customerId: selectedCustomer.id,
    };
    axios
      .post(`${customerOrdersUrl}/GetCustomerOrdersByIdOnFilter`, data)
      .then((response) => {
        console.log(response);
        setOrders(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCustomerPrefrence = () => {
    axios
      .get(
        `${customerPreferenceUrl}/GetCustomerPreferenceByStoreId/${store.id}/${selectedCustomer.id}`
      )
      .then((response) => {
        console.log(response);
        setPreference(response.data.data[0]);
        let arr = [];
        if (response.data.data[0].customerSlotWisePortions.length > 0) {
          response.data.data[0].customerSlotWisePortions.map((portion) => {
            arr.push({
              id: portion.id,
              portionName: portion.portionName,
              portion: portion.portion,
              editPortion: 0,
            });
          });
        }
        setCustomerPortion(arr);
      })
      .catch((error) => {
        console.log(error.response);
        setPreference();
      });
  };

  const handleEditPortion = (e, id) => {
    let arr = customerPortion;
    arr.find((portion) => {
      if (portion.id == id) {
        portion.editPortion = e.target.value;
      }
    });
    setCustomerPortion(arr);
  };

  const updatePortion = () => {
    let totalCal = 0;
    customerPortion.map((cal) => {
      totalCal = totalCal + Number(cal.editPortion);
    });
    if (totalCal === +preference.portion.calories) {
      console.log(customerPortion);
      setLoader(true);
      axios
        .put(
          `${customerSlotWisePortionsUrl}/UpdateCustomerSlotPortion`,
          customerPortion
        )
        .then((response) => {
          console.log(response);
          getCustomerPrefrence();
          setLoader(false);
        })
        .catch((error) => {
          setLoader(false);
          console.log(error);
        });
    } else {
      alert("selected portion does not match");
    }
  };

  const edit = () => {
    let data = customerInfoData;
    data.id = selectedCustomer.id;
    data.dob = selectedCustomer.dob;
    data.vendorsId = selectedCustomer.vendorsId;
    data.status = selectedCustomer.status;
    setCustomerInfoData(data);
    toogle();
  };

  const handleEdit = (e) => {
    setCustomerInfoData({
      ...customerInfoData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (e) => {
    setSignupDetails({
      ...signupDetails,
      [e.target.name]: e.target.value,
    });
  };

  const updateCustomerInfo = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      console.log("vali in if");
    } else {
      setLoader(true);
      axios
        .put(`CustomerAuth/UpdateCustomerInfo`, customerInfoData)
        .then((response) => {
          console.log(response);
          getCustomerDetials(response.data.data.id);
          closeEdit();
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
    setValidate(true);
  };

  const closeEdit = () => {
    toogle();
    setCustomerInfoData({
      id: "",
      vendorsId: "",
      dob: "",
      status: "",
    });
    setValidate(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      console.log("validity false");
    } else {
      console.log("validity true");
      if (
        signupDetails.mobileNumber.length > 8 ||
        signupDetails.mobileNumber.length < 8
      ) {
        toast.error("Mobile number should be of 8 digit.", {
          position: toast.POSITION.BOTTOM_RIGHT,
          hideProgressBar: true,
          autoClose: 3000,
        });
      } else if (
        !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/.test(
          password
        )
      ) {
        const msg =
          "Password must contain minimum eight characters, maximum 12 characters, at least one upppercase letter, at least one lowercase letter and one number and one special character.";
        toast.error(msg, {
          position: toast.POSITION.BOTTOM_RIGHT,
          hideProgressBar: true,
          autoClose: 3000,
        });
      } else {
        setLoader(true);
        let data = signupDetails;
        data.storeName = store.name;
        data.lastName = data.firstName;
        console.log("number is corect");
        console.log(data);
        axios
          .post(`CustomerAuth/ValidateEmail`, data)
          .then((response) => {
            console.log(response);
            toast.info("OTP sent to your email Id.", {
              position: toast.POSITION.TOP_RIGHT,
              hideProgressBar: true,
              autoClose: 3000,
            });
            setOtp(response.data.data.otp);
            toogleOtp();
          })
          .catch((error) => {
            console.log(error.response);
          });
      }
    }
    setValidateAccount(true);
  };

  const resendOtp = () => {
    axios
      .post(`CustomerAuth/ValidateEmail`, signupDetails)
      .then((response) => {
        console.log(response);
        toast.info("OTP sent to your email Id.", {
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: true,
          autoClose: 3000,
        });
        setOtp(response.data.data.otp);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleOtp = (e) => {
    setInputOtp({
      ...inputOtp,
      [e.target.name]: e.target.value,
    });
  };

  const addAcount = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      console.log("validity false");
    } else {
      console.log("validity true");
      const userOtp = inputOtp.otp1 + inputOtp.otp2 + inputOtp.otp3;
      if (Number(otp) == Number(userOtp)) {
        const data = {
          storesId: store.id,
          vendorsId: store.vendors.id,
          roleId: 2,
          name: signupDetails.firstName,
          email: signupDetails.email,
          password: password,
          mobileNumber: signupDetails.mobileNumber,
          status: true,
        };
        console.log(data);
        setLoader(true);
        axios
          .post(`CustomerAuth/AddCustomer`, data)
          .then((response) => {
            console.log(response);
            // history.push("login")
            toogleAccount();
            toogleOtp();
            getData(postData);
          })
          .catch((error) => {
            console.log(error.response);
            toast.error(error.response.data.message, {
              position: toast.POSITION.BOTTOM_RIGHT,
              hideProgressBar: true,
              autoClose: 3000,
            });
          });
        getData(postData);
      } else {
        toast.error("Incorrect otp! please enter correct otp.", {
          position: toast.POSITION.BOTTOM_RIGHT,
          hideProgressBar: true,
          autoClose: 3000,
        });
      }
    }

    setValidateOtp(true);
  };
  const next = () => {
    if (customers.pageNo < customers.totalPages) {
      const page = postData;
      postData.pageNo = customers.pageNo + 1;
      setPostData(page);
      getData(page);
      // console.log(page);
    }
  };

  const previous = () => {
    if (customers.pageNo > 1) {
      const page = postData;
      postData.pageNo = customers.pageNo - 1;
      setPostData(page);
      getData(page);
      // console.log(page);
    }
  };
  return (
    <AccountLayout title="Customers List" loader={loader}>
      <BodyContainer>
        <div class="card mb-0">
          <div class="card-header">
            <BodyHeader
              toogle={toogleAccount}
              search={search}
              setSearch={setSearch}
              addBtn={true}
            />
            <div
              class="card"
              id="dvSearch"
              style={{ display: `${search ? "block" : "none"}` }}
            >
              <div class="card-body">
                <form id="frm-customers-search">
                  <div class="mb-3 col-md-12 my-0">
                    <div class="row">
                      <div class="col-sm-4">
                        <label for="con-phone">Customer Name</label>
                        <input
                          class="form-control"
                          id="txtSearchCustomerName"
                          type="text"
                          name="name"
                          onChange={handleSearch}
                          value={postData.name}
                        />
                      </div>
                      <div class="col-sm-2">
                        <label for="con-phone">Mobile Number</label>
                        <input
                          class="form-control"
                          id="txtSearchMobileNumber"
                          type="number"
                          name="mobileNumber"
                          onChange={handleSearch}
                          value={postData.mobileNumber}
                        />
                      </div>
                      <div class="col-sm-2">
                        <label for="con-mail">Status</label>
                        <select
                          class="form-control"
                          id="ddlSearchStatus"
                          name="status"
                          onChange={handleSearch}
                          value={postData.status}
                        >
                          <option value="" selected>
                            Select
                          </option>
                          <option value="1">Active</option>
                          <option value="2">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3 col-md-12 my-0">
                    <div class="row">
                      <div class="col-sm-9">
                        <label for="">&nbsp;</label>
                        <br />
                        <button
                          type="button"
                          id="btnCloseFilter"
                          class="btn btn-outline-primary"
                          onClick={() => {
                            setSearch(false);
                            setPostData(pdata);
                          }}
                        >
                          Close
                        </button>
                      </div>
                      <div class="col-sm-3">
                        <label for="">&nbsp;</label>
                        <br />
                        <button
                          type="button"
                          id="btnFilter"
                          class="btn btn-outline-primary me-1"
                          onClick={searchOnFilter}
                        >
                          Search
                        </button>
                        <button
                          type="button"
                          id="btnClearFilter"
                          class="btn btn-outline-primary"
                          onClick={clearFilter}
                        >
                          Clear filter
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="card-body p-0">
          <div
            id="div-not-found"
            class="row"
            style={{
              display: `${
                customers
                  ? customers.customers.length < 1
                    ? ""
                    : "none"
                  : "none"
              }`,
            }}
          >
            <div class="col-sm-12">
              <div class="card">
                <div class="card-body">
                  <h5 class="text-center">Data not found</h5>
                </div>
              </div>
            </div>
          </div>
          <div
            class="row list-persons"
            id="div-customers"
            style={{ display: "" }}
          >
            <div class="col-xl-4 xl-30 col-md-5">
              <div
                class="nav flex-column nav-pills"
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical"
              >
                <div id="div-all-customers">
                  {customers &&
                    customers.customers.map((customer, i) => {
                      return (
                        <Link
                          to="#"
                          id={`customers-${i}`}
                          title="Syed"
                          class="nav-link"
                          onClick={() => getCustomerDetials(customer.id)}
                        >
                          <div class="media">
                            <div class="media-body">
                              <h6>
                                {" "}
                                <span class="first_name_0">
                                  {customer.name}
                                </span>
                              </h6>
                              <p class="email">{customer.email}</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  {/* <a href="#" id="customers-1" title="Syed" class="nav-link" onclick="GetCustomer(1)">
                                        <div class="media">
                                            <div class="media-body">
                                                <h6> <span class="first_name_0">Syed</span></h6>
                                                <p class="email">adil@pentamount.com</p>
                                            </div>
                                        </div>
                                    </a> */}
                </div>

                <div class="dataTables_info">
                  <ul class="pagination justify-content-center pagination-primary">
                    <li class="page-item">
                      <Link
                        to="#"
                        id="btnPrevious"
                        class="page-link"
                        onClick={previous}
                      >
                        Previous
                      </Link>
                    </li>
                    <li class="page-item">
                      <Link
                        to="#"
                        id="btnNext"
                        class="page-link"
                        onClick={next}
                      >
                        Next
                      </Link>
                    </li>
                  </ul>
                  <div class="mt-3">
                    Showing{" "}
                    <span id="spn-pageNo">{customers && customers.pageNo}</span>{" "}
                    of{" "}
                    <span id="spn-totalPages">
                      {customers && customers.totalPages}
                    </span>{" "}
                    pages
                  </div>
                </div>
              </div>
            </div>
            <div
              class="col-xl-8 xl-70 col-md-7"
              style={{ display: `${selectedCustomer ? "" : "none"}` }}
            >
              <div class="profile-mail">
                <div class="media">
                  <img
                    class="img-100 img-fluid m-r-20 rounded-circle update_img_0"
                    id="custImg"
                    src="../assets/images/user/2.png"
                    alt=""
                  />
                  <input
                    class="updateimg"
                    type="file"
                    name="img"
                    onchange="readURL(this,0)"
                  />
                  <div class="media-body mt-0">
                    <h5>
                      <span id="spn-header-customer-name">
                        {selectedCustomer && selectedCustomer.name}
                      </span>
                    </h5>
                    <p id="spn-customer-emailID">
                      {selectedCustomer && selectedCustomer.email}
                    </p>
                    <ul>
                      <li onClick={() => setTab("1")}>
                        <Link id="txtDetails" to="#">
                          Details
                        </Link>
                      </li>
                      <li class="checkPermission">
                        <Link id="txtEditCustomer" to="#" onClick={edit}>
                          Edit
                        </Link>
                      </li>
                      <li onClick={() => setTab("5")}>
                        <Link
                          id="txtMealPlan"
                          to="#"
                          onClick={getCustomerMealPlans}
                        >
                          Meal plan
                        </Link>
                      </li>
                      <li onClick={() => setTab("4")}>
                        <Link
                          id="txtAppointment"
                          to="#"
                          onClick={getCustomerAppointments}
                        >
                          Appointment
                        </Link>
                      </li>
                      <li onClick={() => setTab("3")}>
                        <Link
                          id="txtHistory"
                          to="#"
                          onClick={getCustomerOrders}
                        >
                          Order history
                        </Link>
                      </li>
                      <li onClick={() => setTab("2")}>
                        <Link
                          id="txtPreference"
                          to="#"
                          onClick={getCustomerPrefrence}
                        >
                          Preference
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  class="email-general"
                  style={{ display: `${selectedCustomer ? "" : "none"}` }}
                >
                  <TabContent activeTab={tab}>
                    <TabPane className="fade show" tabId="1">
                      <div id="dvDetails">
                        <h6 class="mb-3">General details</h6>
                        <ul>
                          <li>
                            Name{" "}
                            <span id="spn-customer-name" class="font-primary">
                              {selectedCustomer && selectedCustomer.name}
                            </span>
                          </li>
                          <li>
                            Birthday
                            <span
                              id="spn-customer-birthdate"
                              class="font-primary"
                            >
                              {selectedCustomer && selectedCustomer.dob
                                ? selectedCustomer.dob.split("T")[0]
                                : "-"}
                            </span>
                          </li>
                          <li>
                            Phone Number
                            <span id="spn-customer-number" class="font-primary">
                              {selectedCustomer &&
                                selectedCustomer.mobileNumber}
                            </span>
                          </li>
                          <li>
                            Email{" "}
                            <span id="spn-customer-email" class="font-primary">
                              {selectedCustomer && selectedCustomer.email}
                            </span>
                          </li>
                          <li>
                            Status{" "}
                            <span id="spn-customer-status" class="font-primary">
                              {selectedCustomer && selectedCustomer.status == 1
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </TabPane>
                    <TabPane tabId="2">
                      <div id="dvPreference">
                        <div class="mb-3 col-md-12 my-0">
                          <div class="row">
                            <div class="col-sm-11">
                              <button
                                class="btn btn-primary pull-right"
                                type="button"
                                onClick={updatePortion}
                              >
                                Update calories
                              </button>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-sm-12">
                              <div class="table-responsive">
                                <table class="table" id="tblCustomerPortions">
                                  <thead>
                                    <tr>
                                      <th
                                        scope="col"
                                        style={{ fontSize: "x-large" }}
                                      >
                                        Meal
                                      </th>
                                      <th
                                        scope="col"
                                        style={{ fontSize: "x-large" }}
                                      >
                                        Portion Calories
                                      </th>
                                      <th
                                        scope="col"
                                        style={{ fontSize: "x-large" }}
                                      >
                                        Edit
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody id="tblCustomerPortionsList">
                                    {preference &&
                                      preference.customerSlotWisePortions.map(
                                        (portion, i) => {
                                          return (
                                            <tr>
                                              <td>{portion.portionName}</td>
                                              <td>{portion.portion}</td>
                                              <td>
                                                <input
                                                  min="0"
                                                  id="txtPortion0"
                                                  type="number"
                                                  class="form-control"
                                                  placeholder="0"
                                                  onChange={(e) =>
                                                    handleEditPortion(
                                                      e,
                                                      portion.id
                                                    )
                                                  }
                                                />
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            {/* <hr /> */}
                            <div class="col-sm-12" id="showCalories">
                              <h6>
                                Total calories ={" "}
                                <span id="totalCalories">
                                  {preference && preference.portion?.calories}
                                </span>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div class="mb-3 col-md-12 my-0">
                          <div class="row">
                            <div class="table-responsive">
                              <table class="table" id="tblCustomerDislikes">
                                <thead>
                                  <tr>
                                    <th
                                      scope="col"
                                      style={{ fontSize: "x-large" }}
                                    >
                                      Dislikes
                                    </th>
                                  </tr>
                                </thead>
                                <tbody id="tblCustomerDislikesList">
                                  {preference &&
                                    preference.customerDislikes.map(
                                      (dislike) => {
                                        return (
                                          <tr>
                                            <td>{dislike.ingredientsName}</td>
                                          </tr>
                                        );
                                      }
                                    )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div class="mb-3 col-md-12 my-0">
                          <div class="row">
                            <div class="table-responsive">
                              <table class="table" id="tblCustomerAllergies">
                                <thead>
                                  <tr>
                                    <th
                                      scope="col"
                                      style={{ fontSize: "x-large" }}
                                    >
                                      Allergies
                                    </th>
                                  </tr>
                                </thead>
                                <tbody id="tblCustomerAllergiesList">
                                  {preference &&
                                    preference.customerAllegies.map(
                                      (allergie) => {
                                        return (
                                          <tr>
                                            <td>{allergie.ingredientsName}</td>
                                          </tr>
                                        );
                                      }
                                    )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPane>
                    <TabPane tabId="3">
                      <div id="dvHistory">
                        {/* <!-- End InvoiceTop--> */}
                        <div class="table-responsive">
                          <table class="table" id="tblCustomerOrders">
                            <thead>
                              <tr>
                                <th scope="col">#</th>

                                <th scope="col">Order number</th>
                                <th scope="col">Total</th>
                                <th scope="col">Coupon</th>
                                <th scope="col">Discount</th>
                                <th scope="col">Net Total</th>
                                {/* <!--<th scope="col">
                                                            Print
                                                        </th>--> */}
                              </tr>
                            </thead>
                            <tbody id="tblCustomerOrderList">
                              {orders &&
                                orders.customerOrders.map((order, i) => {
                                  return (
                                    <tr>
                                      <td>{i + 1}</td>
                                      <td>{order.transactionNumber}</td>
                                      <td>{order.totalAmount}</td>
                                      <td>
                                        {order.vendorCoupons
                                          ? order.vendorCoupons.couponName
                                          : "-"}
                                      </td>
                                      <td>
                                        {order.vendorCoupons
                                          ? order.vendorCoupons.discount + "%"
                                          : "-"}
                                      </td>
                                      <td>{order.grandTotal}</td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                        {/* <!-- End Table-->
                                        <!-- End InvoiceBot--> */}
                      </div>
                    </TabPane>
                    <TabPane tabId="4">
                      <div id="dvAppointment">
                        <div class="table-responsive">
                          <table class="table" id="tblCustomerAppointments">
                            <thead>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Number</th>
                                <th scope="col">Date</th>
                                <th scope="col">Booking slot</th>
                                <th scope="col">Nutritionist name</th>
                                <th scope="col">Status</th>
                              </tr>
                            </thead>
                            <tbody id="tblCustomerAppointmentList">
                              {appointments &&
                                appointments.appointments.map(
                                  (appointment, i) => {
                                    return (
                                      <tr>
                                        <td>{i + 1}</td>
                                        <td>{appointment.appointmentNumber}</td>
                                        <td>
                                          {
                                            appointment.appointmentDate.split(
                                              "T"
                                            )[0]
                                          }
                                        </td>
                                        <td>{appointment.slot}</td>
                                        <td>
                                          {appointment.vendors.firstName +
                                            " " +
                                            appointment.vendors.lastName}
                                        </td>
                                        <td>
                                          {appointment.status == 1
                                            ? "Booked"
                                            : appointment.status == 2
                                            ? "Rescheduled"
                                            : appointment.status == 4
                                            ? "Confirmed"
                                            : "Cancelled"}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </TabPane>
                    <TabPane tabId="5">
                      <div id="dvMealPlan">
                        <div class="default-according" id="dvMealPlanDetails">
                          {mealPlans.map((plan) => {
                            return (
                              <div class="card">
                                <div
                                  class="card-header p-0"
                                  id="headingOne"
                                  style={{ padding: "0px" }}
                                >
                                  <h5 class="mb-0">
                                    <button
                                      class="btn btn-link"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#collapseOne"
                                      aria-expanded="true"
                                      aria-controls="collapseOne"
                                    >
                                      {plan.mealPlan.programs.name}
                                    </button>
                                  </h5>
                                </div>
                                <div
                                  class="collapse show"
                                  id="collapseOne"
                                  aria-labelledby="headingOne"
                                  data-bs-parent="#accordion"
                                >
                                  <div class="card-body">
                                    <ul>
                                      <li>
                                        Start date{" "}
                                        <span id="spn-meal-plan-start-date">
                                          {plan.planStartDate.split("T")[0]}
                                        </span>
                                      </li>
                                      <li>
                                        End date{" "}
                                        <span id="spn-meal-plan-end-date">
                                          {plan.planEndDate.split("T")[0]}
                                        </span>
                                      </li>
                                      <li>
                                        Total boxes
                                        <span id="spn-meal-plan-total-boxes">
                                          {" "}
                                          {Number(plan.days) *
                                            Number(
                                              plan.mealPlan.mealPlanSlots.length
                                            )}
                                        </span>
                                      </li>
                                      <li>
                                        Delivered boxes
                                        <span id="spn-meal-plan-delivered-boxes">
                                          {plan.deliveredBoxes}
                                        </span>
                                      </li>
                                      <li>
                                        Remaining boxes
                                        <span id="spn-meal-plan-remaining-boxes">
                                          {Number(plan.days) *
                                            Number(
                                              plan.mealPlan.mealPlanSlots.length
                                            ) -
                                            Number(plan.deliveredBoxes)}
                                        </span>
                                      </li>
                                      <li>
                                        Complimentary boxes
                                        <span id="spn-meal-plan-complimentery-boxes">
                                          {plan.complimentaryBoxes}
                                        </span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </TabPane>
                  </TabContent>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          show={show}
          size="lg"
          onHide={toogleAccount}
          backdrop="static"
          keyboard={false}
        >
          <div class="modal-body">
            <Form
              noValidate
              validated={validated}
              onSubmit={updateCustomerInfo}
              className="form-bookmark customerAddress-validation"
            >
              <div class="row g-2">
                <div class="mb-3 col-md-12 my-0">
                  <div class="row">
                    <div class="col-sm-4">
                      <label for="con-ma">DOB</label>
                      <input
                        class="form-control"
                        id="txt-customer-DOB"
                        type="date"
                        autocomplete="off"
                        name="dob"
                        onChange={handleEdit}
                        value={customerInfoData.dob.split("T")[0]}
                      />
                      <div class="invalid-feedback">
                        This field is required.
                      </div>
                    </div>
                    <div class="col-sm-4">
                      <label for="con-phone">Nutritionist Name</label>
                      <select
                        class="form-control"
                        id="ddl-customer-nutritionist"
                        name="vendorsId"
                        onChange={handleEdit}
                        value={customerInfoData.vendorsId}
                      >
                        <option>Select</option>
                        {nutritionist.map((nutri) => {
                          return (
                            <option value={nutri.id}>
                              {(nutri.firstName, nutri.lastName)}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div class="col-sm-4">
                      <label for="con-phone">Status</label>
                      <select
                        class="form-control"
                        id="ddl-customer-status"
                        name="status"
                        onChange={handleEdit}
                        value={customerInfoData.status}
                      >
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <input id="index_var" type="hidden" value="5" />
              <button
                id="btnUpdateCustomer"
                class="btn btn-primary pull-right"
                type="submit"
              >
                Update
              </button>
              <button
                class="btn btn-secondary"
                type="button"
                data-bs-dismiss="modal"
                onClick={closeEdit}
              >
                Cancel
              </button>
            </Form>
          </div>
        </Modal>
        <Modal
          show={accountModal}
          size="lg"
          onHide={toogleAccount}
          backdrop="static"
          keyboard={false}
        >
          <div class="modal-body">
            <Form
              noValidate
              validated={validateAccount}
              onSubmit={handleSubmit}
              className="form-bookmark signup-validation"
            >
              <div class="wizard-title mb-3">
                <h4>Customer Signup</h4>
              </div>
              <div class="form-group mb-3">
                <label class="col-form-label">Name</label>
                <input
                  className="form-control"
                  type="text"
                  id="txtName"
                  required
                  placeholder="Name"
                  value={signupDetails.firstName}
                  name="firstName"
                  onChange={handleChange}
                />
                {/* <input class="form-control" id="txtName" type="text" required="" placeholder="Name" /> */}
                <div class="invalid-feedback">Please enter valid name.</div>
              </div>
              <div class="form-group mb-3">
                <label class="col-form-label">Email Address</label>
                <input
                  className="form-control"
                  type="email"
                  id="txtEmail"
                  required
                  placeholder="Email"
                  name="email"
                  value={signupDetails.email}
                  onChange={handleChange}
                />
                {/* <input class="form-control" type="email" id="txtEmail" required="" placeholder="Email" /> */}
                <div class="invalid-feedback">
                  Please enter valid email address.
                </div>
              </div>
              <div class="form-group mb-3">
                <label class="col-form-label">Mobile Number</label>
                <input
                  className="form-control"
                  type="number"
                  id="txtNumber"
                  required
                  placeholder="99XXXXXXX"
                  value={signupDetails.mobileNumber}
                  name="mobileNumber"
                  onChange={handleChange}
                />
                {/* <input class="form-control" type="number" id="txtNumber" required="" placeholder="99XXXXXXX" /> */}
                <div class="invalid-feedback">
                  Please enter valid mobile number.
                </div>
              </div>
              <div class="form-group mb-3">
                {/* <!--<label class="col-form-label">Password</label>
                                <div class="form-input position-relative">
                                    <input class="form-control" id="txtPassword" type="password" name="login[password]" required=""
                                        placeholder="*********">
                                        <div class="show-hide"><span class=""></span></div>
                                        <div class="invalid-feedback">Please enter valid password.</div>
                                </div>--> */}
                <label class="col-form-label">Password</label>
                <div class="form-input position-relative">
                  <input
                    className="form-control"
                    type={togglePassword ? "text" : "password"}
                    id="txtPassword"
                    name="login[password]"
                    required
                    placeholder="*********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {/* <input class="form-control" type="password" id="txtPassword" name="login[password]" required="" placeholder="*********" /> */}
                  <div
                    className="show-hide"
                    onClick={() => HideShowPassword(togglePassword)}
                    style={{ top: "50%" }}
                  >
                    <span className={togglePassword ? "" : "show"}></span>
                  </div>
                  {/* <div class="show-hide" style="top: 50%"><span class="show"></span></div> */}
                  <div class="invalid-feedback">
                    Please enter valid password.
                  </div>
                </div>
              </div>
              <label>&nbsp;</label>
              <button
                class="btn btn-danger pull-left"
                type="button"
                onClick={toogleAccount}
              >
                Cancel
              </button>
              <button
                class="btn btn-primary pull-right"
                id="btnInfoNext"
                type="submit"
              >
                Next
              </button>
            </Form>
          </div>
        </Modal>
        <Modal
          show={showOtp}
          size="md"
          onHide={toogleOtp}
          backdrop="static"
          keyboard={false}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              OTP
            </h5>
          </div>
          <div className="modal-body">
            <h5 className="text-muted mb-4">Enter your OTP to verify</h5>
            <Form
              noValidate
              validated={validateOtp}
              onSubmit={addAcount}
              className="form-bookmark signup-validation"
            >
              <div className="mt-4 mb-4">
                <span className="reset-password-link">
                  If don't receive OTP?&nbsp;&nbsp;
                  <a
                    className="btn-link text-danger"
                    href="#"
                    onClick={resendOtp}
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
                      placeholder="00"
                      maxlength="2"
                      required
                      value={inputOtp.otp1}
                      name="otp1"
                      onChange={handleOtp}
                    />
                    <div className="invalid-feedback">
                      Please enter valid otp.
                    </div>
                  </div>
                  <div className="col">
                    <input
                      className="form-control text-center opt-text"
                      type="text"
                      id="txtOtp2"
                      placeholder="00"
                      maxlength="2"
                      required
                      value={inputOtp.otp2}
                      name="otp2"
                      onChange={handleOtp}
                    />
                    <div className="invalid-feedback">
                      Please enter valid otp.
                    </div>
                  </div>
                  <div className="col">
                    <input
                      className="form-control text-center opt-text"
                      type="text"
                      id="txtOtp3"
                      placeholder="00"
                      maxlength="2"
                      required
                      value={inputOtp.otp3}
                      name="otp3"
                      onChange={handleOtp}
                    />
                    <div className="invalid-feedback">
                      Please enter valid otp.
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group m-t-15">
                <button
                  className="btn btn-danger pull-left"
                  type="button"
                  onClick={toogleOtp}
                >
                  Close
                </button>
                <button
                  className="btn btn-success pull-right"
                  type="submit"
                  id="btnProceed"
                >
                  Proceed
                </button>
              </div>
            </Form>
          </div>
        </Modal>
        <ToastContainer />
      </BodyContainer>
    </AccountLayout>
  );
}
