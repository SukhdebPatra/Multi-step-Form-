import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import axios from '../../assets/axios/axios';
// import axios from '../../assets/axios/axios';
// import { ingredientsUrl } from '../../assets/Api/api';
import AccountLayout from '../../layout/account-layout/AccountLayout';
import BodyContainer from '../../layout/body-container/BodyContainer';
import BodyHeader from '../../layout/body-header/BodyHeader'
import Upload from '../../components/upload-modal/Upload';
import { Form, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { ingredientsUrl } from '../../assets/Api/api';

export default function Ingredients() {
    const user = JSON.parse(window.localStorage.getItem("user"))
    const store = JSON.parse(window.localStorage.getItem("store"))

    const idata = {
        storesId: store.id,
        pageNo: 1,
        pageSize: 5,
        fromDate: '',
        toDate: '',
        name: '',
        status: ''
    };
    const ingredientData = {
        storesId: store.id,
        name: '',
        description: '',
        status: '1',
    }

    const [search, setSearch] = useState(false);
    const [loader, setLoader] = useState(false)
    const [postData, setPostData] = useState(idata);
    const [ingredients, setIngredients] = useState()
    const [selectedIngredient, setSelectedIngredient] = useState()
    const [tab, setTab] = useState("1")
    const [modal, setModal] = useState(false)
    const [edit, setEdit] = useState(false)
    const [validated, setValidated] = useState(false)
    const [allIngredients, setAllIngredients] = useState([])
    const [ingredientDetails, setIngredientDetails] = useState(ingredientData)
    const [ingrDislikesAndAllergies, setIngrDislikesAndAllergies] = useState()

    const toogle = () => setModal(!modal)

    const getData = (data) => {
        setLoader(true)
        axios.post(`${ingredientsUrl}/GetIngredientsByIdOnFilter`, data)
            .then(response => {
                console.log(response);
                setIngredients(response.data.data)
                setLoader(false)
            })
            .catch(error => {
                console.log(error.response);
                setLoader(false)
            })
    }

    const getAllIngredients = () => {
        axios.get(`${ingredientsUrl}/GetIngredientsByStoreId/${store.id}`)
            .then(response => {
                console.log(response);
                setAllIngredients(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getData(postData)
        getAllIngredients()
    }, [])

    const getIngredientDetails = (id) => {
        setLoader(true)
        axios.get(`${ingredientsUrl}/GetIngredient/${id}`)
            .then(response => {
                console.log(response);
                setSelectedIngredient(response.data.data)
                setLoader(false)
            })
        axios.get(`${ingredientsUrl}/GetDislikesAndAllergies/${id}`)
            .then(response => {
                console.log(response);
                setIngrDislikesAndAllergies(response.data)
                setLoader(false)
            })
            .catch(error => {
                console.log(error.response);
            })
            .catch(error => {
                console.log(error);
                setLoader(false)
            })
    }

    const editIngredient = () => {
        toogle()
        setEdit(true)
        let data = ingredientDetails
        data.name = selectedIngredient.name
        data.description = selectedIngredient.description
        data.status = selectedIngredient.status ? "1" : "0"
        data.id = selectedIngredient.id
        setIngredientDetails(data)
    }

    const handleInput = (e) => {
        setIngredientDetails({
            ...ingredientDetails,
            [e.target.name]: e.target.value
        })
    }

    const addIngredient = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = ingredientDetails
        data.status = ingredientDetails.status == 1 ? true : false
        const found = allIngredients.find(ing => ing.name == data.name)
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            console.log(data);
            if (found) {
                toast.info("Ingredient name already exist.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
            } else {
                setLoader(true)
                axios.post(`${ingredientsUrl}/AddIngredient`, data)
                    .then(response => {
                        console.log(response);
                        closeModal()
                        getData(postData)
                        getAllIngredients()
                        toast.info(response.data.message, {
                            position: toast.POSITION.TOP_RIGHT,
                            hideProgressBar: true,
                            autoClose: 3000
                        })
                    })
                    .catch(error => {
                        console.log(error.response);
                    })
            }
        }
        console.log(found);
        setValidated(true)
    }

    const updateIngredient = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        let data = ingredientDetails
        data.status = ingredientDetails.status == 1 ? true : false
        const found = allIngredients.find(ing => ing.name == data.name)
        if (form.checkValidity() === false) {
            console.log("validity fails");
        } else {
            console.log(data);
            if (found) {
                console.log(found);
                if (found.name == selectedIngredient.name) {
                    setLoader(true)
                    axios.put(`${ingredientsUrl}/UpdateIngredient`, data)
                        .then(response => {
                            console.log(response);
                            closeModal()
                            getIngredientDetails(response.data.data.id)
                            getData(postData)
                            toast.info(response.data.message, {
                                position: toast.POSITION.TOP_RIGHT,
                                hideProgressBar: true,
                                autoClose: 3000
                            })
                            getAllIngredients()
                        })
                        .catch(error => {
                            console.log(error.response);
                        })
                } else {
                    toast.info("Ingredient name already exist.", {
                        position: toast.POSITION.TOP_RIGHT,
                        hideProgressBar: true,
                        autoClose: 3000
                    })
                }
            } else {
                setLoader(true)
                axios.put(`${ingredientsUrl}/UpdateIngredient`, data)
                    .then(response => {
                        console.log(response);
                        closeModal()
                        getIngredientDetails(response.data.data.id)
                        getData(postData)
                        toast.info(response.data.message, {
                            position: toast.POSITION.TOP_RIGHT,
                            hideProgressBar: true,
                            autoClose: 3000
                        })
                        getAllIngredients()
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
        setIngredientDetails(ingredientData)
        setValidated(false)
        setEdit(false)
    }

    const next = () => {
        if (ingredients.pageNo < ingredients.totalPages) {
            const page = postData
            page.pageNo = ingredients.pageNo + 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }

    const previous = () => {
        if (ingredients.pageNo > 1) {
            const page = postData
            page.pageNo = ingredients.pageNo - 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }

    const ingredientByFilter = () => {
        getData(postData)
    }

    const clearFilter = () => {
        getData(idata)
        setPostData(idata)
    }

    const handleSearch = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value
        })
    }
    return (
        <AccountLayout title="Ingredients" loader={loader}>
            <BodyContainer>
                <div className="card-header">
                    <BodyHeader toogle={toogle} search={search} setSearch={setSearch} addBtn={true} uploadBtn={true} >
                        <Upload url={ingredientsUrl} exportPath="/ExportIngredients/" importPath="/ImportIngredients/" storeId={true} />
                    </BodyHeader>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="card" id="dvQuickSearch" style={{ display: `${search ? "block" : "none"}` }}>
                                <div class="card-body">
                                    <form id="frm-ingredient-search">
                                        <div class="mb-3 col-md-12 my-0">
                                            <div class="row">
                                                <div class="col-sm-3">
                                                    <label for="con-mail">From</label>
                                                    <input class="form-control" id="txt-Search-FromDate" type="date" name='fromDate' required="" autocomplete="off" value={postData.fromDate} onChange={handleSearch} />
                                                </div>
                                                <div class="col-sm-3">
                                                    <label for="con-mail">To</label>
                                                    <input class="form-control" id="txt-Search-ToDate" type="date" name='toDate' required="" autocomplete="off" value={postData.toDate} onChange={handleSearch} />
                                                </div>
                                                <div class="col-sm-3">
                                                    <label for="con-mail">Ingredient</label>
                                                    <div class="input-group">
                                                        <input id="txt-Search-Name" class="form-control" type="text" name='name' placeholder="Ingredient name" value={postData.name} onChange={handleSearch} />
                                                    </div>
                                                </div>
                                                <div class="col-sm-3">
                                                    <label for="con-phone">Status</label>
                                                    <select id="ddl-Search-Status" name='status' class="form-control" value={postData.status} onChange={handleSearch}>
                                                        <option value="" selected>Select</option>
                                                        <option value="true">Active</option>
                                                        <option value="false">Inactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-3 col-md-12 my-0">
                                            <div class="row">
                                                <div class="col-sm-9">
                                                    <label for="">&nbsp;</label>
                                                    <br />
                                                    <button type="button" id="btnCloseFilter" class="btn btn-outline-primary" onClick={() => { setSearch(false); setPostData(idata) }}>
                                                        Close
                                                    </button>
                                                </div>
                                                <div class="col-sm-3">
                                                    <label for="">&nbsp;</label>
                                                    <br />
                                                    <button type="button" id="btnFilter" class="btn btn-outline-primary me-1" onClick={ingredientByFilter}>
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
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card" id="dvSearch" style={{ display: "block" }}>
                                <div className="card-body">
                                    <div className="mb-3 col-md-12 my-0">
                                        <div className="card-body p-0">

                                            <div id="div-not-found" class="row" style={{ display: `${ingredients ? ingredients.ingredients.length < 1 ? "" : "none" : "none"}` }}>
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
                                                    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                                                        aria-orientation="vertical">
                                                        <div id="div-ingredients">
                                                            {ingredients && ingredients.ingredients.map(ingredient => {
                                                                return (
                                                                    <Link to="#" id="slot-1" title="Breakfast" class="nav-link" onClick={() => getIngredientDetails(ingredient.id)}>
                                                                        <div class="media">
                                                                            <div class="media-body">
                                                                                <h6> <span class="first_name_0">{ingredient.name}</span></h6>
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
                                                                Showing <span id="spn-pageNo">{ingredients && ingredients.pageNo}</span> of <span id="spn-totalPages">{ingredients && ingredients.totalPages}</span> pages
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xl-8 xl-70 col-md-7">
                                                    <div class="tab-content" id="v-pills-tabContent">
                                                        <div class="tab-pane contact-tab-0 tab-content-child fade show active"
                                                            id="div-ingredient-details" role="tabpanel" aria-labelledby="v-pills-user-tab" style={{ display: `${selectedIngredient ? "" : "none"}` }}>
                                                            <div class="profile-mail">
                                                                <div class="media">
                                                                    <div class="media-body mt-0">
                                                                        <h5><span class="first_name_0" id="spn-labelName">{selectedIngredient && selectedIngredient.name}</span></h5>
                                                                        <ul>
                                                                            <li><Link id="txtDetails" to="#" onClick={() => setTab("1")}>Details</Link></li>
                                                                            <li class="checkPermission">
                                                                                <Link to="#" id="btnEdit" onClick={editIngredient}>Edit</Link>
                                                                            </li>
                                                                            <li><Link id="txtAllergy" to="#" onClick={() => setTab("2")}>Dislikes & allergy</Link></li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div class="email-general">
                                                                    <div id="dvDetails" style={{ display: `${tab == 1 ? "" : "none"}` }}>
                                                                        <h6 class="mb-3">General details</h6>
                                                                        <ul>
                                                                            <li>Name <span id="spn-name" class="font-primary">{selectedIngredient && selectedIngredient.name}</span></li>
                                                                            <li>Status<span id="spn-status" class="badge badge-primary">{selectedIngredient && selectedIngredient.status ? "Active" : "Inactive"}</span></li>
                                                                            <li>Description</li>
                                                                        </ul>
                                                                        <div class="row mt-3">
                                                                            <div class="col-md-12">
                                                                                <p class="font-primary" style={{ fontWeight: "bold" }}><span id="spn-description">{selectedIngredient && selectedIngredient.description}</span></p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div id="dvAllergy" style={{ display: `${tab == 2 ? "" : "none"}` }}>
                                                                        <ul>
                                                                            <li>Total customers dislike <span class="font-primary first_name_0" id="totalDislikes">{ingrDislikesAndAllergies && ingrDislikesAndAllergies.dislikes}</span></li>
                                                                            <li>Toatl customers allergy <span class="font-primary" id="totalAllergies">{ingrDislikesAndAllergies && ingrDislikesAndAllergies.allergies}</span></li>
                                                                        </ul>
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
                <Modal show={modal} size="md" onHide={toogle} backdrop="static" keyboard={false} >
                    <div class="modal-body">
                        <Form noValidate validated={validated} onSubmit={edit ? updateIngredient : addIngredient} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                            <div class="row g-2">
                                <div class="mb-3 col-md-12 mt-0">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <label for="con-name">Ingredient name</label>
                                            <input class="form-control" id="txtName" type="text" required placeholder="Ingredient name" autocomplete="off" name='name' value={ingredientDetails.name} onChange={handleInput} />
                                            <div class="invalid-feedback">Please enter valid ingredient name.</div>
                                        </div>
                                        <div class="col-sm-6">
                                            <label for="con-phone">Status</label>
                                            <select class="form-control" id="ddlStatus" name='status' value={ingredientDetails.status} onChange={handleInput}>
                                                <option value="1" selected>
                                                    Active
                                                </option>
                                                <option value="0">
                                                    Inactive
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 col-md-12 mt-0">
                                    <label for="con-name">Description</label>
                                    <textarea class="form-control" id="txtDescription" type="text" required rows="3" placeholder="Description" autocomplete="off" name='description' value={ingredientDetails.description} onChange={handleInput} />
                                    <div class="invalid-feedback">Please enter valid description about ingredient.</div>
                                </div>
                            </div>
                            <input id="index_var" type="hidden" value="5" />
                            <button class="btn btn-secondary" type="button" id="btn-close-modal-ingredient" onClick={closeModal}>
                                Cancel
                            </button>
                            <button id="btn-save-modal-ingredient" class="btn btn-primary pull-right" type="submit" >
                                Save
                            </button>
                        </Form>
                    </div>
                </Modal>
                <ToastContainer />
            </BodyContainer >
        </AccountLayout >
    );
}
