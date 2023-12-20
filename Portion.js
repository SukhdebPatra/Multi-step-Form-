import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { portionsUrl } from '../../assets/Api/api';
import axios from '../../assets/axios/axios';
import AccountLayout from '../../layout/account-layout/AccountLayout';
import BodyContainer from '../../layout/body-container/BodyContainer';
import BodyHeader from '../../layout/body-header/BodyHeader'

export default function () {
    const user = JSON.parse(window.localStorage.getItem("user"))
    const store = JSON.parse(window.localStorage.getItem("store"))

    const pdata = {
        storesId: store.id,
        pageNo: 1,
        pageSize: 5,
        fromDate: '',
        toDate: '',
        portionCode: '',
        portionName: '',
        status: ''
    }

    const portionData = {
        storesId: store.id,
        portionCode: '',
        portionName: '',
        snackCode: '',
        calories: '',
        description: '',
        status: '1'
    }

    const [modal, setModal] = useState(false)
    const [loader, setLoader] = useState(false)
    const [search, setSearch] = useState(false)
    const [postData, setPostData] = useState(pdata);
    const [edit, setEdit] = useState(false)
    const [validated, setValidated] = useState(false)
    const [portions, setPortions] = useState()
    const [selectedportion, setSelectedPortion] = useState()
    const [portionDetails, setPortionDetails] = useState(portionData)

    const toogle = () => setModal(!modal)

    const getData = (data) => {
        setLoader(true)
        axios.post(`${portionsUrl}/GetPortionsByIdOnFilter`, data)
            .then(response => {
                console.log(response);
                setPortions(response.data.data)
                setLoader(false)
            })
            .catch(error => {
                console.log(error);
                setLoader(false)
            })
    }

    useEffect(() => {
        getData(postData)
    }, [])

    const getPotionDetails = (id) => {
        setLoader(true)
        axios.get(`${portionsUrl}/GetPortions/${id}`)
            .then(response => {
                console.log(response);
                setSelectedPortion(response.data.data)
                setLoader(false)
            })
            .catch(error => {
                console.log(error);
                setLoader(false)
            })
    }

    const handleInput = (e) => {
        setPortionDetails({
            ...portionDetails,
            [e.target.name]: e.target.value
        })
    }

    const addPortion = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = portionDetails
        data.status = portionDetails.status == 1 ? true : false
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            console.log(data);
            if (found) {
                toast.info("Portion already exist.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
            } else {
                setLoader(true)
                axios.post(`${portionsUrl}/AddPortions`, data)
                    .then(response => {
                        console.log(response);
                        getData(postData)
                        closeModal()
                        toast.info(response.data.message, {
                            position: toast.POSITION.TOP_RIGHT,
                            hideProgressBar: true,
                            autoClose: 3000
                        })
                    })
                    .catch(error => {
                        console.log(error.response);
                    })
            }
        }
        setValidated(true)
    }

    const editPortion = () => {
        setEdit(true)
        let data = portionDetails
        data.portionName = selectedportion.portionName
        data.portionCode = selectedportion.portionCode
        data.calories = selectedportion.calories
        data.snackCode = selectedportion.snackCode
        data.description = selectedportion.description
        data.status = selectedportion.status ? '1' : '0'
        toogle()
    }

    const updatePortion = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = portionDetails
        data.id = selectedportion.id
        data.status = portionDetails.status == 1 ? true : false
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            console.log(data);
            if (found) {
                toast.info("Portion already exist.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
            } else {
                setLoader(true)
                axios.put(`${portionsUrl}/UpdatePortions`, data)
                    .then(response => {
                        console.log(response);
                        getData(postData)
                        closeModal()
                        getPotionDetails(response.data.data.id)
                        toast.info(response.data.message, {
                            position: toast.POSITION.TOP_RIGHT,
                            hideProgressBar: true,
                            autoClose: 3000
                        })
                    })
                    .catch(error => {
                        console.log(error.response);
                    })
            }
        }
        setValidated(true)
    }

    const closeModal = () => {
        toogle()
        setEdit(false)
        setPortionDetails(portionData)
        setValidated(false)
    }

    const next = () => {
        if (portions.pageNo < portions.totalPages) {
            const page = postData
            page.pageNo = portions.pageNo + 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }

    const previous = () => {
        if (portions.pageNo > 1) {
            const page = postData
            page.pageNo = portions.pageNo - 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }

    const portionByFilter = () => {
        getData(postData)
    }

    const clearFilter = () => {
        getData(pdata)
        setPostData(pdata)
    }

    const handleSearch = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value
        })
        console.log("clicked");
    }

    return (
        <AccountLayout title="Portion" loader={loader}>
            <BodyContainer>
                <div class="card mb-0">
                    <div className="card-header">
                        <BodyHeader toogle={toogle} search={search} setSearch={setSearch} addBtn={true} />
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="card" id="dvQuickSearch" style={{ display: `${search ? "block" : "none"}` }}>
                                    <div class="card-body">
                                        <form id="frm-portion-search">
                                            <div class="mb-3 col-md-12 my-0">
                                                <div class="row">
                                                    {/* <!--<div class="col-sm-3">
                                                        <label for="con-mail">From</label>
                                                        <input class="form-control" id="txt-Search-FromDate" type="date" required=""
                                                                autocomplete="off">
                                                    </div>
                                                    <div class="col-sm-3">
                                                        <label for="con-mail">To</label>
                                                        <input class="form-control" id="txt-Search-ToDate" type="date" required=""
                                                                autocomplete="off">
                                                    </div>--> */}
                                                    <div class="col-sm-2">
                                                        <label for="con-mail">Portion Code</label>
                                                        <input class="form-control" id="txt-Search-Code" type="text" required="" autocomplete="off" name='portionCode' value={postData.portionCode} onChange={handleSearch} />
                                                    </div>
                                                    <div class="col-sm-3">
                                                        <label for="con-mail">Portion Name</label>
                                                        <input class="form-control" id="txt-Search-Name" type="text" required="" autocomplete="off" name='portionName' value={postData.portionName} onChange={handleSearch} />
                                                    </div>
                                                    <div class="col-sm-2">
                                                        <label for="con-phone">Status</label>
                                                        <select id="ddl-Search-Status" class="form-control" name='status' value={postData.status} onChange={handleSearch}>
                                                            <option value="" selected>Select</option>
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
                                                        <button type="button" id="btnCloseFilter" class="btn btn-outline-primary" onClick={() => { setSearch(false); setPostData(pdata) }}>
                                                            Close
                                                        </button>
                                                    </div>
                                                    <div class="col-sm-3">
                                                        <label for="">&nbsp;</label>
                                                        <br />
                                                        <button type="button" id="btnFilter" class="btn btn-outline-primary me-1" onClick={portionByFilter}>
                                                            Search
                                                        </button>
                                                        <button type="button" id="btnClearFilter" class="btn btn-outline-primary" onClick={clearFilter}>
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
                                            <div class="card-body p-0">
                                                <div id="div-not-found" class="row" style={{ display: `${portions ? portions.portions.length < 1 ? "" : "none" : "none"}` }}>
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
                                                        <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                                                            aria-orientation="vertical">
                                                            <div id="div-portions">
                                                                {portions && portions.portions.map(portion => {
                                                                    return (
                                                                        <Link to="#" id="portion-1" class="nav-link" onClick={() => getPotionDetails(portion.id)}>
                                                                            <div class="media">
                                                                                <div class="media-body"><h6> <span class="first_name_0">{portion.portionName}</span></h6>
                                                                                </div>
                                                                            </div>
                                                                        </Link>
                                                                    )
                                                                })}
                                                            </div>
                                                            <div class="dataTables_info">
                                                                <ul class="pagination justify-content-center pagination-primary">
                                                                    <li class="page-item"><Link to="#" id="btnPrevious" class="page-link" onClick={previous}>Previous</Link></li>
                                                                    <li class="page-item"><Link to="#" id="btnNext" class="page-link" onClick={next}>Next</Link></li>
                                                                </ul>
                                                                <div class="mt-3">
                                                                    Showing <span id="spn-pageNo">{portions && portions.pageNo}</span> of <span id="spn-totalPages">{portions && portions.totalPages}</span> pages
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-xl-8 xl-70 col-md-7">
                                                        <div class="tab-content" id="v-pills-tabContent">
                                                            <div class="tab-pane contact-tab-0 tab-content-child fade show active"
                                                                id="div-portion-details" role="tabpanel" aria-labelledby="v-pills-user-tab" style={{ display: `${selectedportion ? "" : "none"}` }}>
                                                                <div class="profile-mail">
                                                                    <div class="media">
                                                                        {/* <!--<img class="img-100 img-fluid m-r-20 rounded-circle update_img_0"
                                                                                             src="../assets/images/user/2.png" alt="">
                                                                                        <input class="updateimg" type="file" name="img" onchange="readURL(this,0)">--> */}
                                                                        <div class="media-body mt-0">
                                                                            <h5><span class="first_name_0" id="spn-labelName">{selectedportion && selectedportion.portionName}</span></h5>
                                                                            {/* <!--<p class="email_add_0" id="spn-labelDescription"></p>--> */}
                                                                            <ul>
                                                                                <li>
                                                                                    <Link id="txtDetails" to="#">Details</Link>
                                                                                </li>
                                                                                <li class="checkPermission">
                                                                                    <Link to="#" id="btnEdit" onClick={editPortion}>Edit</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    <div class="email-general">
                                                                        <div id="dvDetails">
                                                                            <h6 class="mb-3">General details</h6>
                                                                            <ul>
                                                                                <li>Code <span id="spn-code" class="font-primary first_name_0">{selectedportion && selectedportion.portionCode}</span></li>
                                                                                <li>Name <span id="spn-name" class="font-primary first_name_0">{selectedportion && selectedportion.portionName}</span></li>
                                                                                <li>Calories <span id="spn-calories" class="font-primary">{selectedportion && selectedportion.calories}</span></li>
                                                                                <li>Snack code<span id="spn-snackCode" class="font-primary personality_0">{selectedportion && selectedportion.snackCode}</span></li>
                                                                                <li>Status<span id="spn-status" class="badge badge-primary">{selectedportion && selectedportion.status ? 'Active' : 'Inactive'}</span></li>
                                                                                {/* <!--<li>Total customer<span id="spn-name" class="font-primary city_0"></span></li>--> */}
                                                                                <li>Description</li>
                                                                            </ul>
                                                                            <div class="row mt-3">
                                                                                <div class="col-md-12">
                                                                                    <p class="font-primary" style={{ fontWeight: "bold" }}><span id="spn-description">{selectedportion && selectedportion.description}</span></p>
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
                <Modal show={modal} size="lg" onHide={toogle} backdrop="static" keyboard={false} >
                    <div class="modal-body">
                        {/* <form class="form-bookmark portion-validation" id="frm-portion" novalidate="" onsubmit="return false"> */}
                        <Form noValidate validated={validated} onSubmit={edit ? updatePortion : addPortion} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                            <div class="row g-2">
                                <div class="mb-3 col-md-12 mt-0">
                                    <div class="row">
                                        <div class="col-sm-4">
                                            <label for="con-phone">Portion code</label>
                                            <input class="form-control" id="txtCode" type="text" required autocomplete="off" name='portionCode' value={portionDetails.portionCode} onChange={handleInput} />
                                            <div class="invalid-feedback">Please enter valid portion code.</div>
                                        </div>
                                        <div class="col-sm-4">
                                            <label for="con-name">Portion name</label>
                                            <input class="form-control" id="txtName" type="text" required autocomplete="off" name='portionName' value={portionDetails.portionName} onChange={handleInput} />
                                            <div class="invalid-feedback">Please enter valid portion name.</div>
                                        </div>
                                        <div class="col-sm-4">
                                            <label for="con-name">Calories</label>
                                            <input class="form-control" id="txtCalories" type="text" required autocomplete="off" name='calories' value={portionDetails.calories} onChange={handleInput} />
                                            <div class="invalid-feedback">Please enter valid calorie value.</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 col-md-12 my-0">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <label for="con-phone">Snack code</label>
                                            <input class="form-control" id="txtSnackCode" type="text" required autocomplete="off" name='snackCode' value={portionDetails.snackCode} onChange={handleInput} />
                                            <div class="invalid-feedback">Please enter snack code.</div>
                                        </div>
                                        <div class="col-sm-6">
                                            <label for="con-name">Status</label>
                                            <select class="form-control" id="ddlStatus" name='status' value={portionDetails.status} onChange={handleInput}>
                                                <option value="1">Active</option>
                                                <option value="0">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 col-md-12 mt-0">
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <label for="con-name">Portion description</label>
                                            <textarea class="form-control" id="txtDescription" type="text" required rows="3" autocomplete="off" name='description' value={portionDetails.description} onChange={handleInput} />
                                            <div class="invalid-feedback">Please enter valid description about portion.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <input id="index_var" type="hidden" value="5" />
                            <button id="btn-save-modal-portion" class="btn btn-primary pull-right" type="submit">
                                Save
                            </button>
                            <button class="btn btn-secondary" type="button" id="btn-close-modal-portion" onClick={closeModal}>Cancel</button>
                        </Form>
                    </div>
                </Modal>
                <ToastContainer />
            </BodyContainer>
        </AccountLayout>
    );
}
