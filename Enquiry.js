import React, { useEffect, useState } from 'react'
import AccountLayout from '../../layout/account-layout/AccountLayout'
import { Form, Modal } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import axios from '../../assets/axios/axios'
import { toast, ToastContainer } from 'react-toastify'
import { Redirect } from 'react-router-dom'
import moment from 'moment'
import { accessPermissionUrl, appointmentsUrl, sessionsUrl } from '../../assets/Api/api'
import BodyContainer from '../../layout/body-container/BodyContainer'
import BodyHeader from '../../layout/body-header/BodyHeader';
import { Link } from 'react-router-dom'

export default function Enquiry() {
    const user = JSON.parse(window.localStorage.getItem("user"))
    const store = JSON.parse(window.localStorage.getItem("store"))

    let SlotEndTime = "00:00";
    const date = new Date().getDate()
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()
    const toDay = year + "-" + month + "-" + date
    const onLoadDdata = {
        pageNo: 1,
        pageSize: 5,
        fromDate: '',
        toDate: '',
        vendorsId: '',
        storesId: store.id,
        status: ''
    };

    const appointmentObj = {
        vendorsId: '',
        customersId: user.id,
        slotEnd: '',
        slot: '',
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        comments: '',
        appointmentNumber: "AP",
        appointmentDate: '',
        status: 1
    }

    const [search, setSearch] = useState(false);
    const [show, setShow] = useState(false)
    const [modal, setModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [appointmentData, setAppiontmentData] = useState(onLoadDdata)
    const [appointments, setAppointments] = useState()
    const [appointmentDetails, setAppointmentDetails] = useState()
    const [filterData, setFilterData] = useState(appointmentData)
    const [nutritionist, setNutriotionist] = useState()
    const [edit, setEdit] = useState(false)
    const [appointmentBooking, setAppointmentBooking] = useState(appointmentObj)
    const [validated, setValidated] = useState(false);
    const [validateCancel, setValidateCancel] = useState(false)
    const [slotsList, setSlotsList] = useState()
    const [slotEndTime, setSlotEndTime] = useState(SlotEndTime)
    const [name, setName] = useState("")
    const [reason, setReason] = useState("")


    const toogle = () => setModal(!modal);
    const toogleCancel = () => setCancelModal(!cancelModal)
    const toogleConfirm = () => setConfirmModal(!confirmModal)



    const getData = (data) => {
        setShow(true)
        axios.post(`${appointmentsUrl}/GetAppointmentsOnFilter`, data)
            .then(response => {
                console.log(response);
                setAppointments(response.data.data)
                setShow(false)
            })
            .catch(error => {
                console.log(error.response);
                setShow(false)
            })
    }
    useEffect(() => {
        getData(appointmentData)

        const nutritionData = {
            pageNo: 1,
            pageSize: 5,
            roleId: 4,
            storeId: store.id,
        }
        axios.post(`${accessPermissionUrl}/GetNutritionistsOnFilter`, nutritionData)
            .then(response => {
                console.log(response);
                setNutriotionist(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    const getAppointmentDetails = (id) => {
        setShow(true)
        axios.get(`${appointmentsUrl}/GetAppointment/${id}`)
            .then(response => {
                console.log(response);
                setAppointmentDetails(response.data.data)
                setShow(false)
            })
            .catch(error => {
                setShow(false)
                console.log(error);
            })
    }

    const handleFilterInput = (e) => {
        setFilterData({
            ...filterData,
            [e.target.name]: e.target.value
        })
        console.log(filterData);
        console.log(appointmentData);
    }

    const getAppointmentByFilter = () => {
        const data = filterData
        filterData.storesId = store.id
        getData(data)
        setAppointmentDetails()
    }

    const clearFilter = () => {
        getData(appointmentData)
        setFilterData(appointmentData)
        toast.info("Filters cleared", {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: true,
            autoClose: 3000
        })
    }

    const handleAppointmentInput = (e) => {

        setAppointmentBooking({
            ...appointmentBooking,
            [e.target.name]: e.target.value
        })
    }

    const editAppointment = () => {
        toogle()
        setEdit(true)
        setAppointmentBooking(prevData => {
            prevData.vendorsId = appointmentDetails.vendorsId
            prevData.appointmentDate = appointmentDetails.appointmentDate
            console.log(prevData);
            getSlots()
        })
        setAppointmentBooking({
            ...appointmentBooking,
            vendorsId: appointmentDetails.vendorsId,
            slotEnd: appointmentDetails.slotEnd,
            slot: appointmentDetails.slot,
            comments: appointmentDetails.comments,
            appointmentNumber: appointmentDetails.appointmentNumber,
            appointmentDate: appointmentDetails.appointmentDate,
            status: appointmentDetails.status
        })
        console.log(appointmentBooking);
    }

    const getSlots = () => {
        if (appointmentBooking.vendorsId > 0 && appointmentBooking.appointmentDate != "") {
            axios.get(`${sessionsUrl}/GetSessionsByVendorsId/${appointmentBooking.vendorsId}/${appointmentBooking.appointmentDate}`)
                .then(response => {
                    console.log(response);
                    setSlotsList(response.data.data)
                    // const slotTime = appointmentBooking?.slot.split(":")[0] + ":" + appointmentBooking?.slot.split(":")[1]
                    // GetEndSlot(slotTime)
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
    }

    const closeModal = () => {
        toogle()
        setEdit(false)
        // setSlotsList(false)
        setAppointmentBooking(appointmentObj)
        setValidated(false)
    }

    const updateAppointment = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        const data = appointmentBooking
        data.slot = appointmentBooking.slot.split('.')[0] + ":" + appointmentBooking.slot.split('.')[1]
        data.id = appointmentDetails.id
        if (form.checkValidity() === false) {
            console.log("validity fails");
        }
        else {
            console.log(data);
            setShow(true)
            axios.put(`${appointmentsUrl}/UpdateAppointment`, data)
                .then(response => {
                    console.log(response.data.data);
                    setAppointmentDetails(response.data.data)
                    toast.info("Appointment details updated successfully.", {
                        position: toast.POSITION.TOP_RIGHT,
                        hideProgressBar: true,
                        autoClose: 3000
                    })
                    closeModal()
                    setShow(false)
                })
                .catch(error => {
                    console.log(error.response);
                })
        }
        setValidated(true);

    }

    const addAppointment = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            console.log("validity fail");
        }
        else {
            const data = appointmentBooking
            data.slotEnd = slotEndTime
            data.slot = appointmentBooking.slot.split('.')[0] + ":" + appointmentBooking.slot.split('.')[1]
            data.name = name
            console.log(data);
            setShow(true)
            axios.post(`${appointmentsUrl}/AddAppointment`, data)
                .then(response => {
                    console.log(response);
                    toast.info("Appointment added successfully.", {
                        position: toast.POSITION.TOP_RIGHT,
                        hideProgressBar: true,
                        autoClose: 3000
                    })
                    closeModal()
                    getData(appointmentData)
                })
                .catch(error => {
                    console.log(error.response);
                })
        }
        setValidated(true);

    }

    const cancelAppointment = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            console.log("validated");
            const cancelObj = {
                id: appointmentDetails?.id,
                cancellationReason: reason,
                status: 3
            }
            setShow(true)
            axios.put(`${appointmentsUrl}/UpdateAppointmentStatus`, cancelObj)
                .then(response => {
                    console.log(response);
                    setAppointmentDetails(response.data.data)
                    toogleCancel()
                    toast.info("Appointment cancelled successfully.", {
                        position: toast.POSITION.TOP_RIGHT,
                        hideProgressBar: true,
                        autoClose: 3000
                    })
                    setShow(false)
                })
                .catch(error => {
                    setShow(false)
                    console.log(error);
                })
        }
        setValidateCancel(true)
    }

    const GetEndSlot = () => {
        const slot = appointmentBooking?.slot.split(".")[0] + "." + appointmentBooking?.slot.split(".")[1]
        if (slot != "0") {
            var slotMn = parseInt(slot.split(".")[1]);
            var SlotEndHr = "00";
            var SlotEndMn = "00";
            slotMn += parseInt(slotsList?.[0].slot.split(":")[1]);
            if (slotMn >= 60) {
                SlotEndHr = parseInt(slot.split(".")[0]) + 1;
            }
            else {
                SlotEndHr = parseInt(slot.split(".")[0]);
                SlotEndMn = slotMn;
            }
            setSlotEndTime(SlotEndHr + ":" + SlotEndMn)
            // debugger
        }
        else {
            // $('#ddlSlot').val('0').trigger('change');
        }
    }

    const next = () => {
        if (appointments?.pageNo < appointments?.totalPages) {
            const page = appointmentData
            page.pageNo = appointments.pageNo + 1
            setAppiontmentData(page)
            getData(page)
            // console.log(page);
        }
    }

    const previous = () => {
        if (appointments?.pageNo > 1) {
            const page = appointmentData
            page.pageNo = appointments.pageNo - 1
            setAppiontmentData(page)
            getData(page)
        }
    }

    const confirmVisit = () => {
        const confirmobj = {
            id: appointmentDetails.id,
            cancellationReason: reason,
            status: 4
        }
        axios.put(`${appointmentsUrl}/UpdateAppointmentStatus`, confirmobj)
            .then(response => {
                console.log(response);
                setAppointmentDetails(response.data.data)
                toogleConfirm()
                toast.info("Appointment confirmed.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
            })
            .catch(error => {
                console.log(error);
            })
    }
    if (!user) {
        return <Redirect to={"login"} />
    }
    return (
        <AccountLayout title="Enquiry List" loader={show} >
            <BodyContainer>
                <div className="card-header">
                    <BodyHeader toogle={toogle} search={search} setSearch={setSearch} addBtn={true} />
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card" id="dvSearch" style={{ display: `${search ? "block" : "none"}` }}>
                                <div className="card-body">
                                    <form id="frm-appointments-search">
                                        <div className="mb-3 col-md-12 my-0">
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <label for="con-mail">From</label>
                                                    <input className="form-control" id="dtSearchFromDate" type="date" required="" value={filterData.fromDate} name="fromDate" onChange={handleFilterInput} autocomplete="off" />
                                                </div>
                                                <div className="col-sm-3">
                                                    <label for="con-mail">To</label>
                                                    <input className="form-control" id="dtSearchToDate" type="date" required="" value={filterData.toDate} name='toDate' onChange={handleFilterInput} autocomplete="off" />
                                                </div>
                                                <div className="col-sm-3">
                                                    <label for="con-name">Nutritionist</label>
                                                    <select className="form-control" id="ddlSearchNutritionist" value={filterData.vendorsId} name='vendorsId' onChange={handleFilterInput} >
                                                        <option value="">select</option>
                                                        {nutritionist?.users.map(user => {
                                                            return (
                                                                <option value={user.id}>{user.firstName + " " + user.lastName}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="col-sm-3">
                                                    <label for="con-mail">Status</label>
                                                    <select className="form-control" id="ddlSearchStatus" value={filterData.status} name='status' onChange={handleFilterInput}>
                                                        <option value="" selected>Select</option>
                                                        <option value="1">Booked</option>
                                                        <option value="2">Rescheduled</option>
                                                        <option value="3">Cancelled</option>
                                                        <option value="4">Confirmed</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-3 col-md-12 my-0">
                                            <div className="row">
                                                <div className="col-sm-9">
                                                    <label for="">&nbsp;</label>
                                                    <br />
                                                    <button type="button" id="btnCloseFilter" className="btn btn-outline-primary" onClick={() => { setSearch(false); setFilterData(appointmentData) }}>
                                                        Close
                                                    </button>
                                                </div>
                                                <div className="col-sm-3">
                                                    <label for="">&nbsp;</label>
                                                    <br />
                                                    <button type="button" id="btnFilter" className="btn btn-outline-primary " onClick={getAppointmentByFilter}>
                                                        Search
                                                    </button>
                                                    <button type="button" id="btnClearFilter" className="btn btn-outline-primary ms-1" onClick={clearFilter}>
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
                    <div className="card-body p-0">
                        <div id="div-not-found" className="row" style={{ display: `${appointments ? appointments.appointments.length < 1 ? "" : "none" : "none"}` }}>
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="text-center">Data not found</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row list-persons" id="div-enquries" style={{ display: "" }}>
                            <div className="col-xl-4 xl-30 col-md-5">
                                <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                                    aria-orientation="vertical">
                                    <div id="div-all-enquiries">
                                        {appointments && appointments.appointments.map(appointment => {
                                            return (
                                                <div id={`appointments-${appointment.id}`} className="nav-link" style={{ cursor: "pointer" }} onClick={() => getAppointmentDetails(appointment.id)}>
                                                    <div className="media">
                                                        <div className="media-body">
                                                            <h6> <span className="first_name_0">{appointment.name}</span></h6>
                                                            <p class="first_name_0">{appointment.mobileNumber}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {/* <a href="#" id="appointments-5" title="AP5" className="nav-link" onclick="GetAppointment(5)" >
                                            <div className="media">
                                                <div className="media-body">
                                                    <h6> <span className="first_name_0">AP5</span></h6>
                                                </div>
                                            </div>
                                        </a> */}
                                    </div>
                                    <div className="dataTables_info">
                                        <ul className="pagination justify-content-center pagination-primary">
                                            <li className="page-item"><Link to="#" id="btnPrevious" className="page-link" onClick={previous}>Previous</Link></li>
                                            <li className="page-item"><Link to="#" id="btnNext" className="page-link" onClick={next}>Next</Link></li>
                                        </ul>
                                        <div className="mt-3">
                                            Showing <span id="spn-pageNo">{appointments?.pageNo}</span> of <span id="spn-totalPages">{appointments?.totalPages}</span> pages
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-8 xl-70 col-md-7" id="div-enquiry-details" style={{ display: `${appointmentDetails ? "block" : "none"}` }}>
                                <div className="tab-content" id="v-pills-tabContent">
                                    <div className="tab-pane contact-tab-0 tab-content-child fade show active" id="v-pills-user" role="tabpanel" aria-labelledby="v-pills-user-tab">
                                        <div className="profile-mail">
                                            <div className="media">
                                                <div className="media-body mt-0">
                                                    <h5>
                                                        <span id="spn-customer-name">{appointmentDetails?.name}</span>
                                                    </h5>
                                                    <p id="spn-customer-emailID">{appointmentDetails?.email}</p>
                                                    {appointmentDetails && appointmentDetails.status == 1 ?
                                                        <ul>
                                                            <li><Link id="btnEditAppointment" to="#" onClick={editAppointment}>Edit</Link></li>
                                                            <li><Link id="btnCancelAppointment" to="#" onClick={toogleCancel}>Cancel</Link></li>
                                                            <li><Link id="btnCancelAppointment" to="#" onClick={toogleConfirm}>Customer Visit</Link></li>
                                                        </ul> : <></>}
                                                </div>
                                            </div>
                                            <div className="email-general">
                                                <h6 className="mb-3">General details</h6>
                                                <ul>
                                                    <li>Appointment Number<span id="spn-appointment-number">{appointmentDetails?.appointmentNumber}</span></li>
                                                    <li>Mobile Number<span id="spn-customer-number">{appointmentDetails?.mobileNumber}</span></li>
                                                    <li>Email <span id="spn-customer-email">{appointmentDetails?.email}</span></li>
                                                    <li>Enquiry date<span id="spn-customer-appointment-date">{appointmentDetails?.appointmentDate.split('T')[0]}</span></li>
                                                    <li>Nutritionist name<span id="spn-nutritionist-name">{appointmentDetails?.vendors.firstName + " " + appointmentDetails?.vendors.lastName}</span></li>
                                                    <li>Slot<span id="spn-slot">{appointmentDetails?.slot}</span></li>
                                                    <li>Appointment Notes<span id="spn-appointment-notes">{appointmentDetails?.comments}</span></li>
                                                    <li>Appointment Status
                                                        <span id="spn-appointment-status" className={`badge ${appointmentDetails?.status == 1 ? "badge-info" : appointmentDetails?.status == 2 ? "badge-primary" : appointmentDetails?.status == 4 ? "badge-success" : "badge-danger"}`}>
                                                            {appointmentDetails?.status == 1 ? "Booked" : appointmentDetails?.status == 2 ? "Rescheduled" : appointmentDetails?.status == 4 ? "Confirmed" : "Cancelled"}
                                                        </span>
                                                    </li>
                                                    <li>Cancellation Reason<span id="spn-cancellation-reason">{appointmentDetails?.cancellationReason == null ? "-" : appointmentDetails?.cancellationReason}</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </BodyContainer >
            <Modal show={modal} size="lg" onHide={toogle} backdrop="static" keyboard={false} >
                <div className="modal-body">
                    <div className="profile-mail pt-0" id="DivIdToPrint">
                        <Form noValidate validated={validated} onSubmit={edit ? updateAppointment : addAppointment} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                            {/* <form className="form-bookmark enquiry-validation" id="frm-modal-add-appointment" novalidate=""> */}
                            <label>&nbsp;</label>
                            <div className="mb-3 col-md-12 mt-0">
                                <div className="row">
                                    <div className="col-sm-2">
                                        <label for="con-name">Select nutritionist</label>
                                    </div>
                                    <div className="col-sm-4">
                                        <select className="form-control" value={appointmentBooking?.vendorsId} name='vendorsId' onChange={handleAppointmentInput} id="ddlNutritionist" required>
                                            <option value="">select</option>
                                            {nutritionist?.users.map(user => {
                                                return (
                                                    <option value={user.id}>{user.firstName + " " + user.lastName}</option>
                                                )
                                            })}
                                        </select>
                                        <div className="invalid-feedback">Please select nutritionist.</div>
                                    </div>
                                    <div className="col-sm-2">
                                        <label for="con-name">Select date</label>
                                    </div>
                                    <div className="col-sm-4">
                                        <input className="form-control" id="dtAppointmentDate" type="date" onBlur={getSlots} name='appointmentDate' onChange={handleAppointmentInput} value={appointmentBooking?.appointmentDate.split("T")[0]} min={moment(new Date()).format("YYYY-MM-DD")} required />
                                        <div className="invalid-feedback">Please select date.</div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3 col-md-12 mt-0">
                                <div className="row">
                                    <div className="col-sm-2 dvCurrentSlot" style={{ display: `${edit ? "block" : "none"}` }}>
                                        <label for="con-name">Current booked slot</label>
                                    </div>
                                    <div className="col-sm-4 dvCurrentSlot" style={{ display: `${edit ? "block" : "none"}` }}>
                                        <input className="form-control" id="txtCurrentSlot" type="text" required disabled value={appointmentDetails?.slot} />
                                    </div>
                                    <div className="col-sm-2">
                                        <label for="con-name">Select slot</label>
                                    </div>
                                    <div className="col-sm-4">
                                        <select className="form-control"
                                            // onchange="GetEndSlot(this.value)" 
                                            id="ddlSlot" required={edit ? "" : "true"} name='slot' onBlur={GetEndSlot} onChange={handleAppointmentInput} value={appointmentBooking?.slot}>
                                            <option value="">select</option>
                                            {slotsList?.[0].slotsList.map(slot => {
                                                // const slotValue = slot + `${slot.charAt(slot.length - 1) == ":" ? "00" : ":00"}`
                                                return (
                                                    <option value={slot}>{slot}</option>
                                                )
                                            })}
                                        </select>
                                        <div className="invalid-feedback">Please select slot.</div>
                                    </div>
                                    <div className="col-sm-2 dvCurrentSlot" style={{ display: `${!edit ? "block" : "none"}` }}>
                                        <label for="con-name">name</label>
                                    </div>
                                    <div className="col-sm-4 dvCurrentSlot" style={{ display: `${!edit ? "block" : "none"}` }}>
                                        <input className="form-control" id="txtCurrentSlot" type="text" required name='name' value={name} onChange={(e) => setName(e.target.value)} />
                                        <div className="invalid-feedback">Please enter Name.</div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3 col-md-12 mt-0">
                                <div className="row">
                                    <div className="col-sm-2">
                                        <label for="con-name">Add your message</label>
                                    </div>
                                    <div className="col-sm-10">
                                        <textarea className="form-control" id="txtCustomerComments" type="email" required name='comments' onChange={handleAppointmentInput} placeholder="Your Message" rows="5" value={appointmentBooking?.comments} />
                                        <div className="invalid-feedback">Please enter description.</div>
                                    </div>
                                </div>
                            </div>
                            {edit ? <button className="btn btn-primary pull-right" id="btnUpdateAppointment" type="submit">Update</button>
                                : <button className="btn btn-primary pull-right" id="btnSaveAppointment" type="submit" >Save</button>}
                            <button className="btn btn-secondary" type="button" data-bs-dismiss="modal" id="btnAppointmentCancel" onClick={closeModal}>Cancel</button>
                        </Form>
                    </div>
                </div>
            </Modal>
            <Modal show={cancelModal} size="lg" onHide={toogleCancel} backdrop="static" keyboard={false} >
                <div className="modal-body">
                    <Form noValidate validated={validateCancel} onSubmit={cancelAppointment} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                        {/* <form className="form-bookmark cancel-validation" id="frm-cancelAppointment" novalidate=""> */}
                        <div className="row g-2">
                            <div className="mb-3 col-md-12 my-0">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <label for="con-name">Fill reason for cancellation</label>
                                        <textarea className="form-control" id="txtCancellationReason" required value={reason} onChange={(e) => setReason(e.target.value)} rows="3"></textarea>
                                        <div className="invalid-feedback">Please enter reason for cancellation.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input id="index_var" type="hidden" value="5" />
                        <button className="btn btn-primary pull-right" type="submit" id="btnSaveCancelAppointment">
                            Save
                        </button>
                        <button className="btn btn-secondary" type="button"
                            data-bs-dismiss="modal" id="btnCancelSaveAppointment" onClick={toogleCancel}>
                            Cancel
                        </button>
                    </Form>
                </div>
            </Modal>
            <Modal show={confirmModal} size="sm" onHide={toogleConfirm} backdrop="static" keyboard={false} >
                <div class="modal-body">
                    <div class="row g-2">
                        <div class="mb-3 col-md-12 my-0">
                            <h6>Are you sure about the confirmation?</h6>
                        </div>
                    </div>
                    <button class="btn btn-primary pull-right" type="submit" id="btnSaveConfirmAppointment" onClick={confirmVisit}>
                        Yes
                    </button>
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal" onClick={toogleConfirm}>
                        Cancel
                    </button>
                </div>
            </Modal>
            <ToastContainer />
        </AccountLayout >
    )
}
