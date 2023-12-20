import React, { useEffect, useState } from 'react'
import { Edit, User } from 'react-feather'
import axios from '../../assets/axios/axios'
import { accessPermissionUrl } from '../../assets/Api/api'
import AccountLayout from '../../layout/account-layout/AccountLayout'
import { Modal, Form } from 'react-bootstrap'
import { toast, ToastContainer } from 'react-toastify'
import { Link } from 'react-router-dom'
import Users from '../../components/user-role/Users'

export default function UserRole() {

    const [roles, setRoles] = useState([])
    const [modal, setModal] = useState(false)
    const [edit, setEdit] = useState(false)
    const [validated, setValidated] = useState(false)
    const [roleName, setRoleName] = useState('')
    const [id, setId] = useState('')
    const [roleDetails, setRoleDetails] = useState({
        name: '',
        status: 'true'
    })

    const toogle = () => setModal(!modal)

    const getData = () => {
        axios.get(`${accessPermissionUrl}/GetRoles`)
            .then(response => {
                console.log(response);
                setRoles(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getData()
    }, [])

    const addRole = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = roleDetails
        const found = roles.find(role => role.name.toLowerCase() == data.name)
        console.log(found);
        console.log(data);
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            if (found) {
                toast.info("Role already exist.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
            } else {
                axios.post(`${accessPermissionUrl}/AddRole`, data)
                    .then(response => {
                        console.log(response);
                        closeModal()
                        getData()
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        }
        setValidated(true)
    }

    const editRole = (role) => {
        setEdit(true)
        setRoleName(role.name)
        let data = roleDetails
        data.name = role.name
        data.status = role.status
        data.id = role.id
        setRoleDetails(data)
        toogle()
    }

    const updateRole = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = roleDetails
        const found = roles.find(role => role.name == data.name)
        console.log(found);
        console.log(data);
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            if (found) {
                if (found.name == roleName) {
                    axios.put(`${accessPermissionUrl}/UpdateRole`, data)
                        .then(response => {
                            console.log(response);
                            closeModal()
                            getData()
                        })
                        .catch(error => {
                            console.log(error.response);
                        })
                } else {
                    toast.info("Role name already exist.", {
                        position: toast.POSITION.TOP_RIGHT,
                        hideProgressBar: true,
                        autoClose: 3000
                    })
                }
            } else {
                axios.put(`${accessPermissionUrl}/UpdateRole`, data)
                    .then(response => {
                        console.log(response);
                        closeModal()
                        getData()
                    })
                    .catch(error => {
                        console.log(error.response);
                    })
            }
        }
        setValidated(true)

    }

    const closeModal = () => {
        toogle()
        setEdit(false)
        setValidated(false)
        setRoleDetails({
            name: '',
            status: 'true'
        })
    }

    const users = (Id) => {
        return <Users id={Id} />
    }

    return (
        <AccountLayout title="User Role">
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
                                                    <button id="btnAddUser" class="badge-light-primary btn-block btn-mail w-100 checkPermission"
                                                        type="button">
                                                        <User /> New User
                                                    </button>
                                                </li>
                                                <li class="nav-item">
                                                    <span class="main-title"> Role type</span>
                                                </li>
                                                <li>
                                                    <button id="btnAddRole" class="btn btn-category checkPermission" type="button" onClick={toogle}>
                                                        <span class="title"> + Add Role</span>
                                                    </button>
                                                </li>
                                            </ul>
                                            <ul id="ul-roles" class="nav main-menu contact-options" role="tablist">
                                                {roles.map(role => {
                                                    return (
                                                        <li>
                                                            <Link to="#" id="4" onClick={() => setId(role.id)} data-bs-toggle="pill" style={{ float: "left", paddingRight: "15px" }}>
                                                                <span class="title">{role.name}</span>
                                                            </Link>
                                                            <i class="icofont" onclick="checkEditRole(4)" style={{ float: "right", paddingTop: "10px" }} onClick={() => editRole(role)}><Edit /></i>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {id && users(id)}
                    </div>
                </div>
            </div>
            <Modal show={modal} size="lg" onHide={toogle} backdrop="static" keyboard={false} >
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel1">
                        Add Role
                    </h5>
                    <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <Form noValidate validated={validated} onSubmit={edit ? updateRole : addRole} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                        <div class="row g-2">
                            <div class="mb-3 col-md-12">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <label for="con-phone">
                                            Role name
                                        </label>
                                        <input id="txtRoleName" class="form-control" type="text" required placeholder="Name" autocomplete="off" value={roleDetails.name} onChange={(e) => setRoleDetails({ ...roleDetails, name: e.target.value })} />
                                        <div class="invalid-feedback">Please enter valid role name.</div>
                                    </div>
                                    <div class="col-sm-6">
                                        <label for="con-phone">Status</label>
                                        <select id="ddlRoleStatus" class="form-control" value={roleDetails.status} onChange={(e) => setRoleDetails({ ...roleDetails, status: e.target.value })} >
                                            <option value="true" selected>Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button id="btnSaveRole" class="btn btn-primary pull-right" type="submit">
                            Save
                        </button>
                        <button id="btnCancelRole" class="btn btn-secondary" type="button" data-bs-dismiss="modal" onClick={closeModal}>
                            Cancel
                        </button>
                    </Form>
                </div>
            </Modal>
            <ToastContainer />
        </AccountLayout>
    )
}
