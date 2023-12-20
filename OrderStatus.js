import React, { useEffect, useState } from 'react'
import { vendorOrderStatusUrl } from '../../assets/Api/api';
import AccountLayout from '../../layout/account-layout/AccountLayout'
import BodyContainer from '../../layout/body-container/BodyContainer'
import axios from '../../assets/axios/axios';
import BodyHeader from '../../layout/body-header/BodyHeader'
import { Link } from 'react-router-dom';
import { Form, Modal } from 'react-bootstrap';
export default function OrderStatus() {
    const store = JSON.parse(window.localStorage.getItem("store"))

    const odata = {
        pageNo: 1,
        pageSize: 5,
        storesId: store.id,
        fromDate: '',
        toDate: '',
        name: '',
        status: ''
    };

    var orderData = {
        // storesId: store.id,
        name: '',
        status: '1',
    }

    const [search, setSearch] = useState(false);
    const [modal, setModal] = useState(false);
    const [postData, setPostData] = useState(odata)
    const [orderStatus, setOrderStatus] = useState()
    const [selectedOrder, setSelectedOrder] = useState()
    const [validated, setValidated] = useState(false)
    const [edit, setEdit] = useState(false)
    const [orderDetails, setOrderDetails] = useState(orderData)

    const toogle = () => setModal(!modal);

    const getData = (values) => {
        let data = values
        data.status = values.status == 2 ? false : true
        axios.post(`${vendorOrderStatusUrl}/GetOrderStatusByIdOnFilter`, data)
            .then(response => {
                console.log(response);
                setOrderStatus(response.data.data)
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    useEffect(() => {
        getData(postData)
    }, [])

    const getOrderStatusDetails = (id) => {
        axios.get(`${vendorOrderStatusUrl}/GetOrderStatus/${id}`)
            .then(response => {
                console.log(response);
                setSelectedOrder(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }

    const addOrderStatus = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = orderDetails
        data.status = orderDetails.status == 1 ? true : false
        data.storesId = store.id
        console.log(data);
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            axios.post(`${vendorOrderStatusUrl}/AddOrderStatus`, data)
                .then(response => {
                    console.log(response);
                    getData(postData)
                    closeModal()
                })
                .catch(error => {
                    console.log(error.response);
                })
        }
        setValidated(true)
    }

    const editOrderStatus = (id) => {
        setEdit(true)
        let data = orderDetails
        console.log(data);
        data.name = selectedOrder.name
        data.status = selectedOrder.status ? '1' : '2'
        console.log(data);
        setOrderDetails(data)
        toogle()

    }

    const updateOrderStatus = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = orderDetails
        data.status = orderDetails.status == 1 ? true : false
        data.id = selectedOrder.id
        console.log(data);
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            axios.put(`${vendorOrderStatusUrl}/UpdateOrderStatus`, data)
                .then(response => {
                    console.log(response);
                    getData(postData)
                    getOrderStatusDetails(response.data.data.id)
                    closeModal()
                })
                .catch(error => {
                    console.log(error.response);
                })
        }
        setValidated(true)
    }

    const closeModal = () => {
        toogle()
        setValidated(false)
        setOrderDetails(orderData)
    }
    const ordersByFilter = () => {
        getData(postData)
    }

    const clearFilter = () => {
        getData(odata)
        setPostData(odata)
    }

    const next = () => {
        if (orderStatus.pageNo < orderStatus.totalPages) {
            const page = postData
            page.pageNo = orderStatus.pageNo + 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }

    const previous = () => {
        if (orderStatus.pageNo > 1) {
            const page = postData
            page.pageNo = orderStatus.pageNo - 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }
    return (
        <AccountLayout title="Order status" loader={false}>
            <BodyContainer>
                <div className="card-header">
                    <BodyHeader toogle={toogle} search={search} setSearch={setSearch} addBtn={true} />
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card" id="dvSearch" style={{ display: `${search ? "block" : "none"}` }}>
                                <div className="card-body">
                                    <div class="mb-3 col-md-12 my-0">
                                        <form id="frm-orders-search">
                                            <div class="mb-3 col-md-12 my-0">
                                                <div class="row">
                                                    <div class="col-sm-3">
                                                        <label for="con-mail">Name</label>
                                                        <input class="form-control" id="txt-Search-Name" type="text" required="" autocomplete="off" value={postData.name} onChange={(e) => setPostData({ ...postData, name: e.target.value })} />
                                                    </div>
                                                    <div class="col-sm-2">
                                                        <label for="con-phone">Status</label>
                                                        <select id="ddl-Search-Status" class="form-control" name='status' value={postData.status} onChange={(e) => setPostData({ ...postData, status: e.target.value })}>
                                                            <option value="">Select</option>
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
                                                        <button type="button" id="btnCloseFilter" class="btn btn-outline-primary" onClick={() => setSearch(false)}>
                                                            Close
                                                        </button>
                                                    </div>
                                                    <div class="col-sm-3">
                                                        <label for="">&nbsp;</label>
                                                        <br />
                                                        <button type="button" id="btnFilter" class="btn btn-outline-primary me-1" onClick={ordersByFilter}>
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
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card" id="dvSearch">
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
                                                        <div id="div-order-status">
                                                            {orderStatus && orderStatus.orderStatus.map(order => {
                                                                return (
                                                                    <Link to="#" id={`order-${order.id}`} className="nav-link" onClick={() => getOrderStatusDetails(order.id)}>
                                                                        <div className="media">
                                                                            <div className="media-body"><h6>
                                                                                <span className="order_subject_0">{order.name}</span>
                                                                            </h6>
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
                                                                Showing <span id="spn-pageNo">{orderStatus && orderStatus.pageNo}</span> of <span id="spn-totalPages">{orderStatus && orderStatus.totalPages}</span> pages
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xl-8 xl-70 col-md-7">
                                                    <div class="tab-content"
                                                        id="v-pills-tabContent">
                                                        <div id="div-order-status-details" class="tab-pane contact-tab-1 tab-content-child fade active show" role="tabpanel" aria-labelledby="v-pills-user-tab" style={{ display: `${selectedOrder ? "block" : "none"}` }}>
                                                            <div class="profile-mail">
                                                                <div class="media">
                                                                    <div class="media-body mt-0">
                                                                        <h5>
                                                                            <span class="first_name_1" id="spn-lableName">
                                                                                {selectedOrder && selectedOrder.name}
                                                                            </span>
                                                                        </h5>
                                                                        <ul>
                                                                            <li>
                                                                                <Link id="txtDetails" to="#">Details</Link>
                                                                            </li>
                                                                            <li class="checkPermission"><Link to="#" id="btnEdit" onClick={editOrderStatus}>Edit</Link></li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div class="email-general">
                                                                    <div id="dvDetails">
                                                                        <h6 class="mb-3">Order Status details</h6>
                                                                        <ul>
                                                                            <li>Name <span id="spn-name" class="font-primary">{selectedOrder && selectedOrder.name}</span></li>
                                                                            <li>Status<span id="spn-status" class="badge badge-primary">{selectedOrder && selectedOrder.status ? "Active" : "Inactive"}</span></li>
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
                <Modal show={modal} size="lg" onHide={toogle} backdrop="static" keyboard={false} >
                    <div class="modal-body">
                        <Form noValidate validated={validated} onSubmit={edit ? updateOrderStatus : addOrderStatus} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                            <div class="row g-2">
                                <div class="mb-3 col-md-12 mt-0">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <label for="con-name">Name</label>
                                            <input class="form-control" id="txtStatusName" type="text" required autocomplete="off" value={orderDetails.name} onChange={(e) => setOrderDetails({ ...orderDetails, name: e.target.value })} />
                                            <div class="invalid-feedback">Please enter valid name.</div>
                                        </div>
                                        <div class="col-sm-6">
                                            <label for="con-phone">Status</label>
                                            <select class="form-control" id="ddlStatus" value={orderDetails.status} onChange={(e) => setOrderDetails({ ...orderDetails, status: e.target.value })}>
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
                            </div>
                            <input id="index_var" type="hidden" value="5" />
                            <button class="btn btn-primary pull-right" type="submit">
                                Save
                            </button>
                            <button class="btn btn-secondary" id="btn-close-modal-order-status" type="button" data-bs-dismiss="modal" onClick={closeModal}>
                                Cancel
                            </button>
                        </Form>
                    </div>
                </Modal>
            </BodyContainer>
        </AccountLayout>
    )
}
