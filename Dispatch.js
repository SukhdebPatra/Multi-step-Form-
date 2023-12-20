import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Eye, Search } from 'react-feather'
import { Link } from 'react-router-dom'
import { kotUrl, storePreferenceUrl } from '../../assets/Api/api'
import axios from '../../assets/axios/axios'
import history from '../../assets/history/history'
import AllergieAndDislikes from '../../components/allergi-dislikes/AllergieAndDislikes'
import AccountLayout from '../../layout/account-layout/AccountLayout'

export default function Dispatch() {
    const user = JSON.parse(window.localStorage.getItem("user"))
    const store = JSON.parse(window.localStorage.getItem("store"))

    let kotID = ''

    const [storePreference, setStorePrefrence] = useState()
    const [selectedDate, setSelectedDate] = useState(moment(new Date()).format("YYYY-MM-DD"))
    const [deliveryDate, setDeliveryDate] = useState()
    const [modal, setModal] = useState(false)
    const [allMealPlans, setAllMealPlans] = useState([])
    const [type, setType] = useState(1)
    const [tab, setTab] = useState(0)
    const [propsData, setPropsData] = useState([])
    const [count, setCount] = useState({
        to: 0,
        actual: 0
    })
    // const [kotId, setKotId] = useState(0)
    const toogle = () => setModal(!modal)
    const getKot = () => {
        axios.get(`${kotUrl}/GetKOTByDate/${selectedDate}`)
            .then(response => {
                console.log(response);
                const counts = count
                response.data.data.map(plan => {
                    counts.to = counts.to + +plan.kot.totalCustomers
                    counts.actual = counts.actual + Number(plan.kot.totalCustomers) + Number(plan.kot.complimentary)
                })
                setCount(counts)
                setAllMealPlans(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        axios.get(`${storePreferenceUrl}/GetStorePreferenceByStoreId/${store.id}`)
            .then(response => {
                console.log(response);
                setStorePrefrence(response.data.data)
                const deliver = moment(new Date(selectedDate)).add(response.data.data.kotDays, "days")
                setDeliveryDate(moment(new Date(deliver)).format("YYYY-MM-DD"))
                getKot()
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    const dispatch = () => {
        let data = {
            id: kotID
        }
        axios.put(`${kotUrl}/UpdateKOTDispatch`, data)
            .then(response => {
                console.log(response);
                history.push("/vendor/kdashboard")
            })
            .catch(error => {
                console.log(error.response);
            })
        console.log(data);
    }

    const ShowAllergies = (data) => {
        setPropsData(data)
        setType(2)
        toogle()

    }
    const ShowDislikes = (data) => {
        setPropsData(data)
        setType(1)
        toogle()
    }
    return (
        <AccountLayout title="Dispatch Summary" loader={false}>
            <div class="container-fluid">
                <div class="email-wrap bookmark-wrap">
                    <div class="row">
                        <div class="col-xl-12 col-md-12 box-col-12">
                            <div class="email-right-aside bookmark-tabcontent contacts-tabs">
                                <div class="card email-body radius-left">
                                    <div class="ps-0">
                                        <div class="tab-content">
                                            <div class="tab-pane fade active show" id="pills-personal" role="tabpanel" aria-labelledby="pills-personal-tab">
                                                <div class="file-content">
                                                    <div class="card mb-0">
                                                        <div class="card-header">
                                                            <div class="row">
                                                                <div class="col-sm-2">
                                                                    <label>Preparation date</label>
                                                                    <input class="form-control" id="date" type="date" required="" autocomplete="off" data-bs-original-title="" title="" value={selectedDate} min={moment(new Date()).format("YYYY-MM-DD")} onChange={(e) => setSelectedDate(e.target.value)} />

                                                                </div>
                                                                <div class="col-sm-1">
                                                                    <label><br /></label>
                                                                    <button class="btn btn-primary btn-xs" id="btnClass" onClick={getKot}><Search /></button>
                                                                </div>

                                                                <div class="col-sm-2">
                                                                    <label>Delivery date</label>
                                                                    <input class="form-control" id="dtDelivery" type="date" required="" disabled autocomplete="off" data-bs-original-title="" value={deliveryDate} title="" />

                                                                </div>
                                                                <div class="col-sm-5" id="dv-info">
                                                                    <div class="pull-right" id="project">
                                                                        <p>To deliver: <span id="spn-deliver"></span>{count.to}</p>
                                                                        <p>Actual delivery: <span id="spn-actual-delivery">{count.actual}</span></p>
                                                                    </div>
                                                                </div>
                                                                <div class="col-sm-2" style={{ display: `${allMealPlans.length > 0 ? "block" : "none"}` }}>
                                                                    <Link to="#" class="btn btn-success" id="btnDispatch" onClick={dispatch}>Dispatch</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card-body p-0">
                                                            <div class="row list-persons" id="addcon">
                                                                <div id="div-note" class="row" style={{ display: `${allMealPlans.length < 1 ? "block" : "none"}` }}>
                                                                    <div class="col-sm-12">
                                                                        <div class="card">
                                                                            <div class="card-body">
                                                                                <h5 class="text-center" id="show-note">No Orders found</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div id="dv-data" style={{ display: `${allMealPlans.length > 0 ? "block" : "none"}` }}>
                                                                    <div class="col-xl-12 xl-100 col-md-12">
                                                                        <div class="table-responsive">
                                                                            <table class="table table-sm">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th scope="col" colspan='12'>#</th>
                                                                                        <th scope="col" colspan='12'>Meal&nbsp;plan</th>
                                                                                        <th scope="col" colspan='12'>Slot</th>
                                                                                        <th scope="col" colspan='12'>Menu</th>
                                                                                        <th scope="col" colspan='12'>Calories</th>
                                                                                        <th scope="col" colspan='12'>Allergies</th>
                                                                                        <th scope="col" colspan='12'>Dislikes</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody id="tblDataBody">
                                                                                    {allMealPlans.map((plan, i) => {
                                                                                        kotID = plan.kot.id
                                                                                        return (
                                                                                            <>
                                                                                                <tr class='table-active'>
                                                                                                    <th colspan='12' data-bs-toggle='collapse' id='accordionclose" + hkey + "' data-bs-target='#collapse1" + hkey + "' role='button' aria-expanded='false' aria-controls=" + hkey + ">
                                                                                                        <i style={{ color: 'red' }} class='fa fa-arrow-circle-right'  onClick={() => setTab(i)}></i>
                                                                                                    </th>
                                                                                                    <th colspan='12' style={{ textAlign: "center" }}>
                                                                                                        <u> Customer&nbsp;  &nbsp; {plan.customer.name} &nbsp;-&nbsp;{plan.customer.mobileNumber} </u>
                                                                                                    </th>
                                                                                                    <th colspan='12' style={{ textAlign: "center" }}>
                                                                                                        <u>To&nbsp;be&nbsp;delivered&nbsp;:&nbsp;1</u>
                                                                                                    </th>
                                                                                                    <th colspan='12' style={{ textAlign: "center" }}>
                                                                                                        <u>Complimentary&nbsp;:&nbsp;{plan.complimentary}</u>
                                                                                                    </th>
                                                                                                    <th colspan='12' style={{ textAlign: "center" }}>
                                                                                                        <u>Days&nbsp;:&nbsp;1</u>
                                                                                                    </th>
                                                                                                    <th colspan='12' style={{ textAlign: "center" }}>
                                                                                                        <u> Actual&nbsp;delivery&nbsp;:&nbsp;{plan.complimentary + 1}</u>
                                                                                                    </th>
                                                                                                    <th colspan='12' style={{ textAlign: "center" }}>
                                                                                                        <u></u>
                                                                                                    </th>
                                                                                                </tr>
                                                                                                {plan.kotMenuDetails.map((menu, index) => {
                                                                                                    return (
                                                                                                        <tr class='collapse show' id='collapse1hkey' data-bs-parent='#accordionclose" + hkey + "'  style={{ display: `${tab == index ? "" : "none"}` }}>
                                                                                                            <td colspan='12'>{index + 1}</td>
                                                                                                            <td colspan='12'>{menu.mealPlan}</td>
                                                                                                            <td colspan='12'>{menu.slotName}</td>
                                                                                                            <td colspan='12'>{menu.menuName}</td>
                                                                                                            <td colspan='12'>{menu.portion}</td>
                                                                                                            <td colspan="12">{menu.allergies.length > 0 ? <Eye onClick={() => ShowAllergies(menu.allergies)} /> : "No allergies"}</td>
                                                                                                            <td colspan="12">{menu.dislikes.length > 0 ? <Eye onClick={() => ShowDislikes(menu.dislikes)} /> : "No dislikes"}</td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                })}
                                                                                            </>
                                                                                        )
                                                                                    })}
                                                                                </tbody>
                                                                            </table>
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
            <AllergieAndDislikes
                type={type}
                data={propsData}
                modal={modal}
                toogle={toogle}
            />
        </AccountLayout>
    )
}
