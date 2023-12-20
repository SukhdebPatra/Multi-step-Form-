import React, { useEffect, useRef, useState } from 'react'
import { adminUrl, vendorAuthUrl } from '../../assets/Api/api'
import AccountLayout from '../../layout/account-layout/AccountLayout'
import axios from '../../assets/axios/axios'
import BodyContainer from '../../layout/body-container/BodyContainer'
import { Form } from 'react-bootstrap'
import { toast, ToastContainer } from 'react-toastify'

export default function Profile() {
    const user = JSON.parse(window.localStorage.getItem("user"))

    const [vendor, setVendor] = useState()
    const [validated, setValidated] = useState(false)
    const [details, setDetails] = useState({
        firstName: '',
        lastName: '',
        file: '',
        email: '',
        contactNumber: '',
        password: '',
        reType: ''
    })

    const imageRef = useRef()

    const getData = (id) => {
        axios.get(`${adminUrl}/GetVendor/${id}`)
            .then(response => {
                console.log(response);
                edit(response.data.data)
                setVendor(response.data.data)
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    useEffect(() => {
        getData(user.id)
    }, [])

    const edit = (vendor) => {
        let data = details
        data.firstName = vendor.firstName
        data.lastName = vendor.lastName
        data.email = vendor.email
        data.contactNumber = vendor.mobileNumber
        data.password = ''
        data.reType = ''
        setDetails(data)
    }

    const imageInput = (e) => {
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
                setDetails({ ...setDetails, file: e.target.files[0] })
            }
        }
    }

    const handleInput = (e) => {
        setDetails({
            ...details,
            [e.target.name]: e.target.value
        })
    }

    const saveDetails = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = new FormData()
        data.append('Id', user.id);
        data.append('File', details.file);
        data.append('FirstName', details.firstName);
        data.append('LastName', details.lastName);
        data.append('MobileNumber', details.contactNumber);
        data.append('Email', details.email);
        data.append('Password', details.password);
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            if (details.contactNumber.length > 8 || details.contactNumber.length < 8) {
                toast.error("Mobile number should be of 8 digit.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                });
                setValidated(true)
            } else if (details.password.length > 0 || details.reType.length > 0) {
                if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/.test(details.password)) {
                    const msg = "Password must contain minimum eight characters, maximum 12 characters, at least one upppercase letter, at least one lowercase letter and one number and one special character."
                    toast.error(msg, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                        autoClose: 3000
                    });
                } else if (details.password != details.reType) {
                    toast.error("Password did not match: Please try again.", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        hideProgressBar: true,
                        autoClose: 3000
                    });
                } else {
                    axios.put(`${vendorAuthUrl}/UpdateVendor`, data)
                        .then(response => {
                            console.log(response);
                            getData(user.id)
                            setValidated(false)
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
                setValidated(true)
            } else {
                axios.put(`${vendorAuthUrl}/UpdateVendor`, data)
                    .then(response => {
                        console.log(response);
                        getData(user.id)
                        setValidated(false)
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
            for (var pair of data.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }
        }
        setValidated(true)
    }
    return (
        <AccountLayout title="Profile edit">
            <div class="row">
                <div class="col-sm-12">
                    <div class="edit-profile">
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="card">
                                    <div class="card-body">
                                        <form class="theme-form">
                                            <div class="row mb-2">
                                                <div class="col-auto">
                                                    <img id="imgVendorPic" class="img-70 rounded-circle" style={{ cursor: "pointer" }} src="../assets/images/user/7.jpg" alt="User Profile Pic" />
                                                </div>
                                                <div class="col">
                                                    <h3 id="spnName" class="mb-1">{vendor && vendor.firstName} {vendor && vendor.lastName}</h3>
                                                    <p id="spnRole" class="mb-4">Vendor</p>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <input class="form-control" id="MenuImgAttachment" type="file" accept=".jpg, .jpeg, .png" autocomplete="off" ref={imageRef} onChange={imageInput} />
                                                {/* <input class="form-control" id="Attachment" type="file" required autocomplete="off" /> */}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-8">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title mb-0">Edit Profile</h4>
                                        <div class="card-options"><a class="card-options-collapse" href="#" data-toggle="card-collapse"><i class="fe fe-chevron-up"></i></a><a class="card-options-remove" href="#" data-toggle="card-remove"><i class="fe fe-x"></i></a></div>
                                    </div>
                                    <div class="card-body p-4">
                                        <Form noValidate validated={validated} onSubmit={saveDetails} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                                            <div class="mb-3 col-md-12 mt-0">
                                                <div class="row">
                                                    <div class="col-sm-6 col-md-4">
                                                        <div class="form-group">
                                                            <label class="form-label">First name</label>
                                                            <input id="txtFirstName" class="form-control" type="text" placeholder="First name" required name='firstName' value={details.firstName} onChange={handleInput} />
                                                            <div class="invalid-feedback">Please enter valid firstname.</div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6 col-md-4">
                                                        <div class="form-group">
                                                            <label class="form-label">Last name</label>
                                                            <input id="txtLastName" class="form-control" type="text" placeholder="Last name" required name='lastName' value={details.lastName} onChange={handleInput} />
                                                            <div class="invalid-feedback">Please enter valid lastname.</div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6 col-md-4">
                                                        <div class="form-group">
                                                            <label class="form-label">Mobile number</label>
                                                            <input id="txtMobileNumber" class="form-control" type="number" placeholder="Mobile number" required name='contactNumber' value={details.contactNumber} onChange={handleInput} />
                                                            <div class="invalid-feedback">Please enter valid mobile number.</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="mb-3 col-md-12 mt-0">
                                                <div class="row">
                                                    <div class="col-sm-6 col-md-4">
                                                        <div class="form-group">
                                                            <label class="form-label">Email</label>
                                                            <input id="txtEmail" class="form-control" type="email" placeholder="Email" required name='email' value={details.email} onChange={handleInput} />
                                                            <div class="invalid-feedback">Please enter valid email address.</div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6 col-md-4">
                                                        <div class="form-group">
                                                            <label class="form-label">Password</label>
                                                            <input id="txtPassword" class="form-control" type="password" placeholder="*******" name='password' value={details.password} onChange={handleInput} />
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6 col-md-4">
                                                        <div class="form-group">
                                                            <label class="form-label">Confirm password</label>
                                                            <input id="txtConfirmPassword" class="form-control" type="password" required={details.password.length > 0 ? true : false} placeholder="*******" name='reType' value={details.reType} onChange={handleInput} />
                                                            <div class="invalid-feedback">Please retype your Password.</div>
                                                        </div>
                                                    </div>
                                                    <label>&nbsp;</label>
                                                    <div class="col-md-12">
                                                        <button id="btnSave" type="submit" class="btn btn-primary pull-right">Save</button>
                                                        <button id="btnClose" type="button" class="btn btn-danger">Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </AccountLayout>
    )
}
