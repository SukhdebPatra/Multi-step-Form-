import React, { useEffect, useRef, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { Link } from 'react-router-dom';
import { Form, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';

import axios from '../../assets/axios/axios';
import Upload from '../../components/upload-modal/Upload';
import { ingredientsUrl, menusUrl, programUrl } from '../../assets/Api/api';
import AccountLayout from '../../layout/account-layout/AccountLayout';
import BodyContainer from '../../layout/body-container/BodyContainer';
import BodyHeader from '../../layout/body-header/BodyHeader'

export default function Menus() {
    const user = JSON.parse(window.localStorage.getItem("user"))
    const store = JSON.parse(window.localStorage.getItem("store"))

    const mdata = {
        storesId: store.id,
        pageNo: 1,
        pageSize: 5,
        fromDate: '',
        toDate: '',
        menusId: '',
        ingredientsId: '',
        status: ''
    };

    const menuData = {
        storesId: store.id,
        File: '',
        name: '',
        description: '',
        status: '1'
    }

    const [search, setSearch] = useState(false)
    const [postData, setPostData] = useState(mdata)
    const [loader, setLoader] = useState(false)
    const [menus, setMenus] = useState()
    const [allMenus, setAllMenus] = useState([])
    const [tab, setTab] = useState("1")
    const [selectedMenu, setSelectedMenu] = useState()
    const [edit, setEdit] = useState(false)
    const [modal, setModal] = useState(false)
    const [allIngredients, setAllIngredients] = useState([])
    const [selectedIngredient, setSelectedIngredient] = useState([])
    const [validated, setValidated] = useState(false)
    const [menuDetails, setMenuDetails] = useState(menuData)
    const [menuHistory, setMenuHistory] = useState()

    const imageRef = useRef()


    const toogle = () => setModal(!modal)

    const getData = (data) => {
        setLoader(true)
        axios.post(`${menusUrl}/GetMenusByIdOnFilter`, data)
            .then(response => {
                console.log(response);
                setMenus(response.data.data)
                setLoader(false)
            })
            .catch(error => {
                console.log(error.response);
                setLoader(false)
            })
    }

    const getAllMenus = () => {
        axios.get(`${programUrl}/GetMenus/${store.id}`)
            .then(response => {
                console.log(response);
                setAllMenus(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getData(postData)
        axios.get(`${ingredientsUrl}/GetIngredientsByStoreId/${store.id}`)
            .then(response => {
                console.log(response);
                setAllIngredients(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
        getAllMenus()
    }, [])

    const getMenuDetails = (id) => {
        setLoader(true)
        axios.get(`${menusUrl}/GetMenus/${id}`)
            .then(response => {
                console.log(response);
                setSelectedMenu(response.data.data)
                axios.get(`${menusUrl}/GetMenuHistory/${store.id}/${id}`)
                    .then(response => {
                        console.log(response);
                        setMenuHistory(response.data)
                        setLoader(false)
                    })
                    .catch(error => {
                        setLoader(false)
                        console.log(error);
                    })
            })
            .catch(error => {
                setLoader(false)
                console.log(error);
            })
    }

    const handleInput = (e) => {
        setMenuDetails({
            ...menuDetails,
            [e.target.name]: e.target.value
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
                setMenuDetails({ ...menuDetails, File: e.target.files[0] })
            }
        }
    }

    const editMenu = () => {
        toogle()
        setEdit(true)
        let data = menuDetails
        data.name = selectedMenu.name
        data.description = selectedMenu.description
        data.status = selectedMenu.status ? "1" : "0"
        setMenuDetails(data)
        let arr = []
        selectedMenu.menuIngredients.map(ing => {
            arr.push({
                ...ing,
                name: ing.ingredientsName
            })
        })
        console.log(arr);
        setSelectedIngredient(arr)
    }

    const selectIngredients = (selectedList, selectedItem) => {
        let item = selectedIngredient
        item.push({
            ...selectedItem,
            id: selectedItem.id
        })
        // console.log(item);
        setSelectedIngredient(item)
    }


    const addMenu = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        console.log(menuDetails);
        console.log(selectedIngredient);
        let data = new FormData()
        data.append("storesId", menuDetails.storesId)
        data.append("name", menuDetails.name)
        data.append("File", menuDetails.File)
        data.append("description", menuDetails.description)
        data.append("status", menuDetails.status == 1 ? true : false)
        selectedIngredient.map((ing, i) => {
            data.append(`menuIngredients[${i}].ingredientsId`, ing.id)
            data.append(`menuIngredients[${i}].status`, ing.status)
        })
        const found = allMenus.find(menu => menu.name == menuDetails.name)
        if (form.checkValidity() == false) {
            console.log("validity fails");
        } else {
            if (found) {
                toast.info("Menu name already exist.", {
                    position: toast.POSITION.TOP_RIGHT,
                    hideProgressBar: true,
                    autoClose: 3000
                })
            } else {
                setLoader(true)
                axios.post(`${menusUrl}/AddMenus`, data)
                    .then(response => {
                        console.log(response);
                        getData(postData)
                        closeModal()
                        getAllMenus()
                        toast.info(response.data.message, {
                            position: toast.POSITION.TOP_RIGHT,
                            hideProgressBar: true,
                            autoClose: 3000
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    })
                // console.log(data);
            }
            // for (var pair of data.entries()) {
            //     console.log(pair[0] + ', ' + pair[1]);
            // }
        }
        setValidated(true)
    }

    const updateMenu = (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        console.log(menuDetails);
        console.log(selectedIngredient);
        let data = new FormData()
        data.append('id', selectedMenu.id);
        data.append("storesId", menuDetails.storesId)
        data.append("name", menuDetails.name)
        data.append("File", menuDetails.File)
        data.append("description", menuDetails.description)
        data.append("status", menuDetails.status == 1 ? true : false)
        selectedIngredient.map((ing, i) => {
            data.append(`menuIngredients[${i}].menusId`, ing.menusId)
            data.append(`menuIngredients[${i}].ingredientsId`, ing.ingredientsId)
            data.append(`menuIngredients[${i}].status`, ing.status)
        })
        const found = allMenus.find(menu => menu.name == menuDetails.name)
        if (form.checkValidity() == false) {
            console.log("validity fails");
        } else {
            if (found) {
                if (found.name == selectedMenu.name) {
                    setLoader(true)
                    axios.put(`${menusUrl}/UpdateMenus`, data)
                        .then(response => {
                            console.log(response);
                            getData(postData)
                            closeModal()
                            getMenuDetails(response.data.data.id)
                            getAllMenus()
                            toast.info(response.data.message, {
                                position: toast.POSITION.TOP_RIGHT,
                                hideProgressBar: true,
                                autoClose: 3000
                            })
                        })
                        .catch(error => {
                            console.log(error.response);
                        })
                } else {
                    toast.info("Menu name already exist.", {
                        position: toast.POSITION.TOP_RIGHT,
                        hideProgressBar: true,
                        autoClose: 3000
                    })
                }
            } else {
                setLoader(true)
                axios.put(`${menusUrl}/UpdateMenus`, data)
                    .then(response => {
                        console.log(response);
                        getData(postData)
                        closeModal()
                        getMenuDetails(response.data.data.id)
                        getAllMenus()
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
        setValidated(true)
    }

    const closeModal = () => {
        toogle()
        setMenuDetails(menuData)
        setEdit(false)
        setSelectedIngredient([])
        setValidated(false)
    }

    const next = () => {
        if (menus.pageNo < menus.totalPages) {
            const page = postData
            page.pageNo = menus.pageNo + 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }

    const previous = () => {
        if (menus.pageNo > 1) {
            const page = postData
            page.pageNo = menus.pageNo - 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }

    const menusByFilter = () => {
        getData(postData)
    }

    const clearFilter = () => {
        getData(mdata)
        setPostData(mdata)
    }

    const handleSearch = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <AccountLayout title="Menus" loader={loader}>
            <BodyContainer>
                <div className="card-header">
                    <BodyHeader toogle={toogle} search={search} setSearch={setSearch} addBtn={true} >
                        <Upload url={menusUrl} exportPath="/ExportMenus/" importPath="/ImportMenus/" storeId={true} />
                    </BodyHeader>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="card" id="dvQuickSearch" style={{ display: `${search ? "block" : "none"}` }}>
                                <div class="card-body">
                                    <form id="frm-menu-search">
                                        <div class="mb-3 col-md-12 my-0">
                                            <div class="row">
                                                <div class="col-sm-2">
                                                    <label for="con-mail">From</label>
                                                    <input class="form-control" id="txt-Search-FromDate" type="date" name='fromDate' required="" autocomplete="off" value={postData.fromDate} onChange={handleSearch} />
                                                </div>
                                                <div class="col-sm-2">
                                                    <label for="con-mail">To</label>
                                                    <input class="form-control" id="txt-Search-ToDate" type="date" name='toDate' required="" autocomplete="off" value={postData.toDate} onChange={handleSearch} />
                                                </div>
                                                <div class="col-sm-3">
                                                    <div class="form-group">
                                                        <label id="lblMenuSearch">Menu name</label>
                                                        <div class="input-group">
                                                            <input id="txtMenuSearch" class="form-control" type="text" name='menusId' placeholder="Search menu" value={postData.menusId} onChange={handleSearch} />
                                                        </div>
                                                        <ul id="ulMenus"></ul>
                                                    </div>
                                                </div>
                                                <div class="col-sm-3">
                                                    <div class="form-group">
                                                        <label id="lblIngredientSearch">Ingredient name</label>
                                                        <div class="input-group">
                                                            <input id="txtIngredientSearch" class="form-control" type="text" placeholder="Search ingredient" name='ingredientsId' value={postData.ingredientsId} onChange={handleSearch} />
                                                        </div>
                                                        <ul id="ulIngredients"></ul>
                                                    </div>
                                                </div>
                                                <div class="col-sm-2">
                                                    <label for="con-phone">Status</label>
                                                    <select id="ddl-Search-Status" class="form-control" name='status' value={postData.status} onChange={handleSearch}>
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
                                                    <button type="button" id="btnCloseFilter" class="btn btn-outline-primary" onClick={() => { setSearch(false); setPostData(mdata) }}>
                                                        Close
                                                    </button>
                                                </div>
                                                <div class="col-sm-3">
                                                    <label for="">&nbsp;</label>
                                                    <br />
                                                    <button type="button" id="btnFilter" class="btn btn-outline-primary me-1" onClick={menusByFilter}>
                                                        Search
                                                    </button>
                                                    <button type="button" id="btnClearFilter" class="btn btn-outline-primary" onClick={clearFilter}>
                                                        Clear
                                                        filter
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
                                        <div class="card-body p-0">
                                            <div id="div-not-found" class="row" style={{ display: `${menus ? menus.menus.length < 1 ? "" : "none" : "none"}` }}>
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
                                                        <div id="div-menus">
                                                            {menus && menus.menus.map(menu => {
                                                                return (
                                                                    <Link to="#" id="menu-1" title="Greek Fruit Yogurt + granola + almonds" class="nav-link" onClick={() => getMenuDetails(menu.id)}>
                                                                        <div class="media">
                                                                            <div class="media-body">
                                                                                <h6> <span class="first_name_0">{menu.name}</span></h6>
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
                                                                Showing <span id="spn-pageNo">{menus && menus.pageNo}</span> of <span id="spn-totalPages">{menus && menus.totalPages}</span> pages
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xl-8 xl-70 col-md-7">
                                                    <div class="tab-content" id="v-pills-tabContent">
                                                        <div class="tab-pane contact-tab-0 tab-content-child fade show active"
                                                            id="div-menu-details" role="tabpanel" aria-labelledby="v-pills-user-tab" style={{ display: `${selectedMenu ? "" : "none"}` }}>
                                                            <div class="profile-mail">
                                                                <div class="media">
                                                                    <img id="bindMenuPic" class="img-100 img-fluid m-r-20 rounded-circle update_img_0"
                                                                        src="../assets/images/user/2.png" alt="" />
                                                                    <input class="updateimg" type="file" name="img" onchange="readURL(this,0)" />
                                                                    <div class="media-body mt-0">
                                                                        <h5><span class="first_name_0" id="spn-labelName">{selectedMenu && selectedMenu.name}</span></h5>
                                                                        <ul>
                                                                            <li><Link id="txtDetails" to="#" onClick={() => setTab("1")}>Details</Link></li>
                                                                            <li class="checkPermission"><Link to="#" id="btnEdit" onClick={editMenu}>Edit</Link></li>
                                                                            <li><Link id="txtMenuHistory" to="#" onClick={() => setTab("2")}>Menu history</Link></li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div class="email-general">
                                                                    <div id="dvImages"
                                                                        style={{ display: "none" }}>
                                                                        <div class="mb-3 col-md-12 my-0">
                                                                            <div style={{ float: "right" }}>
                                                                                <div data-bs-toggle="modal"
                                                                                    data-bs-target="#imageModal"
                                                                                    class="btn btn-outline-primary ms-2">
                                                                                    <i data-feather="plus">
                                                                                    </i>Add new image
                                                                                </div>
                                                                            </div>
                                                                            <label>&nbsp;</label>
                                                                            <div class="avatar-showcase">
                                                                                <div class="avatars">
                                                                                    <div class="avatar ratio">
                                                                                        <img class="b-r-8 img-80"
                                                                                            src="../assets/images/user/1.jpg"
                                                                                            alt="#" />
                                                                                    </div>
                                                                                    <div class="avatar ratio">
                                                                                        <img class="b-r-8 img-80"
                                                                                            src="../assets/images/user/1.jpg"
                                                                                            alt="#" />
                                                                                    </div>
                                                                                    <div class="avatar ratio">
                                                                                        <img class="b-r-8 img-80"
                                                                                            src="../assets/images/user/1.jpg"
                                                                                            alt="#" />
                                                                                    </div>
                                                                                    <div class="avatar ratio">
                                                                                        <img class="b-r-8 img-80"
                                                                                            src="../assets/images/user/1.jpg"
                                                                                            alt="#" />
                                                                                    </div>
                                                                                    <div class="avatar ratio">
                                                                                        <img class="b-r-8 img-80"
                                                                                            src="../assets/images/user/1.jpg"
                                                                                            alt="#" />
                                                                                    </div>
                                                                                    <div class="avatar ratio">
                                                                                        <img class="b-r-8 img-80"
                                                                                            src="../assets/images/user/1.jpg"
                                                                                            alt="#" />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div id="dvmenuHistory" style={{ display: `${tab == 2 ? "" : "none"}` }}>
                                                                        <div class="mb-3 col-md-12 mt-0">

                                                                            <div class="col-xl-12 xl-100 chart_data_left box-col-12">
                                                                                <div class="card">
                                                                                    <div class="card-body p-0">
                                                                                        <div class="row m-0 chart-main">
                                                                                            <div class="col-xl-4 col-md-6 col-sm-6 p-0 box-col-6">
                                                                                                <div class="media align-items-center">
                                                                                                    <div class="media-body">
                                                                                                        <div class="right-chart-content">
                                                                                                            <h4 id="total">{menuHistory && menuHistory.total}</h4><span>Total menu </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-xl-12 xl-100 chart_data_left box-col-12">
                                                                                <div class="card">
                                                                                    <div class="card-body p-0">
                                                                                        <div class="row m-0 chart-main" id="dv-slots">

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div id="dvDetails" style={{ display: `${tab == 1 ? "" : "none"}` }}>
                                                                        <h6 class="mb-3">General details</h6>
                                                                        <ul>
                                                                            <li>
                                                                                Name <span class="font-primary first_name_0" id="spn-name">{selectedMenu && selectedMenu.name}</span>
                                                                            </li>
                                                                            <li>Status<span class="badge badge-primary" id="spn-status">{selectedMenu && selectedMenu.status ? "Active" : 'Inactive'}</span></li>
                                                                            <li>Ingredients<span class="font-primary first_name_0" id="div-ingredients">
                                                                                {selectedMenu && selectedMenu.menuIngredients.map(ing => {
                                                                                    return (
                                                                                        <span class="badge badge-success">{ing.ingredientsName}</span>
                                                                                    )
                                                                                })}</span></li>
                                                                            <li>Description</li>
                                                                        </ul>
                                                                        <div class="row mt-3">
                                                                            <div class="col-md-12">
                                                                                <p class="font-primary" style={{ fontweight: "bold" }}><span id="spn-description">{selectedMenu && selectedMenu.description}</span></p>
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
                </div>
                <Modal show={modal} size="md" onHide={toogle} backdrop="static" keyboard={false} >
                    <div class="modal-body">
                        {/* <form class="form-bookmark menu-validation" id="frm-menu" novalidate="" onsubmit="return false">                         */}
                        <Form noValidate validated={validated} onSubmit={edit ? updateMenu : addMenu} className="form-bookmark enquiry-validation" id="frm-modal-add-appointment">
                            <div class="row g-2">
                                <div class="mb-3 col-md-12 mt-0">
                                    <div class="row mb-2">
                                        <div class="col-auto">
                                            <img id="imgMenuPic" class="img-70 rounded-circle" style={{ cursor: "pointer" }} src="../assets/images/user/7.jpg" alt="User Profile Pic" />
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <input class="form-control" id="MenuImgAttachment" type="file" accept=".jpg, .jpeg, .png" autocomplete="off" ref={imageRef} onChange={imageInput} />
                                    </div>
                                </div>
                                <div class="mb-3 col-md-12 mt-0">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <label for="">Menu name</label>
                                            <input class="form-control" id="txtName" type="text" required placeholder="Menu name" autocomplete="off" name='name' value={menuDetails.name} onChange={handleInput} />
                                            <div class="invalid-feedback">Please enter valid menu name.</div>
                                        </div>
                                        <div class="col-sm-6">
                                            <label for="">Status</label>
                                            <select class="form-control" id="ddlStatus" name='status' value={menuDetails.status} onChange={handleInput}>
                                                <option value="1">Active</option>
                                                <option value="0">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 col-md-12 mt-0">
                                    <label for="">Select ingredient</label>
                                    <Multiselect
                                        options={allIngredients} // Options to display in the dropdown
                                        selectedValues={selectedIngredient} // Preselected value to persist in dropdown
                                        onSelect={selectIngredients} // Function will trigger on select event
                                        // onRemove={onAllergiesRemove} // Function will trigger on remove event
                                        displayValue="name" // Property name to display in the dropdown options

                                    />
                                    {/* <select class="form-control select2" multiple="multiple" id="ddlIngredients" required
                                        style={{ width: "100%" }}>
                                        <option value="" disabled>Select ingredients</option>
                                    </select> */}
                                    <div class="invalid-feedback">Please select valid ingredients.</div>
                                </div>
                                <div class="mb-3 col-md-12 mt-0">
                                    <label for="">Description</label>
                                    <textarea class="form-control" id="txtDescription" type="text" required rows="3" placeholder="Description" autocomplete="off" name='description' value={menuDetails.description} onChange={handleInput} />
                                    <div class="invalid-feedback">Please enter valid description about menu.</div>
                                </div>
                            </div>
                            <input id="index_var" type="hidden" value="5" />
                            <button id="btn-save-modal-menu" class="btn btn-primary pull-right" type="submit">
                                Save
                            </button>
                            <button class="btn btn-secondary" type="button" id="btn-close-modal-menu" onClick={toogle}>
                                Cancel
                            </button>
                        </Form>
                    </div>
                </Modal>
                <ToastContainer />
            </BodyContainer>
        </AccountLayout>
    );
}
