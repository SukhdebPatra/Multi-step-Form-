import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AccountLayout from "../../layout/account-layout/AccountLayout";
import BodyContainer from "../../layout/body-container/BodyContainer";
import axios from "../../assets/axios/axios";
import Upload from "../../components/upload-modal/Upload";
import BodyHeader from "../../layout/body-header/BodyHeader";
import { Form, Modal } from "react-bootstrap";
import { mealPlanUrl } from "../../assets/Api/api";
import { toast, ToastContainer } from "react-toastify";
import { ModalBody } from "reactstrap";

export default function Mealplans() {
  const user = JSON.parse(window.localStorage.getItem("user"));
  const store = JSON.parse(window.localStorage.getItem("store"));
  const mdata = {
    pageNo: 1,
    pageSize: 5,
    storeId: store.id,
    name: "",
    programsId: "",
    menuPlanType: "",
    status: "",
  };

  const mealplanData = {
    storeId: store.id,
    name: "",
    File: "",
    program: "",
    planType: "1",
    slots: [],
    quantity: "1",
    duration: "1",
    days: "1",
    price: "0",
    sellingPrice: "0",
    dayPrice: "0",
    status: true,
    description: "",
  };

  const [search, setSearch] = useState(false);
  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [postData, setPostData] = useState(mdata);
  const [edit, setEdit] = useState(false);
  const [validated, setValidated] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [slots, setSlots] = useState([]);
  const [mealPlans, setMealPlans] = useState();
  const [selectedMealplan, setSelectedMealplan] = useState();
  const [mealplanDetails, setMealplanDetails] = useState(mealplanData);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const [show, setShow] = useState(false);
  const [showCunsumtion, setShowCunsumtion] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleShowSetConsumtions = () => {
    setShowCunsumtion(true);
  };

  const handleCloseCunsumtion = () => {
    setShowCunsumtion(false);
  };
  const imageRef = useRef();

  const toogle = () => setModal(!modal);

  const getData = (data) => {
    setLoader(true);
    axios
      .post(`${mealPlanUrl}/GetProgramMenuPlansOnFilter`, data)
      .then((response) => {
        console.log(response);
        setMealPlans(response.data.data);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };

  useEffect(() => {
    axios
      .get(`${mealPlanUrl}/GetPrograms/${store.id}`)
      .then((response) => {
        console.log(response);
        setPrograms(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${mealPlanUrl}/GetSlots/${store.id}`)
      .then((response) => {
        console.log(response);
        setSlots(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    getData(postData);
  }, []);

  const getMealPlanDetials = (id) => {
    setLoader(true);
    axios
      .get(`${mealPlanUrl}/GetProgramMenuPlan/${id}`)
      .then((response) => {
        console.log(response);
        setSelectedMealplan(response.data.data);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };

  const imageInput = (e) => {
    console.log(e.target.files[0]);
    const File = e.target.files;
    var arrValidExtensions = ["jpg", "jpeg", "png", "gif"];
    var Size = Math.round(File[0].size / (1024 * 1024)); //Max 2 MB
    if (File.length > 0) {
      if (
        !arrValidExtensions.includes(
          File[0].name.toLowerCase().split(".").reverse()[0]
        )
      ) {
        toast.error("Invalid file type.", {
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: true,
          autoClose: 3000,
        });
        imageRef.current.value = "";
      } else if (Size > 2) {
        toast.error("File size should be less than or equal to 2 MB.", {
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: true,
          autoClose: 3000,
        });
        imageRef.current.value = "";
      } else {
        setMealplanDetails({ ...mealplanDetails, File: e.target.files[0] });
      }
    }
  };

  const handleInput = (e) => {
    setMealplanDetails({
      ...mealplanDetails,
      [e.target.name]: e.target.value,
    });
  };

  const selectSlots = (e) => {
    if (selectedSlots.length < mealplanDetails.planType) {
      const arrSlots = [...selectedSlots];
      arrSlots.push(e.target.value);
      setSelectedSlots(arrSlots);
    }
  };

  const removeSlot = (slotId) => {
    const newArray = selectedSlots.filter((i) => i !== slotId);
    setSelectedSlots(newArray);
    console.log(selectedSlots, "from delete");
  };

  const getDays = (e) => {
    let data = {
      days: mealplanDetails.days,
      quantity: mealplanDetails.quantity,
      duration: mealplanDetails.duration,
      price: mealplanDetails.price,
      sellingPrice: mealplanDetails.sellingPrice,
      dayPrice: mealplanDetails.dayPrice,
    };
    data[e.target.name] = e.target.value;
    if (e.target.name !== "days") {
      let day = 0;
      switch (+data.duration) {
        case 1:
          day = data.quantity * 1;
          data.days = day;
          break;
        case 2:
          day = data.quantity * 6;
          data.days = day;
          break;
        case 3:
          day = data.quantity * 24;
          data.days = day;
          break;
        case 4:
          day = data.quantity * 288;
          data.days = day;
          break;
      }
    }
    if (+data.sellingPrice > 0) {
      const price = data.sellingPrice / data.days;
      data.dayPrice = price;
    } else {
      const price = data.price / data.days;
      data.dayPrice = price;
    }
    setMealplanDetails({
      ...mealplanDetails,
      days: data.days,
      quantity: data.quantity,
      duration: data.duration,
      price: data.price,
      sellingPrice: data.sellingPrice,
      dayPrice: data.dayPrice,
    });
  };

  const addMealplan = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    let data = new FormData();
    data.append("programsId", mealplanDetails.program);
    data.append("storesId", mealplanDetails.storeId);
    data.append("menuPlanType", mealplanDetails.planType);
    data.append("status", mealplanDetails.status === 1 ? true : false);
    selectedSlots.map((slot, i) => {
      data.append("mealPlanSlots[" + i + "].slotsId", slot);
      data.append("mealPlanSlots[" + i + "].status", mealplanDetails.status);
    });
    // mealplanDetails.slots.map((slot, i) => {s
    //   data.append("mealPlanSlots[" + i + "].slotsId", slot.id);
    //   data.append("mealPlanSlots[" + i + "].status", mealplanDetails.status);
    // });
    data.append("programMenuPlan.storesId", mealplanDetails.storeId);
    data.append("programMenuPlan.name", mealplanDetails.name);
    data.append("programMenuPlan.quantity", mealplanDetails.quantity);
    data.append("programMenuPlan.duration", mealplanDetails.duration);
    data.append("programMenuPlan.days", mealplanDetails.days);
    data.append("programMenuPlan.pricePerDay", mealplanDetails.dayPrice);
    data.append("programMenuPlan.price", mealplanDetails.price);
    data.append("programMenuPlan.sellingPrice", mealplanDetails.sellingPrice);
    data.append("programMenuPlan.file", mealplanDetails.File);
    data.append("programMenuPlan.description", mealplanDetails.description);
    data.append(
      "programMenuPlan.status",
      mealplanDetails.status == 1 ? true : false
    );
    const found = false;
    if (form.checkValidity() === false) {
      console.log("validity fails");
    } else {
      console.log(data);
      if (found) {
        toast.info("Meal plan name already exist.", {
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: true,
          autoClose: 3000,
        });
      } else {
        setLoader(true);
        axios
          .post(`${mealPlanUrl}/AddMealPlan`, data)
          .then((response) => {
            console.log(response.data.data, "coming from response");
            getData(postData);
            closeModal();
            toast.info("Meal plan added successfully.", {
              position: toast.POSITION.TOP_RIGHT,
              hideProgressBar: true,
              autoClose: 3000,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
      for (var pair of data.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
    }
    setValidated(true);
  };

  const editMealplan = () => {
    setEdit(true);
    let data = mealplanDetails;
    data.name = selectedMealplan.name;
    data.description = selectedMealplan.description;
    data.dayPrice = selectedMealplan.pricePerDay;
    data.price = selectedMealplan.price;
    data.sellingPrice = selectedMealplan.sellingPrice;
    data.quantity = selectedMealplan.quantity;
    data.duration = selectedMealplan.duration;
    data.status = selectedMealplan.status;
    data.planType = selectedMealplan.programMenuPlanTypes.menuPlanType;
    data.days = selectedMealplan.days;
    data.program = selectedMealplan.programMenuPlanTypes.programsId;

    let arrSlots = [];
    selectedMealplan.programMenuPlanTypes.mealPlanSlots.map((slot) => {
      arrSlots.push({
        id: slot.slotsId,
      });
    });
    data.slots = arrSlots;
    setMealplanDetails(data);
    console.log(mealplanDetails, "from edit ");
    toogle();
  };

  const updateMealplan = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    let data = new FormData();
    data.append("id", selectedMealplan.programMenuPlanTypesId);
    data.append("programsId", mealplanDetails.program);
    data.append("storesId", mealplanDetails.storeId);
    data.append("menuPlanType", mealplanDetails.planType);
    data.append("status", mealplanDetails.status == 1 ? true : false);
    mealplanDetails.slots.map((slot, i) => {
      selectedMealplan.programMenuPlanTypes.mealPlanSlots.map((s, n) => {
        if (s.slotsId == slot.id) {
          data.append("mealPlanSlots[" + n + "].id", s.id);
        }
      });
      data.append("mealPlanSlots[" + i + "].slotsId", slot.id);
      data.append("mealPlanSlots[" + i + "].status", mealplanDetails.status);
    });
    data.append("programMenuPlan.storesId", mealplanDetails.storeId);
    data.append("programMenuPlan.name", mealplanDetails.name);
    data.append("programMenuPlan.quantity", mealplanDetails.quantity);
    data.append("programMenuPlan.duration", mealplanDetails.duration);
    data.append("programMenuPlan.days", mealplanDetails.days);
    data.append("programMenuPlan.pricePerDay", mealplanDetails.dayPrice);
    data.append("programMenuPlan.price", mealplanDetails.price);
    data.append("programMenuPlan.sellingPrice", mealplanDetails.sellingPrice);
    data.append("programMenuPlan.file", mealplanDetails.File);
    data.append("programMenuPlan.description", mealplanDetails.description);
    data.append(
      "programMenuPlan.status",
      mealplanDetails.status == 1 ? true : false
    );
    const found = false;
    if (form.checkValidity() === false) {
      console.log("validity fails");
    } else {
      console.log(data);
      if (found) {
        toast.info("Meal plan name already exist.", {
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: true,
          autoClose: 3000,
        });
      } else {
        setLoader(true);
        axios
          .put(`${mealPlanUrl}/UpdateMealPlan`, data)
          .then((response) => {
            console.log(response);
            getData(postData);
            closeModal();
            getMealPlanDetials(response.data.data.id);
            toast.info("Meal plan updated successfully.", {
              position: toast.POSITION.TOP_RIGHT,
              hideProgressBar: true,
              autoClose: 3000,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
      for (var pair of data.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
    }
    setValidated(true);
  };

  const closeModal = () => {
    toogle();
    setEdit(false);
    setMealplanDetails(mealplanData);
    setValidated(false);
  };

  const next = () => {
    if (mealPlans.pageNo < mealPlans.totalPages) {
      const page = postData;
      page.pageNo = mealPlans.pageNo + 1;
      setPostData(page);
      getData(page);
      // console.log(page);
    }
  };

  const previous = () => {
    if (mealPlans.pageNo > 1) {
      const page = postData;
      page.pageNo = mealPlans.pageNo - 1;
      setPostData(page);
      getData(page);
      // console.log(page);
    }
  };

  const mealplansByFilter = () => {
    getData(postData);
  };

  const clearFilter = () => {
    getData(mdata);
    setPostData(mdata);
  };

  const handleSearch = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };

  const duration = (duration) => {
    let result;
    switch (duration) {
      case 1:
      case "1":
        result = "Day";
        break;
      case 2:
      case "2":
        result = "Week";
        break;
      case 3:
      case "3":
        result = "Month";
        break;
      case 4:
      case "4":
        result = "Year";
        break;
    }
    return result;
  };

  return (
    <AccountLayout title="Mealplans" loader={loader}>
      <BodyContainer>
        <div className="card mb-0">
          <div className="card-header">
            <BodyHeader
              toogle={toogle}
              search={search}
              setSearch={setSearch}
              addBtn={true}
            >
              <Upload
                url={mealPlanUrl}
                exportPath="/ExportMealPlans/"
                importPath="/ImportMealPlans"
              />
            </BodyHeader>
            <div className="row">
              <div className="col-sm-12">
                <div
                  className="card"
                  id="dvQuickSearch"
                  style={{ display: `${search ? "block" : "none"}` }}
                >
                  <div className="card-body">
                    <form id="frm-search-program-menu-plans">
                      <div className="mb-3 col-md-12 my-0">
                        <div className="row">
                          <div className="col-sm-3">
                            <label htmlFor="con-name">Name</label>
                            <input
                              className="form-control"
                              id="txt-search-name"
                              type="text"
                              placeholder="Name"
                              autoComplete="off"
                              value={postData.name}
                              name="name"
                              onChange={handleSearch}
                            />
                          </div>
                          <div className="col-sm-3">
                            <label htmlFor="con-name">Program</label>
                            <select
                              className="programs form-control"
                              id="ddl-search-programs"
                              value={postData.programsId}
                              name="programsId"
                              onChange={handleSearch}
                            >
                              <option value="" selected>
                                Select
                              </option>
                              {programs.map((program) => (
                                <option value={program.id}>
                                  {program.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-sm-3">
                            <label htmlFor="con-name">Plan type</label>
                            <select
                              id="ddl-search-menu-plan-types"
                              className="form-control"
                              value={postData.menuPlanType}
                              name="menuPlanType"
                              onChange={handleSearch}
                            >
                              <option value="" selected>
                                Select
                              </option>
                              <option value="1">1 M/D</option>
                              <option value="2">2 M/D</option>
                              <option value="3">3 M/D</option>
                              <option value="4">4 M/D</option>
                              <option value="5">5 M/D</option>
                              {/* <!--<option value="6">6 M/D</option>--> */}
                            </select>
                          </div>
                          <div className="col-sm-3">
                            <label htmlFor="con-name">Status</label>
                            <select
                              className="form-control"
                              id="ddl-search-status"
                              value={postData.status}
                              name="status"
                              onChange={handleSearch}
                            >
                              <option value="" selected>
                                Select
                              </option>
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 col-md-12 my-0">
                        <div className="row">
                          <div className="col-sm-9">
                            <label htmlFor="">&nbsp;</label>
                            <br />
                            <button
                              type="button"
                              id="btnCloseFilter"
                              className="btn btn-outline-primary"
                              onClick={() => {
                                setSearch(false);
                                setPostData(mdata);
                              }}
                            >
                              Close
                            </button>
                          </div>
                          <div className="col-sm-3">
                            <label htmlFor="">&nbsp;</label>
                            <br />
                            <button
                              type="button"
                              id="btnFilter"
                              className="btn btn-outline-primary me-1"
                              onClick={mealplansByFilter}
                            >
                              Search
                            </button>
                            <button
                              type="button"
                              id="btnClearFilter"
                              className="btn btn-outline-primary"
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

            <div className="row">
              <div className="col-sm-12">
                <div
                  className="card"
                  id="dvSearch"
                  style={{ display: "block" }}
                >
                  <div className="card-body">
                    <div className="mb-3 col-md-12 my-0">
                      <div className="card-body p-0">
                        <div
                          id="div-not-found"
                          className="row"
                          style={{
                            display: `${
                              mealPlans
                                ? mealPlans.programMenuPlans < 1
                                  ? ""
                                  : "none"
                                : "none"
                            }`,
                          }}
                        >
                          <div className="col-sm-12">
                            <div className="card">
                              <div className="card-body">
                                <h5 className="text-center">Data not found</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row list-persons" id="addcon">
                          <div className="col-xl-4 xl-30 col-md-5">
                            <div
                              className="nav flex-column nav-pills"
                              id="v-pills-tab"
                              role="tablist"
                              aria-orientation="vertical"
                            >
                              <div id="div-program-menu-plans">
                                {mealPlans &&
                                  mealPlans.programMenuPlans.map((plan) => {
                                    return (
                                      <Link
                                        to="#"
                                        id="program-menu-plan-1"
                                        className="nav-link"
                                        onClick={() =>
                                          getMealPlanDetials(plan.id)
                                        }
                                      >
                                        <div className="media">
                                          <img
                                            className="img-50 img-fluid m-r-20 rounded-circle update_img_0"
                                            src={`${plan.path}`}
                                            alt="image"
                                          />
                                          <div className="media-body">
                                            <h6>
                                              <span className="first_name_0">
                                                {plan.name}
                                              </span>
                                            </h6>
                                            <p className="email_add_0">
                                              {plan.description}
                                            </p>
                                          </div>
                                        </div>
                                      </Link>
                                    );
                                  })}
                              </div>
                              <div className="dataTables_info">
                                <ul className="pagination justify-content-center pagination-primary">
                                  <li className="page-item">
                                    <Link
                                      to="#"
                                      id="btnPrevious"
                                      className="page-link"
                                      onClick={previous}
                                    >
                                      Previous
                                    </Link>
                                  </li>
                                  <li className="page-item">
                                    <Link
                                      to="#"
                                      id="btnNext"
                                      className="page-link"
                                      onClick={next}
                                    >
                                      Next
                                    </Link>
                                  </li>
                                </ul>
                                <div className="mt-3">
                                  Showing{" "}
                                  <span id="spn-pageNo">
                                    {mealPlans && mealPlans.pageNo}
                                  </span>{" "}
                                  of{" "}
                                  <span id="spn-totalPages">
                                    {mealPlans && mealPlans.totalPages}
                                  </span>{" "}
                                  pages
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-8 xl-70 col-md-7">
                            <div
                              className="tab-content"
                              id="v-pills-tabContent"
                            >
                              <div
                                className="tab-pane contact-tab-0 tab-content-child fade show active"
                                id="div-program-menu-plan-details"
                                role="tabpanel"
                                aria-labelledby="v-pills-user-tab"
                                style={{
                                  display: `${selectedMealplan ? "" : "none"}`,
                                }}
                              >
                                <div className="profile-mail">
                                  <div className="media">
                                    <img
                                      id="img-program-menu-plan"
                                      className="img-100 img-fluid m-r-20 rounded-circle update_img_0"
                                      src={`${selectedMealplan?.path}`}
                                      alt=""
                                    />
                                    <input
                                      className="updateimg"
                                      type="file"
                                      name="img"
                                      onchange="readURL(this,0)"
                                    />
                                    <div className="media-body mt-0">
                                      <h5>
                                        <span className="spn-name">
                                          {selectedMealplan &&
                                            selectedMealplan.name}
                                        </span>
                                      </h5>
                                      <p
                                        id="spn-description"
                                        className="email_add_6"
                                      ></p>
                                      <ul>
                                        <li>
                                          <Link id="txtDetails" to="#">
                                            Details
                                          </Link>
                                        </li>
                                        <li className="checkPermission">
                                          <Link
                                            to="#"
                                            id="btnEditMealPlan"
                                            onClick={editMealplan}
                                          >
                                            Edit
                                          </Link>
                                        </li>
                                        <li hidden>
                                          <Link id="txtImages" to="#">
                                            Images
                                          </Link>
                                        </li>
                                        <li hidden>
                                          <Link id="txtHistory" to="#">
                                            Summary History
                                          </Link>
                                        </li>
                                        {/* <!-- <li><Link to="#">Receipe</Link></li> -->
                                                                                            <!-- <li><Link to="#" onclick="printContact(0)" data-bs-toggle="modal" data-bs-target="#printModal">Print</Link></li> --> */}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="email-general">
                                    <div
                                      id="dvImages"
                                      style={{ display: "none" }}
                                    >
                                      <div className="mb-3 col-md-12 my-0">
                                        <div style={{ float: "right" }}>
                                          <div
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModal1"
                                            className="btn btn-outline-primary ms-2"
                                          >
                                            <i data-feather="plus"></i>Add new
                                            image
                                          </div>
                                        </div>
                                        <label>&nbsp;</label>
                                        <div className="avatar-showcase">
                                          <div className="avatars">
                                            <div className="avatar ratio">
                                              <img
                                                className="b-r-8 img-100"
                                                src="../assets/images/user/1.jpg"
                                                alt="#"
                                              />
                                            </div>
                                            <div className="avatar ratio">
                                              <img
                                                className="b-r-8 img-90"
                                                src="../assets/images/user/1.jpg"
                                                alt="#"
                                              />
                                            </div>
                                            <div className="avatar ratio">
                                              <img
                                                className="b-r-8 img-80"
                                                src="../assets/images/user/1.jpg"
                                                alt="#"
                                              />
                                            </div>
                                            <div className="avatar ratio">
                                              <img
                                                className="b-r-8 img-70"
                                                src="../assets/images/user/1.jpg"
                                                alt="#"
                                              />
                                            </div>
                                            <div className="avatar ratio">
                                              <img
                                                className="b-r-8 img-60"
                                                src="../assets/images/user/1.jpg"
                                                alt="#"
                                              />
                                            </div>
                                            <div className="avatar ratio">
                                              <img
                                                className="b-r-8 img-50"
                                                src="../assets/images/user/1.jpg"
                                                alt="#"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      id="dvHistory"
                                      style={{ display: "none" }}
                                    >
                                      <div className="row">
                                        <div className="col-xl-12 xl-100 col-md-12">
                                          <div className="table-responsive">
                                            <table
                                              className="display"
                                              id="basic-1"
                                            >
                                              <thead>
                                                <tr>
                                                  <th>S.No.</th>
                                                  <th>Total customer</th>
                                                  <th>Active customer</th>
                                                  <th>Freeze customer</th>
                                                  <th>Total orders</th>
                                                  <th>Total collection</th>
                                                  <th>Freeze meal plan</th>
                                                  <th>Status</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr>
                                                  <td>1</td>
                                                  <td>100</td>
                                                  <td>50</td>
                                                  <td>12</td>
                                                  <td>52</td>
                                                  <td>5200 QR</td>
                                                  <td></td>
                                                  <td>Active</td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div id="dvDetails">
                                      <h6 className="mb-3">General details</h6>
                                      <ul>
                                        <li>
                                          Name{" "}
                                          <span className="font-primary spn-name">
                                            {selectedMealplan &&
                                              selectedMealplan.name}
                                          </span>
                                        </li>
                                        <li>
                                          Plan type{" "}
                                          <span
                                            id="spn-plan-type"
                                            className="font-primary"
                                          >
                                            {selectedMealplan &&
                                              selectedMealplan
                                                .programMenuPlanTypes
                                                .menuPlanType + " M/D"}
                                          </span>
                                        </li>
                                        <li>
                                          Program{" "}
                                          <span
                                            id="spn-program"
                                            className="font-primary"
                                          >
                                            {selectedMealplan &&
                                              selectedMealplan
                                                .programMenuPlanTypes.programs
                                                .name}
                                          </span>
                                        </li>
                                        <li>
                                          Duration{" "}
                                          <span
                                            id="spn-duration"
                                            className="font-primary"
                                          >
                                            {selectedMealplan &&
                                              duration(
                                                selectedMealplan.duration
                                              )}
                                          </span>
                                        </li>
                                        <li>
                                          Quantity{" "}
                                          <span
                                            id="spn-quantity"
                                            className="font-primary"
                                          >
                                            {selectedMealplan &&
                                              selectedMealplan.quantity}
                                          </span>
                                        </li>
                                        <li>
                                          Price Type
                                          <span
                                            id="spn-price"
                                            className="font-primary"
                                          >
                                            {selectedMealplan &&
                                              selectedMealplan.price}
                                          </span>
                                        </li>
                                        <li>
                                          Status
                                          <span
                                            id="spn-status"
                                            className="badge badge-primary"
                                          >
                                            {selectedMealplan &&
                                            selectedMealplan.status
                                              ? "Active"
                                              : "Inactive"}
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            show={modal}
            size="xl"
            onHide={toogle}
            backdrop="static"
            keyboard={false}
          >
            <div className="modal-body">
              <Form
                noValidate
                validated={validated}
                onSubmit={edit ? updateMealplan : addMealplan}
                className="form-bookmark enquiry-validation"
                id="frm-modal-add-appointment"
              >
                <div className="row g-2">
                  <div className="mb-3 col-md-12 mt-0">
                    <div className="row">
                      <div className="col-sm-4">
                        <label>Choose image</label>
                        <input
                          className="form-control"
                          id="MenuImgAttachment"
                          type="file"
                          accept=".jpg, .jpeg, .png"
                          autoComplete="off"
                          ref={imageRef}
                          onChange={imageInput}
                        />
                      </div>
                      <div className="col-sm-4">
                        <label>Program</label>
                        <select
                          className="programs form-control"
                          id="ddl-programs"
                          required
                          name="program"
                          value={mealplanDetails.program}
                          onChange={handleInput}
                        >
                          <option value="" selected>
                            Select
                          </option>
                          {programs.map((program) => (
                            <option value={program.id}>{program.name}</option>
                          ))}
                        </select>
                        <div className="invalid-feedback">
                          Please select valid program.
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <label htmlFor="con-name">Plan type</label>
                        <select
                          id="ddl-menu-plan-types"
                          className="form-control"
                          value={mealplanDetails.planType}
                          name="planType"
                          onChange={handleInput}
                        >
                          <option value="1" selected>
                            1 M/D
                          </option>
                          <option value="2">2 M/D</option>
                          <option value="3">3 M/D</option>
                          <option value="4">4 M/D</option>
                          <option value="5">5 M/D</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 col-md-12 mt-0">
                    <div className="row">
                      <div className="col-sm-6">
                        <label>Slots</label>
                        <div id="div-slots-1">
                          <select
                            id="ddl-slots-1"
                            className="slots 1m-plan form-control js-example-basic-multiple"
                            onChange={selectSlots}
                            required
                            value=""
                          >
                            {/* <option value="">Select</option> */}
                            {slots.map((slot, i) => {
                              if (!selectedSlots.some((s) => s == slot.id)) {
                                return (
                                  <option value={slot.id}>{slot.name}</option>
                                );
                              }
                            })}
                          </select>
                          <div className="invalid-feedback">
                            Please select valid slot.
                          </div>
                        </div>

                        <div id="div-slots-2" hidden>
                          <select
                            id="ddl-slots-2"
                            className="slots 2m-plan form-control js-example-basic-multiple col-sm-12"
                            multiple
                          ></select>
                          <div className="invalid-feedback">
                            Please select valid slot.
                          </div>
                        </div>
                        <div id="div-slots-3" hidden>
                          <select
                            id="ddl-slots-3"
                            className="slots 3m-plan form-control js-example-basic-multiple col-sm-12"
                            multiple
                          ></select>
                          <div className="invalid-feedback">
                            Please select valid slot.
                          </div>
                        </div>
                        <div id="div-slots-4" hidden>
                          <select
                            id="ddl-slots-4"
                            className="slots 4m-plan form-control js-example-basic-multiple col-sm-12"
                            multiple
                          ></select>
                          <div className="invalid-feedback">
                            Please select valid slot.
                          </div>
                        </div>
                        <div id="div-slots-5" hidden>
                          <select
                            id="ddl-slots-5"
                            className="slots 5m-plan form-control js-example-basic-multiple col-sm-12"
                            multiple
                          ></select>
                          <div className="invalid-feedback">
                            Please select valid slot.
                          </div>
                        </div>
                      </div>
                      <div className=" col-sm-6">
                        {selectedSlots.map((slotId) => {
                          const slot = slots.find(
                            (slot) => slot.id === parseInt(slotId)
                          );
                          return (
                            <span
                              key={slot.id}
                              className="badge text-bg-secondary"
                            >
                              {slot.name}
                              <span
                                style={{ cursor: "pointer", marginLeft: "5px" }}
                                onClick={() => removeSlot(slotId)}
                              >
                                &#x2715;
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 col-md-12 mt-0">
                    <div className="row">
                      <div className="col-sm-6">
                        <label htmlFor="con-name">Name</label>
                        <input
                          className="form-control"
                          id="txt-name"
                          type="text"
                          required
                          placeholder="Name"
                          autoComplete="off"
                          name="name"
                          value={mealplanDetails.name}
                          onChange={handleInput}
                        />
                        <div className="invalid-feedback">
                          Please enter valid name.
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <label htmlFor="con-name">Quantity</label>
                        <input
                          className="form-control"
                          id="txt-quantity"
                          type="number"
                          required
                          placeholder="Quantity"
                          autoComplete="off"
                          name="quantity"
                          value={mealplanDetails.quantity}
                          onChange={(e) => {
                            getDays(e);
                          }}
                        />
                        <div className="invalid-feedback">
                          Please enter valid quantity.
                        </div>
                      </div>
                      <div className="col-sm-2">
                        <label htmlFor="con-name">Duration</label>
                        <select
                          id="ddl-duration"
                          className="form-control"
                          name="duration"
                          value={mealplanDetails.duration}
                          onChange={(e) => {
                            getDays(e);
                          }}
                        >
                          <option value="1" selected>
                            Day
                          </option>
                          <option value="2">Week</option>
                          <option value="3">Month</option>
                          <option value="4">Year</option>
                        </select>
                      </div>
                      <div className="col-sm-2">
                        <label htmlFor="con-name">Days</label>
                        <input
                          className="form-control"
                          id="txt-days"
                          type="number"
                          required
                          placeholder="Days"
                          autoComplete="off"
                          name="days"
                          value={mealplanDetails.days}
                          onChange={(e) => {
                            getDays(e);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 col-md-12 mt-0">
                    <div className="row">
                      <div className="col-sm-3">
                        <label htmlFor="con-name">Price Type</label>
                        {/* <input className="form-control" id="txt-price" type="number" required placeholder="Price" autoComplete="off" step="0.01" name='price' value={mealplanDetails.price} onChange={(e) => { getDays(e) }} /> */}
                        <select
                          value={mealplanDetails.priceType}
                          onChange={handleInput}
                          name="priceType"
                          className="form-control"
                          required=""
                        >
                          <option defaultValue value="">
                            Select price type
                          </option>
                          <option value="1">Per Day</option>
                          <option value="2">Per Calories</option>
                          <option value="3">Calories range</option>
                        </select>

                        <div className="invalid-feedback">
                          Please enter valid price.
                        </div>
                      </div>
                      {mealplanDetails.priceType == 1 ? (
                        // <div>
                        <React.Fragment>
                          <div className="col-sm-3">
                            <label htmlFor="con-name">Price</label>
                            <input
                              className="form-control"
                              id="txt-price"
                              type="number"
                              value="0"
                              required=""
                              placeholder="Price"
                              autoComplete="off"
                              step="0.01"
                            />
                            <div className="invalid-feedback">
                              Please enter valid price.
                            </div>
                          </div>
                          <div className="col-sm-3" id="dvSellingPrice">
                            <label htmlFor="con-name">Selling price</label>
                            <input
                              className="form-control"
                              id="txt-selling-price"
                              type="number"
                              value="0"
                              required=""
                              placeholder="Selling price"
                              autoComplete="off"
                              step="0.01"
                            />
                            <div className="invalid-feedback">
                              Please enter valid selling price.
                            </div>
                          </div>
                          <div className="col-sm-3" id="dvPricePerDay">
                            <label htmlFor="con-name">Price per day</label>
                            <input
                              className="form-control"
                              id="txt-price-per-day"
                              type="number"
                              value="0"
                              required=""
                              placeholder="Price per day"
                              autoComplete="off"
                              disabled=""
                            />
                          </div>
                          {/* </div> */}
                        </React.Fragment>
                      ) : null}

                      {mealplanDetails.priceType == 2 ? (
                        <div className="col-sm-3">
                          <div id="dvPricePerCalories">
                            <label htmlFor="con-name">Price per calories</label>
                            <input
                              className="form-control"
                              id="txt-price-per-calories"
                              type="number"
                              value="0"
                              required=""
                              placeholder="Price per calories"
                              autoComplete="off"
                              step="0.01"
                            />
                            <div className="invalid-feedback">
                              Please enter valid price.
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {mealplanDetails.priceType == 3 ? (
                        <div className="col-sm-3" id="dvPriceRange">
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleShow}
                          >
                            Set range
                          </button>
                        </div>
                      ) : null}

                      {/* <div className="col-sm-3">
                                                <label for="con-name">Selling price</label>
                                                <input className="form-control" id="txt-selling-price" type="number" required placeholder="Selling price" autocomplete="off" step="0.01" name='sellingPrice' value={mealplanDetails.sellingPrice} onChange={(e) => { getDays(e) }} />
                                                <div className="invalid-feedback">Please enter valid selling price.</div>
                                            </div> */}
                      {/* <div className="col-sm-3">
                                                <label for="con-name">Price per day</label>
                                                <input className="form-control" id="txt-price-per-day" type="number" required placeholder="Price per day" autocomplete="off" disabled value={mealplanDetails.dayPrice} />
                                            </div> */}

                      <div className="col-sm-3">
                        <label htmlFor="con-name">Status</label>
                        <select
                          className="form-control"
                          id="ddl-status"
                          name="status"
                          value={mealplanDetails.status}
                          onChange={handleInput}
                        >
                          <option value="true" selected>
                            Active
                          </option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                      <div className="col-sm-3">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={handleShowSetConsumtions}
                        >
                          Set consumptions
                        </button>
                      </div>
                      <div>
                        <Modal show={show} onHide={handleClose}>
                          <Modal.Body>
                            {" "}
                            <div className="modal-body">
                              <form
                                className="form-bookmark meal-plan-validation"
                                id="frm-modal-price-range"
                                novalidate=""
                              >
                                <div className="row g-2">
                                  <div className="mb-3 col-md-12 mt-0">
                                    <div className="row">
                                      <div className="col-sm-4">
                                        <label htmlFor="con-name">
                                          Start range
                                        </label>
                                        <input
                                          className="form-control"
                                          id="txt-start-range-1"
                                          type="number"
                                          required=""
                                          value="750"
                                          placeholder="Name"
                                          autoComplete="off"
                                          disabled=""
                                        />
                                        <div className="invalid-feedback">
                                          Please enter valid name.
                                        </div>
                                      </div>
                                      <div className="col-sm-4">
                                        <label htmlFor="con-name">
                                          End range
                                        </label>
                                        <input
                                          className="form-control"
                                          id="txt-end-range-1"
                                          type="number"
                                          value="1000"
                                          required=""
                                          placeholder="Quantity"
                                          autoComplete="off"
                                          disabled=""
                                        />
                                        <div className="invalid-feedback">
                                          Please enter valid quantity.
                                        </div>
                                      </div>
                                      <div className="col-sm-4">
                                        <label htmlFor="con-name">Price</label>
                                        <input
                                          className="form-control"
                                          id="txt-price-range-1"
                                          type="number"
                                          value="0"
                                          required=""
                                          placeholder="Quantity"
                                          autoComplete="off"
                                        />
                                        <div className="invalid-feedback">
                                          Please enter valid quantity.
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row g-2">
                                  <div className="mb-3 col-md-12 mt-0">
                                    <div className="row">
                                      <div className="col-sm-4">
                                        <input
                                          className="form-control"
                                          id="txt-start-range-2"
                                          type="number"
                                          required=""
                                          value="1001"
                                          placeholder="Name"
                                          autoComplete="off"
                                          disabled=""
                                        />
                                        <div className="invalid-feedback">
                                          Please enter valid name.
                                        </div>
                                      </div>
                                      <div className="col-sm-4">
                                        <input
                                          className="form-control"
                                          id="txt-end-range-2"
                                          type="number"
                                          value="1250"
                                          required=""
                                          placeholder="Quantity"
                                          autoComplete="off"
                                          disabled=""
                                        />
                                        <div className="invalid-feedback">
                                          Please enter valid quantity.
                                        </div>
                                      </div>
                                      <div className="col-sm-4">
                                        <input
                                          className="form-control"
                                          id="txt-price-range-2"
                                          type="number"
                                          value="0"
                                          required=""
                                          placeholder="Quantity"
                                          autoComplete="off"
                                        />
                                        <div className="invalid-feedback">
                                          Please enter valid quantity.
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row g-2">
                                  <div className="mb-3 col-md-12 mt-0">
                                    <div className="row">
                                      <div className="col-sm-4">
                                        <input
                                          className="form-control"
                                          id="txt-start-range-3"
                                          type="number"
                                          required=""
                                          value="1251"
                                          placeholder="Name"
                                          autoComplete="off"
                                          disabled=""
                                        />
                                        <div className="invalid-feedback">
                                          Please enter valid name.
                                        </div>
                                      </div>
                                      <div className="col-sm-4">
                                        <input
                                          className="form-control"
                                          id="txt-end-range-3"
                                          type="number"
                                          value="1500"
                                          required=""
                                          placeholder="Quantity"
                                          autoComplete="off"
                                          disabled=""
                                        />
                                        <div className="invalid-feedback">
                                          Please enter valid quantity.
                                        </div>
                                      </div>
                                      <div className="col-sm-4">
                                        <input
                                          className="form-control"
                                          id="txt-price-range-3"
                                          type="number"
                                          value="0"
                                          required=""
                                          placeholder="Quantity"
                                          autoComplete="off"
                                        />
                                        <div className="invalid-feedback">
                                          Please enter valid quantity.
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row g-2">
                                  <div className="mb-3 col-md-12 mt-0">
                                    <div className="row">
                                      <div className="col-sm-4">
                                        <input
                                          className="form-control"
                                          id="txt-start-range-4"
                                          type="number"
                                          required=""
                                          value="1501"
                                          placeholder="Name"
                                          autoComplete="off"
                                          disabled=""
                                        />
                                        <div className="invalid-feedback">
                                          Please enter valid name.
                                        </div>
                                      </div>
                                      <div className="col-sm-4">
                                        <input
                                          className="form-control"
                                          id="txt-end-range-4"
                                          type="number"
                                          value="2000"
                                          required=""
                                          placeholder="Quantity"
                                          autoComplete="off"
                                          disabled=""
                                        />
                                        <div className="invalid-feedback">
                                          Please enter valid quantity.
                                        </div>
                                      </div>
                                      <div className="col-sm-4">
                                        <input
                                          className="form-control"
                                          id="txt-price-range-4"
                                          type="number"
                                          value="0"
                                          required=""
                                          placeholder="Quantity"
                                          autoComplete="off"
                                        />
                                        <div className="invalid-feedback">
                                          Please enter valid quantity.
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row g-2">
                                  <div className="mb-3 col-md-12 mt-0">
                                    <div className="row">
                                      <div className="col-sm-4">
                                        <input
                                          className="form-control"
                                          id="txt-start-range-5"
                                          type="number"
                                          required=""
                                          value="2001"
                                          placeholder="Name"
                                          autoComplete="off"
                                          disabled=""
                                        />
                                        <div className="invalid-feedback">
                                          Please enter valid name.
                                        </div>
                                      </div>
                                      <div className="col-sm-4">
                                        <input
                                          className="form-control"
                                          id="txt-end-range-5"
                                          type="text"
                                          value=">"
                                          required=""
                                          placeholder="Quantity"
                                          autoComplete="off"
                                          disabled=""
                                        />
                                        <div className="invalid-feedback">
                                          Please enter valid quantity.
                                        </div>
                                      </div>
                                      <div className="col-sm-4">
                                        <input
                                          className="form-control"
                                          id="txt-price-range-5"
                                          type="number"
                                          value="0"
                                          required=""
                                          placeholder="Quantity"
                                          autoComplete="off"
                                        />
                                        <div className="invalid-feedback">
                                          Please enter valid quantity.
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  id="btnSaveMealPlan"
                                  className="btn btn-primary pull-right"
                                  type="button"
                                  onClick={handleClose}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleClose}
                                  id="btnCancelMealPlan"
                                  className="btn btn-secondary"
                                  type="button"
                                  data-bs-dismiss="modal"
                                >
                                  Cancel
                                </button>
                              </form>
                            </div>
                          </Modal.Body>
                        </Modal>
                      </div>
                      <Modal
                        show={showCunsumtion}
                        onHide={handleCloseCunsumtion}
                      >
                        <ModalBody>
                          <div>
                            <form
                              className="form-bookmark meal-plan-validation"
                              id="frm-modal-price-range"
                              novalidate=""
                            >
                              <div className="row g-2">
                                <div className="mb-3 col-md-12 mt-0">
                                  <div
                                    className="row"
                                    id="dv-consumption-slots"
                                  >
                                    <div className="col-sm-4">
                                      <label htmlFor="con-name">
                                        Breakfast (Self)
                                      </label>
                                      <input
                                        className="form-control"
                                        id="txt-consumption-1"
                                        type="number"
                                        value="0"
                                        required=""
                                        placeholder="Quantity"
                                        autoComplete="off"
                                      />
                                      <div className="invalid-feedback">
                                        Please enter valid consumption.
                                      </div>
                                    </div>
                                    <div className="col-sm-4">
                                      <label htmlFor="con-name">
                                        AM Snack (Self)
                                      </label>
                                      <input
                                        className="form-control"
                                        id="txt-consumption-2"
                                        type="number"
                                        value="0"
                                        required=""
                                        placeholder="Quantity"
                                        autoComplete="off"
                                      />
                                      <div className="invalid-feedback">
                                        Please enter valid consumption.
                                      </div>
                                    </div>
                                    <div className="col-sm-4">
                                      <label htmlFor="con-name">
                                        Lunch (Self)
                                      </label>
                                      <input
                                        className="form-control"
                                        id="txt-consumption-3"
                                        type="number"
                                        value="0"
                                        required=""
                                        placeholder="Quantity"
                                        autoComplete="off"
                                      />
                                      <div className="invalid-feedback">
                                        Please enter valid consumption.
                                      </div>
                                    </div>
                                    <div className="col-sm-4">
                                      <label htmlFor="con-name">
                                        PM Snack (Self)
                                      </label>
                                      <input
                                        className="form-control"
                                        id="txt-consumption-4"
                                        type="number"
                                        value="0"
                                        required=""
                                        placeholder="Quantity"
                                        autoComplete="off"
                                      />
                                      <div className="invalid-feedback">
                                        Please enter valid consumption.
                                      </div>
                                    </div>
                                    <div className="col-sm-4">
                                      <label htmlFor="con-name">
                                        Dinner (Self)
                                      </label>
                                      <input
                                        className="form-control"
                                        id="txt-consumption-5"
                                        type="number"
                                        value="0"
                                        required=""
                                        placeholder="Quantity"
                                        autoComplete="off"
                                      />
                                      <div className="invalid-feedback">
                                        Please enter valid consumption.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <button
                                id="btnSaveConsumption"
                                className="btn btn-primary pull-right"
                                type="button"
                                onClick={handleCloseCunsumtion}
                              >
                                Save
                              </button>
                              <button
                                id="btnCancelConsumption"
                                className="btn btn-secondary"
                                type="button"
                                data-bs-dismiss="modal"
                                onClick={handleCloseCunsumtion}
                              >
                                Cancel
                              </button>
                            </form>
                          </div>
                        </ModalBody>{" "}
                      </Modal>
                    </div>
                  </div>
                  <div className="mb-3 col-md-12 mt-0">
                    <label htmlFor="con-name">Description</label>
                    <textarea
                      className="form-control"
                      id="txt-description"
                      type="text"
                      required
                      rows="3"
                      placeholder="Description"
                      autoComplete="off"
                      name="description"
                      value={mealplanDetails.description}
                      onChange={handleInput}
                    />
                    <div className="invalid-feedback">
                      Please enter valid description about meal plan.
                    </div>
                  </div>
                </div>
                <button
                  id="btnSaveMealPlan"
                  className="btn btn-primary pull-right"
                  type="submit"
                >
                  Save
                </button>
                <button
                  id="btnCancelMealPlan"
                  className="btn btn-secondary"
                  type="button"
                  data-bs-dismiss="modal"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </Form>
            </div>
          </Modal>
        </div>
        <ToastContainer />
      </BodyContainer>
    </AccountLayout>
  );
}
