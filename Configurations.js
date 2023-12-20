import React, { useEffect, useState } from 'react'
import { Modal, Form } from 'react-bootstrap'
import { DollarSign, Hash, Slack } from 'react-feather'
import { Link } from 'react-router-dom'
import Coupons from '../../components/configuration/Coupons'
import PaymentGateway from '../../components/configuration/PaymentGateway'
import Prefixes from '../../components/configuration/Prefixes'
import AccountLayout from '../../layout/account-layout/AccountLayout'
import { gatewayUrl, prefixUrl, vendorCouponsUrl } from '../../assets/Api/api'
import axios from '../../assets/axios/axios'

export default function Configurations() {
    const store = JSON.parse(window.localStorage.getItem("store"))

    const pdata = {
        storesId: store.id,
        transactionType: '',
        transactionLength: '',
        prefix: '',
        startNumber: '',
        currentNumber: '',
        status: '1'
    }

    const cdata = {
        storesId: store.id,
        couponCode: '',
        couponName: '',
        startDate: '',
        endDate: '',
        discount: '',
        usePerCoupon: '1',
        usePerCustomer: '1',
        programsId: '',
        status: '1'
    }

    const gdata = {
        storesId: store.id,
        name: '',
        key: '',
        secret: '',
        status: 'true',
        gatewayType: ''
    }

    const [refresh, setRefresh] = useState(false)
    const [tab, setTab] = useState(1)
    const [edit, setEdit] = useState(false)
    const [modal, setModal] = useState(false)
    const [couponModal, setCouponModal] = useState(false)
    const [paymentModal, setPaymentModal] = useState(false)
    const [prefixDetails, setPrefixDetails] = useState(pdata)
    const [couponDetails, setCouponDetails] = useState(cdata)
    const [gatewayDetails, setGatewayDetails] = useState(gdata)
    const [validated, setValidated] = useState(false)
    const [programs, setPrograms] = useState([])
    const [credential, setCredential] = useState('0')

    const toogle = () => setModal(!modal)
    const toogleCoupon = () => setCouponModal(!couponModal)
    const tooglePayment = () => setPaymentModal(!paymentModal)

    useEffect(() => {
        axios.get(`${vendorCouponsUrl}/GetProgramsByStoreId/${store.id}`)
            .then(response => {
                console.log(response);
                setPrograms(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    const handlePrefix = (e) => {
        setPrefixDetails({
            ...prefixDetails,
            [e.target.name]: e.target.value
        })
    }

    const addPrefix = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = prefixDetails
        data.status = prefixDetails.status == 1 ? true : false
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        console.log(data);
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            axios.post(`${prefixUrl}/AddPrefixes`, data)
                .then(response => {
                    console.log(response);
                    closeModal()
                })
                .catch(error => {
                    console.log(error.response);
                })
        }
        setValidated(true)
    }

    const editPrefix = (prefix) => {
        setEdit(true)
        let data = prefixDetails
        data.prefix = prefix.prefix
        data.currentNumber = prefix.currentNumber
        data.startNumber = prefix.startNumber
        data.transactionLength = prefix.transactionLength
        data.transactionType = prefix.transactionType
        data.status = prefix.status ? "1" : "0"
        data.id = prefix.id
        toogle()
    }

    const updatePrefix = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = prefixDetails
        data.status = prefixDetails.status == 1 ? true : false
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        console.log(data);
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            axios.put(`${prefixUrl}/UpdatePrefixes`, data)
                .then(response => {
                    console.log(response);
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
        setEdit(false)
        setPrefixDetails(pdata)
        setValidated(false)
    }

    const handleCoupon = (e) => {
        setCouponDetails({
            ...couponDetails,
            [e.target.name]: e.target.value
        })
    }

    const addCoupon = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = couponDetails
        data.status = couponDetails.status == 1 ? true : false
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        console.log(data);
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            axios.post(`${vendorCouponsUrl}/AddVendorCoupon`, data)
                .then(response => {
                    console.log(response);
                    closeCouponModal()
                    setRefresh(!refresh)
                })
                .catch(error => {
                    console.log(error.response);
                })
        }
        setValidated(true)
    }

    const editCoupon = (coupon) => {
        setEdit(true)
        let data = couponDetails
        data.couponCode = coupon.couponCode
        data.couponName = coupon.couponName
        data.discount = coupon.discount
        data.endDate = coupon.endDate.split('T')[0]
        data.startDate = coupon.startDate.split('T')[0]
        data.programsId = coupon.programsId
        data.usePerCoupon = coupon.usePerCoupon
        data.usePerCustomer = coupon.usePerCustomer
        data.status = coupon.status ? '1' : '0'
        data.id = coupon.id
        toogleCoupon()
    }

    const updateCoupon = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = couponDetails
        data.status = couponDetails.status == 1 ? true : false
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        console.log(data);
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            axios.put(`${vendorCouponsUrl}/UpdateVendorCoupon`, data)
                .then(response => {
                    console.log(response);
                    closeCouponModal()
                    setRefresh(!refresh)
                })
                .catch(error => {
                    console.log(error.response);
                })
        }
        setValidated(true)

    }

    const closeCouponModal = () => {
        toogleCoupon()
        setEdit(false)
        setCouponDetails(cdata)
        setValidated(false)
    }

    const changeCredentialType = (e) => {
        setCredential(e.target.value)
        if (gatewayDetails.id) {
            setGatewayDetails({
                ...gdata,
                id: gatewayDetails.id
            })
        } else {
            setGatewayDetails(gdata)
        }
    }

    const handleGateway = (e) => {
        setGatewayDetails({
            ...gatewayDetails,
            [e.target.name]: e.target.value
        })
    }

    const addPaymentGateway = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = gatewayDetails
        data.gatewayType = credential
        // data.status = couponDetails.status == 1 ? true : false
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        if (credential == 1) {
            data.key = 'test'
            data.name = 'test'
            data.secret = 'test'
            console.log(data);
            axios.post(`${gatewayUrl}/AddVendorPaymentGateway`, data)
                .then(response => {
                    console.log(response);
                    closeGatewayModal()
                    setRefresh(!refresh)
                })
                .catch(error => {
                    console.log(error.response);
                })
        } else {
            if (form.checkValidity() === false) {
                console.log("validity fails");
            } else {
                console.log(data);
                axios.post(`${gatewayUrl}/AddVendorPaymentGateway`, data)
                    .then(response => {
                        console.log(response);
                        closeGatewayModal()
                        setRefresh(!refresh)
                    })
                    .catch(error => {
                        console.log(error.response);
                    })
            }
            setValidated(true)
        }
    }

    const editPaymentGateway = (gateway) => {
        setEdit(true)
        let data = gatewayDetails
        data.name = gateway.name
        data.key = gateway.key
        data.secret = gateway.secret
        data.status = gateway.status
        data.id = gateway.id
        data.gatewayType = gateway.gatewayType
        setCredential(gateway.gatewayType)
        setGatewayDetails(data)
        tooglePayment()
    }

    const updatePaymentGateway = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = gatewayDetails
        data.gatewayType = credential
        // data.status = couponDetails.status == 1 ? true : false
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        if (credential == 1) {
            data.key = 'test'
            data.name = 'test'
            data.secret = 'test'
            console.log(data);
            axios.put(`${gatewayUrl}/UpdateVendorPaymentGateway`, data)
                .then(response => {
                    console.log(response);
                    closeGatewayModal()
                    setRefresh(!refresh)
                })
                .catch(error => {
                    console.log(error.response);
                })
        } else {
            if (form.checkValidity() === false) {
                console.log("validity fails");
            } else {
                console.log(data);
                axios.put(`${gatewayUrl}/UpdateVendorPaymentGateway`, data)
                    .then(response => {
                        console.log(response);
                        closeGatewayModal()
                        setRefresh(!refresh)
                    })
                    .catch(error => {
                        console.log(error.response);
                    })
            }
            setValidated(true)
        }
    }

    const closeGatewayModal = () => {
        tooglePayment()
        setEdit(false)
        setGatewayDetails(gdata)
        setValidated(false)
    }

    return (
        <AccountLayout title="Configuration" loader={false}>
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
                                                    <button class="badge-light-primary btn-block btn-mail w-100 checkPermission" type="button" id="btnCouponAdd" onClick={toogleCoupon}>
                                                        <Slack /> Add new coupon
                                                    </button>
                                                    {/* <button class="badge-light-success btn-block btn-mail w-100 checkPermission" type="button" id="btnAddGateway" onClick={tooglePayment}>
                                                        <DollarSign /> Add payment gateway
                                                    </button> */}
                                                    <button class="badge-light-info btn-block btn-mail w-100 checkPermission" type="button" id="btnAddPrefix" onClick={toogle}>
                                                        <Hash /> Add prefix
                                                    </button>
                                                </li>
                                            </ul>
                                            <ul id="ul-kitchen-types" class="nav main-menu contact-options" role="tablist">
                                                <li>
                                                    <Link id="coupons-tab" data-bs-toggle="pill" to="#" role="tab" aria-controls="pills-personal" aria-selected="true" onClick={() => setTab(1)}>
                                                        <span class="title"> Coupon</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link class="show" id="prefixes-tab" data-bs-toggle="pill" to="#" role="tab" aria-controls="pills-organization" aria-selected="false" onClick={() => setTab(2)}>
                                                        <span class="title"> Prefix</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link id="gateways-tab" data-bs-toggle="pill" to="#" role="tab" aria-controls="pills-gateway" aria-selected="true" onClick={() => setTab(3)}>
                                                        <span class="title">Payment gateway</span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {tab == 1 ? <Coupons edit={editCoupon} refresh={refresh} /> : tab == 2 ? <Prefixes edit={editPrefix} refresh={refresh} /> : <PaymentGateway edit={editPaymentGateway} refresh={refresh} />}
                    </div>

                    <Modal show={couponModal} size="lg" onHide={toogleCoupon} backdrop="static" keyboard={false} >
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel1">
                                Add coupon
                            </h5>
                            <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <Form noValidate validated={validated} onSubmit={edit ? updateCoupon : addCoupon} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                                <div class="row g-2">
                                    <div class="mb-3 col-md-12 mt-0">
                                        <div class="row">
                                            <div class="col-sm-4">
                                                <label for="con-name">
                                                    Coupon code
                                                </label>
                                                <input class="form-control" id="txtCouponCode" type="text" required placeholder="Code" autocomplete="off" name='couponCode' value={couponDetails.couponCode} onChange={handleCoupon} />
                                                <div class="invalid-feedback">Please enter valid coupon code.</div>
                                            </div>
                                            <div class="col-sm-4">
                                                <label for="con-name">
                                                    Coupon name
                                                </label>
                                                <input class="form-control" id="txtCouponName" type="text" required placeholder="Name" autocomplete="off" name='couponName' value={couponDetails.couponName} onChange={handleCoupon} />
                                                <div class="invalid-feedback">Please enter valid coupon name.</div>
                                            </div>
                                            <div class="col-sm-4">
                                                <label for="con-name">
                                                    Start date
                                                </label>
                                                <input class="form-control" id="dtStartDate" type="date" required autocomplete="off" name='startDate' value={couponDetails.startDate} onChange={handleCoupon} />
                                                <div class="invalid-feedback">Please select start date.</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3 col-md-12 mt-0">
                                        <div class="row">
                                            <div class="col-sm-4">
                                                <label for="con-name">
                                                    End date
                                                </label>
                                                <input class="form-control" id="dtEndDate" type="date" required autocomplete="off" name='endDate' value={couponDetails.endDate} onChange={handleCoupon} />
                                                <div class="invalid-feedback">Please select end date.</div>
                                            </div>
                                            <div class="col-sm-4">
                                                <label for="con-name">Discount</label>
                                                <input class="form-control" id="txtDiscount" placeholder="%" type="number" required autocomplete="off" name='discount' value={couponDetails.discount} onChange={handleCoupon} />
                                                <div class="invalid-feedback">Please enter valid discount.</div>
                                            </div>
                                            <div class="col-sm-4">
                                                <label for="con-name">
                                                    Use per coupon
                                                </label>
                                                <input class="form-control" id="txtUsePerCoupon" value="1" type="number" required autocomplete="off" name='usePerCoupon' value={couponDetails.usePerCoupon} onChange={handleCoupon} />
                                                <div class="invalid-feedback">Please enter valid number use per coupon.</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3 col-md-12 my-0">
                                        <div class="row">
                                            <div class="col-sm-4">
                                                <label for="con-name">
                                                    Use per customer
                                                </label>
                                                <input class="form-control" id="txtUsePerCustomer" value="1" type="number" required autocomplete="off" name='usePerCustomer' value={couponDetails.usePerCustomer} onChange={handleCoupon} />
                                                <div class="invalid-feedback">Please enter valid number use per customer.</div>
                                            </div>
                                            <div class="col-sm-4">
                                                <label for="con-name">
                                                    Coupon For
                                                </label>
                                                <select class="form-control" id="ddlPrograms" name='programsId' value={couponDetails.programsId} onChange={handleCoupon}>
                                                    <option value="" selected=""> Select Program </option>
                                                    {programs.map(program => <option value={program.id}>{program.name}</option>)}
                                                </select>
                                                {/* <!--<div class="invalid-feedback">Please select program.</div>--> */}
                                            </div>
                                            <div class="col-sm-4">
                                                <label for="con-phone">Status</label>
                                                <select id="ddlCouponStatus" class="form-control" name='status' value={couponDetails.status} onChange={handleCoupon}>
                                                    {/* <!--<option value="" selected>Select</option>--> */}
                                                    <option value="1" selected>Active</option>
                                                    <option value="0">Inactive</option>
                                                </select>
                                                <div class="invalid-feedback">Please select status.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <input id="index_var" type="hidden" value="5" />
                                <button class="btn btn-primary pull-right" type="submit">
                                    Save
                                </button>
                                <button class="btn btn-secondary" type="button" id="btn-close-modal-vendorCoupon" onClick={closeCouponModal}>
                                    Cancel
                                </button>
                            </Form>
                        </div>
                    </Modal>
                    <Modal show={modal} size="lg" onHide={toogle} backdrop="static" keyboard={false} >
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel1">
                                Add prefix
                            </h5>
                            <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <Form noValidate validated={validated} onSubmit={edit ? updatePrefix : addPrefix} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                                <div class="row g-2">
                                    <div class="mb-3 col-md-12">
                                        <div class="row">
                                            <div class="col-sm-6">
                                                <label for="con-phone">
                                                    Transaction type
                                                </label>
                                                <select class="form-control" id="ddlTransactionType" required name='transactionType' value={prefixDetails.transactionType} onChange={handlePrefix}>
                                                    <option value="">Select</option>
                                                    <option value="1">Order</option>
                                                    <option value="2">Coupon</option>
                                                </select>
                                                <div class="invalid-feedback">Please select transaction type.</div>
                                            </div>
                                            <div class="col-sm-6">
                                                <label for="con-phone">
                                                    Transaction length
                                                </label>
                                                <input class="form-control" id="txtTransactionLength" type="number" required autocomplete="off" name='transactionLength' value={prefixDetails.transactionLength} onChange={handlePrefix} />
                                                <div class="invalid-feedback">Please enter valid transaction length.</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3 col-md-12">
                                        <div class="row">
                                            <div class="col-sm-4">
                                                <label for="con-phone">Prefix</label>
                                                <input class="form-control" id="txtPrefix" type="text" required autocomplete="off" name='prefix' value={prefixDetails.prefix} onChange={handlePrefix} />
                                                <div class="invalid-feedback">Please enter valid prefix.</div>
                                            </div>
                                            <div class="col-sm-4">
                                                <label for="con-phone">
                                                    Start number
                                                </label>
                                                <input class="form-control" id="txtStartNumber" type="number" required autocomplete="off" name='startNumber' value={prefixDetails.startNumber} onChange={handlePrefix} />
                                                <div class="invalid-feedback">Please enter valid start number.</div>
                                            </div>
                                            <div class="col-sm-4">
                                                <label for="con-phone">
                                                    Current number
                                                </label>
                                                <input class="form-control" id="txtCurrentNumber" type="number" autocomplete="off" name='currentNumber' value={prefixDetails.currentNumber} onChange={handlePrefix} />
                                                {/* <!--<div class="invalid-feedback">Please enter valid current number.</div>--> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button class="btn btn-primary pull-right" type="submit">
                                    Save
                                </button>
                                <button class="btn btn-secondary" type="button" id="btn-close-modal-prefix" onClick={closeModal}>
                                    Cancel
                                </button>
                            </Form>
                        </div>
                    </Modal>
                    <Modal show={paymentModal} size="md" onHide={tooglePayment} backdrop="static" keyboard={false} >
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel1">
                                Add gateway
                            </h5>
                            <button class="btn-close" type="button"
                                data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3 col-md-12 mt-0">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="form-group m-checkbox-inline custom-radio-ml">
                                            <div class="radio radio-primary">
                                                <input id="radioinline1" type="radio" name="credential" value="1" checked={credential == 1} onChange={changeCredentialType} />
                                                <label class="mb-0" for="radioinline1">Use Admin's Razorpay Credentials</label>
                                            </div>
                                            <div class="radio radio-primary">
                                                <input id="radioinline2" type="radio" name="credential" value="0" checked={credential == 0} onChange={changeCredentialType} />
                                                <label class="mb-0" for="radioinline2">Use Your Razorpay Credentials</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Form noValidate validated={validated} onSubmit={edit ? updatePaymentGateway : addPaymentGateway} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                                <div class="row g-2" style={{ display: `${credential == 1 ? 'none' : ''}` }}>
                                    <div class="mb-3 col-md-12 mt-0 dv-payment">
                                        <div class="row">
                                            <div class="col-sm-6">
                                                <label for="con-name">Key</label>
                                                <input class="form-control" id="txtKey" type="text" required placeholder="Code" autocomplete="off" name='key' value={gatewayDetails.key} onChange={handleGateway} />
                                                <div class="invalid-feedback">Please enter valid key.</div>
                                            </div>
                                            <div class="col-sm-6">
                                                <label for="con-name">Secret</label>
                                                <input class="form-control" id="txtSecret" type="text" required autocomplete="off" name='secret' value={gatewayDetails.secret} onChange={handleGateway} />
                                                <div class="invalid-feedback">Please enter valid secret.</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3 col-md-12 my-0 dv-payment">
                                        <div class="row">
                                            <div class="col-sm-6">
                                                <label for="con-name">Name</label>
                                                <input class="form-control" id="txtName" type="text" required autocomplete="off" name='name' value={gatewayDetails.name} onChange={handleGateway} />
                                                <div class="invalid-feedback">Please enter valid name.</div>
                                            </div>
                                            <div class="col-sm-6">
                                                <label for="con-phone">Status</label>
                                                <select id="ddlStatus" class="form-control" name='status' value={gatewayDetails.status} onChange={handleGateway}>
                                                    <option value="true">Active</option>
                                                    <option value="false">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <input id="index_var" type="hidden" value="5" />
                                <button class="btn btn-primary pull-right" type="submit">
                                    Save
                                </button>
                                <button class="btn btn-secondary" type="button" id="btn-close-modal-payment" onClick={closeGatewayModal}>
                                    Cancel
                                </button>
                            </Form>
                        </div>
                    </Modal>
                </div>
            </div>
        </AccountLayout>
    )
}
