import React, { useState, useEffect } from 'react';
import AccountLayout from '../../layout/account-layout/AccountLayout';
import { Card, Col, FormGroup, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { Target, Info, CheckCircle, PlusCircle } from 'react-feather';
import { Link } from 'react-router-dom';
import { kitchensUrl, kitchenTypeUrl, kotUrl } from '../../assets/Api/api';
import axios from '../../assets/axios/axios';
import { Modal } from 'react-bootstrap';
import history from '../../assets/history/history';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';

export default function KitchenDashboard() {
    const user = JSON.parse(window.localStorage.getItem("user"))
    const store = JSON.parse(window.localStorage.getItem("store"))

    const [activeTab, setActiveTab] = useState("1")
    const [mealPlans, setMealPlans] = useState([])
    const [allKitchens, setAllKitchens] = useState([])
    const [modal, setModal] = useState(false)
    const [selectedKitchen, setSelectedKitchen] = useState()

    const toogle = () => setModal(!modal)

    const getData = () => {
        axios.get(`${kotUrl}/GetKOTByStoreId/${store.id}`)
            .then(response => {
                console.log(response);
                setMealPlans(response.data.data)
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    useEffect(() => {
        getData()
        axios.get(`${kitchensUrl}/GetKitchensByStoreId/${store.id}`)
            .then(response => {
                console.log(response);
                setAllKitchens(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    const prepareMeal = (id) => {
        const data = {
            id: id
        }
        axios.put(`${kotUrl}/UpdateKOT`, data)
            .then(response => {
                console.log(response);
                getData()
            })
            .catch(error => {
                console.log(error);
            })
    }

    const dispatch = (id) => {
        const data = {
            id: id
        }
        console.log(data);
        axios.put(`${kotUrl}/UpdateKOTReadyToDispatch`, data)
            .then(response => {
                console.log(response);
                console.log("dispatched");
                getData()
                window.sessionStorage.setItem("kotId", id)
                history.push("/vendor/dispatchsummary")
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    const updateStatus = (id) => {
        window.sessionStorage.setItem("kotId", id)
    }

    const gotoKitchen = () => {
        if (selectedKitchen) {
            window.sessionStorage.setItem("kotId", selectedKitchen)
            history.push("/vendor/kot")
        } else {
            toast.error("Please select kitchen.", {
                position: toast.POSITION.TOP_RIGHT,
                hideProgressBar: true,
                autoClose: 3000
            })
        }
    }

    return (
        <AccountLayout title="KOT" loader={false}>
            <Col md="12" className="project-list">
                <Card>
                    <Row>
                        <Col sm="6">
                            <Nav tabs className="border-tab">
                                <NavItem><NavLink className={activeTab === "1" ? "active" : ''} onClick={() => setActiveTab("1")}><Target />Today</NavLink></NavItem>
                                <NavItem><NavLink className={activeTab === "2" ? "active" : ''} onClick={() => setActiveTab("2")}><Info />Doing</NavLink></NavItem>
                                <NavItem><NavLink className={activeTab === "3" ? "active" : ''} onClick={() => setActiveTab("3")}><CheckCircle />Done</NavLink></NavItem>
                            </Nav>
                        </Col>
                        <Col sm="6">
                            <div className="text-right">
                                <FormGroup className="mb-0 mr-0"></FormGroup>
                                <Link className="btn btn-primary" style={{ color: 'white' }} to="#" onClick={toogle}>To be prepare</Link>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>
            <div class="col-sm-12">
                <div class="card">
                    <div class="card-body">
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1" class="fade">
                                <div class="row" id="dv-kot">
                                    {mealPlans.map(plan => {
                                        const x = new Date(Date.parse(moment(new Date()).format("YYYY-MM-DD")));
                                        const y = new Date(Date.parse(plan.preparationDate.split('T')[0]));
                                        if (+x === +y) {
                                            return (
                                                <div class="col-xxl-4 col-lg-6">
                                                    <div class="project-box">
                                                        {plan.status == 2 ? <span class="badge badge-primary">Doing</span> : <span class="badge badge-primary">Done</span>}
                                                        <h6><Link to="/vendor/kotdetails" onClick={() => updateStatus(plan.id)}>KOT - {plan.preparationDate.split('T')[0]}</Link></h6>
                                                        <div class="media">
                                                            <img class="img-30 me-1 rounded-circle" src={`http://infuse.scount.in/${plan.path}`} alt="" data-original-title="" title="" />
                                                            <div class="media-body">
                                                                <p>{plan.kitchens.stores.name} - {plan.kitchens.stores.storeAddress}</p>
                                                            </div>
                                                            <p>{plan.kitchens.stores.description == null ? "" : plan.kitchens.stores.description}</p>
                                                        </div>
                                                        <p>{plan.kitchens.stores.description == null ? "" : plan.kitchens.stores.description}</p>
                                                        <div class="row details">
                                                            <div class="col-6">
                                                                <span>Total Customers </span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.totalCustomers}</div>
                                                            <div class="col-6">
                                                                <span>Total menu item</span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.totalMenuItems}</div>
                                                            <div class="col-6">
                                                                <span>Box to be delivered</span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.boxToBeDelivered}</div>
                                                            <div class="col-6">
                                                                <span>Box delivered</span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.boxDelivered}</div>
                                                            <div class="col-6">
                                                                <span>Undelivered</span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.undelivered}</div>
                                                            <div class="col-6">
                                                                <span>Complimentary</span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.complimentary}</div>
                                                        </div>
                                                        <div class="project-status mt-4">
                                                            {plan.status == 2 ?
                                                                <Link class="btn btn-success m-t-15" to="#" onClick={() => prepareMeal(plan.id)}>Prepared</Link>
                                                                : plan.status == 3 ? <Link class="btn btn-primary" to="#" onClick={() => dispatch(plan.id)}>To be dispatch</Link>
                                                                    : plan.status == 5 || plan.status == 6 || plan.status == 7 ? <Link class="btn btn-info" to="/vendor/delivery-status" onClick={() => updateStatus(plan.id)}>Update status</Link>
                                                                        : <></>}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
                                    {/* <div class="col-xxl-4 col-lg-6">
                                        <div class="project-box">
                                            <span class="badge badge-primary">Done</span>
                                            <h6>
                                                <Link to="/vendor/kotdetails" onClick={() => updateStatus(1)}>KOT - 2022-01-28</Link></h6><div class="media">
                                                <img class="img-30 me-1 rounded-circle" src="http://infuse.scount.in/Documents/Stores/StoreLogo/1/1a1f6031-a424-4398-af1f-bfcc7b99c3c7.png" alt="" data-original-title="" title="" />
                                                <div class="media-body">
                                                    <p>Salaf - bkr</p>
                                                </div>
                                            </div>
                                            <p>Salaf</p>
                                            <div class="row details">
                                                <div class="col-6">
                                                    <span>Total Customers </span>
                                                </div>
                                                <div class="col-6 text-primary">6</div>
                                                <div class="col-6">
                                                    <span>Total menu item</span>
                                                </div>
                                                <div class="col-6 text-primary">11</div>
                                                <div class="col-6">
                                                    <span>Box to be delivered</span>
                                                </div>
                                                <div class="col-6 text-primary">6</div>
                                                <div class="col-6">
                                                    <span>Box delivered</span>
                                                </div>
                                                <div class="col-6 text-primary">7</div>
                                                <div class="col-6">
                                                    <span>Undelivered</span>
                                                </div>
                                                <div class="col-6 text-primary">0</div>
                                                <div class="col-6">
                                                    <span>Complimentary</span>
                                                </div>
                                                <div class="col-6 text-primary">0</div>
                                            </div>
                                            <div class="project-status mt-4">
                                            </div>
                                            <div class="project-status mt-4">
                                                <Link class="btn btn-primary" to="#" onclick="Dispatch(' + value.id + ')">To be dispatch</Link>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </TabPane>
                            <TabPane tabId="2" class="fade">
                                <div class="row" id="dv-doing">
                                    {mealPlans.map(plan => {
                                        if (plan.status == 2) {
                                            return (
                                                <div class="col-xxl-4 col-lg-6">
                                                    <div class="project-box">
                                                        <span class="badge badge-primary">Doing</span>
                                                        <h6><Link to="/vendor/kotdetails" onClick={() => updateStatus(plan.id)}>KOT - {plan.preparationDate.split('T')[0]}</Link></h6>
                                                        <div class="media">
                                                            <img class="img-30 me-1 rounded-circle" src={`http://infuse.scount.in/${plan.path}`} alt="" data-original-title="" title="" />
                                                            <div class="media-body">
                                                                <p>{plan.kitchens.stores.name} - {plan.kitchens.stores.storeAddress}</p>
                                                            </div>
                                                        </div>
                                                        <p>{plan.kitchens.stores.description == null ? "" : plan.kitchens.stores.description}</p>
                                                        <div class="row details">
                                                            <div class="col-6">
                                                                <span>Total Customers </span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.totalCustomers}</div>
                                                            <div class="col-6">
                                                                <span>Total menu item</span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.totalMenuItems}</div>
                                                            <div class="col-6">
                                                                <span>Box to be delivered</span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.boxToBeDelivered}</div>
                                                            <div class="col-6">
                                                                <span>Box delivered</span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.boxDelivered}</div>
                                                            <div class="col-6">
                                                                <span>Undelivered</span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.undelivered}</div>
                                                            <div class="col-6">
                                                                <span>Complimentary</span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.complimentary}</div>
                                                        </div>
                                                        <div class="project-status mt-4">
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </TabPane>
                            <TabPane tabId="3" class="fade">
                                <div class="row" id="dv-done">
                                    {mealPlans.map(plan => {
                                        if (plan.status != 2) {
                                            return (
                                                <div class="col-xxl-4 col-lg-6">
                                                    <div class="project-box">
                                                        <span class="badge badge-primary">Done</span>
                                                        <h6><Link to="/vendor/kotdetails" onClick={() => updateStatus(plan.id)}>KOT - {plan.preparationDate.split('T')[0]}</Link></h6>
                                                        <div class="media">
                                                            <img class="img-30 me-1 rounded-circle" src={`http://infuse.scount.in/${plan.path}`} alt="" data-original-title="" title="" />
                                                            <div class="media-body">
                                                                <p>{plan.kitchens.stores.name} - {plan.kitchens.stores.storeAddress}</p>
                                                            </div>
                                                        </div>
                                                        <p>{plan.kitchens.stores.description == null ? "" : plan.kitchens.stores.description}</p>
                                                        <div class="row details">
                                                            <div class="col-6">
                                                                <span>Total Customers </span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.totalCustomers}</div>
                                                            <div class="col-6">
                                                                <span>Total menu item</span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.totalMenuItems}</div>
                                                            <div class="col-6">
                                                                <span>Box to be delivered</span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.boxToBeDelivered}</div>
                                                            <div class="col-6">
                                                                <span>Box delivered</span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.boxDelivered}</div>
                                                            <div class="col-6">
                                                                <span>Undelivered</span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.undelivered}</div>
                                                            <div class="col-6">
                                                                <span>Complimentary</span>
                                                            </div>
                                                            <div class="col-6 text-primary">{plan.complimentary}</div>
                                                        </div>
                                                        <div class="project-status mt-4">
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            </div>
            <Modal show={modal} size="md" onHide={toogle} backdrop="static" keyboard={false} >
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Select kitchen</h5>
                </div>
                <div class="modal-body">
                    <div class="row g-2">
                        <div class="mb-6 col-md-12 my-0">
                            <div class="row">
                                <div class="col-sm-12">
                                    <label for="con-name">Select Kitchen</label>
                                    <select class="form-control" id="ddlKitchens" onChange={(e) => setSelectedKitchen(e.target.value)}>
                                        <option value="">Select</option>
                                        {allKitchens.map(kitchen => (<option value={kitchen.id}>{kitchen.name}</option>))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <button class="btn btn-secondary pull-left" id="btnCloseModal" type="button" onClick={toogle}>Cancel</button>
                    <button class="btn btn-primary pull-right" type="button" id="btnUpdatePortion" onClick={gotoKitchen}>OK</button>
                </div>
            </Modal>
            <ToastContainer />
        </AccountLayout >
    );
}
