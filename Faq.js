import React, { useEffect, useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import { Edit, Users } from 'react-feather'
import { Link } from 'react-router-dom'
import { vendorFAQTypeUrl } from '../../assets/Api/api'
import axios from '../../assets/axios/axios'
import Faqs from '../../components/faq/Faqs'
import FaqType from '../../components/faq/FaqType'
import AccountLayout from '../../layout/account-layout/AccountLayout'

export default function Faq() {
    const store = JSON.parse(window.localStorage.getItem("store"))

    const [modal, setModal] = useState(false)
    const [tab, setTab] = useState(2)

    const toogle = () => setModal(!modal)

    // const getData = (values) => {
    //     let data = values
    //     data.status = values.status == 2 ? false : true
    //     axios.post(`${vendorFAQTypeUrl}/GetVendorFAQTypesByIdOnFilter`, data)
    //         .then(response => {
    //             console.log(response);
    //             setFqaTypes(response.data.data)
    //         })
    //         .catch(error => {
    //             console.log(error.response);
    //         })
    // }

    // useEffect(() => {
    //     getData(postData)
    // }, [])

    // const addFaqType = (event) => {
    //     event.preventDefault()
    //     const form = event.currentTarget;
    //     let data = typeDetails
    //     data.status = typeDetails.status == 1 ? true : false
    //     const found = allIngredients.find(ing => ing.name == data.name)
    //     let found = false
    //     console.log(data);
    //     if (form.checkValidity() === false) {
    //         console.log("validity fails");
    //     } else {
    //         axios.post(`${vendorFAQTypeUrl}/AddVendorFAQType`, data)
    //             .then(response => {
    //                 console.log(response);
    //                 getData(postData)
    //                 closeTypeModal()
    //             })
    //             .catch(error => {
    //                 console.log(error.response);
    //             })
    //     }
    //     setValidated(true)
    // }

    // const editFaqType = (type) => {
    //     setEdit(true)
    //     let data = typeDetails
    //     data.type = type.type
    //     data.status = type.status ? "1" : "2"
    //     data.id = type.id
    //     setTypeDetails(data)
    //     toogle()
    // }

    // const updateFaqType = (event) => {
    //     event.preventDefault()
    //     const form = event.currentTarget;
    //     let data = typeDetails
    //     data.status = typeDetails.status == 1 ? true : false
    //     const found = allIngredients.find(ing => ing.name == data.name)
    //     let found = false
    //     console.log(data);
    //     if (form.checkValidity() === false) {
    //         console.log("validity fails");
    //     } else {
    //         axios.put(`${vendorFAQTypeUrl}/UpdateVendorFAQType`, data)
    //             .then(response => {
    //                 console.log(response);
    //                 getData(postData)
    //                 closeTypeModal()
    //             })
    //             .catch(error => {
    //                 console.log(error.response);
    //             })
    //     }
    //     setValidated(true)

    // }

    // const closeTypeModal = () => {
    //     toogle()
    //     setEdit(false)
    //     setValidated(false)
    //     setTypeDetails(typeInfo)
    // }

    const getFaqTypeDetails = (id) => {
        // axios.get(`${vendorFAQTypeUrl}/GetVendorFAQType/${id}`)
        //     .then(response => {
        //         console.log(response);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     })
    }

    return (
        <AccountLayout title="FAQ" loader={false}>
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
                                                    <button class="badge-light-primary btn-block btn-mail w-100 checkPermission" type="button" id="btnAdd" onClick={toogle}>
                                                        <Users /> New FAQ
                                                    </button>
                                                </li>
                                                <li class="nav-item"><span class="main-title"> Faq type</span></li>
                                                <li>
                                                    <button class="btn btn-category checkPermission" type="button" id="btnNewKitchenType" onClick={toogle}>
                                                        <span class="title"> + Add Faq type</span>
                                                    </button>
                                                </li>
                                            </ul>
                                            <ul id="ul-kitchen-types" class="nav main-menu contact-options" role="tablist">
                                                <li>
                                                    <Link id="btn-pills-faq" data-bs-toggle="pill" to="#pills-faq" role="tab" aria-controls="pills-personal" aria-selected="true" onClick={() => setTab(1)}>
                                                        <span class="title"> Faqs</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link class="show" id="btn-pills-faq-type" data-bs-toggle="pill" to="#pills-faq-type" role="tab" aria-controls="pills-organization" aria-selected="false" onClick={() => setTab(2)}>
                                                        <span class="title">Faq type</span>
                                                    </Link>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {tab == 1 ? <Faqs modal={modal} toogle={toogle} /> : <FaqType modal={modal} toogle={toogle} />}


                    </div>
                </div>
            </div >
            {/* <Modal show={modal} size="lg" onHide={toogle} backdrop="static" keyboard={false} >
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel1">
                        Add Faq type
                    </h5>
                    <button class="btn-close" type="button"
                        data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <Form noValidate validated={validated} onSubmit={edit ? updateFaqType : addFaqType} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                        <div class="row g-2">
                            <div class="mb-3 col-md-12">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <label for="con-phone">Faq type</label>
                                        <input class="form-control" id="txtfaqType" type="text" required autocomplete="off" value={typeDetails.type} onChange={(e) => setTypeDetails({ ...typeDetails, type: e.target.value })} />
                                        <div class="invalid-feedback">Please enter a valid name.</div>
                                    </div>
                                    <div class="col-sm-6">
                                        <label for="con-phone">Status</label>
                                        <select class="form-control" id="ddlTypeStatus" value={typeDetails.status} onChange={(e) => setTypeDetails({ ...typeDetails, status: e.target.value })}>
                                            <option value="1" >
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
                        <button class="btn btn-primary pull-right"
                            type="submit" id="btnSave">
                            Save
                        </button>
                        <button class="btn btn-secondary"
                            type="button" id="btn-close-modal-faq-type" onClick={closeTypeModal}>
                            Cancel
                        </button>
                    </Form>
                </div>
            </Modal> */}
        </AccountLayout >
    )
}
                // <div class="modal-body">
                //     <form class="form-bookmark faqs-validation"
                //         id="frm-faq" novalidate="">
                //         
                //     </form>
                // </div>
