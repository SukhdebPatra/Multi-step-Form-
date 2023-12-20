import React, { useEffect, useState } from 'react';
import { menusUrl, slotsUrl } from '../../assets/Api/api';
import AccountLayout from '../../layout/account-layout/AccountLayout';
import BodyContainer from '../../layout/body-container/BodyContainer';
import axios from '../../assets/axios/axios';
import BodyHeader from '../../layout/body-header/BodyHeader'
import { Container, Row, Col, Card, CardBody, CardHeader, Button, CardFooter, Table, Input, Label, FormGroup } from 'reactstrap'
import { Link } from 'react-router-dom';
import { Database, ShoppingBag } from 'react-feather';
import { toast } from 'react-toastify';
import { Form, Modal } from 'react-bootstrap';

export default function Slots() {
    const user = JSON.parse(window.localStorage.getItem("user"))
    const store = JSON.parse(window.localStorage.getItem("store"))

    const sdata = {
        storesId: store.id,
        pageNo: 1,
        pageSize: 5,
        fromDate: '',
        toDate: '',
        name: '',
        status: ''
    };
    const [search, setSearch] = useState(false);
    const [loader, setLoader] = useState(false)
    const [slots, setSlots] = useState()
    const [slotsData, setSlotsData] = useState(sdata)
    const [selectedSlot, setSelectedSlot] = useState()
    const [slotSummary, setSlotSummary] = useState()
    const [modal, setModal] = useState(false)
    const [defaultMenu, setDefaultMenu] = useState('')
    const [tab, setTab] = useState("1")
    const [menusBySearch, setMenusBySearch] = useState([])
    const [edit, setEdit] = useState(false)
    const [validated, setValidated] = useState(false)
    const [slotDetails, setSlotDetails] = useState({
        storesId: store.id,
        name: '',
        MenusId: '',
        description: '',
        status: '1',
    })

    const toogle = () => setModal(!modal)

    const getData = (data) => {
        setLoader(true)
        axios.post(`${slotsUrl}/GetSlotsByIdOnFilter`, data)
            .then(response => {
                console.log(response);
                setSlots(response.data.data)
                setLoader(false)
            })
            .catch(error => {
                console.log(error.response);
                setLoader(false)
            })
    }
    useEffect(() => {
        axios.get(`${menusUrl}/GetMenusByStoreId/${store.id}`)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
        getData(slotsData)
    }, [])

    const getSlotDetails = (id) => {
        setLoader(true)
        axios.get(`${slotsUrl}/GetSlot/${id}`)
            .then(response => {
                console.log(response);
                setSelectedSlot(response.data.data)
                setDefaultMenu(response.data.data.defaultMenu.menus.name)
                axios.get(`${slotsUrl}/GetSlotsSummary/${store.id}/${response.data.data.id}`)
                    .then(response => {
                        console.log(response);
                        setSlotSummary(response.data)
                        setLoader(false)
                    })
                    .catch(error => {
                        console.log(error.response);
                        setLoader(false)
                    })
            })
            .catch(error => {
                console.log(error);
                setLoader(false)
            })
    }
    const clearFilter = () => {
        getData(sdata)
        setSlotsData(sdata)
        toast.info("Filters cleared", {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: true,
            autoClose: 3000
        })
    }
    const handleFilterInput = (e) => {
        setSlotsData({
            ...slotsData,
            [e.target.name]: e.target.value
        })
        // console.log(filterData);
        // console.log(appointmentData);
    }

    const getSlotsByFilter = () => {
        getData(slotsData)
        setSlotsData(sdata)
    }

    const editSlot = () => {
        let data = slotDetails
        data.description = selectedSlot.description
        data.name = selectedSlot.name
        data.status = selectedSlot.status ? "1" : "0"
        data.MenusId = selectedSlot.defaultMenu.id
        setEdit(true)
        setSlotDetails(data)
        toogle()
    }

    const handleSlotDetails = (e) => {
        setSlotDetails({
            ...slotDetails,
            [e.target.name]: e.target.value
        })
    }

    const getMenusOnSearch = () => {
        let data = {
            storesId: store.id,
            name: defaultMenu
        }
        axios.post(`${menusUrl}/GetMenusOnSearch`, data)
            .then(response => {
                console.log(response);
                setMenusBySearch(response.data.data)
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    const selectDefaultMenu = (menu) => {
        setDefaultMenu(menu.name)
        let details = slotDetails
        slotDetails.MenusId = menu.id
        setSlotDetails(details)
    }

    const closeModal = () => {
        toogle()
        setDefaultMenu('')
        setEdit(false)
        setSlotDetails({
            storesId: store.id,
            name: '',
            MenusId: '',
            description: '',
            status: '',
        })
        setValidated(false)
        setMenusBySearch([])
    }

    const updateSlot = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        const data = slotDetails
        data.id = selectedSlot.id
        data.status = selectedSlot.status == 1 ? true : false
        if (form.checkValidity() === false) {
            console.log("validity fails");
        }
        else {
            console.log(data);
            setLoader(true)
            axios.put(`${slotsUrl}/UpdateSlot`, data)
                .then(response => {
                    console.log(response);
                    getData(slotsData)
                    getSlotDetails(response.data.data.id)
                    closeModal()
                })
                .catch(error => {
                    console.log(error.response);
                })
        }
        setValidated(true);

    }

    const addSlot = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        const data = slotDetails
        data.status = selectedSlot && selectedSlot.status == 1 ? true : false
        if (form.checkValidity() === false) {
            console.log("validity fails");
        }
        else {
            console.log(data);
            setLoader(true)
            axios.post(`${slotsUrl}/AddSlot`, data)
                .then(response => {
                    console.log(response);
                    closeModal()
                    getData(slotsData)
                })
                .catch(error => {
                    console.log(error);
                })
        }
        setValidated(true);

    }
    return (
        <AccountLayout title="Slots" loader={loader}>
            <BodyContainer>
                <div className="card-header">
                    <BodyHeader toogle={toogle} search={search} setSearch={setSearch} addBtn={slots && slots.slots.length < 5 ? true : false} />
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="card" id="dvQuickSearch" style={{ display: `${search ? "block" : "none"}` }}>
                                <div class="card-body">
                                    <form id="frm-slot-search">
                                        <div class="mb-3 col-md-12 my-0">
                                            <div class="row">
                                                <div class="col-sm-3">
                                                    <label for="con-mail">From</label>
                                                    <input className="form-control" id="dtSearchFromDate" type="date" required="" value={slotsData.fromDate} name="fromDate" onChange={handleFilterInput} autocomplete="off" />
                                                </div>
                                                <div class="col-sm-3">
                                                    <label for="con-mail">To</label>
                                                    <input className="form-control" id="dtSearchToDate" type="date" required="" value={slotsData.toDate} name='toDate' onChange={handleFilterInput} autocomplete="off" />
                                                </div>
                                                <div class="col-sm-3">
                                                    <label for="con-mail">Slot</label>
                                                    <div class="input-group">
                                                        <input id="txt-Search-Name" class="form-control" type="text" placeholder="Slot name" value={slotsData.name} name='name' onChange={handleFilterInput} autocomplete="off" />
                                                    </div>
                                                </div>
                                                <div class="col-sm-3">
                                                    <label for="con-phone">Status</label>
                                                    <select className="form-control" id="ddlSearchStatus" value={slotsData.status} name='status' onChange={handleFilterInput}>
                                                        <option value="" selected>Select</option>
                                                        <option value="1">Active</option>
                                                        <option value="0">Inactive</option>
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
                                                    <button type="button" id="btnFilter" class="btn btn-outline-primary me-1" onClick={getSlotsByFilter}>
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
                                    {/* <form id="frm-support-search"> */}
                                    <div className="mb-3 col-md-12 my-0">
                                        <div className="card-body p-0">
                                            <div id="div-not-found" className="row" style={{ display: `${slots ? slots.slots.length < 1 ? "" : "none" : "none"}` }}>
                                                <div className="col-sm-12">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <h5 className="text-center">Data not found</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row list-persons" id="addcon">
                                                <div class="col-xl-4 xl-30 col-md-5">
                                                    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                                                        aria-orientation="vertical">
                                                        <div id="div-slots">
                                                            {slots && slots.slots.map(slot => {
                                                                return (
                                                                    <Link to="#" id="slot-1" title="Breakfast" class="nav-link" onClick={() => getSlotDetails(slot.id)}>
                                                                        <div class="media">
                                                                            <div class="media-body">
                                                                                <h6> <span class="first_name_0">{slot.name}</span></h6>
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                )
                                                            })}
                                                        </div>
                                                        {/* <div class="dataTables_info">
                                                            <ul class="pagination justify-content-center pagination-primary">
                                                                <li class="page-item"><a href="#" id="btnPrevious" class="page-link">Previous</a></li>
                                                                <li class="page-item"><a href="#" id="btnNext" class="page-link">Next</a></li>
                                                            </ul>
                                                            <div class="mt-3">
                                                                Showing <span id="spn-pageNo">0</span> of <span id="spn-totalPages">0</span> pages
                                                            </div>
                                                        </div> */}
                                                    </div>
                                                </div>
                                                <div class="col-xl-8 xl-70 col-md-7">
                                                    <div class="tab-content" id="v-pills-tabContent">
                                                        <div class="tab-pane contact-tab-0 tab-content-child fade show active"
                                                            id="div-slot-details" role="tabpanel" aria-labelledby="v-pills-user-tab" style={{ display: `${selectedSlot ? "" : "none"}` }}>
                                                            <div class="profile-mail">
                                                                <div class="media">
                                                                    <div class="media-body mt-0">
                                                                        <h5><span class="first_name_0" id="spn-lableName">{selectedSlot && selectedSlot.name}</span></h5>
                                                                        <ul>
                                                                            <li><Link id="txtDetails" to="#" onClick={() => setTab("1")}>Details</Link></li>
                                                                            <li class="checkPermission">
                                                                                <Link to="#" id="btnEdit" onClick={editSlot}>Edit</Link>
                                                                            </li>
                                                                            <li><Link id="txtSummary" to="#" onClick={() => setTab("2")}>Slot summary</Link></li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div class="email-general">
                                                                    <div id="dvSummary" style={{ display: `${tab == 2 ? "" : "none"}` }}>
                                                                        {/* <!-- End InvoiceTop--> */}
                                                                        {/* <div class="row">
                                                                            <div class="col-sm-6 col-xl-4 col-lg-6">
                                                                                <div class="card o-hidden">
                                                                                    <div class="bg-primary b-r-4 card-body">
                                                                                        <div class="media static-top-widget">
                                                                                            <div class="align-self-center text-center"><i data-feather="database"></i></div>
                                                                                            <div class="media-body">
                                                                                                <span class="m-0">Total meal plan</span>
                                                                                                <h4 class="mb-0 counter" id="totalMealPlans"></h4><i class="icon-bg" data-feather="database"></i>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-sm-6 col-xl-4 col-lg-6">
                                                                                <div class="card o-hidden">
                                                                                    <div class="bg-secondary b-r-4 card-body">
                                                                                        <div class="media static-top-widget">
                                                                                            <div class="align-self-center text-center"><i data-feather="shopping-bag"></i></div>
                                                                                            <div class="media-body">
                                                                                                <span class="m-0">Offered in meal plan</span>
                                                                                                <h4 class="mb-0 counter" id="totalOffered"></h4><i class="icon-bg" data-feather="shopping-bag"></i>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div> */}
                                                                        <Row>
                                                                            <Col sm="6" xl="4" lg="6">
                                                                                <Card className="o-hidden">
                                                                                    <CardBody className="bg-primary b-r-4 card-body">
                                                                                        <div className="media static-top-widget">
                                                                                            <div className="align-self-center text-center"><Database /></div>
                                                                                            <div className="media-body"><span className="m-0">Total meal plan</span>
                                                                                                <h4 className="mb-0 counter">
                                                                                                    {/* <CountUp end={6659} /> */}
                                                                                                    {slotSummary && slotSummary.mealPlans}
                                                                                                </h4><Database className="icon-bg" />
                                                                                            </div>
                                                                                        </div>
                                                                                    </CardBody>
                                                                                </Card>
                                                                            </Col>
                                                                            <Col sm="6" xl="4" lg="6">
                                                                                <Card className="o-hidden">
                                                                                    <div className="bg-secondary b-r-4 card-body">
                                                                                        <div className="media static-top-widget">
                                                                                            <div className="align-self-center text-center"><ShoppingBag /></div>
                                                                                            <div className="media-body"><span className="m-0">Offered in meal plan</span>
                                                                                                <h4 className="mb-0 counter">
                                                                                                    {/* <CountUp end={9856} /> */}
                                                                                                    {slotSummary && slotSummary.slotSummary}
                                                                                                </h4><ShoppingBag className="icon-bg" />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Card>
                                                                            </Col>
                                                                        </Row>
                                                                        {/* <!-- End Table-->
                                                                        <!-- End InvoiceBot--> */}
                                                                    </div>
                                                                    <div id="dvDetails" style={{ display: `${tab == 1 ? "" : "none"}` }}>
                                                                        <h6 class="mb-3">General details</h6>
                                                                        <ul>
                                                                            <li>Name <span id="spn-name" class="font-primary">{selectedSlot && selectedSlot.name}</span></li>
                                                                            <li>Status<span id="spn-status" class="badge badge-primary">{selectedSlot && selectedSlot.status == 1 ? "Active" : "Inactive"}</span></li>
                                                                            <li>Default menu<span id="spn-default-menu" class="font-primary interest_0">{selectedSlot && selectedSlot.menuName}</span></li>
                                                                            <li>Description</li>
                                                                        </ul>
                                                                        <div class="row mt-3">
                                                                            <div class="col-md-12">
                                                                                <p class="font-primary" style={{ fontWeight: "bold" }}><span id="spn-description">{selectedSlot && selectedSlot.description}</span></p>
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
                                    {/* </form> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={modal} size="md" onHide={toogle} backdrop="static" keyboard={false} >
                    <div class="modal-body">
                        <Form noValidate validated={validated} onSubmit={edit ? updateSlot : addSlot} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                            <div class="row g-2">
                                <div class="mb-3 col-md-12 mt-0">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <label for="con-name">Slot name</label>
                                            <input class="form-control" id="txtName" type="text" required placeholder="Slot name" autocomplete="off" value={slotDetails.name} name='name' onChange={handleSlotDetails} />
                                            <div class="invalid-feedback">Please enter valid slot name.</div>
                                        </div>
                                        <div class="col-sm-6">
                                            <label for="con-phone">Status</label>
                                            <select class="form-control" id="ddlStatus" value={slotDetails.status} name='status' onChange={handleSlotDetails}>
                                                <option value="1">
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
                                        <div class="col-sm-12">
                                            <label for="con-phone">Default menu</label>
                                            <div class="input-group">
                                                <input id="txtMenuSearch" class="form-control" type="text" placeholder="Search menu" required name='MenusId' value={defaultMenu} onChange={(e) => setDefaultMenu(e.target.value)} />
                                                <span id="spnMenuSearch" class="input-group-text" style={{ cursor: "pointer" }} onClick={getMenusOnSearch}><i class="icofont icofont-search-alt-2"> </i></span>
                                                <div class="invalid-feedback">Please enter valid slot name.</div>
                                            </div>
                                            <ul id="ulMenus">
                                                {menusBySearch.map(menu => {
                                                    if (menusBySearch.length > 0) {
                                                        return <li onClick={() => selectDefaultMenu(menu)}><Link to='#'>{menu.name}</Link></li>
                                                    } else {
                                                        return <li><Link to='#'>No result found</Link></li>
                                                    }
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 col-md-12 mt-0">
                                    <label for="con-name">Description</label>
                                    <textarea class="form-control" id="txtDescription" type="text" required rows="3" placeholder="Description" autocomplete="off" value={slotDetails.description} name='description' onChange={handleSlotDetails}></textarea>
                                    <div class="invalid-feedback">Please enter valid description about slot.</div>
                                </div>
                            </div>
                            <button id="btnSaveSlot" class="btn btn-primary pull-right" type="submit">
                                Save
                            </button>
                            <button id="btnCancelSlot" class="btn btn-secondary" type="button" onClick={closeModal}>
                                Cancel
                            </button>
                        </Form>
                    </div>
                </Modal>
            </BodyContainer>
        </AccountLayout>
    );
}
