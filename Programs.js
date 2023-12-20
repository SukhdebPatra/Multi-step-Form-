import React, { useEffect, useRef, useState } from "react";
import AccountLayout from "../../layout/account-layout/AccountLayout";
import { Form, Modal } from "react-bootstrap";
import BodyHeader from "../../layout/body-header/BodyHeader";
import BodyContainer from "../../layout/body-container/BodyContainer";
import { Database, ShoppingBag, UserPlus } from "react-feather";
import axios from "../../assets/axios/axios";
import {
  mealPlanUrl,
  programUrl,
  slotDefaultMenuUrl,
} from "../../assets/Api/api";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Row } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import Upload from "../../components/upload-modal/Upload";
import _ from "lodash";

export default function Programs() {
  const user = JSON.parse(window.localStorage.getItem("user"));
  const store = JSON.parse(window.localStorage.getItem("store"));

  const pdata = {
    pageNo: 1,
    pageSize: 5,
    storeId: store.id,
    name: "",
    status: "",
  };

  const programData = {
    storesId: store.id,
    File: "",
    name: "",
    description: "",
    menuType: "Include",
    status: "1",
  };

  const [search, setSearch] = useState(false);
  const [loader, setLoader] = useState(false);
  const [postData, setPostData] = useState(pdata);
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState("1");
  const [validated, setValidated] = useState(false);
  const [edit, setEdit] = useState(false);
  const [programs, setPrograms] = useState();
  const [allPrograms, setAllPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState();
  const [programSummary, setProgramSummary] = useState();
  const [programMealPlans, setProgramMealPlans] = useState();
  const [allMenus, setAllMenus] = useState([]);
  const [defaultMenus, setDefaultMenu] = useState([]);
  const [availableMenus, setAvailableMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [programDetails, setProgramDetails] = useState(programData);

  const imageRef = useRef();

  const toogle = () => setModal(!modal);

  const getData = (data) => {
    setLoader(true);
    axios
      .post(`${programUrl}/GetProgramsOnFilter`, data)
      .then((response) => {
        console.log(response);
        setPrograms(response.data.data);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };

  const getAllPrograms = () => {
    axios
      .get(`${mealPlanUrl}/GetPrograms/${store.id}`)
      .then((response) => {
        console.log(response);
        setAllPrograms(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getData(postData);

    axios
      .get(`${programUrl}/GetMenus/${store.id}`)
      .then((response) => {
        console.log(response);
        setAllMenus(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    getAllPrograms();
  }, []);

  const getProgramDetails = (id) => {
    setLoader(true);
    axios
      .get(`${programUrl}/GetProgram/${id}`)
      .then((response) => {
        console.log(response);
        setSelectedProgram(response.data.data);
        axios
          .get(`${programUrl}/GetProgramMealPlans/${id}`)
          .then((response) => {
            console.log(response);
            setProgramMealPlans(response.data.data);
            setLoader(false);
          })
          .catch((error) => {
            console.log(error);
          });

        axios
          .get(`${programUrl}/GetProgramSummary/${id}`)
          .then((response) => {
            console.log(response);
            setProgramSummary(response.data.data);
            setLoader(false);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };

  const handleInput = (e) => {
    setProgramDetails({
      ...programDetails,
      [e.target.name]: e.target.value,
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
        setProgramDetails({ ...programDetails, File: e.target.files[0] });
      }
    }
  };

  const selectMenus = (e) => {
    let menus = [];
    let target = e.target.selectedOptions;

    for (let i = 0; i < target.length; i++) {
      menus.push({
        id: target[i].value,
      });
    }
    setSelectedMenu(menus);
  };

  const add = () => {
    let arrDefault = [];
    axios
      .get(`${slotDefaultMenuUrl}/GetSlotDefaultMenuByStoreId/${store.id}`)
      .then((response) => {
        console.log(response);
        if (response.data.data.length > 0) {
          if (response.data.data.length < 5) {
            toast.error(
              "One or more slots are not configured with default menus! Please add default menus to slots to continue.",
              {
                position: toast.POSITION.TOP_RIGHT,
                hideProgressBar: true,
                autoClose: 3000,
              }
            );
          } else {
            allMenus.map((menu) => {
              response.data.data.map((m) => {
                if (menu.id == m.menus.id) {
                  arrDefault.push({
                    id: m.menus.id,
                    name: m.menus.name,
                  });
                }
              });
            });
            toogle();
          }
          const defaultMenus = _.uniqBy(arrDefault, "id");
          const avail = _.differenceBy(allMenus, arrDefault, "id");
          setAvailableMenus(avail);
          setDefaultMenu(defaultMenus);
        } else {
          toast.error(
            "Please add default menus to slots to continue with adding programs.",
            {
              position: toast.POSITION.TOP_RIGHT,
              hideProgressBar: true,
              autoClose: 3000,
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editProgram = () => {
    toogle();
    setEdit(true);
    let data = programDetails;
    data.name = selectedProgram.name;
    data.description = selectedProgram.description;
    data.status = selectedProgram.status;

    let arrDefault = [];
    axios
      .get(`${slotDefaultMenuUrl}/GetSlotDefaultMenuByStoreId/${store.id}`)
      .then((response) => {
        console.log(response);
        allMenus.map((menu) => {
          response.data.data.map((m) => {
            if (menu.id == m.menus.id) {
              arrDefault.push({
                id: m.menus.id,
                name: m.menus.name,
              });
            }
          });
        });
        const defaultMenus = _.uniqBy(arrDefault, "id");
        const avail = _.differenceBy(allMenus, arrDefault, "id");
        setAvailableMenus(avail);
        setDefaultMenu(defaultMenus);
      })
      .catch((error) => {
        console.log(error);
      });

    let arrmenu = [];
    selectedProgram.programMenus.map((menu) => {
      arrmenu.push({
        id: menu.menusId,
      });
    });
    setSelectedMenu(arrmenu);
    // console.log(arrmenu);
  };

  const addProgram = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    let data = new FormData();
    data.append("storesId", programDetails.storesId);
    data.append("name", programDetails.name);
    data.append("File", programDetails.File);
    data.append("description", programDetails.description);
    data.append("menuType", programDetails.menuType);
    data.append("status", programDetails.status == 1 ? true : false);
    selectedMenu.map((menu, i) => {
      data.append(`programMenus[${i}].menusId`, menu.id);
      data.append(
        `programMenus[${i}].status`,
        programDetails.status == 1 ? true : false
      );
    });
    const found = allPrograms.find(
      (program) => program.name == programDetails.name
    );
    if (form.checkValidity() === false) {
      console.log("validity fails");
    } else {
      console.log(data);
      if (found) {
        toast.info("Program name already exist.", {
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: true,
          autoClose: 3000,
        });
      } else {
        setLoader(true);
        axios
          .post(`${programUrl}/AddProgram`, data)
          .then((response) => {
            console.log(response);
            getData(postData);
            closeModal();
            getAllPrograms();
            toast.info(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
              hideProgressBar: true,
              autoClose: 3000,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
      // for (var pair of data.entries()) {
      //     console.log(pair[0] + ', ' + pair[1]);
      // }
    }
    setValidated(true);
  };

  const updateProgram = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    let data = new FormData();
    data.append("storesId", programDetails.storesId);
    data.append("name", programDetails.name);
    data.append("File", programDetails.File);
    data.append("description", programDetails.description);
    data.append("menuType", programDetails.menuType);
    data.append("status", programDetails.status == 1 ? true : false);
    selectedMenu.map((menu, i) => {
      selectedProgram.programMenus.map((me) => {
        if (menu.id == me.menusId) {
          data.append(`programMenus[${i}].id`, me.id);
        }
      });
      data.append(`programMenus[${i}].programsId`, selectedProgram.id);
      data.append(`programMenus[${i}].menusId`, menu.id);
      data.append(
        `programMenus[${i}].status`,
        programDetails.status == 1 ? true : false
      );
    });
    // const found = allIngredients.find(ing => ing.name == data.name)
    const found = allPrograms.find(
      (program) => program.name == programDetails.name
    );
    if (form.checkValidity() === false) {
      console.log("validity fails");
    } else {
      if (found) {
        if (found.name == selectedProgram.name) {
          setLoader(true);
          axios
            .put(`${programUrl}/UpdateProgram`, data)
            .then((response) => {
              console.log(response);
              getData(postData);
              getProgramDetails(response.data.data.id);
              getAllPrograms();
              closeModal();
              toast.info(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
                hideProgressBar: true,
                autoClose: 3000,
              });
            })
            .catch((error) => {
              console.log(error.response);
            });
        } else {
          toast.info("Program name already exist.", {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: true,
            autoClose: 3000,
          });
        }
      } else {
        setLoader(true);
        axios
          .put(`${programUrl}/UpdateProgram`, data)
          .then((response) => {
            console.log(response);
            getData(postData);
            getProgramDetails(response.data.data.id);
            getAllPrograms();
            closeModal();
            toast.info(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
              hideProgressBar: true,
              autoClose: 3000,
            });
          })
          .catch((error) => {
            console.log(error.response);
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
    setProgramDetails(programData);
    setEdit(false);
    setValidated(false);
    setSelectedMenu([]);
  };

  const programsByFilter = () => {
    getData(postData);
  };

  const clearFilter = () => {
    getData(pdata);
    setPostData(pdata);
  };

  const handleSearch = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };

  const next = () => {
    if (programs.pageNo < programs.totalPages) {
      const page = postData;
      page.pageNo = programs.pageNo + 1;
      setPostData(page);
      getData(page);
      // console.log(page);
    }
  };

  const previous = () => {
    if (programs.pageNo > 1) {
      const page = postData;
      page.pageNo = programs.pageNo - 1;
      setPostData(page);
      getData(page);
      // console.log(page);
    }
  };
  return (
    <AccountLayout title="Programs" loader={false}>
      <BodyContainer>
        <div className="card-header">
          <BodyHeader
            toogle={add}
            search={search}
            setSearch={setSearch}
            addBtn={true}
            uploadBtn={true}
          >
            <Upload
              url={programUrl}
              exportPath="/ExportPrograms/"
              importPath="/ImportPrograms"
            />
          </BodyHeader>
          <div class="row">
            <div class="col-sm-12">
              <div
                class="card"
                id="dvQuickSearch"
                style={{ display: `${search ? "block" : "none"}` }}
              >
                <div class="card-body">
                  <form id="frm-programs-search">
                    <div class="mb-3 col-md-12 my-0">
                      <div class="row">
                        <div class="col-sm-4">
                          <label for="con-name">Program name</label>
                          <input
                            class="form-control"
                            id="txt-search-name"
                            type="text"
                            placeholder="Program name"
                            autocomplete="off"
                            name="name"
                            value={postData.name}
                            onChange={handleSearch}
                          />
                        </div>
                        <div class="col-sm-4">
                          <label for="con-phone">Status</label>
                          <select
                            id="ddl-search-status"
                            class="form-control"
                            name="status"
                            value={postData.status}
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
                            onClick={programsByFilter}
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

          <div className="row">
            <div className="col-sm-12">
              <div className="card" id="dvSearch" style={{ display: "block" }}>
                <div className="card-body">
                  <div className="mb-3 col-md-12 my-0">
                    <div className="card-body p-0">
                      <div
                        id="div-not-found"
                        class="row"
                        style={{
                          display: `${
                            programs
                              ? programs.programs.length < 1
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

                      <div class="row list-persons" id="addcon">
                        <div class="col-xl-4 xl-30 col-md-5">
                          <div
                            class="nav flex-column nav-pills"
                            id="v-pills-tab"
                            role="tablist"
                            aria-orientation="vertical"
                          >
                            <div id="div-programs">
                              {programs &&
                                programs.programs.map((program) => {
                                  return (
                                    <Link
                                      to="#"
                                      id="program-1"
                                      class="nav-link"
                                      onClick={() =>
                                        getProgramDetails(program.id)
                                      }
                                    >
                                      <div class="media">
                                        <img
                                          class="img-50 img-fluid m-r-20 rounded-circle update_img_0"
                                          src={`http://infuse.scount.in/${program.path}`}
                                          alt="image"
                                        />
                                        <div class="media-body">
                                          <h6>
                                            <span class="first_name_0">
                                              {program.name}
                                            </span>
                                          </h6>
                                        </div>
                                      </div>
                                    </Link>
                                  );
                                })}
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
                                <span id="spn-pageNo">
                                  {programs && programs.pageNo}
                                </span>{" "}
                                of{" "}
                                <span id="spn-totalPages">
                                  {programs && programs.totalPages}
                                </span>{" "}
                                pages
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          class="col-xl-8 xl-70 col-md-7"
                          style={{
                            display: `${selectedProgram ? "" : "none"}`,
                          }}
                        >
                          <div class="tab-content" id="v-pills-tabContent">
                            <div
                              class="tab-pane contact-tab-0 tab-content-child fade show active"
                              id="div-program-details"
                              role="tabpanel"
                              aria-labelledby="v-pills-user-tab"
                            >
                              <div class="profile-mail">
                                <div class="media">
                                  <img
                                    id="img-program"
                                    class="img-100 img-fluid m-r-20 rounded-circle update_img_0"
                                    src={`http://infuse.scount.in/${selectedProgram?.path}`}
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
                                      <span class="spn-name">
                                        {selectedProgram &&
                                          selectedProgram.name}
                                      </span>
                                    </h5>
                                    {/* <!--<p id="spn-description" class="email_add_6"></p>--> */}
                                    <ul>
                                      <li>
                                        <Link
                                          id="txtDetails"
                                          to="#"
                                          onClick={() => setTab("1")}
                                        >
                                          Details
                                        </Link>
                                      </li>
                                      <li class="checkPermission">
                                        <Link
                                          to="#"
                                          id="btnEditProgram"
                                          onClick={editProgram}
                                        >
                                          Edit
                                        </Link>
                                      </li>
                                      {/* <!--<li><Link id="txtImages" to="#">Images</Link></li>--> */}
                                      <li>
                                        <Link
                                          id="txtHistory"
                                          to="#"
                                          onClick={() => setTab("2")}
                                        >
                                          Summary History
                                        </Link>
                                      </li>
                                      <li>
                                        <Link
                                          id="txtMealPlan"
                                          to="#"
                                          onClick={() => setTab("3")}
                                        >
                                          Meal Plan
                                        </Link>
                                      </li>
                                      {/* <!-- <li><Link to="#">Receipe</Link></li> --> */}
                                      {/* <!-- <li><Link to="#" onclick="printContact(0)" data-bs-toggle="modal" data-bs-target="#printModal">Print</Link></li> --> */}
                                    </ul>
                                  </div>
                                </div>
                                <div class="email-general">
                                  <div
                                    id="dvImages"
                                    style={{ display: "none" }}
                                  >
                                    <div class="mb-3 col-md-12 my-0">
                                      <div class="avatar-showcase">
                                        <div class="avatars">
                                          <div class="avatar ratio">
                                            <img
                                              class="b-r-8 img-80"
                                              src="../assets/images/user/1.jpg"
                                              alt="#"
                                            />
                                          </div>
                                          <div class="avatar ratio">
                                            <img
                                              class="b-r-8 img-80"
                                              src="../assets/images/user/1.jpg"
                                              alt="#"
                                            />
                                          </div>
                                          <div class="avatar ratio">
                                            <img
                                              class="b-r-8 img-80"
                                              src="../assets/images/user/1.jpg"
                                              alt="#"
                                            />
                                          </div>
                                          <div class="avatar ratio">
                                            <img
                                              class="b-r-8 img-80"
                                              src="../assets/images/user/1.jpg"
                                              alt="#"
                                            />
                                          </div>
                                          <div class="avatar ratio">
                                            <img
                                              class="b-r-8 img-80"
                                              src="../assets/images/user/1.jpg"
                                              alt="#"
                                            />
                                          </div>
                                          <div class="avatar ratio">
                                            <img
                                              class="b-r-8 img-80"
                                              src="../assets/images/user/1.jpg"
                                              alt="#"
                                            />
                                          </div>
                                          <div style={{ float: "right" }}>
                                            <div
                                              data-bs-toggle="modal"
                                              data-bs-target="#exampleModal1"
                                              class="btn btn-outline-primary ms-2"
                                            >
                                              <i data-feather="plus"></i>Add new
                                              image
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    id="dvMealPlan"
                                    style={{
                                      display: `${tab == 3 ? "" : "none"}`,
                                    }}
                                  >
                                    <div
                                      class="default-according"
                                      id="accordion"
                                    >
                                      <div id="dv-mealPlans">
                                        <div class="card">
                                          <div
                                            class="card-header"
                                            id="headingOne"
                                            style={{
                                              padding: " 0px !important",
                                            }}
                                          >
                                            <h5 class="mb-0">
                                              <button
                                                class="btn btn-link"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne${key}"
                                                aria-expanded="true"
                                                aria-controls="collapseOne"
                                                data-bs-original-title=""
                                                title=""
                                              >
                                                planName
                                              </button>
                                            </h5>
                                          </div>
                                          <div
                                            class="collapse show"
                                            id="collapseOne${key}"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#accordion"
                                          >
                                            <div class="card-body">
                                              <ul>
                                                <li>
                                                  Total customers{" "}
                                                  <span class="font-primary first_name_0">
                                                    customersCount
                                                  </span>
                                                </li>
                                                <li>
                                                  Total Meals to be deliver{" "}
                                                  <span class="font-primary">
                                                    totalCount
                                                  </span>
                                                </li>
                                                <li>
                                                  Total Meals delivered
                                                  <span class="font-primary">
                                                    deliveredCount
                                                  </span>
                                                </li>
                                                <li>
                                                  Pending meals to be delivered
                                                  <span class="font-primary">
                                                    pendingCount
                                                  </span>
                                                </li>
                                                <li>
                                                  Complimentary meals given
                                                  <span class="font-primary">
                                                    complimentaryCount
                                                  </span>
                                                </li>
                                                <li>
                                                  Freezed Customer
                                                  <span class="font-primary">
                                                    freezedCount
                                                  </span>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    id="dvHistory"
                                    style={{
                                      display: `${tab == 2 ? "" : "none"}`,
                                    }}
                                  >
                                    <Row>
                                      <Col sm="6" xl="3" lg="6">
                                        <Card className="o-hidden">
                                          <CardBody className="bg-primary b-r-4 card-body">
                                            <div className="media static-top-widget">
                                              <div className="align-self-center text-center">
                                                <Database />
                                              </div>
                                              <div className="media-body">
                                                <span className="m-0">
                                                  Meal Plan
                                                </span>
                                                <h4 className="mb-0 counter">
                                                  {/* <CountUp end={6659} /> */}
                                                  {programSummary &&
                                                    programSummary.totalMealPlans}
                                                </h4>
                                                <Database className="icon-bg" />
                                              </div>
                                            </div>
                                          </CardBody>
                                        </Card>
                                      </Col>
                                      <Col sm="6" xl="3" lg="6">
                                        <Card className="o-hidden">
                                          <div className="bg-secondary b-r-4 card-body">
                                            <div className="media static-top-widget">
                                              <div className="align-self-center text-center">
                                                <UserPlus />
                                              </div>
                                              <div className="media-body">
                                                <span className="m-0">
                                                  Customers
                                                </span>
                                                <h4 className="mb-0 counter">
                                                  {/* <CountUp end={9856} /> */}
                                                  {programSummary &&
                                                    programSummary.totalCustomers}
                                                </h4>
                                                <UserPlus className="icon-bg" />
                                              </div>
                                            </div>
                                          </div>
                                        </Card>
                                      </Col>
                                      <Col sm="6" xl="3" lg="6">
                                        <Card className="o-hidden">
                                          <CardBody className="bg-primary b-r-4">
                                            <div className="media static-top-widget">
                                              <div className="align-self-center text-center">
                                                <Database />
                                              </div>
                                              <div className="media-body">
                                                <span className="m-0">
                                                  Orders
                                                </span>
                                                <h4 className="mb-0 counter">
                                                  {/* <CountUp end={893} /> */}
                                                  {programSummary &&
                                                    programSummary.totalOrders}
                                                </h4>
                                                <Database className="icon-bg" />
                                              </div>
                                            </div>
                                          </CardBody>
                                        </Card>
                                      </Col>
                                      <Col sm="6" xl="3" lg="6">
                                        <Card className="o-hidden">
                                          <CardBody className="bg-primary b-r-4">
                                            <div className="media static-top-widget">
                                              <div className="align-self-center text-center">
                                                <ShoppingBag />
                                              </div>
                                              <div className="media-body">
                                                <span className="m-0">
                                                  Collections
                                                </span>
                                                <h4 className="mb-0 counter">
                                                  {/* <CountUp end={4563} /> */}
                                                  {programSummary &&
                                                    programSummary.currencySymbol +
                                                      " " +
                                                      programSummary.totalCollections}
                                                </h4>
                                                <ShoppingBag className="icon-bg" />
                                              </div>
                                            </div>
                                          </CardBody>
                                        </Card>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div
                                    id="dvDetails"
                                    style={{
                                      display: `${tab == 1 ? "" : "none"}`,
                                    }}
                                  >
                                    <h6 class="mb-3">General details</h6>
                                    <ul>
                                      <li>
                                        Name{" "}
                                        <span class="font-primary spn-name">
                                          {selectedProgram &&
                                            selectedProgram.name}
                                        </span>
                                      </li>
                                      <li>
                                        Status
                                        <span
                                          id="spn-status"
                                          class="badge badge-primary"
                                        >
                                          {selectedProgram &&
                                          selectedProgram.status
                                            ? "Active"
                                            : "Inactive"}
                                        </span>
                                      </li>
                                      <li>Description</li>
                                    </ul>
                                    <div class="row mt-3">
                                      <div class="col-md-12">
                                        <p
                                          class="font-primary"
                                          style={{ fontWeight: "bold" }}
                                        >
                                          <span id="spn-description">
                                            {selectedProgram &&
                                              selectedProgram.description}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                    <label>&nbsp;</label>
                                    <div class="row" hidden>
                                      <div class="col-sm-12 col-xl-12">
                                        <div class="card">
                                          <div class="card-header">
                                            <h5>Meal plan</h5>
                                          </div>
                                          <div class="card-body">
                                            <div id="treeBasic">
                                              <ul>
                                                <li>
                                                  Meal plan
                                                  <ul>
                                                    <li data-jstree='{"opened":true}'>
                                                      1M/D
                                                      <ul>
                                                        <li data-jstree='{"opened":false}'>
                                                          Otto Clay
                                                          <ul>
                                                            <li data-jstree='{"selected":false,"type":"file"}'>
                                                              1 week @ 600 Qr -
                                                              Active
                                                            </li>
                                                          </ul>
                                                        </li>
                                                        <li data-jstree='{"opened":true}'>
                                                          Connor Johnston
                                                          <ul>
                                                            <li data-jstree='{"selected":true,"type":"file"}'>
                                                              1 Day @ 200 Qr -
                                                              Inactive
                                                            </li>
                                                          </ul>
                                                        </li>
                                                        <li data-jstree='{"opened":true}'>
                                                          Lacey Hess
                                                          <ul>
                                                            <li data-jstree='{"type":"file"}'>
                                                              3 Month @ 200 Qr -
                                                              Active
                                                            </li>
                                                          </ul>
                                                        </li>
                                                      </ul>
                                                    </li>
                                                    <li data-jstree='{"opened":false}'>
                                                      2M/D
                                                      <ul>
                                                        <li data-jstree='{"opened":false}'>
                                                          Otto Clay
                                                          <ul>
                                                            <li data-jstree='{"selected":false,"type":"file"}'>
                                                              1 week @ 600 Qr -
                                                              Active
                                                            </li>
                                                          </ul>
                                                        </li>
                                                        <li data-jstree='{"opened":true}'>
                                                          Connor Johnston
                                                          <ul>
                                                            <li data-jstree='{"selected":true,"type":"file"}'>
                                                              1 Day @ 200 Qr -
                                                              Inactive
                                                            </li>
                                                          </ul>
                                                        </li>
                                                        <li data-jstree='{"opened":true}'>
                                                          Lacey Hess
                                                          <ul>
                                                            <li data-jstree='{"type":"file"}'>
                                                              3 Month @ 200 Qr -
                                                              Active
                                                            </li>
                                                          </ul>
                                                        </li>
                                                      </ul>
                                                    </li>
                                                  </ul>
                                                </li>
                                                <li data-jstree='{"type":"file"}'>
                                                  End
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
          <div class="modal-body">
            <Form
              noValidate
              validated={validated}
              onSubmit={edit ? updateProgram : addProgram}
              className="form-bookmark enquiry-validation"
              id="frm-modal-add-appointment"
            >
              {/* <form class="form-bookmark program-validation" id="frm-modal-program" novalidate="" onsubmit="return false"> */}
              <div class="row g-2">
                <div class="mb-3 col-md-12 mt-0">
                  <h6> Default Slot Menus</h6>
                  <div id="div-Menus">
                    {defaultMenus.map((menu) => {
                      return (
                        <span class="badge badge-success">{menu.name}</span>
                      );
                    })}
                  </div>
                  <br />
                  <label style={{ color: "red" }}>
                    {" "}
                    Note : The above shown menus will be added to this program
                  </label>
                </div>
                <div class="mb-3 col-md-12 mt-0">
                  <div class="row">
                    <div class="col-sm-4">
                      <label>Choose image</label>
                      <input
                        class="form-control"
                        id="MenuImgAttachment"
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        autocomplete="off"
                        ref={imageRef}
                        onChange={imageInput}
                      />
                    </div>
                    <div class="col-sm-4">
                      <label for="">Program name</label>
                      <input
                        class="form-control"
                        id="txt-program-name"
                        type="text"
                        required
                        placeholder="Program name"
                        name="name"
                        value={programDetails.name}
                        onChange={handleInput}
                      />
                      <div class="invalid-feedback">
                        Please enter valid program name.
                      </div>
                    </div>
                    <div class="col-sm-4">
                      <label for="">Status</label>
                      <select
                        class="form-control"
                        id="ddl-program-status"
                        name="status"
                        value={programDetails.status}
                        onChange={handleInput}
                      >
                        <option value="true" selected>
                          Active
                        </option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="mb-3 col-md-12 mt-0">
                  <div class="row">
                    <div class="col-sm-2">
                      <label for="">Selection type</label>
                      <select
                        class="form-control"
                        id="ddl-menu-type"
                        name="menuType"
                        value={programDetails.menuType}
                        onChange={handleInput}
                      >
                        <option value="Include" selected>
                          Include
                        </option>
                        <option value="Exclude">Exclude</option>
                      </select>
                    </div>
                    <div class="col-sm-10">
                      <label for="">Select menu</label>
                      <select
                        id="ddl-program-menus"
                        class="js-example-basic-multiple col-sm-12"
                        multiple="multiple"
                        required=""
                        onChange={selectMenus}
                      >
                        {availableMenus.map((menu) => {
                          return <option value={menu.id}>{menu.name}</option>;
                        })}
                      </select>
                      <div class="invalid-feedback">
                        Please select valid menus.
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mb-3 col-md-12 mt-0">
                  <div class="row">
                    <div class="col-sm-4">
                      <label>Protein</label>
                      <div class="row align-items-center">
                        <div class="col-sm-3">
                          <input
                            id="txtProteinPerc"
                            class="form-control"
                            type="number"
                            placeholder="%"
                          />
                        </div>
                        <div class="col-sm-1">/</div>
                        <div class="col-sm-4">
                          <input
                            id="txtProteinDivide"
                            class="form-control"
                            type="number"
                            placeholder="divided by"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-4">
                      <label for="">Carbs</label>
                      <div class="row align-items-center">
                        <div class="col-sm-3">
                          <input
                            id="txtCarbsPerc"
                            class="form-control"
                            type="number"
                            placeholder="%"
                          />
                        </div>
                        <div class="col-sm-1">/</div>
                        <div class="col-sm-4">
                          <input
                            id="txtCarbsDivide"
                            class="form-control"
                            type="number"
                            placeholder="divided by"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-4">
                      <label for="">Fat</label>
                      <div class="row align-items-center">
                        <div class="col-sm-3">
                          <input
                            id="txtFatPerc"
                            class="form-control"
                            type="number"
                            placeholder="%"
                          />
                        </div>
                        <div class="col-sm-1">/</div>
                        <div class="col-sm-4">
                          <input
                            id="txtFatDivide"
                            class="form-control"
                            type="number"
                            placeholder="divided by"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mb-3 col-md-12 mt-0">
                  <label for="">Description</label>
                  <textarea
                    class="form-control"
                    id="txt-program-description"
                    type="text"
                    required
                    rows="3"
                    placeholder="Description"
                    autocomplete="off"
                    name="description"
                    value={programDetails.description}
                    onChange={handleInput}
                  />
                  <div class="invalid-feedback">
                    Please enter valid description about program.
                  </div>
                </div>
              </div>
              <button
                id="btnSaveProgram"
                class="btn btn-primary pull-right"
                type="submit"
              >
                Save
              </button>
              <button
                id="btnCancelProgram"
                class="btn btn-secondary"
                type="button"
                data-bs-dismiss="modal"
                onClick={closeModal}
              >
                Cancel
              </button>
            </Form>
          </div>
        </Modal>
        <ToastContainer />
      </BodyContainer>
    </AccountLayout>
  );
}
