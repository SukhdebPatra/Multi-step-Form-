import React, { useEffect, useRef, useState } from 'react'
import AccountLayout from '../../layout/account-layout/AccountLayout'
import BodyContainer from '../../layout/body-container/BodyContainer'
import BodyHeader from '../../layout/body-header/BodyHeader'
import axios from '../../assets/axios/axios';
import { adminUrl, storesWorkingUrl, storeTimingsUrl, storeUrl } from '../../assets/Api/api';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Edit } from 'react-feather';
import StoreHolidays from '../../components/stores/StoreHolidays';
import SmtpDetails from '../../components/stores/SmtpDetails';
import SubscriptionHistory from '../../components/stores/SubscriptionHistory';
import Prefrence from '../../components/stores/Prefrence';
import { Form, Modal } from 'react-bootstrap';
import { Container, Row, Col, Card, CardHeader, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import Timings from '../../components/stores/Timings';
import { toast, ToastContainer } from 'react-toastify';

export default function Stores() {
    const user = JSON.parse(window.localStorage.getItem("user"))
    const store = JSON.parse(window.localStorage.getItem("store"))

    const paginationComponentOptions = {
        rowsPerPageText: 'Show Entries',
        rangeSeparatorText: 'of',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'All',
    };

    const sdata = {
        pageNo: 1,
        pageSize: 5,
        fromDate: '',
        toDate: '',
        name: '',
        vendorsId: user.id,
        storesId: '',
        storeContact: '',
        status: ''
    };

    const storeData = {
        id: '',
        file: '',
        name: '',
        description: '',
        storeContact: '',
        storeEmail: '',
        storeAddress: '',
        status: ''
    }

    const [search, setSearch] = useState(false);
    const [postData, setPostData] = useState(sdata)
    const [tab, setTab] = useState(0)
    const [edit, setEdit] = useState(false)
    const [validated, setValidated] = useState(false)
    const [stores, setStores] = useState()
    const [selectedStore, setSelectedStore] = useState()
    const [storeDetails, setStoreDetails] = useState(storeData)
    const [modal, setModal] = useState(false)
    const [timingsModal, setTimingsModal] = useState(false)
    const [SuccessLeftLineTab, setSuccessLeftLineTab] = useState('1');

    const imageRef = useRef()

    const toogle = () => setModal(!modal)
    const toogletimings = () => setTimingsModal(!timingsModal)

    const getData = (data) => {
        axios.post(`${storeUrl}/GetVendorStoresOnFilter`, data)
            .then(response => {
                console.log(response);
                setStores(response.data.data)
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    useEffect(() => {
        getData(postData)
    }, [])

    const handleInput = (e) => {
        setStoreDetails({
            ...storeDetails,
            [e.target.name]: e.target.value
        })
    }

    const getStoreDetails = (id) => {
        axios.get(`${adminUrl}/GetStore/${id}`)
            .then(response => {
                console.log(response);
                setSelectedStore(response.data.data)
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    const editStore = () => {
        let data = storeDetails
        data.name = selectedStore.name
        data.id = selectedStore.id
        data.status = selectedStore.status ? '1' : '0'
        data.description = selectedStore.description
        data.storeAddress = selectedStore.storeAddress
        data.storeContact = selectedStore.storeContact
        data.storeEmail = selectedStore.storeEmail
        toogle()
    }

    const imageInput = (e) => {
        console.log(e.target.files[0]);
        const File = e.target.files
        var arrValidExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        var Size = Math.round(File[0].size / (1024 * 1024));//Max 2 MB
        if (File.length > 0) {
            if (!arrValidExtensions.includes(File[0].name.toLowerCase().split('.').reverse()[0])) {
                toast.error("Invalid file type.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
                imageRef.current.value = ''
            } else if (Size > 2) {
                toast.error("File size should be less than or equal to 2 MB.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
                imageRef.current.value = ''
            }
            else {
                setStoreDetails({ ...storeDetails, file: e.target.files[0] })
            }
        }
    }

    const updateStore = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = new FormData()
        data.append('id', selectedStore.id);
        data.append('File', storeDetails.file);
        data.append('name', storeDetails.name);
        data.append('description', storeDetails.description);
        data.append('storeContact', storeDetails.storeContact);
        data.append('storeEmail', storeDetails.storeEmail);
        data.append('storeAddress', storeDetails.storeAddress);
        data.append('status', storeDetails.status == 1 ? true : false);
        // const found = allPrograms.find(program => program.name == programDetails.name)
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            axios.put(`${storeUrl}/UpdateStore`, data)
                .then(response => {
                    console.log(response);
                    closeModal()
                    getData(postData)
                    getStoreDetails(response.data.data.id)
                })
                .catch(error => {
                    console.log(error);
                })
        }
        for (var pair of data.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        setValidated(true)
    }

    const closeModal = () => {
        toogle()
        setValidated(false)
        setStoreDetails(storeData)
    }

    const storesByFilter = () => {
        getData(postData)
    }

    const clearFilter = () => {
        getData(sdata)
        setPostData(sdata)
    }

    const handleSearch = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value
        })
    }

    const next = () => {
        if (stores.pageNo < stores.totalPages) {
            const page = postData
            page.pageNo = stores.pageNo + 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }

    const previous = () => {
        if (stores.pageNo > 1) {
            const page = postData
            page.pageNo = stores.pageNo - 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }

    return (
        <AccountLayout title="Stores" loaser={false}>
            <BodyContainer>
                <div className="card-header">
                    <BodyHeader search={search} setSearch={setSearch} />
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="card" id="dvQuickSearch" style={{ display: `${search ? "block" : "none"}` }}>
                                <div class="card-body">
                                    <form id="frm-store-search">
                                        <div class="mb-3 col-md-12 my-0">
                                            <div class="row">
                                                <div class="col-sm-2">
                                                    <label for="con-mail">From</label>
                                                    <input class="form-control" id="txt-Search-FromDate" type="date" required="" autocomplete="off" name='fromDate' value={postData.fromDate} onChange={handleSearch} />
                                                </div>
                                                <div class="col-sm-2">
                                                    <label for="con-mail">To</label>
                                                    <input class="form-control" id="txt-Search-ToDate" type="date" required="" autocomplete="off" name='toDate' value={postData.toDate} onChange={handleSearch} />
                                                </div>
                                                {/* <div class="col-sm-3">
                                                    <div class="form-group">
                                                        <label id="lblStoreSearch">Store name</label>
                                                        <div class="input-group">
                                                            <input id="txtStoreSearch" class="form-control" type="text" placeholder="Search store" aria-label="Name" data-bs-original-title="" title="" />
                                                            <span class="input-group-text" >
                                                                <i class="icofont icofont-search-alt-2">
                                                                </i>
                                                            </span>
                                                        </div>
                                                        <ul id="ulStores"></ul>
                                                        <!--<div class="input-group">
                                                            <input id="txtStoreSearch" type="text" class="form-control icd-input" style="border-radius: 0px" placeholder="Search store">
                                                        </div>
                                                        <ul id="ulStores"></ul>-->
                                                    </div>
                                                </div> */}
                                                <div class="col-sm-2">
                                                    <label for="con-mail">
                                                        Store contact
                                                    </label>
                                                    <input class="form-control" id="txt-Search-StoreContact" type="text" autocomplete="off" name='storeContact' value={postData.storeContact} onChange={handleSearch} />
                                                </div>
                                                <div class="col-sm-2">
                                                    <label for="con-phone">Status</label>
                                                    <select id="ddl-Search-Status" class="form-control" name='status' value={postData.status} onChange={handleSearch}>
                                                        <option value="">Select</option>
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
                                                    <button type="button" id="btnCloseFilter" class="btn btn-outline-primary" onClick={() => setSearch(false)}>
                                                        Close
                                                    </button>
                                                </div>
                                                <div class="col-sm-3">
                                                    <label for="">&nbsp;</label>
                                                    <br />
                                                    <button type="button" id="btnFilter" class="btn btn-outline-primary me-1" onClick={storesByFilter}>
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
                                        <div className="card-body p-0">

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
                                                            <div id="div-stores">
                                                                {stores && stores.stores.map(store => {
                                                                    return (
                                                                        <Link to="#" id="program-1" class="nav-link" onClick={() => { getStoreDetails(store.id); setTab(0) }}>
                                                                            <div class="media">
                                                                                <div class="media-body">
                                                                                    <h6><span class="first_name_0">{store.name}</span></h6>
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
                                                                    Showing <span id="spn-pageNo">{stores && stores.pageNo}</span> of <span id="spn-totalPages">{stores && stores.totalPages}</span> pages
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-xl-8 xl-70 col-md-7">
                                                        <div class="tab-content"
                                                            id="v-pills-tabContent">
                                                            <div class="tab-pane contact-tab-0 tab-content-child fade show active"
                                                                id="div-store-details" role="tabpanel"
                                                                aria-labelledby="v-pills-user-tab" style={{ display: `${selectedStore ? "" : "none"}` }}>
                                                                <div class="profile-mail">
                                                                    <div class="media">
                                                                        <img id="imgLargeLogo" class="img-100 img-fluid m-r-20 rounded-circle update_img_0" src="../assets/images/user/2.png" alt="" />
                                                                        <div class="media-body mt-0">
                                                                            <h5>
                                                                                <span id="spn-labelName" class="first_name_0">{selectedStore && selectedStore.name}</span>
                                                                            </h5>
                                                                            {/* <!--<p id="spn-labelsubscription" class="email_add_0"></p>--> */}
                                                                            <ul>
                                                                                <li>
                                                                                    <Link to="#" id="txtDetails" onClick={() => setTab(0)}>Details</Link>
                                                                                </li>
                                                                                <li class="checkPermission">
                                                                                    <Link id="txtEdit" to="#" onClick={editStore}>Edit</Link>
                                                                                </li>
                                                                                <li class="checkPermission">
                                                                                    <Link id="txtPreference" to="#" onClick={() => setTab(1)}>Preference</Link>
                                                                                </li>
                                                                                <li class="checkPermission">
                                                                                    <Link to="#" id="txtTimings" onClick={toogletimings}>Timing</Link>
                                                                                </li>
                                                                                <li class="">
                                                                                    <Link id="txtHoliday" to="#" onClick={() => setTab(2)}>Holiday</Link>
                                                                                </li>
                                                                                <li>
                                                                                    <Link to="#" id="txtSubHistory" onClick={() => setTab(3)}>
                                                                                        Subscription History
                                                                                    </Link>
                                                                                </li>
                                                                                <li class="checkPermission">
                                                                                    <Link to="#" id="txtSmtpDetails" onClick={() => setTab(4)}>Smtp Details</Link>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    <div class="email-general">
                                                                        {tab == 1 && <Prefrence id={selectedStore.id} />}
                                                                        {tab == 2 && <StoreHolidays id={selectedStore.id} pagination={paginationComponentOptions} />}
                                                                        {tab == 3 && <SubscriptionHistory id={selectedStore.id} />}
                                                                        {tab == 4 && <SmtpDetails id={selectedStore.id} pagination={paginationComponentOptions} />}
                                                                        <div id="dvDetails" style={{ display: `${tab == 0 ? "" : "none"}` }}>
                                                                            <h6 class="mb-3">
                                                                                General
                                                                            </h6>
                                                                            <ul>
                                                                                <li>Name <span id="spn-store-name" class="font-primary first_name_0">{selectedStore && selectedStore.name}</span></li>
                                                                                <li>Subscription <span id="spn-subscription" class="font-primary first_name_0">{selectedStore && selectedStore.storeSubscriptions.subscriptions.name}</span></li>
                                                                                <li>Tenure <span id="spn-tenture" class="font-primary first_name_0">{selectedStore && selectedStore.storeSubscriptions.subscriptions.duration}</span></li>
                                                                                <li>Vendor Name <span id="spn-vendor" class="font-primary first_name_0">{selectedStore && selectedStore.vendors.firstName + " " + selectedStore.vendors.lastName} </span></li>
                                                                                <li>Status <span id="spn-status" class="badge badge-primary">{selectedStore && selectedStore.status ? "Active" : "Inactive"}</span></li>
                                                                                <li>Description</li>
                                                                            </ul>
                                                                            <div class="row mt-3">
                                                                                <div class="col-md-12">
                                                                                    <p class="font-primary" style={{ fontWeight: "bold" }}><span id="spn-store-description">{selectedStore && selectedStore.description}</span></p>
                                                                                </div>
                                                                            </div>
                                                                            <h6 class="mb-3 m-t-15" style={{ display: "none" }}>
                                                                                Store Front URL
                                                                            </h6>
                                                                            <div class="row" style={{ display: "none" }}>
                                                                                <div class="col-md-12">
                                                                                    <Link to="#" onclick="GoToStoreFront()"><span id="spn-url"></span></Link>
                                                                                </div>
                                                                            </div>
                                                                            <h6 class="mb-3 m-t-15" style={{ display: "none" }}>
                                                                                QR Code
                                                                            </h6>
                                                                            <div class="row" style={{ display: "none" }}>
                                                                                <div class="col-md-2">
                                                                                    <div class="clipboaard-container">
                                                                                        <h6 class="border rounded" id="clipboardExample4">
                                                                                            <span style={{ textAlign: "left" }}>
                                                                                                <img id="imgQRcode" class="img-fluid img-50" style={{ width: "135px !important" }} alt="QRcode" />
                                                                                            </span>
                                                                                        </h6>
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
                <Modal show={modal} size="lg" onHide={toogle} backdrop="static" keyboard={false} >
                    <div class="modal-body">
                        <Form noValidate validated={validated} onSubmit={updateStore} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                            <div class="row g-2">
                                <div class="mb-3 col-md-12 mt-0">
                                    <div class="row">
                                        <div class="col-sm-1">
                                            <br />
                                            <img id="imgLogo" class="img-50 img-fluid m-r-20 rounded-circle update_img_0" src="../assets/images/user/2.png" alt="" />
                                        </div>
                                        <div class="col-sm-4">
                                            <label for="con-name">
                                                Store logo
                                            </label>
                                            <input class="form-control" id="MenuImgAttachment" type="file" accept=".jpg, .jpeg, .png" autocomplete="off" ref={imageRef} onChange={imageInput} />
                                        </div>
                                        <div class="col-sm-6">
                                            <label for="con-name">Name</label>
                                            <input class="form-control" id="txtUpdateStoreName" type="text" required placeholder="Store name" autocomplete="off" name='name' value={storeDetails.name} onChange={handleInput} />
                                            <div class="invalid-feedback">Please enter valid name.</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 col-md-12 mt-0">
                                    <div class="row">
                                        <div class="col-sm-4">
                                            <label for="con-name">Email</label>
                                            <input class="form-control" id="txtUpdateStoreEmail" type="email" required autocomplete="off" name='storeEmail' value={storeDetails.storeEmail} onChange={handleInput} />
                                            <div class="invalid-feedback">Please enter email address.</div>
                                        </div>
                                        <div class="col-sm-4">
                                            <label for="con-name">
                                                Contact number
                                            </label>
                                            <input class="form-control" id="txtUpdateStoreNumber" type="number" required autocomplete="off" name='storeContact' value={storeDetails.storeContact} onChange={handleInput} />
                                            <div class="invalid-feedback">Please enter contact number.</div>
                                        </div>
                                        <div class="col-sm-4">
                                            <label for="con-phone">Status</label>
                                            <select class="form-control" id="ddlUpdateStatus" name='status' value={storeDetails.status} onChange={handleInput}>
                                                <option value="1" selected>
                                                    Active
                                                </option>
                                                <option value="0">
                                                    Inactive
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 col-md-12 mt-0">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <label class="form-label" for="exampleFormControlTextarea4">
                                                Store description
                                            </label>
                                            <textarea class="form-control" id="txtUpdateStoreDescription" required rows="3" name='description' value={storeDetails.description} onChange={handleInput} />
                                            <div class="invalid-feedback">Please enter valid store description.</div>
                                        </div>
                                        <div class="col-sm-6">
                                            <label class="form-label" for="exampleFormControlTextarea4">
                                                Store address
                                            </label>
                                            <textarea class="form-control" required id="txtUpdateStoreAddress" rows="3" name='storeAddress' value={storeDetails.storeAddress} onChange={handleInput} />
                                            <div class="invalid-feedback">Please enter valid store address.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <input id="btnUpdateStore" type="hidden" value="5" />
                            <button class="btn btn-primary pull-right" type="submit">
                                Save
                            </button>
                            <button class="btn btn-secondary" type="button" data-bs-dismiss="modal" onClick={closeModal}>
                                Cancel
                            </button>
                        </Form>

                    </div>
                </Modal>
                <Modal show={timingsModal} size="lg" onHide={toogletimings} backdrop="static" keyboard={false} >
                    <Timings id={selectedStore && selectedStore.id} toogle={toogletimings} />
                </Modal>
                <ToastContainer />
            </BodyContainer >
        </AccountLayout >
    )
}
