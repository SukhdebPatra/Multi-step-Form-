import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Eye, Search } from 'react-feather'
import { Link } from 'react-router-dom'
import { kotUrl, storePreferenceUrl } from '../../assets/Api/api'
import axios from '../../assets/axios/axios'
import history from '../../assets/history/history'
import AllergieAndDislikes from '../../components/allergi-dislikes/AllergieAndDislikes'
import AccountLayout from '../../layout/account-layout/AccountLayout'

export default function Kot() {
    const user = JSON.parse(window.localStorage.getItem("user"))
    const store = JSON.parse(window.localStorage.getItem("store"))
    const kitchenId = JSON.parse(window.sessionStorage.getItem("kotId"))

    let totalMeals = 0

    const [storePreference, setStorePrefrence] = useState()
    const [selectedDate, setSelectedDate] = useState(moment(new Date()).format("YYYY-MM-DD"))
    const [deliveryDate, setDeliveryDate] = useState()
    const [allMealPlans, setAllMealPlans] = useState([])
    const [complimentaryBoxes, setComplimentaryBoxes] = useState(0)
    const [propsData, setPropsData] = useState([])
    const [type, setType] = useState(1)
    const [tab, setTab] = useState(0)
    const [modal, setModal] = useState(false)

    const toogle = () => setModal(!modal)


    // const getKot = () => {
    //     axios.get(`${kotUrl}/GetKOTByDate/${selectedDate}`)
    //         .then(response => {
    //             console.log(response);
    //             setAllMealPlans(response.data.data)
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         })
    // }

    const getCustomerMealplan = (days) => {
        setComplimentaryBoxes(0)
        axios.get(`${kotUrl}/GetDateWiseMealPlans/${store.id}/${selectedDate}`)
            .then(response => {
                console.log(response);
                setAllMealPlans(response.data.data)
                if (response.data.data.length > 0) {
                    const deliver = moment(new Date(selectedDate)).add(days, "days")
                    setDeliveryDate(moment(new Date(deliver)).format("YYYY-MM-DD"))
                    addKot(response.data.data, moment(new Date(deliver)).format("YYYY-MM-DD"))
                }
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
                // getKot()
                getCustomerMealplan(response.data.data.kotDays)
            })
            .catch(error => {
                console.log(error.response);

            })
    }, [])

    const addKot = (plans, date) => {
        let customerPlans = []
        let complimentary = 0
        plans.map(plan => {
            customerPlans.push({
                CustomerMealPlansId: plan.customerMealPlans.id,
                CustomersId: plan.customerMealPlans.customersId,
                Date: date,
            })
            complimentary = complimentary + Number(plan.customerMealPlans.complimentaryBoxes) + 1
        })
        setComplimentaryBoxes(complimentary)
        const data = {
            preparationDate: selectedDate,
            deliveryDate: date,
            storeId: store.id,
            kitchensId: kitchenId,
            totalCustomers: plans.length,
            totalMenuItems: totalMeals,
            boxToBeDelivered: plans.length,
            boxDelivered: 0,
            undelivered: 0,
            complimentary: 0,
            status: 1,
            UpdateCustomers: customerPlans
        }
        console.log(data);
        // if (deliveryDate) {
            console.log(data);
            axios.post(`${kotUrl}/AddKOT`, data)
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error.response);
                })
        // }
    }

    const prepare = () => {
        let kotDetails = []
        let complimentary = 0
        allMealPlans.map(plan => {
            complimentary = 0
            complimentary += Number(plan.customerMealPlans.complimentaryBoxes)
            let menuDetails = []
            plan.customerMealPlanDetailsBreakup.map(meal => {
                menuDetails.push({
                    customerMealPlansId: plan.customerMealPlans.id,
                    slotsId: meal.slotsId,
                    menusId: meal.menusId,
                    portion: meal.portion,
                    status: 2,
                })
            })
            kotDetails.push({
                kotId: 0,
                customersId: plan.customerMealPlans.customersId,
                boxToBeDelivered: Number(complimentary) + 1,
                BoxDelivered: 0,
                undelivered: 0,
                complimentary: complimentary,
                status: 2,
                kotMenuDetails: menuDetails
            })
        })
        const data = {
            preparationDate: selectedDate,
            deliveryDate: deliveryDate,
            storeId: store.id,
            kitchensId: kitchenId,
            totalCustomers: allMealPlans.length,
            totalMenuItems: totalMeals,
            boxToBeDelivered: Number(allMealPlans.length) + Number(complimentary),
            boxDelivered: 0,
            undelivered: 0,
            complimentary: complimentary,
            status: 2,
            kotDetails: kotDetails
        }
        console.log(data);
        setComplimentaryBoxes(complimentary)
        axios.post(`${kotUrl}/AddKOTDetails`, data)
            .then(response => {
                console.log(response);
                history.push("/vendor/kdashboard")
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    const addComplimentary = (e, i) => {
        let data = allMealPlans
        data[i].customerMealPlans.complimentaryBoxes = e.target.value
        console.log(data);
        setAllMealPlans(allMealPlans)
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
        <AccountLayout title="KOT" loader={false}>
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
                                                                    <input class="form-control" id="date" type="date" required="" disabled autocomplete="off" data-bs-original-title="" title="" value={selectedDate} min={moment(new Date()).format("YYYY-MM-DD")} onChange={(e) => setSelectedDate(e.target.value)}
                                                                    />

                                                                </div>
                                                                {/* <div class="col-sm-1">
                                                                    <label><br /></label>
                                                                    <button class="btn btn-primary btn-xs" id="btnClass" onClick={getCustomerMealplan}><Search /></button>
                                                                </div> */}

                                                                <div class="col-sm-2">
                                                                    <label>Delivery date</label>
                                                                    <input class="form-control" id="dtDelivery" type="date" required="" disabled autocomplete="off" data-bs-original-title="" title="" value={deliveryDate} />

                                                                </div>
                                                                <div class="col-sm-5" id="dv-info">
                                                                    <div class="pull-right" id="project">
                                                                        <p>To deliver: <span id="spn-deliver">{allMealPlans.length}</span></p>
                                                                        <p>Actual delivery: <span id="spn-actual-delivery">{complimentaryBoxes}</span></p>
                                                                    </div>
                                                                </div>
                                                                <div class="col-sm-2" style={{ display: `${allMealPlans.length > 0 ? "block" : "none"}` }}>
                                                                    <Link to="#" class="btn btn-success" id="btnDispatch" onClick={prepare}>Prepare</Link>
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
                                                                                    {allMealPlans.map((mealplan, index) => {
                                                                                        return (
                                                                                            <>
                                                                                                <tr class="table-active">
                                                                                                    <th colspan="12" data-bs-toggle="collapse" id="accordionclose0" data-bs-target="#collapse10" role="button" aria-expanded="true" aria-controls="0">
                                                                                                        <i style={{ color: "red" }} class="fa fa-arrow-circle-right" onClick={() => setTab(index)}></i>
                                                                                                    </th>

                                                                                                    <th colspan="12" style={{ textAlign: "center" }}>
                                                                                                        Customer&nbsp;-&gt;&nbsp;{mealplan.customer.name}&nbsp;-&nbsp;{mealplan.customer.mobileNumber}

                                                                                                    </th>
                                                                                                    <th colspan="12" style={{ textAlign: "center" }}>
                                                                                                        To&nbsp;be&nbsp;delivered&nbsp;:&nbsp;1

                                                                                                    </th>
                                                                                                    <th colspan="12" style={{ textAlign: "center" }}>
                                                                                                        Complimentary <input class="form-control" type="number" onBlur={(e) => addComplimentary(e, index)} min="0" id="txtComplimentary0" defaultValue={mealplan.customerMealPlans.complimentaryBoxes} />
                                                                                                    </th>
                                                                                                    <th colspan="12" style={{ textAlign: "center" }}>
                                                                                                        Days <input class="form-control" type="number" id="txtDays0" value="1" />

                                                                                                    </th>
                                                                                                    <th colspan="12" style={{ textAlign: "center" }}>
                                                                                                        {/* {console.log(+mealplan.customerMealPlans.complimentaryBoxes + 1)} */}
                                                                                                        Actual&nbsp;delivery&nbsp;:&nbsp;{+mealplan.customerMealPlans.complimentaryBoxes + 1}
                                                                                                    </th>
                                                                                                    <th colspan="12" style={{ textAlign: "center" }}>

                                                                                                    </th>
                                                                                                </tr>
                                                                                                {mealplan.customerMealPlanDetailsBreakup.map((plan, i) => {
                                                                                                    totalMeals = totalMeals + 1
                                                                                                    return (
                                                                                                        <tr class="collapse show" id="collapse10" data-bs-parent="#accordionclose0" style={{ display: `${tab == i ? "" : "none"}` }}>
                                                                                                            <td colspan="12">{i + 1}</td>
                                                                                                            <td colspan="12">{plan.mealPlan}</td>
                                                                                                            <td colspan="12">{plan.slotName}</td>
                                                                                                            <td colspan="12">{plan.menuName}</td>
                                                                                                            <td colspan="12">{plan.portion}</td>
                                                                                                            <td colspan="12">{plan.allergies.length > 0 ? <Eye onClick={() => ShowAllergies(plan.allergies)} /> : "No allergies"}</td>
                                                                                                            <td colspan="12">{plan.dislikes.length > 0 ? <Eye onClick={() => ShowDislikes(plan.dislikes)} /> : "No dislikes"}</td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                })}
                                                                                            </>
                                                                                        )
                                                                                    })}
                                                                                    {/* <tr class="table-active">
                                                                                        <th colspan="12" data-bs-toggle="collapse" id="accordionclose0" data-bs-target="#collapse10" role="button" aria-expanded="true" aria-controls="0">
                                                                                            <i style={{ color: "red" }} class="fa fa-arrow-circle-right"></i>
                                                                                        </th>

                                                                                        <th colspan="12" style={{ textAlign: "center" }}>
                                                                                            Customer&nbsp;-&gt;&nbsp;Salman Ahmed&nbsp;-&nbsp;75984568

                                                                                        </th>
                                                                                        <th colspan="12" style={{ textAlign: "center" }}>
                                                                                            To&nbsp;be&nbsp;delivered&nbsp;:&nbsp;1

                                                                                        </th>
                                                                                        <th colspan="12" style={{ textAlign: "center" }}>
                                                                                            Complimentary <input class="form-control" type="number" onfocusout="PushComplimetary(0)" id="txtComplimentary0" value="0" />

                                                                                        </th>
                                                                                        <th colspan="12" style={{ textAlign: "center" }}>
                                                                                            Days <input class="form-control" type="number" id="txtDays0" value="1" />

                                                                                        </th>
                                                                                        <th colspan="12" style={{ textAlign: "center" }}>
                                                                                            Actual&nbsp;delivery&nbsp;:&nbsp;1

                                                                                        </th>
                                                                                        <th colspan="12" style={{ textAlign: "center" }}>

                                                                                        </th>
                                                                                    </tr>
                                                                                    <tr class="collapse show" id="collapse10" data-bs-parent="#accordionclose0">
                                                                                        <td colspan="12">1</td>
                                                                                        <td colspan="12">30 Days Meal Plan</td>
                                                                                        <td colspan="12">Breakfast</td>
                                                                                        <td colspan="12">Greek Fruit Yogurt + granola + almonds</td>
                                                                                        <td colspan="12">200</td>
                                                                                        <td colspan="12">No allergies</td>
                                                                                        <td colspan="12">No dislikes</td>
                                                                                    </tr> */}
                                                                                    {/* {allMealPlans.map((plan, i)=>{ */}
                                                                                    {/* <tr class='table-active'>
                                                                                        <th colspan='12' data-bs-toggle='collapse' id='accordionclose" + hkey + "' data-bs-target='#collapse1" + hkey + "' role='button' aria-expanded='false' aria-controls=" + hkey + ">
                                                                                            <i style={{ color: 'red' }} class='fa fa-arrow-circle-right'></i>
                                                                                        </th>
                                                                                        <th colspan='12' style={{ textAlign: "center" }}>
                                                                                            <u> Customer&nbsp;  &nbsp; hvalue.customer.name &nbsp;-&nbsp;hvalue.customer.mobileNumber </u>
                                                                                        </th>
                                                                                        <th colspan='12' style={{ textAlign: "center" }}>
                                                                                            <u>To&nbsp;be&nbsp;delivered&nbsp;:&nbsp;1</u>
                                                                                        </th>
                                                                                        <th colspan='12' style={{ textAlign: "center" }}>
                                                                                            <u>Complimentary&nbsp;:&nbsp;hvalue.complimentary</u>
                                                                                        </th>
                                                                                        <th colspan='12' style={{ textAlign: "center" }}>
                                                                                            <u>Days&nbsp;:&nbsp;1</u>
                                                                                        </th>
                                                                                        <th colspan='12' style={{ textAlign: "center" }}>
                                                                                            <u> Actual&nbsp;delivery&nbsp;:&nbsp;total</u>
                                                                                        </th>
                                                                                        <th colspan='12' style={{ textAlign: "center" }}>
                                                                                            <u></u>
                                                                                        </th>
                                                                                    </tr>
                                                                                    <tr class='collapse show' id='collapse1hkey' data-bs-parent='#accordionclose" + hkey + "'>
                                                                                        <td colspan='12'>(key + 1)</td>
                                                                                        <td colspan='12'>value.mealPlan</td>
                                                                                        <td colspan='12'>value.slotName</td>
                                                                                        <td colspan='12'>value.menuName</td>
                                                                                        <td colspan='12'>value.portion</td>
                                                                                        <td colspan='12'><a href='#' onclick='ShowAllergies(" + hkey + "," + key + ")'><i class='icofont icofont-eye-alt'></i></a></td>
                                                                                        <td colspan='12'>No dislikes</td>
                                                                                    </tr> */}
                                                                                    {/* })} */}
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
