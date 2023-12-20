import React, { useEffect, useState } from 'react'
import { vendorInformationUrl } from '../../assets/Api/api'
import AccountLayout from '../../layout/account-layout/AccountLayout'
import BodyContainer from '../../layout/body-container/BodyContainer'
import axios from '../../assets/axios/axios'
import BodyHeader from '../../layout/body-header/BodyHeader'
import { Link } from 'react-router-dom'
import { Form, Modal } from 'react-bootstrap';
import CKEditors from "react-ckeditor-component";
import parse from 'html-react-parser'

export default function VendorInformation() {
    const store = JSON.parse(window.localStorage.getItem("store"))

    const idata = {
        pageNo: 1,
        pageSize: 5,
        storesId: store.id,
        fromDate: '',
        toDate: '',
        name: '',
        status: ''
    }

    var infoData = {
        storesId: store.id,
        name: '',
        details: '',
        status: '1'
    }

    const [search, setSearch] = useState(false);
    const [modal, setModal] = useState(false);
    const [postData, setPostData] = useState(idata)
    const [validated, setValidated] = useState(false)
    const [edit, setEdit] = useState(false)
    const [information, setInformation] = useState()
    const [informationDetails, setInformationDetails] = useState()
    const [infodetails, setInfoDetails] = useState(infoData)
    const [details, setDetails] = useState('')

    const toogle = () => setModal(!modal);

    const getData = (values) => {
        let data = values
        data.status = values.status == 2 ? false : true
        axios.post(`${vendorInformationUrl}/GetVendorInformationByIdOnFilter`, data)
            .then(response => {
                console.log(response);
                setInformation(response.data.data)
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    useEffect(() => {
        getData(postData)
    }, [])

    const getInformationDetails = (id) => {
        axios.get(`${vendorInformationUrl}/GetVendorInformation/${id}`)
            .then(response => {
                console.log(response);
                setInformationDetails(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }

    const onChange = (evt) => {
        const newContent = evt.editor.getData();
        setDetails(newContent)
    }

    const addInformation = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = infodetails
        data.status = infodetails.status == 1 ? true : false
        data.details = details
        console.log(data);
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            axios.post(`${vendorInformationUrl}/AddVendorInformation`, data)
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

    const editInformation = () => {
        setEdit(true)
        let data = infodetails
        data.name = informationDetails.name
        data.status = informationDetails.status ? '1' : '2'
        setDetails(informationDetails.details)
        toogle()
    }

    const updateInformation = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = infodetails
        data.status = infodetails.status == 1 ? true : false
        data.details = details
        data.id = informationDetails.id
        console.log(data);
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            axios.put(`${vendorInformationUrl}/UpdateVendorInformation`, data)
                .then(response => {
                    console.log(response);
                    getData(postData)
                    getInformationDetails(response.data.data.id)
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
        setValidated(false)
        setDetails('')
        setInfoDetails(infoData)
    }

    const clearFilter = () => {
        getData(idata)
        setPostData(idata)
    }

    const informationByFilter = () => {
        getData(postData)
    }

    const next = () => {
        if (information.pageNo < information.totalPages) {
            const page = postData
            page.pageNo = information.pageNo + 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }

    const previous = () => {
        if (information.pageNo > 1) {
            const page = postData
            page.pageNo = information.pageNo - 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }
    return (
        <AccountLayout title="Information" loader={false}>
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
                                                        <button type="button" id="btnFilter" class="btn btn-outline-primary me-1" onClick={informationByFilter}>
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
                                            <div class="row list-persons" id="addcon">
                                                <div class="col-xl-4 xl-30 col-md-5">
                                                    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                                                        aria-orientation="vertical">
                                                        <div id="div-information">
                                                            {information && information.vendorInformation.map(info => {
                                                                return (
                                                                    <Link to="#" id={`info-${info.id}`} className="nav-link" onClick={() => getInformationDetails(info.id)}>
                                                                        <div className="media">
                                                                            <div className="media-body"><h6>
                                                                                <span className="order_subject_0">{info.name}</span>
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
                                                                Showing <span id="spn-pageNo">{information && information.pageNo}</span> of <span id="spn-totalPages">{information && information.totalPages}</span> pages
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xl-8 xl-70 col-md-7">
                                                    <div class="tab-content"
                                                        id="v-pills-tabContent">
                                                        <div class="tab-pane contact-tab-0 tab-content-child fade show active"
                                                            id="div-information-details" role="tabpanel"
                                                            aria-labelledby="v-pills-user-tab" style={{ display: `${informationDetails ? "" : "none"}` }}>
                                                            <div class="profile-mail">
                                                                <div class="media">
                                                                    <div class="media-body mt-0">
                                                                        <h5>
                                                                            <span id="spn-lableName" class="first_name_0">
                                                                                {informationDetails && informationDetails.name}
                                                                            </span>
                                                                        </h5>
                                                                        <ul>
                                                                            <li class="checkPermission">
                                                                                <Link to="#" id="btnEdit" onClick={editInformation}>Edit</Link>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div class="email-general">
                                                                    <h6 class="mb-3">General details</h6>
                                                                    <ul>
                                                                        <li>
                                                                            Name <span id="spn-name" class="font-primary first_name_0">{informationDetails && informationDetails.name}</span>
                                                                        </li>
                                                                        <li>
                                                                            Status<span id="spn-status" class="badge badge-primary">{informationDetails && informationDetails.status ? "Active" : "Inavtive"}</span>
                                                                        </li>
                                                                        <li>Details</li>
                                                                    </ul>
                                                                    <div class="row mt-3">
                                                                        <div class="col-md-12">
                                                                            <p class="font-primary" style={{ fontWeight: "bold" }}><span id="spn-details">{informationDetails && parse(informationDetails.details)}</span></p>
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
                        <Form noValidate validated={validated} onSubmit={edit ? updateInformation : addInformation} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                            <div class="row g-2">
                                <div class="mb-3 col-md-12 mt-0">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <label for="con-name">Name</label>
                                            <input class="form-control" id="txtName" type="text" required autocomplete="off" value={infodetails.name} onChange={(e) => setInfoDetails({ ...infodetails, name: e.target.value })} />
                                            <div class="invalid-feedback">Please enter valid name.</div>
                                        </div>
                                        <div class="col-sm-6">
                                            <label for="con-phone">Status</label>
                                            <select class="form-control" id="ddlStatus" value={infodetails.status} onChange={(e) => setInfoDetails({ ...infodetails, status: e.target.value })}>
                                                <option value="1" >
                                                    Active
                                                </option>
                                                <option value="2">
                                                    Inactive
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <label>&nbsp;</label>
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <label for="con-phone">Editor</label>
                                            <CKEditors
                                                activeclassName="p10"
                                                content={details}
                                                events={{
                                                    "change": onChange
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <input id="index_var" type="hidden" value="5" />
                            <button class="btn btn-primary pull-right" type="submit">
                                Save
                            </button>
                            <button class="btn btn-secondary" type="button" id="btn-close-modal-information" onClick={closeModal}>
                                Cancel
                            </button>
                        </Form>
                    </div>
                </Modal>
            </BodyContainer>
        </AccountLayout>
    )
}
