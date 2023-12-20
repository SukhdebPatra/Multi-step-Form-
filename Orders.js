import React, { useEffect, useState } from 'react'
import { customerOrdersUrl, customersUrl } from '../../assets/Api/api'
import AccountLayout from '../../layout/account-layout/AccountLayout'
import axios from '../../assets/axios/axios'
import BodyContainer from '../../layout/body-container/BodyContainer'
import BodyHeader from '../../layout/body-header/BodyHeader'
import { Link } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { PlusSquare } from 'react-feather'
import DataTable from 'react-data-table-component'
import { FilterComponent } from 'react-data-table-component'
import history from '../../assets/history/history'

export default function Orders() {
    const user = JSON.parse(window.localStorage.getItem("user"))
    const store = JSON.parse(window.localStorage.getItem("store"))

    const orderFilterData = {
        pageNo: 1,
        pageSize: 5,
        fromDate: "",
        toDate: "",
        storeId: store.id,
        transactionNumber: "",
        status: ""
    }

    const columns = [
        {
            name: 'S.No',
            selector: (row, i) => i + 1,
            sortable: true,
            compact: true,
            width: "50px"
        },
        {
            name: 'Customer Name',
            selector: row => row.name,
            sortable: true,
            compact: true
        },
        {
            name: 'Mobile number',
            selector: row => row.mobileNumber,
            sortable: true,
            compact: true
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            compact: true
        },
        // {
        //     name: 'Action',
        //     // selector: row => row.email,
        //     sortable: false,
        // },
        {
            name: 'Action',
            button: true,
            cell: (row, i) => (<Link to="#" className="App">
                <div class="openbtn text-center">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal" onClick={() => setId(row.id)} >
                        Order
                    </button>
                </div>
            </Link>)
        }
    ]

    const paginationComponentOptions = {
        rowsPerPageText: 'Show Entries',
        rangeSeparatorText: 'of',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'All',
    };

    const [search, setSearch] = useState(false);
    const [modal, setModal] = useState(false);
    const [customerModal, setCustomerModal] = useState(false);
    const [postData, setPostData] = useState(orderFilterData)
    const [orders, setOrders] = useState()
    const [tab, setTab] = useState(1)
    const [selectedOrder, setSelectedOrder] = useState()
    const [paymentMode, setPaymentMode] = useState()
    const [cardNumber, setCardNumber] = useState('')
    const [customers, setCustomers] = useState([])
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);

    const filteredItems = customers.filter(
        item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
    );

    const toogle = () => setModal(!modal);
    const toogleCustomer = () => setCustomerModal(!customerModal);

    const getData = (data) => {
        axios.post(`${customerOrdersUrl}/GetCustomerOrdersByIdOnFilter`, data)
            .then(response => {
                console.log(response);
                setOrders(response.data.data)
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    useEffect(() => {
        getData(postData)
    }, [])

    const setId = (id) => {
        console.log(id);
        window.sessionStorage.setItem("custId", id)
        history.push("/vendor/ordermealplan")
    }

    const getOrderDetails = (id) => {
        axios.get(`${customerOrdersUrl}/GetOrder/${id}`)
            .then(response => {
                console.log(response);
                setSelectedOrder(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }

    const makePayment = () => {
        let data = {
            id: selectedOrder.id,
            status: 2
        }
        if (paymentMode) {
            if (paymentMode == 1) {
                console.log("proceed with cash mode", data);
                axios.put(`${customerOrdersUrl}/UpdateOrderStatus`, data)
                    .then(response => {
                        console.log(response);
                        toogle()
                        getOrderDetails(response.data.data.id)
                    })
                    .catch(error => {
                        console.log(error);
                    })
            } else {
                if (cardNumber.length < 16 || cardNumber.length > 16) {
                    alert("card number should be of 16 digit")
                } else {
                    console.log("proceed with card payment", data);
                    axios.put(`${customerOrdersUrl}/UpdateOrderStatus`, data)
                        .then(response => {
                            console.log(response);
                            toogle()
                            getOrderDetails(response.data.data.id)
                        })
                        .catch(error => {
                            console.log(error);
                            axios.put(`${customerOrdersUrl}/UpdateOrderStatus`, data)
                                .then(response => {
                                    console.log(response);

                                })
                        })
                }
            }
        } else {
            alert("select payment mode")
        }
    }

    const getCustomers = () => {
        axios.get(`${customersUrl}/GetVendorCustomers/${user.id}`)
            .then(response => {
                console.log(response);
                setCustomers(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
        toogleCustomer()
    }

    const ordersByFilter = () => {
        getData(postData)
    }

    const clearFilter = () => {
        getData(orderFilterData)
        setPostData(orderFilterData)
    }

    const handleSearch = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value
        })
    }

    const next = () => {
        if (orders.pageNo < orders.totalPages) {
            const page = postData
            page.pageNo = orders.pageNo + 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }

    const previous = () => {
        if (orders.pageNo > 1) {
            const page = postData
            page.pageNo = orders.pageNo - 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }

    // const FilterComponent = ({ filterText, onFilter, onClear }) => (
    //     <>
    //         <input
    //             id="search"
    //             type="text"
    //             placeholder="Filter By Name"
    //             aria-label="Search Input"
    //             value={filterText}
    //             onChange={onFilter}
    //         />
    //         <button type="button" onClick={onClear}>
    //             X
    //         </button>
    //     </>
    // );

    // const subHeaderComponentMemo = React.useMemo(() => {
    //     const handleClear = () => {
    //         if (filterText) {
    //             setResetPaginationToggle(!resetPaginationToggle);
    //             setFilterText('');
    //         }
    //     };

    //     return (
    //         <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
    //     );
    // }, [filterText, resetPaginationToggle]);

    return (
        <AccountLayout title="Orders" loader={false}>
            <BodyContainer>
                <div className="card-header">
                    <BodyHeader toogle={toogle} search={search} setSearch={setSearch} addBtn={false} >
                        <div className="btn btn-primary" id="btnAdd" onClick={getCustomers}>
                            <PlusSquare />New Order
                        </div>
                    </BodyHeader>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card" id="dvSearch" style={{ display: `${search ? "block" : "none"}` }}>
                                <div className="card-body">
                                    <div class="mb-3 col-md-12 my-0">
                                        <form id="frm-orders-search">
                                            <div class="mb-3 col-md-12 my-0">
                                                <div class="row">
                                                    <div class="col-sm-2">
                                                        <label for="con-mail">From</label>
                                                        <input class="form-control" id="txt-Search-FromDate" type="date" required="" autocomplete="off" name='fromDate' onChange={handleSearch} value={postData.fromDate} />
                                                    </div>
                                                    <div class="col-sm-2">
                                                        <label for="con-mail">To</label>
                                                        <input class="form-control" id="txt-Search-ToDate" type="date" required="" autocomplete="off" name='toDate' onChange={handleSearch} value={postData.toDate} />
                                                    </div>
                                                    <div class="col-sm-4">
                                                        <label for="con-mail">
                                                            Customer
                                                        </label>
                                                        <input class="form-control" id="txt-Search-Customer-Number" type="text" autocomplete="off" />
                                                    </div>
                                                    <div class="col-sm-2">
                                                        <label for="con-mail">
                                                            Order number
                                                        </label>
                                                        <input class="form-control" id="txt-Search-Order-Number" type="text" autocomplete="off" name='transactionNumber' onChange={handleSearch} value={postData.transactionNumber} />
                                                    </div>
                                                    <div class="col-sm-2">
                                                        <label for="con-phone">Status</label>
                                                        <select id="ddl-Search-Status" class="form-control" name='status' onChange={handleSearch} value={postData.status}>
                                                            <option value="" selected>Select</option>
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
                                                        <button type="button" id="btnCloseFilter" class="btn btn-outline-primary" onClick={() => { setSearch(false); setPostData(orderFilterData) }}>
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
                            <div className="card" id="dvSearch" style={{ display: "block" }}>
                                <div className="card-body">
                                    {/* <form id="frm-support-search"> */}
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
                                                    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                        <div id="div-orders">
                                                            {orders && orders.customerOrders.map(order => {
                                                                return (
                                                                    <Link to="#" id={`order-${order.id}`} className="nav-link" onClick={() => getOrderDetails(order.id)}>
                                                                        <div className="media">
                                                                            <div className="media-body"><h6>
                                                                                <span className="order_subject_0">{order.transactionNumber}</span>
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
                                                                Showing <span id="spn-pageNo">{orders && orders.pageNo}</span> of <span id="spn-totalPages">{orders && orders.totalPages}</span> pages
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xl-8 xl-70 col-md-7">
                                                    <div class="tab-content" id="v-pills-tabContent">
                                                        <div class="tab-pane contact-tab-0 tab-content-child fade show active" id="div-order-details" role="tabpanel" aria-labelledby="v-pills-user-tab" style={{ display: `${selectedOrder ? "" : "none"}` }}>
                                                            <div class="profile-mail">
                                                                <div class="media">
                                                                    <div class="media-body mt-0">
                                                                        <h5><span class="first_name_0" id="spn-lableName">{selectedOrder && selectedOrder.transactionNumber}</span></h5>
                                                                        <ul>
                                                                            <li><Link id="txtDetails" to="#" onClick={() => setTab(1)}>Details</Link></li>
                                                                            <li><Link id="txtPrint" to="#" onClick={() => setTab(2)}>Print</Link></li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div class="email-general">
                                                                    <div id="dvPrint" style={{ display: `${tab == 2 ? "" : "none"}` }}>
                                                                        <div class="profile-mail">
                                                                            <div class="invoice">
                                                                                <div>
                                                                                    <div class="row">
                                                                                        <div class="col-sm-6">
                                                                                            <div class="media">
                                                                                                <div class="media-left">
                                                                                                    <img id="imgStoreProfilePicture" class="media-object img-60" alt="" src={``} />
                                                                                                </div>
                                                                                                <div class="media-body m-l-20 text-right">
                                                                                                    <h4 class="media-heading" id="h-store">{store.name}</h4>
                                                                                                    <p><span id="spn-email">{store.storeEmail}</span><br /><span id="spn-number">{store.storeContact}</span></p>
                                                                                                </div>
                                                                                            </div>
                                                                                            {/* <!-- End Info--> */}
                                                                                        </div>
                                                                                        <div class="col-sm-6">
                                                                                            <div class="text-md-end text-xs-center">
                                                                                                <h3>Order # <span class="counter" id="spn-transaction-number">{selectedOrder && selectedOrder.transactionNumber}</span></h3>
                                                                                                <p>
                                                                                                    Order date: <span id="spn-orderDate">{selectedOrder && selectedOrder.createdAt.split("T")[0]}</span>
                                                                                                </p>
                                                                                            </div>
                                                                                            {/* <!-- End Title--> */}
                                                                                        </div>
                                                                                    </div>
                                                                                    <hr />
                                                                                    {/* <!-- End InvoiceTop--> */}
                                                                                    <div class="table-responsive invoice-table" id="table">
                                                                                        <table class="table table-bordered table-striped">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td class="item">
                                                                                                        <h6 class="p-2 mb-0"> Name</h6>
                                                                                                    </td>
                                                                                                    <td class="Hours">
                                                                                                        <h6 class="p-2 mb-0">Amount</h6>
                                                                                                    </td>
                                                                                                    <td class="Rate">
                                                                                                        <h6 class="p-2 mb-0">Payment Mode</h6>
                                                                                                    </td>
                                                                                                    <td class="subtotal">
                                                                                                        <h6 class="p-2 mb-0">Total</h6>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td>
                                                                                                        <p class="m-0" id="p-txtPlanName">{selectedOrder && selectedOrder.name}</p>
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <p class="itemtext p-total" id="">{selectedOrder && selectedOrder.totalAmount}</p>
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <p class="itemtext" id="p-card">{"card"}</p>
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <p class="itemtext p-grand-total" id="">{selectedOrder && selectedOrder.grandTotal}</p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td class="Rate">
                                                                                                        <h6 class="mb-0 p-2">Gross</h6>
                                                                                                    </td>
                                                                                                    <td class="payment">
                                                                                                        <h6 class="mb-0 p-2 p-total">{selectedOrder && selectedOrder.totalAmount}</h6>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td class="Rate">
                                                                                                        <h6 class="mb-0 p-2">Discount</h6>
                                                                                                    </td>
                                                                                                    <td class="payment">
                                                                                                        <h6 class="mb-0 p-2" id="h-coupon-discount">{selectedOrder && selectedOrder.couponDiscountValue}</h6>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td class="Rate">
                                                                                                        <h6 class="mb-0 p-2">Net total</h6>
                                                                                                    </td>
                                                                                                    <td class="payment">
                                                                                                        <h6 class="mb-0 p-2 p-grand-total">{selectedOrder && selectedOrder.grandTotal}</h6>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                    {/* <!-- End Table--> */}
                                                                                    <div class="row">
                                                                                        <div class="col-md-8">
                                                                                            <div>
                                                                                                <p class="legal">
                                                                                                    <strong>
                                                                                                        Thank you for your
                                                                                                        business!
                                                                                                    </strong>  Payment is expected within 31
                                                                                                    days; please process this invoice within that time.
                                                                                                    There will be Link 5% interest charge per month on late
                                                                                                    invoices.
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                        {/* <!--<div class="col-md-4">
                                                                                            <form class="text-end">
                                                                                                <input type="image"
                                                                                                    src="../../assets/images/other-images/paypal.png"
                                                                                                    name="submit"
                                                                                                    alt="PayPal - The safer, easier way to pay online!">
                                                                                            </form>
                                                                                        </div>--> */}
                                                                                    </div>
                                                                                    {/* <!-- End InvoiceBot--> */}
                                                                                </div>
                                                                                <div class="col-sm-12 text-center mt-3">
                                                                                    <button class="btn btn btn-primary me-2" type="button"
                                                                                        onclick="myFunction()">
                                                                                        Print
                                                                                    </button>
                                                                                </div>
                                                                                {/* <!-- End Invoice-->
                                                                                <!-- End Invoice Holder-->
                                                                                <!-- Container-fluid Ends--> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div id="dvDetails" style={{ display: `${tab == 1 ? "" : "none"}` }}>
                                                                        <h6 class="mb-3">Order details</h6>
                                                                        <ul>
                                                                            <li>Transaction Number <span id="spn-order-number" class="font-primary">{selectedOrder && selectedOrder.transactionNumber}</span></li>
                                                                            <li>Meal plan name <span id="spn-meal-name" class="font-primary">{selectedOrder && selectedOrder.name}</span></li>
                                                                            <li>Payment Status<span id="spn-status" class="badge badge-primary">{selectedOrder && selectedOrder.status == 1 ? "Pending" : "Completed"}</span></li>
                                                                            <li>Sub total<span id="spn-sub-total" class="font-primary">{selectedOrder && selectedOrder.totalAmount}</span></li>
                                                                            <li>Discount<span id="spn-discount" class="font-primary">{selectedOrder && selectedOrder.couponDiscountValue}</span></li>
                                                                            <li>Grand total<span id="spn-grand-total" class="font-primary">{selectedOrder && selectedOrder.grandTotal}</span></li>
                                                                        </ul>
                                                                        <div class="row mt-3">
                                                                            <div class="col-md-12">
                                                                                <p class="font-primary" style={{ fontWeight: "bold" }}><span id="spn-description"></span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div id="dv-pay" style={{ display: `${selectedOrder && selectedOrder.status == 1 ? "" : "none"}` }}>
                                                                            <div class="col-sm-12 text-center mt-3">
                                                                                <button class="btn btn btn-primary me-2" type="button" onClick={toogle}>
                                                                                    Make Payment
                                                                                </button>
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
            </BodyContainer>
            <Modal show={modal} size="md" onHide={toogle} backdrop="static" keyboard={false} >
                <div class="modal-body">
                    <form class="form-bookmark" id="frm-slot" novalidate="">
                        <div class="row g-2">
                            <div class="mb-3 col-md-12 mt-0">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <label for="con-phone">Total payable : <span id="spn-grand-total-pay" class="font-primary">{selectedOrder && selectedOrder.grandTotal}</span></label>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3 col-md-12 mt-0">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <label for="con-phone">Payment mode</label>
                                        <select class="form-control" id="ddlOrdPaymentMode" name="select" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                                            <option value="">Select</option>
                                            {/* <!--<option value="1">Featured</option>--> */}
                                            <option value="1">Cash</option>
                                            <option value="2">Card</option>
                                        </select>
                                    </div>

                                </div>
                            </div>
                            <div class="mb-3 col-md-12 mt-0">
                                <div class="row">
                                    <div class="col-sm-12" id="dv-card-details-ord" style={{ display: `${paymentMode == 2 ? "" : "none"}` }}>
                                        <label for="con-phone">Card number</label>
                                        <input type="number" class="form-control" id="txtOrdCardNumber" maxLength={16} value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button id="btnSavePayment" onClick={makePayment} class="btn btn-primary pull-right" type="button">
                            Save
                        </button>
                        <button id="btnCancelPayment" onClick={toogle} class="btn btn-secondary" type="button">
                            Cancel
                        </button>
                    </form>
                </div>
            </Modal>
            <Modal show={customerModal} size="lg" onHide={toogleCustomer} backdrop="static" keyboard={false} >
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-12">
                            {/* <div class="table-responsive">
                                <table id="tblCustomersList">
                                    <thead>
                                        <tr>
                                            <th>
                                                S.No.
                                            </th>
                                            <th>
                                                Customer&nbsp;Name
                                            </th>
                                            <th>
                                                Mobile&nbsp;number
                                            </th>
                                            <th>
                                                Email
                                            </th>
                                            <th>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id="tblCustomersBody"></tbody>
                                </table>
                            </div> */}
                            <DataTable
                                columns={columns}
                                data={filteredItems}
                                paginationComponentOptions={paginationComponentOptions}
                                pagination
                            // subHeaderComponent={subHeaderComponentMemo}
                            />
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" type="button" data-bs-dismiss="modal" onClick={toogleCustomer}>Close</button>
                </div>
            </Modal>
        </AccountLayout>
    )
}
