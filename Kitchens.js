import React, { useEffect, useState } from 'react';
import { kitchensUrl, kitchenTypeUrl } from '../../assets/Api/api';
import AccountLayout from '../../layout/account-layout/AccountLayout';
import axios from '../../assets/axios/axios';
import BodyContainer from '../../layout/body-container/BodyContainer';
import BodyHeader from '../../layout/body-header/BodyHeader'
import { Link } from 'react-router-dom';
import { Form, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { Edit, Users } from 'react-feather';

export default function Kitchens() {
    const user = JSON.parse(window.localStorage.getItem("user"))
    const store = JSON.parse(window.localStorage.getItem("store"))

    const ktdata = {
        storesId: store.id,
        name: '',
        status: ''
    };

    const kdata = {
        storesId: store.id,
        pageNo: 1,
        pageSize: 5,
        fromDate: '',
        toDate: '',
        name: '',
        status: ''
    };

    const kdetails = {
        storesId: store.id,
        name: "",
        email: "",
        address: "",
        contactNumber: "",
        kitchenDetails: [],
        kitchenTypeId: "",
        status: true
    }
    const [loader, setLoader] = useState(false)
    const [search, setSearch] = useState(false)
    const [modal, setModal] = useState(false)
    const [modalKitchen, setModalKitchen] = useState(false)
    const [edit, setEdit] = useState(false)
    const [validated, setValidated] = useState(false)
    const [kValidated, setKValidated] = useState(false)
    const [kitchenTypeData, constKitchenTypeData] = useState(ktdata)
    const [kitchenData, setKitchenData] = useState(kdata)
    const [kitchenTypes, setKitchenTypes] = useState()
    const [allKitchenTypes, setAllKitchenTypes] = useState([])
    const [kitchens, setKitchens] = useState()
    const [selectedKitchen, setSelectedKitchen] = useState()
    const [kitchenDetails, setKitchenDetails] = useState(kdetails)
    const [kitchenTypeDetails, setKitchenTypeDetails] = useState({
        storesId: store.id,
        name: '',
        status: "1"
    })

    const toogle = () => setModal(!modal)
    const toogleKitchen = () => setModalKitchen(!modalKitchen)

    const getKitchenTypes = (data) => {
        setLoader(true)
        axios.post(`${kitchenTypeUrl}/GetKitchenTypesByIdOnFilter`, data)
            .then(response => {
                console.log(response);
                setKitchenTypes(response.data.data)
                setLoader(false)
            })
            .catch(error => {
                console.log(error);
                setLoader(false)
            })
    }

    const getKitchens = (data) => {
        setLoader(true)
        axios.post(`${kitchensUrl}/GetKitchensByIdOnFilter`, data)
            .then(response => {
                console.log(response);
                setKitchens(response.data.data)
                setLoader(false)
            })
            .catch(error => {
                console.log(error);
                setLoader(false)
            })
    }

    const getAllKitchenTypes = () => {
        axios.get(`${kitchenTypeUrl}/GetKitchenTypesByStoreId/${store.id}`)
            .then(response => {
                console.log(response);
                setAllKitchenTypes(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getKitchenTypes(kitchenTypeData)
        getKitchens(kitchenData)
        getAllKitchenTypes()
    }, [])

    const getKitchenDetails = (id) => {
        axios.get(`${kitchensUrl}/GetKitchen/${id}`)
            .then(response => {
                console.log(response);
                setSelectedKitchen(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }

    const addKitchenType = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = kitchenTypeDetails
        data.status = kitchenTypeDetails.status == 1 ? true : false
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            console.log(data);
            if (found) {
                toast.info("Kitchen type already exist.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
            } else {
                setLoader(true)
                axios.post(`${kitchenTypeUrl}/AddKitchenType`, data)
                    .then(response => {
                        console.log(response);
                        closeModal()
                        getKitchenTypes(kitchenTypeData)
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
        console.log(found);
        setValidated(true)
    }

    const editKitchenType = (type) => {
        setEdit(true)
        // axios.get(`${kitchenTypeUrl}/GetKitchenType/${id}`)
        //     .then(response => {
        //         console.log(response);
        //         const kType = response.data.data
        const data = kitchenTypeDetails
        data.name = type.name
        data.status = type.status ? "1" : "0"
        data.id = type.id
        console.log(data);
        setKitchenTypeDetails(data)
        // })
        // .catch(error => {
        //     console.log(error);
        // })
        toogle()
    }

    const updateKitchenType = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = kitchenTypeDetails
        data.status = kitchenTypeDetails.status == 1 ? true : false
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            console.log(data);
            if (found) {
                toast.info("Kitchen type already exist.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
            } else {
                setLoader(true)
                axios.put(`${kitchenTypeUrl}/UpdateKitchenType`, data)
                    .then(response => {
                        console.log(response);
                        closeModal()
                        getKitchenTypes(kitchenTypeData)
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
        setValidated(false)
        setKitchenTypeDetails({
            storesId: store.id,
            name: '',
            status: "1"
        })
    }

    const handleInput = (e) => {
        setKitchenDetails({
            ...kitchenDetails,
            [e.target.name]: e.target.value
        })
    }

    const selectKitchenTypes = (e) => {
        let type = []
        let target = e.target.selectedOptions

        for (let i = 0; i < target.length; i++) {
            type.push({
                kitchenTypeId: target[i].value,
                kitchensId: 0,
                status: true,
                storesId: store.id
            });
        }
        setKitchenDetails({ ...kitchenDetails, kitchenDetails: type })
    }

    const addKitchen = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = kitchenDetails
        data.status = kitchenDetails.status == 1 ? true : false
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            console.log(data);
            if (found) {
                toast.info("Kitchen already exist.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
            } else if (kitchenDetails.contactNumber.length != 8) {
                toast.info("Contact number should be of 8 digit.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
            } else {
                setLoader(true)
                axios.post(`${kitchensUrl}/AddKitchen`, data)
                    .then(response => {
                        console.log(response);
                        closeKitchenModal()
                        getKitchens(kitchenData)
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
        setKValidated(true)
    }

    const editKitchen = () => {
        setEdit(true)
        let data = kitchenDetails
        data.name = selectedKitchen.name
        data.contactNumber = selectedKitchen.contactNumber
        data.address = selectedKitchen.address
        data.email = selectedKitchen.email
        data.status = selectedKitchen.status ? "1" : "0"
        data.kitchenDetails = selectedKitchen.kitchenDetails

        toogleKitchen()
    }

    const updateKitchen = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = kitchenDetails
        data.status = kitchenDetails.status == 1 ? true : false
        data.id = selectedKitchen.id

        let arr = []
        kitchenDetails.kitchenDetails.map(kt => {
            arr.push({
                kitchenTypeId: kt.kitchenTypeId,
                kitchensId: kt.kitchensId,
                status: true,
                storesId: store.id
            })
        })
        data.kitchenDetails = arr
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            console.log(data);
            if (found) {
                toast.info("Kitchen already exist.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
            } else if (kitchenDetails.contactNumber.length != 8) {
                toast.info("Contact number should be of 8 digit.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
            } else {
                setLoader(true)
                axios.put(`${kitchensUrl}/UpdateKitchen`, data)
                    .then(response => {
                        console.log(response);
                        closeKitchenModal()
                        getKitchens(kitchenData)
                        getKitchenDetails(response.data.data.id)
                        toast.info(response.data.message, {
                            position: toast.POSITION.TOP_RIGHT,
                            hideProgressBar: true,
                            autoClose: 3000
                        })
                        setLoader(false)
                    })
                    .catch(error => {
                        setLoader(false)
                        console.log(error.response);
                    })
            }
        }
        setKValidated(true)
    }

    const closeKitchenModal = () => {
        toogleKitchen()
        setEdit(false)
        setKValidated(false)
        setKitchenDetails(kdetails)
    }

    const clearFilter = () => {
        getKitchens(kdata)
        setKitchenData(kdata)
    }

    const kitchensByFilter = () => {
        getKitchens(kitchenData)
    }

    const nextTypes = () => {
        if (kitchenTypes.pageNo < kitchenTypes.totalPages) {
            const page = kitchenData
            page.pageNo = kitchenTypes.pageNo + 1
            setKitchenData(page)
            getKitchens(page)
            // console.log(page);
        }
    }

    const previousTypes = () => {
        if (kitchenTypes.pageNo > 1) {
            const page = kitchenData
            page.pageNo = kitchenTypes.pageNo - 1
            setKitchenData(page)
            getKitchens(page)
            // console.log(page);
        }
    }

    const next = () => {
        if (kitchens.pageNo < kitchens.totalPages) {
            const page = kitchenData
            page.pageNo = kitchens.pageNo + 1
            setKitchenData(page)
            getKitchens(page)
            // console.log(page);
        }
    }

    const previous = () => {
        if (kitchens.pageNo > 1) {
            const page = kitchenData
            page.pageNo = kitchens.pageNo - 1
            setKitchenData(page)
            getKitchens(page)
            // console.log(page);
        }
    }

    return (
        <AccountLayout title="Kitchen" loader={loader}>
            <div className="container-fluid">
                <div className="email-wrap bookmark-wrap">
                    <div className="row">
                        <div class="col-xl-3 box-col-6">
                            <div class="email-left-aside">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="email-app-sidebar left-bookmark">
                                            <ul class="nav main-menu contact-options" role="tablist">
                                                <li class="nav-item">
                                                    <button class="badge-light-primary btn-block btn-mail w-100 checkPermission" type="button" id="btnAdd" onClick={toogleKitchen}>
                                                        <Users /> New kitchen
                                                    </button>
                                                </li>
                                                <li class="nav-item"><span class="main-title"> Kitchen type</span></li>
                                                <li>
                                                    <button class="btn btn-category checkPermission" type="button" id="btnNewKitchenType" onClick={toogle}>
                                                        <span class="title"> + Add Kitchen type</span>
                                                    </button>
                                                </li>
                                            </ul>
                                            <ul id="ul-kitchen-types" class="nav main-menu contact-options" role="tablist">
                                                {kitchenTypes && kitchenTypes.kitchenType.map(type => {
                                                    return (
                                                        <li>
                                                            <Link to="#" id="1" data-bs-toggle="pill" style={{ float: "left", paddingRight: "15px" }}>
                                                                <span class="title">{type.name}</span>
                                                            </Link>
                                                            {/* <i  onclick="EditKitchenType(1)"><i class="fas fa-edit"></i></i> */}
                                                            <Edit class="icofont icofont-edit checkPermission" style={{ float: "right", paddingTop: "2px" }} onClick={() => editKitchenType(type)} />
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                            <div class="dataTables_info">
                                                <ul class="pagination justify-content-center pagination-primary">
                                                    <li class="page-item"><Link to="#" id="btn-kitchen-type-Previous" class="page-link" onClick={previousTypes}>Previous</Link></li>
                                                    <li class="page-item"><Link to="#" id="btn-kitchen-type-Next" class="page-link" onClick={nextTypes}>Next</Link></li>
                                                </ul>
                                                <div class="mt-3">
                                                    Showing <span id="spn-kitchen-type-pageNo">{kitchenTypes && kitchenTypes.pageNo}</span> of <span id="spn-kitchen-type-totalPages">{kitchenTypes && kitchenTypes.totalPages}</span> pages
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-9 col-md-12 box-col-12">
                            <div class="email-right-aside bookmark-tabcontent contacts-tabs">
                                <div class="card email-body radius-left">
                                    <div class="ps-0">
                                        <div class="tab-content">
                                            <div class="tab-pane fade active show" id="pills-personal" role="tabpanel" aria-labelledby="pills-personal-tab">
                                                <div class="card mb-0">
                                                    <div className="card-header">
                                                        <BodyHeader toogle={"toogle"} search={search} setSearch={setSearch} />
                                                        <div class="row">
                                                            <div class="col-sm-12">
                                                                <div class="card" id="dvQuickSearch" style={{ display: `${search ? "block" : "none"}` }}>
                                                                    <div class="card-body">
                                                                        <form id="frm-kitchen-search">
                                                                            <div class="mb-3 col-md-12 my-0">
                                                                                <div class="row">
                                                                                    {/* <!--<div class="col-sm-3">
                                                                                        <label for="con-mail">From</label>
                                                                                        <input class="form-control" id="txt-Search-FromDate" type="date" required
                                                                                            autocomplete="off">
                                                                                    </div>
                                                                                    <div class="col-sm-3">
                                                                                        <label for="con-mail">To</label>
                                                                                        <input class="form-control" id="txt-Search-ToDate" type="date" required
                                                                                            autocomplete="off">
                                                                                    </div>--> */}
                                                                                    <div class="col-sm-5">
                                                                                        <label for="con-mail">Name</label>
                                                                                        <input class="form-control" id="txt-Search-Name" type="text" autocomplete="off" value={kitchenData.name} onChange={(e) => setKitchenData({ ...kitchenData, name: e.target.value })} />
                                                                                    </div>
                                                                                    <div class="col-sm-3">
                                                                                        <label for="con-phone">Status</label>
                                                                                        <select id="ddl-Search-Status" class="form-control" value={kitchenData.status} onChange={(e) => setKitchenData({ ...kitchenData, status: e.target.value })}>
                                                                                            <option value="" selected>Select</option>
                                                                                            <option value="true">Active</option>
                                                                                            <option value="false">Inactive</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="mb-3 col-md-12 my-0">
                                                                                <div class="row">
                                                                                    <div class="col-sm-8">
                                                                                        <label for="">&nbsp;</label>
                                                                                        <br />
                                                                                        <button type="button" id="btnCloseFilter" class="btn btn-outline-primary" onClick={() => { setSearch(false); setKitchenData(kdata) }}>
                                                                                            Close
                                                                                        </button>
                                                                                    </div>
                                                                                    <div class="col-sm-4">
                                                                                        <label for="">&nbsp;</label>
                                                                                        <br />
                                                                                        <button type="button" id="btnFilter" class="btn btn-outline-primary me-1" onClick={kitchensByFilter}>
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
                                                                                <div id="div-not-found" class="row" style={{ display: "none" }}>
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
                                                                                            <div id="div-kitchens">
                                                                                                {kitchens && kitchens.kitchens.map(kitchen => {
                                                                                                    return (
                                                                                                        <Link to="#" id="slot-1" title="Breakfast" class="nav-link" onClick={() => getKitchenDetails(kitchen.id)}>
                                                                                                            <div class="media">
                                                                                                                <div class="media-body">
                                                                                                                    <h6> <span class="first_name_0">{kitchen.name}</span></h6>
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
                                                                                                <div class="m-3">
                                                                                                    Showing <span id="spn-pageNo">{kitchens && kitchens.pageNo}</span> of <span id="spn-totalPages">{kitchens && kitchens.totalPages}</span> pages
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="col-xl-8 xl-60 col-md-7">
                                                                                        <div class="tab-content" id="v-pills-tabContent">
                                                                                            <div class="tab-pane contact-tab-0 tab-content-child fade show active"
                                                                                                id="div-kitchen-details" role="tabpanel" aria-labelledby="v-pills-user-tab" style={{ display: `${selectedKitchen ? "" : "none"}` }}>
                                                                                                <div class="profile-mail">
                                                                                                    <div class="media">
                                                                                                        <div class="media-body mt-0">
                                                                                                            <h5><span class="first_name_0" id="spn-labelName">{selectedKitchen && selectedKitchen.name} </span></h5>
                                                                                                            {/* <!--<p class="email_add_0" id="spn-labelEmail"></p>-->*/}
                                                                                                            <ul>
                                                                                                                <li class="checkPermission">
                                                                                                                    <Link to="#" id="btnEdit" onClick={editKitchen}>Edit</Link>
                                                                                                                </li>
                                                                                                                {/* <!--<li>
                                                                                                                    <Link to="#" onclick="printContact(0)" data-bs-toggle="modal"
                                                                                                                    data-bs-target="#printModal">Print</Link>
                                                                                                                </li>--> */}
                                                                                                            </ul>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div class="email-general">
                                                                                                        <h6 class="mb-3">General</h6>
                                                                                                        <ul>
                                                                                                            <li>Name <span id="spn-name" class="font-primary first_name_0">{selectedKitchen && selectedKitchen.name}</span></li>
                                                                                                            <li>Mobile No<span id="spn-number" class="font-primary mobile_num_0">{selectedKitchen && selectedKitchen.contactNumber}</span></li>
                                                                                                            <li>Email Address <span id="spn-email" class="font-primary email_add_0">{selectedKitchen && selectedKitchen.email}</span></li>
                                                                                                            <li>Address<span id="spn-address" class="font-primary url_add_0">{selectedKitchen && selectedKitchen.address}</span></li>
                                                                                                            <li>Status <span id="spn-status" class="badge badge-primary">{selectedKitchen && selectedKitchen ? "Active" : "Inactive"}</span></li>
                                                                                                            <li>Type<span id="div-types" class="font-primary interest_0">
                                                                                                                {selectedKitchen && selectedKitchen.kitchenDetails.map(kot => {
                                                                                                                    if (kot.isDeleted == false) {
                                                                                                                        return <span class="badge badge-success">{kot.name}</span>
                                                                                                                    }
                                                                                                                })}
                                                                                                            </span></li>
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
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={modalKitchen} size="lg" onHide={toogleKitchen} backdrop="static" keyboard={false} >
                <div class="modal-body">
                    <Form noValidate validated={kValidated} onSubmit={edit ? updateKitchen : addKitchen} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                        <div class="row g-2">
                            <div class="mb-3 col-md-12 mt-0">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <label for="con-name">Name</label>
                                        <input class="form-control" id="txtName" type="text" required placeholder="Name" autocomplete="off" name='name' value={kitchenDetails.name} onChange={handleInput} />
                                        <div class="invalid-feedback">Please enter valid name.</div>
                                    </div>
                                    <div class="col-sm-6">
                                        <label for="con-name">Type</label>
                                        <select class="js-example-basic-multiple col-sm-12" id="ddlKitchenType" multiple required onChange={selectKitchenTypes}>
                                            <option value="">Select</option>
                                            {allKitchenTypes.map(type => (<option value={type.id}>{type.name}</option>))}
                                        </select>
                                        <div class="invalid-feedback">Please select valid type.</div>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3 col-md-12 mt-0">
                                <label for="con-mail">Email address</label>
                                <input class="form-control" id="txtEmail" type="text" required autocomplete="off" name='email' value={kitchenDetails.email} onChange={handleInput} />
                                <div class="invalid-feedback">Please select valid email address.</div>
                            </div>
                            <div class="mb-3 col-md-12 my-0">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <label for="con-phone">Contact number</label>
                                        <input class="form-control" id="txtNumber" type="number" required autocomplete="off" name='contactNumber' value={kitchenDetails.contactNumber} onChange={handleInput} />
                                        <div class="invalid-feedback">Please select valid contact number.</div>
                                    </div>
                                    <div class="col-sm-6">
                                        <label for="con-phone">Status</label>
                                        <select class="form-control" id="ddlStatus" name='status' value={kitchenDetails.status} onChange={handleInput}>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3 col-md-12 mt-0">
                                <label for="con-mail">Contact address</label>
                                <textarea class="form-control" id="txtAddress" type="text" required autocomplete="off" name='address' value={kitchenDetails.address} onChange={handleInput} />
                                <div class="invalid-feedback">Please select valid address.</div>
                            </div>
                        </div>
                        <input id="index_var" type="hidden" value="5" />
                        <button class="btn btn-primary pull-right" type="submit">
                            Save
                        </button>
                        <button class="btn btn-secondary" type="button" id="btn-close-modal-kitchen" onClick={closeKitchenModal}>
                            Cancel
                        </button>
                    </Form>
                </div>
            </Modal>
            <Modal show={modal} size="md" onHide={toogle} backdrop="static" keyboard={false} >
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel1">Add Kitchen type</h5>
                    <button class="btn-close" type="button" data-bs-dismiss="modal"
                        aria-label="Close" onClick={closeModal}></button>
                </div>
                <div class="modal-body">
                    <Form noValidate validated={validated} onSubmit={edit ? updateKitchenType : addKitchenType} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                        <div class="row g-2">
                            <div class="mb-3 col-md-12">
                                <input class="form-control" type="text" id="txtKitchenType" required placeholder="Enter type" autocomplete="off" value={kitchenTypeDetails.name} onChange={(e) => setKitchenTypeDetails({ ...kitchenTypeDetails, name: e.target.value })} />
                                <div class="invalid-feedback">Please enter valid kitchen type.</div>
                            </div>
                            <div class="mb-3 col-md-12">
                                <label for="con-phone">Status</label>
                                <select class="form-control" id="ddlKitchenTypeStatus" value={kitchenTypeDetails.status} onChange={(e) => setKitchenTypeDetails({ ...kitchenTypeDetails, status: e.target.value })}>
                                    <option value="1" selected>
                                        Active
                                    </option>
                                    <option value="0">
                                        Inactive
                                    </option>
                                </select>
                            </div>
                        </div>
                        <button class="btn btn-primary pull-right" type="submit">Save</button>
                        <button class="btn btn-secondary" type="button" id="btn-close-modal-kitchen-type" onClick={closeModal}>
                            Cancel
                        </button>
                    </Form>
                </div>
            </Modal>
            <ToastContainer />
        </AccountLayout>
    );
}
{/* <div class="modal fade" id="modal-kitchen-type" tabindex="-1" role="dialog" data-bs-backdrop="static" data-bs-keyboard="false"
         aria-labelledby="exampleModalLabel1" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            </div>
        </div>
    </div> */}




{/* <div class="modal fade modal-bookmark" id="modal-kitchen" tabindex="-1" role="dialog" data-bs-backdrop="static" data-bs-keyboard="false"
                                                             aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                            <div class="modal-dialog modal-lg" role="document">
                                                                <div class="modal-content">
                                                                </div>
                                                            </div>
                                                        </div> */}