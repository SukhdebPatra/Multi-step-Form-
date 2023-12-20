import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { ShoppingCart } from 'react-feather'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { currencyUrl, customerOrdersUrl, mealPlanUrl, vendorCouponsUrl } from '../../assets/Api/api'
import axios from '../../assets/axios/axios'
import history from '../../assets/history/history'
import AccountLayout from '../../layout/account-layout/AccountLayout'

export default function CustomerOrder() {
    const user = JSON.parse(window.localStorage.getItem("user"))
    const store = JSON.parse(window.localStorage.getItem("store"))
    const id = window.sessionStorage.getItem("custId")

    const mdata = {
        storeId: store.id,
        next: 0,
        total: 0,
        filter: 0,
        search: "",
        programs: [],
        plans: [],
        slots: [],
    }

    const [postData, setPostData] = useState(mdata)
    const [mealplans, setMealPlans] = useState()
    const [currency, setCurrency] = useState()
    const [modal, setModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState()
    const [coupons, setCoupons] = useState()
    const [couponModal, setCouponModal] = useState(false)
    const [discountAmt, SetDiscountAmt] = useState()
    const [appliedCoupon, setAppliedCoupon] = useState()
    const [paymentMode, setPaymentMode] = useState()
    const [cardNumber, setCardNumber] = useState('')


    const toogle = () => setModal(!modal);

    const getData = (data) => {
        axios.post(`${mealPlanUrl}/GetFilteredMealPlanData`, data)
            .then(response => {
                console.log(response);
                setMealPlans(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getData(postData)
        axios.get(`${currencyUrl}/GetDefaultCurrency`)
            .then(response => {
                console.log(response);
                setCurrency(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }, [])
    const buyNow = (plan) => {
        setSelectedPlan(plan)
        toogle()
    }

    const getCoupons = () => {
        axios.get(`${vendorCouponsUrl}/GetProgramCoupon/${selectedPlan.programMenuPlanTypes.programsId}/${user.id}/${store.id}`)
            .then(response => {
                console.log(response);
                setCoupons(response.data.data)
                setCouponModal(true)
            })
            .catch(error => {
                console.log(error.response);
                toast.info(error.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
            })
    }

    const applyCoupon = (id) => {
        if (!appliedCoupon) {
            axios.get(`${vendorCouponsUrl}/GetVendorCoupon/${id}`, {
                headers: {
                    authorization: "Bearer " + store.vendors.token
                }
            })
                .then(response => {
                    console.log(response);
                    setAppliedCoupon(response.data.data)
                    const amount = Number((selectedPlan.sellingPrice > 0 ? selectedPlan.sellingPrice : selectedPlan.price)) * (Number(response.data.data.discount) / 100)
                    SetDiscountAmt(amount)
                })
                .catch(error => {
                    console.log(error.response);
                    setAppliedCoupon()
                })
        } else {
            // alert("coupon alreadr applied")
            toast.info("coupon already applied", {
                position: toast.POSITION.TOP_RIGHT,
                hideProgressBar: true,
                autoClose: 3000
            })
        }
    }

    const removeCoupon = () => {
        setAppliedCoupon()
        SetDiscountAmt()
    }

    const placeOrder = () => {
        const data = {
            OrderId: null,
            storesId: store.id,
            customersId: id,
            programsId: selectedPlan.programMenuPlanTypes.programsId,
            programMenuPlanTypesId: selectedPlan.programMenuPlanTypesId,
            totalAmount: selectedPlan.sellingPrice > 0 ? selectedPlan.sellingPrice : selectedPlan.price,
            couponDiscount: 0,
            couponDiscountValue: 0,
            grandTotal: discountAmt ? selectedPlan.sellingPrice > 0 ? selectedPlan.sellingPrice - discountAmt : selectedPlan.price - discountAmt : selectedPlan.sellingPrice > 0 ? selectedPlan.sellingPrice : selectedPlan.price,
            // grandTotal: mealPlan.sellingPrice > 0 ? mealPlan.sellingPrice : mealPlan.price,
            status: 2,
            vendorCouponsId: (!appliedCoupon ? null : appliedCoupon.id)
        }
        console.log(data);
        if (paymentMode) {
            if (paymentMode == 1) {
                console.log("proceed with cash mode", data);
                axios.post(`${customerOrdersUrl}/AddVendorCustomerOrder`, data)
                    .then(response => {
                        console.log(response);
                        toogle()
                        history.push("/venodr/orders")
                    })
                    .catch(error => {
                        console.log(error);
                    })
            } else {
                if (cardNumber.length < 16 || cardNumber.length > 16) {
                    alert("card number should be of 16 digit")
                } else {
                    console.log("proceed with card payment", data);
                    axios.post(`${customerOrdersUrl}/AddVendorCustomerOrder`, data)
                        .then(response => {
                            console.log(response);
                            toogle()
                            history.push("/venodr/orders")
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
            }
        } else {
            alert("select payment mode")
        }
    }
    return (
        <AccountLayout title="Mealplans">
            <div class="row">
                <div class="col-xl-12 col-md-12 box-col-12">
                    <div class="email-right-aside bookmark-tabcontent contacts-tabs">
                        <div class="card email-body radius-left">
                            <div class="ps-0">
                                <div class="tab-content">
                                    <div class="tab-pane fade active show" id="pills-personal"
                                        role="tabpanel" aria-labelledby="pills-personal-tab">
                                        <div class="file-content">
                                            <div class="card mb-0">
                                                <div class="card-header">

                                                </div>
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
                                                    <div class="container-fluid product-wrapper">
                                                        <div class="product-grid" style={{ minHeight: "1000px" }}>
                                                            <div class="feature-products">
                                                                <div class="row">

                                                                    <div class="col-md-12 text-end">
                                                                        <span class="f-w-600 m-r-5">Showing Products <span id="spn-from-count">0</span> - <span id="spn-to-count">0</span> Of <span id="spn-total-count">0</span> Results</span>
                                                                        {/* <!--<div style="display:none" class="select2-drpdwn-product select-options d-inline-block">
                                                                            <select class="form-control btn-square" id="ddlFilter" onchange="FilterById(this.value)" name="select">
                                                                                <option value="0">All</option>-->
                                                                                <!--<option value="1">Featured</option>-->
                                                                                <!--<option value="2">Lowest Prices</option>
                                                                                <option value="3">Highest Prices</option>
                                                                            </select>
                                                                        </div>--> */}
                                                                    </div>
                                                                </div>
                                                                <div class="row" hidden>
                                                                    <div class="col-sm-3">
                                                                        <div class="product-sidebar">
                                                                            <div class="filter-section">
                                                                                <div class="card">
                                                                                    <div class="card-header">
                                                                                        <h6 class="mb-0 f-w-600">Filters<span class="pull-right"><i class="fa fa-chevron-down toggle-data"></i></span></h6>
                                                                                    </div>
                                                                                    <div class="left-filter">
                                                                                        <div class="card-body filter-cards-view animate-chk custom-scroll">
                                                                                            <div class="product-filter">
                                                                                                <h6 class="f-w-600">Program</h6>
                                                                                                <div class="checkbox-animated mt-0" id="dv-programs"></div>
                                                                                            </div>
                                                                                            <div class="product-filter">
                                                                                                <h6 class="f-w-600">Plan type</h6>
                                                                                                <div class="checkbox-animated mt-0" id="dv-plans"></div>
                                                                                            </div>
                                                                                            <div class="product-filter">
                                                                                                <h6 class="f-w-600">Slot</h6>
                                                                                                <div class="checkbox-animated mt-0" id="dv-slots"></div>
                                                                                            </div>
                                                                                            <button class="btn btn-primary pull-right" type="button" onclick="ApplyFilters()">Apply</button>
                                                                                            <button class="btn btn-secondary" type="button" onclick="ClearFilters()">Clear all</button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-md-7 col-sm-5">
                                                                        <form>
                                                                            <div class="form-group m-0">
                                                                                <input class="form-control" type="search" placeholder="Search.." id="txtSearch" data-original-title="" title="" data-bs-original-title="" /><i onclick="SearchMealPlan()" class="fa fa-search"></i>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                    <div class="col-sm-2">
                                                                        <form>
                                                                            <div class="form-group m-0">
                                                                                <button id="btnClearfilter" class="btn btn-primary w-100" type="button">
                                                                                    Clear filter
                                                                                </button>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="product-wrapper-grid">
                                                                <div class="row">
                                                                    <h1 class="text-center" id="h-no-data" style={{ display: "none" }}>Sorry! No Data Found</h1>
                                                                    <div class="row gallery my-gallery" id="dvMealPlans" itemscope="">
                                                                        {mealplans && mealplans.mealPlans.map(plan => {
                                                                            return (
                                                                                < div class="col-sm-3 reveal" itemprop="associatedMedia" itemscope="" >
                                                                                    <div class="card">
                                                                                        <div class="blog-box blog-grid text-center product-box">
                                                                                            <div class="product-img">
                                                                                                <img class="img-fluid top-radius-blog customSize" src={`http://infuse.scount.in/${plan.path}`} alt="" />
                                                                                                <div class="product-hover">
                                                                                                    <ul>
                                                                                                        <li><button class="btn" type="button" onClick={() => buyNow(plan)} title=""><ShoppingCart /></button>
                                                                                                        </li>
                                                                                                    </ul>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div class="product-details"><h4>{plan.name}</h4>
                                                                                                {plan.sellingPrice == plan.price ? <div class="product-price">{currency && currency.symbol} {plan.sellingPrice}</div> : <div class="product-price">{currency && currency.symbol} {plan.sellingPrice}<del>{currency && currency.symbol} {plan.price}</del></div>}

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>
                                                                <div class="row m-t-15" id="dv-view-more">
                                                                    <div class="col-md-12">
                                                                        <div class="view-more-root">
                                                                            <div class="and-view-more">View More</div><Link class="and-view" href="#" onclick="ViewMore()">View <span class="txt-primary">More...</span></Link>
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
                                    <Modal show={modal} size="md" onHide={toogle} backdrop="static" keyboard={false} >
                                        <div class="modal-body">
                                            <div class="row" id="dv-cart">
                                                <div class="col-md-12">
                                                    <div class="col-xl-12 xl-70 col-md-12">
                                                        <div class="product-page-details">
                                                            <h5 style={{ color: "blue" }}> Your Plan </h5>
                                                        </div>
                                                        <div class="product-page-details">
                                                            <h5 id="txtMealPlanName">{selectedPlan && selectedPlan.name}</h5>
                                                        </div>
                                                        <hr />
                                                        <div>
                                                            <table class="product-page-width">
                                                                <tbody>
                                                                    <tr>
                                                                        <td> <b>Meals Plan &nbsp;&nbsp;&nbsp;: &nbsp;</b></td>
                                                                        <td> <span id="txtMealPerDay">{selectedPlan && selectedPlan.programMenuPlanTypes.mealPlanSlots.length}</span> Meal per Day</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td> <b>Slots &nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;</b></td>
                                                                        <td class="txt-success">
                                                                            <div class="" id="dvSlots">
                                                                                {selectedPlan && selectedPlan.programMenuPlanTypes.mealPlanSlots.map(slot => {
                                                                                    return <span class='badge badge-primary'>{slot.slots.name}</span>
                                                                                })}
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td> <b>Days &nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;</b></td>
                                                                        <td id="txtDays">{selectedPlan && selectedPlan.days}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td> <b>Total Meals &nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;</b></td>
                                                                        <td id="txtBoxes">{selectedPlan && selectedPlan.days * selectedPlan.programMenuPlanTypes.mealPlanSlots.length}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <br />
                                                <div class="col-xl-12 col-sm-12">
                                                    <div class="checkout-details">
                                                        <div class="order-box">
                                                            <ul class="sub-total total">
                                                                <li><span>Subtotal</span> <span class="count1 pull-right" id="spn-subtotal" style={{ textAlign: "left" }}>{selectedPlan && selectedPlan.price}</span><span class="count1 spn-currency pull-right" id="">{currency && currency.symbol}</span></li>
                                                                <li>Discount <span class="count1 pull-right" id="spn-discount" style={{ textAlign: "left" }}>{selectedPlan && selectedPlan.sellingPrice > 0 ? selectedPlan.price == selectedPlan.sellingPrice ? 0 : selectedPlan.price - selectedPlan.sellingPrice : 0}</span><span class="count1 spn-currency pull-right">{currency && currency.symbol}</span></li>
                                                            </ul>
                                                            <ul class="sub-total total">
                                                                <li>Total <span class="count1 pull-right" id="spn-grand-total" style={{ textAlign: "left" }}>{selectedPlan && selectedPlan.sellingPrice > 0 ? selectedPlan.price == selectedPlan.sellingPrice ? selectedPlan.price : selectedPlan.sellingPrice : selectedPlan && selectedPlan.sellingPrice}</span><span class="count1 spn-currency pull-right">{currency && currency.symbol}</span></li>
                                                            </ul>
                                                            <ul class="sub-total total" id="show-hide-coupon-name" style={{ display: `${appliedCoupon ? "" : "none"}` }}>
                                                                <li>Applied Coupon : <span class="count2" id="coupon-name">{appliedCoupon && appliedCoupon.couponName}</span></li>
                                                            </ul>
                                                            <label class="form-label" for="validationTooltip04"><span style={{ color: "#dc3545" }}><b onClick={getCoupons}> Apply Coupon? </b></span><Link href="#" onClick={removeCoupon} id="showIcon1" style={{ display: `${appliedCoupon ? "" : "none"}` }}><i class="fa fa-times-circle"></i> Remove</Link></label>
                                                            <br />
                                                            <label class="form-label" for="validationTooltip04">Payment mode</label>
                                                            <select class="form-control" id="ddlPaymentMode" name="select" onClick={(e) => setPaymentMode(e.target.value)}>
                                                                <option value="">Select</option>
                                                                {/* <!--<option value="1">Featured</option>--> */}
                                                                <option value="1">Cash</option>
                                                                <option value="2">Card</option>
                                                            </select>
                                                            <br />
                                                            <div id="dv-card-details" style={{ display: `${paymentMode == 2 ? "" : "none"}` }}>
                                                                <label class="form-label" for="validationTooltip04">Card number</label>
                                                                <input type="number" class="form-control" id="txtCardNumber" max="16" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                                                            </div>
                                                            <div class="order-place pull-left" style={{ marginTop: "10px" }}><Link class="btn btn-danger" href="#" id="btnCancelPlaceOrder" onClick={toogle} data-bs-original-title="" title="">Cancel  </Link></div>
                                                            <div class="order-place pull-right" style={{ marginTop: "10px" }}><Link class="btn btn-primary" href="#" id="btnPlaceOrder" onClick={placeOrder} data-bs-original-title="" title="">Place Order  </Link></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div class="row" id="dv-coupons" style={{ display: "none" }}>
                                                <div id="basic-1_wrapper" class="dataTables_wrapper no-footer">
                                                    <table class="display dataTable no-footer" id="basic-1" role="grid" aria-describedby="basic-1_info">
                                                        <tbody id="tblCoupons"></tbody>
                                                    </table>
                                                </div>
                                                <hr />
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="form-group">
                                                            <label class="col-form-label"><b>Discount Amount</b> : <span><b id="lblCouponDiscount"></b></span> <i id="showIcon" style={{ display: "none", color: "red" }} onclick="removeCoupon()" class="fa fa-times-circle"></i></label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <button class="btn btn-danger" type="button" onclick="CloseCouponDiv()">Close</button>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </Modal>
                                    <Modal show={couponModal} size="md" onHide={() => setCouponModal(false)} backdrop="static" keyboard={false}>
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Coupons</h5>
                                        </div>
                                        <div className="modal-body">
                                            <div id="basic-1_wrapper" className="dataTables_wrapper no-footer">
                                                <table className="display dataTable no-footer" id="basic-1" role="grid" aria-describedby="basic-1_info">
                                                    <tbody id="tblCoupons">
                                                        {coupons && coupons.map((coupon, index) => {
                                                            return (
                                                                <tr>
                                                                    <td>{index + 1}) </td>
                                                                    <td>{coupon.couponCode}<br /><span style={{ fontSize: "12px" }}>{coupon.couponName}</span></td>
                                                                    <td>{coupon.discount} (%) off</td>
                                                                    <td>
                                                                        <button id="coupon" className="btn btn-primary" type="button" onClick={() => applyCoupon(coupon.id)}>Apply</button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label className="col-form-label"><b>Discount Amount</b> : <span><b id="lblCouponDiscount">{discountAmt ? discountAmt + " off on total payable " : ""}</b></span><i id="showIcon" style={{ display: `${discountAmt ? "" : "none"}`, color: "red" }} onClick={removeCoupon} className="fa fa-times-circle"></i></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button className="btn btn-danger" type="button" onClick={() => setCouponModal(false)}>Close</button>
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AccountLayout >
    )
}
