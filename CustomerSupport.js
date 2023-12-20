import React, { useEffect, useRef, useState } from 'react'
import { Container, Row, Col, Card, CardBody, CardHeader, Button, CardFooter, Table, Input, Label, FormGroup } from 'reactstrap'
import { UserPlus, Activity, Slash, CheckSquare } from 'react-feather';
import AccountLayout from '../../layout/account-layout/AccountLayout'
import BodyContainer from '../../layout/body-container/BodyContainer'
import BodyHeader from '../../layout/body-header/BodyHeader'
import axios from '../../assets/axios/axios';
import { Form, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { Redirect } from 'react-router-dom';
import { customerSupportUrl, supportUrl } from '../../assets/Api/api';
import { Link } from 'react-router-dom';

export default function CustomerSupport() {
    const user = JSON.parse(window.localStorage.getItem("user"))
    const store = JSON.parse(window.localStorage.getItem("store"))

    const filterData = {
        pageNo: 1,
        pageSize: 5,
        StoresId: store.id,
        VendorsId: user.id,
        fromDate: '',
        toDate: '',
        subject: '',
        status: ''
    }
    let active = 0
    let completed = 0
    let cancelled = 0

    const [search, setSearch] = useState(false)
    const [allTickets, setAllTickets] = useState()
    const [supportTickets, setSupportTickets] = useState()
    const [selectedTicket, setSelectedTicket] = useState()
    const [confModal, setConfModal] = useState(false)
    const [addModal, setAddModal] = useState(false)
    const [validated, setValidated] = useState(false)
    const [status, setStatus] = useState()
    const [replyMsg, setReplyMsg] = useState({
        msg: "",
        attachment: ""
    })
    const [addTicketData, setAddTicketData] = useState({
        subject: "",
        attachment: "",
        description: ""
    })
    const [postData, setPostData] = useState(filterData)
    // const Status = selectedTicket?.[0].status != 1 ? disabled : ""
    const imageRef = useRef()
    const toogleConf = () => setConfModal(!confModal)
    const toogleAdd = () => setAddModal(!addModal)

    const getTickets = (data) => {
        axios.post(`${customerSupportUrl}/GetCustomerSupportsOnFilter`, data)
            .then(response => {
                console.log(response);
                setSupportTickets(response.data.data)
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    useEffect(() => {
        axios.get(`${supportUrl}/GetAllSupport`)
            .then(response => {
                console.log(response);
                setAllTickets(response.data.data)
                response.data.data.forEach(ticket => {
                    // console.log(ticket.status);
                    if (ticket.status == 1) {
                        active = active + 1
                        console.log(active);
                    } else if (ticket.status == 2) {
                        completed = completed + 1
                        console.log(completed);
                    } else {
                        cancelled = cancelled + 1
                        console.log(cancelled);
                    }
                })
            })
            .catch(error => {
                console.log(error);
            })

        getTickets(postData)
    }, [])

    if (allTickets) {
        allTickets.map(ticket => {
            // console.log(ticket.status);
            if (ticket.status == 1) {
                active = active + 1
                // console.log(active);
            } else if (ticket.status == 2) {
                completed = completed + 1
                // console.log(completed);
            } else {
                cancelled = cancelled + 1
                // console.log(cancelled);
            }
        })
    }

    const getSupportDetails = (id) => {
        axios.get(`${customerSupportUrl}/GetCustomerSupport/${id}`)
            .then(response => {
                console.log(response);
                setSelectedTicket(response.data.data)
                setStatus(response.data.data[0].status)
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    const addReply = () => {
        let msg = new FormData()
        msg.append('customerSupportId', selectedTicket[0].id);
        msg.append('replyFrom', user.roleId);
        msg.append('reply', replyMsg.msg);
        msg.append('file', replyMsg.attachment);
        msg.append('status', 1);
        // const data = {
        //     customerSupportId: selectedTicket[0].id,
        //     replyFrom: user.roleId,
        //     reply: replyMsg,
        //     file: '',
        //     status: 1
        // }
        // console.log(data);
        axios.post(`${customerSupportUrl}/AddCustomerSupportReply`, msg)
            .then(response => {
                console.log(response);
                getSupportDetails(response.data.data.customerSupportId)
                setReplyMsg({
                    msg: '',
                    attachment: ''
                })
            })
            .catch(error => {
                console.log(error.response);
                getSupportDetails(error.response.data.data.customerSupportId)
            })
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
            } else if (Size > 2) {
                toast.error("File size should be less than or equal to 2 MB.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
            }
            else {
                setAddTicketData({ ...addTicketData, attachment: e.target.files[0] })
                setReplyMsg({ ...replyMsg, attachment: e.target.files[0] })
            }
        }
    }
    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     const form = event.currentTarget;
    //     const data = new FormData()
    //     data.append('customersId', user.id);
    //     data.append('vendorsId', store.vendors.id);
    //     data.append('storesId', store.id);
    //     data.append('subject', addTicketData.subject);
    //     data.append('body', addTicketData.description);
    //     data.append('file', addTicketData.attachment);
    //     data.append('status', 1);
    //     if (form.checkValidity() === false) {
    //         console.log("validated false");
    //     } else {
    //         console.log("validated true");
    //         axios.post(`${supportUrl}/AddCustomerSupport`, data)
    //             .then(response => {
    //                 console.log(response);
    //                 getTickets(filterData)
    //                 toogleAdd()
    //             })
    //             .catch(error => {
    //                 console.log(error.response);
    //                 getTickets(filterData)
    //                 toogleAdd()
    //             })
    //     }
    //     setValidated(true)
    // }

    const changeStatus = (e) => {
        setStatus(e.target.value)
        toogleConf()
    }

    const updateStatus = () => {
        const data = {
            id: selectedTicket?.[0].id,
            status: status
        }
        // console.log(data);
        axios.put(`${customerSupportUrl}/UpdateCustomerChatStatus`, data)
            .then(response => {
                console.log(response);
                getSupportDetails(response.data.data.id)
                toogleConf()
            })
            .catch(error => {
                console.log(error.response);
                getSupportDetails(error.response.data.data.id)
                toogleConf()
            })
    }

    const handleFilterChange = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value
        })
    }

    const getTicketsOnFilter = () => {
        const data = postData
        data.VendorsId = store.vendorsId
        getTickets(data)
    }

    const clearFilter = () => {
        const data = filterData
        getTickets(data)
        setPostData(filterData)
        toast.info("Filters cleared", {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: true,
            autoClose: 3000
        })
    }

    const next = () => {
        if (supportTickets?.pageNo < supportTickets?.totalPages) {
            const page = filterData
            page.pageNo = supportTickets.pageNo + 1
            setPostData(page)
            getTickets(page)
            // console.log(page);
        }
    }

    const previous = () => {
        if (supportTickets?.pageNo > 1) {
            const page = filterData
            page.pageNo = supportTickets.pageNo - 1
            setPostData(page)
            getTickets(page)
        }
    }

    function formatDate(date) {
        var d = new Date(date);
        var hh = d.getHours();
        var mn = d.getMinutes();
        var dd = "AM";
        var h = hh;
        if (h >= 12) {
            h = hh - 12;
            dd = "PM";
        }
        if (h == 0) {
            h = 12;
        }
        mn = mn < 10 ? "0" + mn : mn;
        var pattern = new RegExp(hh + ":" + mn);
        var replacement = h + ":" + mn;
        replacement += " " + dd;

        return replacement;
    }
    // console.log(allTickets);
    // console.log(supportTickets);
    // console.log(selectedTicket);
    // console.log(status);
    // console.log(active, completed, cancelled, totalTickets);
    if (!user) {
        return <Redirect to={"login"} />
    }
    return (
        <AccountLayout title="Customer Support" loader={false}>
            <div className="row">
                <Col sm="6" xl="3" lg="6">
                    <Card className="o-hidden">
                        <CardBody className="bg-primary b-r-4 card-body">
                            <div className="media static-top-widget">
                                <div className="align-self-center text-center"><UserPlus /></div>
                                <div className="media-body"><span className="m-0">Total Support Tickets</span>
                                    <h4 className="mb-0 counter">{allTickets?.length}</h4><UserPlus className="icon-bg" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="6" xl="3" lg="6">
                    <Card className="o-hidden">
                        <div className="bg-secondary b-r-4 card-body">
                            <div className="media static-top-widget">
                                <div className="align-self-center text-center"><Activity /></div>
                                <div className="media-body"><span className="m-0">Active</span>
                                    <h4 className="mb-0 counter">{active}</h4><Activity className="icon-bg" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col sm="6" xl="3" lg="6">
                    <Card className="o-hidden">
                        <CardBody className="bg-primary b-r-4">
                            <div className="media static-top-widget">
                                <div className="align-self-center text-center"><CheckSquare /></div>
                                <div className="media-body"><span className="m-0">Completed</span>
                                    <h4 className="mb-0 counter">{completed}</h4><CheckSquare className="icon-bg" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="6" xl="3" lg="6">
                    <Card className="o-hidden">
                        <CardBody className="bg-primary b-r-4">
                            <div className="media static-top-widget">
                                <div className="align-self-center text-center"><Slash /></div>
                                <div className="media-body"><span className="m-0">Cancelled</span>
                                    <h4 className="mb-0 counter">{cancelled}</h4><Slash className="icon-bg" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </div>
            <BodyContainer>
                <div className="card-header">
                    <BodyHeader toogle={toogleAdd} search={search} setSearch={setSearch} addBtn={false} />
                    {/* <div className="file-content"> */}
                    {/* <div className="card mb-0"> */}
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card" id="dvQuickSearch" style={{ display: `${search ? "block" : "none"}` }}>
                                <div className="card-body">
                                    <div className="mb-3 col-md-12 my-0">
                                        <form id="frm-orders-search">
                                            <div className="mb-3 col-md-12 my-0">
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <label for="con-mail">From</label>
                                                        <input className="form-control" id="txt-Search-FromDate" name='fromDate' value={postData.fromDate} type="date" required="" onChange={handleFilterChange} autocomplete="off" />
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <label for="con-mail">To</label>
                                                        <input className="form-control" id="txt-Search-ToDate" name='toDate' value={postData.toDate} type="date" required="" onChange={handleFilterChange} autocomplete="off" />
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <label for="lblSubject">Subject</label>
                                                        <input className="form-control" id="txtSearchSubject" name='subject' value={postData.subject} type="text" autocomplete="off" onChange={handleFilterChange} />
                                                    </div>
                                                    <div className="col-sm-2">
                                                        <label for="lblStatus">Status</label>
                                                        <select className="form-control" id="ddlSearchStatus" name='status' value={postData.status} onChange={handleFilterChange}>
                                                            <option value=""
                                                                selected="">
                                                            </option>
                                                            <option value="2">
                                                                Complete
                                                            </option>
                                                            <option value="3">
                                                                Cancel
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-12 my-0">
                                                <div className="row">
                                                    <div className="col-sm-9">
                                                        <label for="">&nbsp;</label>
                                                        <br />
                                                        <button type="button" id="btnCloseFilter" className="btn btn-outline-primary" onClick={() => { setSearch(false); setPostData(filterData) }}>
                                                            Close
                                                        </button>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <label for="">&nbsp;</label>
                                                        <br />
                                                        <button type="button" id="btnFilter" className="btn btn-outline-primary mr-1" style={{ marginRight: "5px" }} onClick={getTicketsOnFilter}>
                                                            Search
                                                        </button>
                                                        <button type="button" id="btnClearFilter" className="btn btn-outline-primary" onClick={clearFilter}>
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
                                        <div className="card-body p-0">
                                            <div id="div-not-found" className="row" style={{ display: "none" }}>
                                                <div className="col-sm-12">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <h5 className="text-center">Data not found</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row list-persons" id="div-supports" style={{ display: "" }}>
                                                <div className="col-xl-4 xl-30 col-md-5">
                                                    <div className="nav flex-column nav-pills"
                                                        id="v-pills-tab" role="tablist"
                                                        aria-orientation="vertical">
                                                        <div id="div-support-tickets">
                                                            {supportTickets && supportTickets.customerSupport.map(ticket => {
                                                                return (
                                                                    <Link to="#" id={`support-${ticket.id}`} className="nav-link" onClick={() => getSupportDetails(ticket.id)}>
                                                                        <div className="media">
                                                                            <div className="media-body"><h6>
                                                                                <span className="support_subject_0">{ticket.subject}</span>
                                                                            </h6>
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                )
                                                            })}
                                                        </div>
                                                        <div className="dataTables_info">
                                                            <ul className="pagination justify-content-center pagination-primary">
                                                                <li className="page-item"><Link to="#" id="btnPrevious" className="page-link" onClick={previous}>Previous</Link></li>
                                                                <li className="page-item"><Link to="#" id="btnNext" className="page-link" onClick={next}>Next</Link></li>
                                                            </ul>
                                                            <div className="mt-3">
                                                                Showing <span id="spn-pageNo">{supportTickets?.pageNo}</span> of <span id="spn-totalPages">{supportTickets?.totalPages}</span> pages
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-8 xl-70 col-md-7">
                                                    <div className="tab-content" id="v-pills-tabContent">
                                                        <div className="tab-pane contact-tab-0 tab-content-child fade show active" style={{ display: `${selectedTicket ? "block" : "none"}` }} id="div-support-ticket-details" role="tabpanel" aria-labelledby="v-pills-user-tab">
                                                            <div className="profile-mail">
                                                                <div className="row">
                                                                    <div className="col-xl-12 col-md-12 box-col-12">
                                                                        <div className="col-xl-12 xl-100 chat-sec box-col-6">
                                                                            <div className="card chat-default">
                                                                                <div className="card-header card-no-border">
                                                                                    <div className="media media-dashboard">
                                                                                        <div className="media-body">
                                                                                            <h5 className="mb-0">
                                                                                                Live Chat
                                                                                            </h5>
                                                                                        </div>
                                                                                        <div className="pull-right">
                                                                                            <select className="form-control" id="ddlSupportChatStatus" disabled={selectedTicket?.[0].status != 1 ? true : false} value={status} onChange={changeStatus}>
                                                                                                <option value="1" selected>Active</option>
                                                                                                <option value="2">Mark as complete</option>
                                                                                                <option value="3">Mark as cancel </option>
                                                                                            </select>
                                                                                        </div>
                                                                                        <div id="" className="btn btn-outline-primary ms-2">
                                                                                            Download
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="card-body">
                                                                                    <div className="row chat-box">
                                                                                        {/* <!-- Chat right side start--> */}
                                                                                        <div className="col pe-0 chat-right-aside" style={{ maxWidth: "100%", flex: '1' }}>
                                                                                            {/* <!-- chat start--> */}
                                                                                            <div className="chat">
                                                                                                {/* <!-- chat-header start--> */}
                                                                                                {/* <!-- chat-header end--> */}
                                                                                                <div id="div-chat-history">
                                                                                                    <div className="chat-history chat-msg-box custom-scrollbar" >
                                                                                                        <ul>
                                                                                                            {/* {selectedTicket?.forEach(ticket => {
                                                                                                                    ticket.customerSupportReply.map(msg => {
                                                                                                                        let CreatedTime = formatDate(msg.createdAt);
                                                                                                                        if (msg.replyFrom != 2) {
                                                                                                                            if (msg.attachment == null) {
                                                                                                                                return (
                                                                                                                                    <li>
                                                                                                                                        <div className="message my-message" style={{ width: "50%" }}>
                                                                                                                                            <div className="message-data text-end">
                                                                                                                                                <span className="message-data-time">
                                                                                                                                                    {CreatedTime}
                                                                                                                                                </span>
                                                                                                                                            </div>
                                                                                                                                            {msg.reply}
                                                                                                                                        </div>
                                                                                                                                    </li>
                                                                                                                                )
                                                                                                                            } else {
                                                                                                                                return (
                                                                                                                                    <li>
                                                                                                                                        <div className="message my-message" style={{ width: "50%" }}>
                                                                                                                                            <img className="img-chat m-r-20 update_img_0 customSize" src={`${"../../../../" + msg.attachment}`} alt="" />
                                                                                                                                            <div className="message-data text-end">
                                                                                                                                                <span className="message-data-time">
                                                                                                                                                    {CreatedTime}
                                                                                                                                                </span>
                                                                                                                                            </div>
                                                                                                                                            {msg.reply}
                                                                                                                                        </div>
                                                                                                                                    </li>
                                                                                                                                )
                                                                                                                            }
                                                                                                                        } else {
                                                                                                                            if (msg.attachment == null) {
                                                                                                                                return (
                                                                                                                                    <li className="clearfix">
                                                                                                                                        <div className="message other-message pull-right" style={{ width: "50%" }}>
                                                                                                                                            <div className="message-data">
                                                                                                                                                <span className="message-data-time">
                                                                                                                                                    {CreatedTime}
                                                                                                                                                </span>
                                                                                                                                            </div>
                                                                                                                                            {msg.reply}
                                                                                                                                        </div>
                                                                                                                                    </li>
                                                                                                                                )
                                                                                                                            } else {
                                                                                                                                return (
                                                                                                                                    <li className="clearfix">
                                                                                                                                        <div className="message other-message pull-right" style={{ width: "50%" }}>
                                                                                                                                            <img className="img-chat m-r-20 update_img_0 customSize" src={`${"../../../../" + msg.attachment}`} alt="" />
                                                                                                                                            <div className="message-data">
                                                                                                                                                <span className="message-data-time">
                                                                                                                                                    {CreatedTime}
                                                                                                                                                </span>
                                                                                                                                            </div>
                                                                                                                                            {msg.reply}
                                                                                                                                        </div>
                                                                                                                                    </li>
                                                                                                                                )
                                                                                                                            }
                                                                                                                        }
                                                                                                                    })
                                                                                                                })} */}
                                                                                                            {
                                                                                                                selectedTicket?.[0].customerSupportReply.map(msg => {
                                                                                                                    let CreatedTime = formatDate(msg.createdAt);
                                                                                                                    if (msg.replyFrom != 3) {
                                                                                                                        if (msg.attachment == null) {
                                                                                                                            return (
                                                                                                                                <li>
                                                                                                                                    <div className="message my-message" style={{ width: "50%" }}>
                                                                                                                                        <div className="message-data text-end">
                                                                                                                                            <span className="message-data-time">
                                                                                                                                                {CreatedTime}
                                                                                                                                            </span>
                                                                                                                                        </div>
                                                                                                                                        {msg.reply}
                                                                                                                                    </div>
                                                                                                                                </li>
                                                                                                                            )
                                                                                                                        } else {
                                                                                                                            return (
                                                                                                                                <li>
                                                                                                                                    <div className="message my-message" style={{ width: "50%" }}>
                                                                                                                                        <img className="img-chat m-r-20 update_img_0 customSize" src={`${"../../../../" + msg.attachment}`} alt="" />
                                                                                                                                        <div className="message-data text-end">
                                                                                                                                            <span className="message-data-time">
                                                                                                                                                {CreatedTime}
                                                                                                                                            </span>
                                                                                                                                        </div>
                                                                                                                                        {msg.reply}
                                                                                                                                    </div>
                                                                                                                                </li>
                                                                                                                            )
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        if (msg.attachment == null) {
                                                                                                                            return (
                                                                                                                                <li className="clearfix">
                                                                                                                                    <div className="message other-message pull-right" style={{ width: "50%" }}>
                                                                                                                                        <div className="message-data">
                                                                                                                                            <span className="message-data-time">
                                                                                                                                                {CreatedTime}
                                                                                                                                            </span>
                                                                                                                                        </div>
                                                                                                                                        {msg.reply}
                                                                                                                                    </div>
                                                                                                                                </li>
                                                                                                                            )
                                                                                                                        } else {
                                                                                                                            return (
                                                                                                                                <li className="clearfix">
                                                                                                                                    <div className="message other-message pull-right" style={{ width: "50%" }}>
                                                                                                                                        <img className="img-chat m-r-20 update_img_0 customSize" src={`${"../../../../" + msg.attachment}`} alt="" />
                                                                                                                                        <div className="message-data">
                                                                                                                                            <span className="message-data-time">
                                                                                                                                                {CreatedTime}
                                                                                                                                            </span>
                                                                                                                                        </div>
                                                                                                                                        {msg.reply}
                                                                                                                                    </div>
                                                                                                                                </li>
                                                                                                                            )
                                                                                                                        }
                                                                                                                    }
                                                                                                                })
                                                                                                            }
                                                                                                            {/* <li className="clearfix">
                                                                                                                    <div className="message other-message pull-right" style={{ width: "50%" }}>
                                                                                                                        <div className="message-data">
                                                                                                                            <span className="message-data-time">
                                                                                                                                1:16 PM
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                        problem in meal plan
                                                                                                                    </div>
                                                                                                                </li>
                                                                                                                <li>
                                                                                                                    <div className="message my-message" style={{ width: "50%" }}>
                                                                                                                        <div className="message-data text-end">
                                                                                                                            <span className="message-data-time">
                                                                                                                                9:35 PM
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                        ytll what is your problem
                                                                                                                    </div>
                                                                                                                </li> */}
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                </div>
                                                                                                {/* <!-- end chat-history--> */}
                                                                                                {selectedTicket?.[0].status != 1 ? <></>
                                                                                                    : <div className="chat-message clearfix">
                                                                                                        <div className="row">
                                                                                                            {/* <!--<div className="col-xl-4"> */}
                                                                                                            {/* </div>--> */}
                                                                                                            <div id="div-reply" className="col-xl-12">
                                                                                                                <div className="input-group text-box">
                                                                                                                    <input className="form-control input-txt-bx" id="txtReply" type="text" name="message-to-send" placeholder="Type a message......" data-bs-original-title="" title="" value={replyMsg.msg} onChange={(e => setReplyMsg({ ...replyMsg, msg: e.target.value }))} />
                                                                                                                    <span onClick={() => imageRef.current.click()} style={{ marginTop: "10px" }}>
                                                                                                                        <input type="file" onChange={imageInput} style={{ display: "none" }} ref={imageRef} />
                                                                                                                        <img src="../../assets/fonts/feather/paperclip.svg" alt="" />
                                                                                                                    </span>
                                                                                                                    <input className="form-control" id="imgReplyAttachment" type="file" style={{ display: "none" }} />
                                                                                                                    <button className="input-group-text btn btn-success" id="btnSendReply" type="button" data-bs-original-title="" title="" onClick={addReply}>SEND</button>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                }
                                                                                                {/* <!-- end chat-message-->
                                                                                                    <!-- chat end-->
                                                                                                    <!-- Chat right side ends--> */}
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
                                    {/* </form> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal show={confModal} size="lg" onHide={toogleConf} backdrop="static" keyboard={false} >
                        <div className="modal-body">
                            <form className="form-bookmark needs-validation" id="bookmark-form" novalidate="">
                                <div className="row g-2">
                                    <div className="mb-3 col-md-12 my-0">
                                        <h6>Are you sure about the confirmation?</h6>
                                    </div>
                                </div>
                                <input id="index_var" type="hidden" value="5" />
                                <button className="btn btn-primary pull-right" type="button" id="btnSaveConfirmedChatStatus"
                                    onClick={updateStatus}>
                                    Yes
                                </button>
                                <button className="btn btn-secondary" type="button"
                                    data-bs-dismiss="modal" onClick={toogleConf}>
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </Modal>
                    {/* <Modal show={addModal} size="lg" onHide={toogleAdd} backdrop="static" keyboard={false} >
                        <div className="modal-body">
                            <Form noValidate validated={validated} onSubmit={handleSubmit} className="theme-form login-validation">
                                <div className="row g-2">
                                    <div className="mb-3 col-md-12 mt-0">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <label for="con-name">Subject</label>
                                                <input className="form-control" id="txtSubject" type="text" required placeholder="Name" autocomplete="off" value={addTicketData.subject} onChange={(e) => setAddTicketData({ ...addTicketData, subject: e.target.value })} />
                                                <div className="invalid-feedback">Please enter valid name.</div>
                                            </div>
                                            <div className="col-sm-6">
                                                <label for="con-name">Attachment</label>
                                                <input className="form-control" id="imgAttachment" type="file" placeholder="" autocomplete="off" onChange={imageInput} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3 col-md-12 mt-0">
                                        <label for="con-mail">Description</label>
                                        <textarea className="form-control" rows="3" id="txtDescription" type="text" required placeholder="Description" value={addTicketData.description} autocomplete="off" onChange={(e) => setAddTicketData({ ...addTicketData, description: e.target.value })} />
                                        <div className="invalid-feedback">Please enter valid description about subject.</div>
                                    </div>
                                </div>
                                <input id="index_var" type="hidden" value="5" />
                                <button id="btnSaveSupport" className="btn btn-primary pull-right" type="submit">
                                    Save
                                </button>
                                <button id="btnCancelSupport" className="btn btn-secondary" type="button" data-bs-dismiss="modal" onClick={toogleAdd}>
                                    Cancel
                                </button>
                            </Form>
                        </div>
                    </Modal> */}
                    {/* </div> */}
                    {/* </div> */}
                </div>
                <ToastContainer />
            </BodyContainer >
        </AccountLayout >
    )
}
