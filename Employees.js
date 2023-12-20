import React, { useEffect, useRef, useState } from 'react'
import AccountLayout from '../../layout/account-layout/AccountLayout'
import { Modal, Form } from 'react-bootstrap'
import axios from '../../assets/axios/axios';
import { employeeTypeUrl, employeeUrl, genderUrl, nationalityUrl } from '../../assets/Api/api';
import { Link } from 'react-router-dom';
import { Edit, User } from 'react-feather';
import Employe from '../../components/employees/Employe';
import { toast, ToastContainer } from 'react-toastify';

export default function Employees() {
    const store = JSON.parse(window.localStorage.getItem("store"))

    const tdata = {
        pageNo: 1,
        pageSize: 5,
        storesId: store.id,
        status: null
    };

    const typedata = {
        storesId: store.id,
        name: '',
        status: '1'
    }

    const edata = {
        StoresId: store.id,
        FirstName: '',
        LastName: '',
        EmployeeTypeId: '',
        GenderId: '',
        NationalityId: '',
        DOB: '',
        Email: '',
        ContactNumber: '',
        QatarId: '',
        City: '',
        Address: '',
        Email: '',
        File: '',
        Status: '1',
    }

    const [refresh, setRefresh] = useState(false)
    const [modal, setModal] = useState(false)
    const [employeeModal, setEmployeeModal] = useState(false)
    const [edit, setEdit] = useState(false)
    const [validated, setValidated] = useState(false)
    const [postData, setPostData] = useState(tdata)
    const [employeeTypes, setEmployeeTypes] = useState()
    const [typeDetails, setTypeDetails] = useState(typedata)
    const [id, setId] = useState('')
    const [genders, setGenders] = useState([])
    const [nationalities, setNationalities] = useState([])
    const [employeeDetails, setEmployeeDetails] = useState(edata)

    const imageRef = useRef()

    const toogle = () => setModal(!modal)
    const toogleEmployee = () => setEmployeeModal(!employeeModal)

    const getData = (data) => {
        axios.post(`${employeeTypeUrl}/GetEmployeeTypesOnFilter`, data)
            .then(response => {
                console.log(response);
                setEmployeeTypes(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getData(postData)

        axios.get(`${genderUrl}/GetAllGender`)
            .then(response => {
                console.log(response);
                setGenders(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })

        axios.get(`${nationalityUrl}/GetNationalities`)
            .then(response => {
                console.log(response);
                setNationalities(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    const addEmployeeType = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = typeDetails
        data.status = typeDetails.status == 1 ? true : false
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        console.log(data);
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            axios.post(`${employeeTypeUrl}/AddEmployeeType`, data)
                .then(response => {
                    console.log(response);
                    closeModal()
                })
                .catch(error => {
                    console.log(error);
                })
        }
        setValidated(true)
    }

    const editEmployeeType = (type) => {
        setEdit(true)
        let data = typeDetails
        data.name = type.name
        data.status = type.status ? '1' : '0'
        data.id = type.id
        setTypeDetails(data)
        toogle()
    }

    const updateEmployeeType = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = typeDetails
        data.status = typeDetails.status == 1 ? true : false
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        console.log(data);
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            axios.put(`${employeeTypeUrl}/UpdateEmployeeType`, data)
                .then(response => {
                    console.log(response);
                    closeModal()
                })
                .catch(error => {
                    console.log(error);
                })
        }
        setValidated(true)
    }

    const closeModal = () => {
        toogle()
        setEdit(false)
        setTypeDetails(typedata)
        setValidated(false)
    }

    const employeeTypeDetails = (id) => {
        return <Employe id={id} edit={editEmployee} refresh={refresh} />
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
                imageRef.current.value = ''
            } else if (Size > 2) {
                toast.error("File size should be less than or equal to 2 MB.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
                imageRef.current.value = ''
            }
            else {
                setEmployeeDetails({ ...employeeDetails, File: e.target.files[0] })
            }
        }
    }

    const handleInput = (e) => {
        setEmployeeDetails({
            ...employeeDetails,
            [e.target.name]: e.target.value
        })
    }

    const addEmployee = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = new FormData()
        data.append('StoresId', store.id);
        data.append('FirstName', employeeDetails.FirstName);
        data.append('LastName', employeeDetails.LastName);
        data.append('EmployeeTypeId', employeeDetails.EmployeeTypeId);
        data.append('GenderId', employeeDetails.GenderId);
        data.append('NationalityId', employeeDetails.NationalityId);
        data.append('DOB', employeeDetails.DOB);
        data.append('Email', employeeDetails.Email);
        data.append('ContactNumber', employeeDetails.ContactNumber);
        data.append('QatarId', employeeDetails.QatarId);
        data.append('City', employeeDetails.City);
        data.append('Address', employeeDetails.Address);
        data.append('File', employeeDetails.File);
        data.append('Status', employeeDetails.Status == 1 ? true : false);
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        console.log(employeeDetails);
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            axios.post(`${employeeUrl}/AddEmployee`, data)
                .then(response => {
                    console.log(response);
                    closeEmployeeModal()
                    setRefresh(!refresh)
                })
                .catch(error => {
                    console.log(error.response);
                })
        }
        for (var pair of data.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        setValidated(true)
    }

    const editEmployee = (employee) => {
        setEdit(true)
        let data = employeeDetails
        data.FirstName = employee.firstName
        data.LastName = employee.lastName
        data.DOB = employee.dob.split('T')[0]
        data.Address = employee.address
        data.City = employee.city
        data.GenderId = employee.genderId
        data.EmployeeTypeId = employee.employeeTypeId
        data.Email = employee.email
        data.ContactNumber = employee.contactNumber
        data.QatarId = employee.qatarId
        data.NationalityId = employee.nationalityId
        data.Status = employee.status ? '1' : '0'
        data.id = employee.id
        setEmployeeDetails(data)
        toogleEmployee()
    }

    const updateEmployee = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = new FormData()
        data.append('Id', employeeDetails.id);
        data.append('StoresId', store.id);
        data.append('FirstName', employeeDetails.FirstName);
        data.append('LastName', employeeDetails.LastName);
        data.append('EmployeeTypeId', employeeDetails.EmployeeTypeId);
        data.append('GenderId', employeeDetails.GenderId);
        data.append('NationalityId', employeeDetails.NationalityId);
        data.append('DOB', employeeDetails.DOB);
        data.append('Email', employeeDetails.Email);
        data.append('ContactNumber', employeeDetails.ContactNumber);
        data.append('QatarId', employeeDetails.QatarId);
        data.append('City', employeeDetails.City);
        data.append('Address', employeeDetails.Address);
        data.append('File', employeeDetails.File);
        data.append('Status', employeeDetails.Status == 1 ? true : false);
        // const found = allIngredients.find(ing => ing.name == data.name)
        let found = false
        console.log(employeeDetails);
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            axios.put(`${employeeUrl}/UpdateEmployee`, data)
                .then(response => {
                    console.log(response);
                    closeEmployeeModal()
                    setRefresh(!refresh)
                })
                .catch(error => {
                    console.log(error.response);
                })
        }
        // for (var pair of data.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }
        setValidated(true)
    }

    const closeEmployeeModal = () => {
        toogleEmployee()
        setEdit(false)
        setValidated(false)
        setEmployeeDetails(edata)
    }

    return (
        <AccountLayout title="Employees" loader={false}>
            <div className="container-fluid">
                <div className="email-wrap bookmark-wrap">
                    <div class="row">
                        <div class="col-xl-3 box-col-6">
                            <div class="email-left-aside">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="email-app-sidebar left-bookmark">
                                            <ul class="nav main-menu contact-options" role="tablist">
                                                <li class="nav-item">
                                                    <button id="btnAddEmployee" class="badge-light-primary btn-block btn-mail w-100 checkPermission" type="button" onClick={toogleEmployee}>
                                                        <i class="me-2"
                                                            data-feather="users"><User /></i> New employee
                                                    </button>
                                                </li>
                                                <li class="nav-item"><span class="main-title"> Employees type</span></li>
                                                <li>
                                                    <button id="btnAddEmployeeType" class="btn btn-category checkPermission" type="button" onClick={toogle}>
                                                        <span class="title"> + Add employee type</span>
                                                    </button>
                                                </li>
                                            </ul>
                                            <ul id="ul-employee-type" class="nav main-menu contact-options" role="tablist">
                                                {employeeTypes && employeeTypes.employeeType.map(employee => {
                                                    return (
                                                        <li>
                                                            <Link to="#" id="' + value.id + '" onClick={() => setId(employee.id)} style={{ float: "left", paddingRight: "15px" }} data-bs-toggle="pill">
                                                                <span class="title">{employee.name}</span>
                                                            </Link>
                                                            <i class="icofont icofont-edit checkPermission" onClick={() => editEmployeeType(employee)} style={{ float: "right", paddingTop: "10px" }} ><Edit /> </i>
                                                        </li>
                                                    )
                                                })}

                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {id && employeeTypeDetails(id)}
                    </div>
                </div>
                {/* {console.log(employeeTypeDetails())} */}
                {/* <Employe id={3} /> */}
            </div>
            <Modal show={modal} size="md" onHide={toogle} backdrop="static" keyboard={false} >
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel1">Add employee type</h5>
                    <button class="btn-close" type="button" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <Form noValidate validated={validated} onSubmit={edit ? updateEmployeeType : addEmployeeType} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                        <div class="row g-2">
                            <div class="mb-3 col-md-12">
                                <label for="con-mail">Employee type</label>
                                <input id="txtEmployeeTypeName" class="form-control" type="text" required placeholder="Enter name" autocomplete="off" value={typeDetails.name} onChange={(e) => setTypeDetails({ ...typeDetails, name: e.target.value })} />
                                <div class="invalid-feedback">Please enter valid employee type.</div>
                            </div>
                            <div class="mb-3 col-md-12">
                                <label for="con-mail">Status</label>
                                <select class="form-control" id="ddlEmployeeTypeStatus" value={typeDetails.status} onChange={(e) => setTypeDetails({ ...typeDetails, status: e.target.value })}>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <button id="btnSaveEmployeeType" class="btn btn-primary pull-right" type="submit">
                            Save
                        </button>
                        <button id="btnCancelEmployeeType" type='button' class="btn btn-secondary" data-bs-dismiss="modal" onClick={closeModal}>
                            Cancel
                        </button>
                    </Form>
                </div>
            </Modal>
            <Modal show={employeeModal} size="xl" onHide={toogleEmployee} backdrop="static" keyboard={false} >
                <div class="modal-body">
                    <Form noValidate validated={validated} onSubmit={edit ? updateEmployee : addEmployee} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                        <div class="row g-2">
                            <div class="mb-3 col-md-12 mt-0">
                                <div class="row">
                                    <div class="col-sm-4">
                                        <label for="con-name">Profile picture</label>
                                        <input class="form-control" id="MenuImgAttachment" type="file" accept=".jpg, .jpeg, .png" autocomplete="off" ref={imageRef} onChange={imageInput} />
                                    </div>
                                    <div class="col-sm-4">
                                        <label for="con-name">First name</label>
                                        <input class="form-control" id="txtEmployeeFirstName" type="text" required="" placeholder="First Name" autocomplete="off" name='FirstName' value={employeeDetails.FirstName} onChange={handleInput} />
                                        <div class="invalid-feedback">Please enter valid first name.</div>
                                    </div>
                                    <div class="col-sm-4">
                                        <label for="con-name">Last name</label>
                                        <input class="form-control" id="txtEmployeeLastName" type="text" required="" placeholder="Last Name" autocomplete="off" name='LastName' value={employeeDetails.LastName} onChange={handleInput} />
                                        <div class="invalid-feedback">Please enter valid last name.</div>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3 col-md-12 mt-0">
                                <div class="row">
                                    <div class="col-sm-4">
                                        <label for="con-name">Mobile number</label>
                                        <input class="form-control" id="txtEmployeePhoneNumber" type="number" required="" placeholder="Phone Number" autocomplete="off" name='ContactNumber' value={employeeDetails.ContactNumber} onChange={handleInput} />
                                        <div class="invalid-feedback">Please enter valid mobile number.</div>
                                    </div>
                                    <div class="col-sm-4">
                                        <label for="con-name">DOB</label>
                                        <input class="form-control" id="txtEmployeeDOB" type="date" required="" placeholder="DOB" autocomplete="off" name='DOB' value={employeeDetails.DOB} onChange={handleInput} />
                                        <div class="invalid-feedback">Please select date of birth.</div>
                                    </div>
                                    <div class="col-sm-4">
                                        <label for="con-mail">Email</label>
                                        <input class="form-control" id="txtEmployeeEmail" type="text" required="" placeholder="Email" autocomplete="off" name='Email' value={employeeDetails.Email} onChange={handleInput} />
                                        <div class="invalid-feedback">Please enter valid email address.</div>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3 col-md-12 mt-0">
                                <div class="row">
                                    <div class="col-sm-4">
                                        <label for="con-name">City</label>
                                        <input class="form-control" id="txtEmployeeCity" type="text" required="" placeholder="City" autocomplete="off" name='City' value={employeeDetails.City} onChange={handleInput} />
                                        <div class="invalid-feedback">Please enter valid city name.</div>
                                    </div>
                                    <div class="col-sm-4">
                                        <label for="con-name">Employee type</label>
                                        <select class="form-control" id="ddlEmployeeType" required name='EmployeeTypeId' value={employeeDetails.EmployeeTypeId} onChange={handleInput}>
                                            <option>Select employee type</option>
                                            {employeeTypes && employeeTypes.employeeType.map(employee => <option value={employee.id}>{employee.name}</option>)}
                                        </select>
                                        <div class="invalid-feedback">Please select valid employee type.</div>
                                    </div>
                                    <div class="col-sm-4">
                                        <label for="con-name">Gender</label>
                                        <select class="form-control" id="ddlGender" required name='GenderId' value={employeeDetails.GenderId} onChange={handleInput}>
                                            <option>Select gender</option>
                                            {genders.map(gender => <option value={gender.id}>{gender.name}</option>)}
                                        </select>
                                        <div class="invalid-feedback">Please select valid gender.</div>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3 col-md-12 mt-0">
                                <div class="row">
                                    <div class="col-sm-4">
                                        <label for="con-name">Nationality</label>
                                        <select class="form-control" id="ddlNationality" required name='NationalityId' value={employeeDetails.NationalityId} onChange={handleInput}>
                                            <option>Select nationality</option>
                                            {nationalities.map(nationality => <option value={nationality.id}>{nationality.name}</option>)}
                                        </select>
                                        <div class="invalid-feedback">Please select valid nationality.</div>
                                    </div>
                                    <div class="col-sm-4">
                                        <label for="con-name">ID number</label>
                                        <input class="form-control" id="txtEmployeeQatarID" type="number" required="" placeholder="ID number" autocomplete="off" name='QatarId' value={employeeDetails.QatarId} onChange={handleInput} />
                                        <div class="invalid-feedback">Please enter valid id.</div>
                                    </div>
                                    <div class="col-sm-4">
                                        <label for="con-name">Status</label>
                                        <select class="form-control" id="ddlEmployeeStatus" name='status' value={employeeDetails.status} onChange={handleInput}>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3 col-md-12 my-0">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <label for="con-mail">Address</label>
                                                <textarea class="form-control" id="txtEmployeeAddress" required placeholder="Address" rows="4" name='Address' value={employeeDetails.Address} onChange={handleInput} />
                                                <div class="invalid-feedback">Please enter valid address.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input id="index_var" type="hidden" value="5" />
                        <button id="btnSaveEmployee" class="btn btn-primary pull-right" type="submit">
                            Save
                        </button>
                        <button id="btnCancelEmployee" class="btn btn-secondary" type="button" data-bs-dismiss="modal" onClick={closeEmployeeModal}>
                            Cancel
                        </button>
                    </Form>
                </div>
            </Modal>
            <ToastContainer />
        </AccountLayout >
    )
}
