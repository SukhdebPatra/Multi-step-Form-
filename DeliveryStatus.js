import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { kotUrl } from '../../assets/Api/api'
import axios from '../../assets/axios/axios'
import history from '../../assets/history/history'
import AccountLayout from '../../layout/account-layout/AccountLayout'

export default function DeliveryStatus() {
    const kotId = window.sessionStorage.getItem("kotId")

    const [mealPlans, setMealPlans] = useState([])
    const [tab, setTab] = useState(0)

    useEffect(() => {
        axios.get(`${kotUrl}/GetKOTForStatusUpdate/${kotId}`)
            .then(response => {
                console.log(response);
                let data = response.data.data
                data.map(plan => [
                    plan.status = 6
                ])
                setMealPlans(data)
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    const pushStatus = (e, i) => {
        let data = mealPlans
        data.map((plan, ind) => {
            if (i == ind) {
                plan.status = e.target.value
            }
        })
        console.log(data);
        setMealPlans(data)
    }

    const check = (id) => {
        let data = mealPlans
        if (data[id].checked == false) {
            data[id].checked = true
        } else {
            data[id].checked = false
        }
        console.log(data);
        setMealPlans(data)
    }

    const checkAll = () => {
        let data = mealPlans
        const chkall = document.getElementById("chkAll")
        if (chkall.checked) {
            data.map((plan, i) => {
                if (plan.checked == false) {
                    data[i].checked = true
                    const cb = document.getElementsByClassName("chk")
                    for (var i = 0; i < cb.length; i++) {
                        cb[i].checked = true;
                    }
                }
            })
        } else {
            data.map((plan, i) => {
                if (plan.checked == true) {
                    data[i].checked = false
                    const cb = document.getElementsByClassName("chk")
                    for (var i = 0; i < cb.length; i++) {
                        cb[i].checked = false;
                    }
                }
            })
        }
        setMealPlans(data)
    }
    const update = () => {
        let data = []
        const found = mealPlans.find(plan => plan.checked == true)
        console.log(found);
        if (found) {
            mealPlans.map(plan => {
                data.push({
                    id: plan.id,
                    status: plan.status
                })
            })
            console.log(data);
            axios.put(`${kotUrl}/UpdateCustomerKotStatus`, data)
                .then(response => {
                    console.log(response);
                    history.push("/vendor/kdashboard")
                })
                .catch(error => {
                    console.log(error.response);
                })
        } else {
            alert("nothing selected")
        }
    }
    return (
        <AccountLayout title="Delivery Status">
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
                                                        <div class="card-header" style={{ display: `${mealPlans.length > 0 ? "" : "none"}` }}>
                                                            <div class="row">
                                                                <div class="col-sm-10">
                                                                    <div class="pull-right" id="project">
                                                                        <p>To deliver: <span id="spn-deliver"></span></p>
                                                                        <p>Actual delivery: <span id="spn-actual-delivery"></span></p>
                                                                    </div>
                                                                </div>
                                                                <div class="col-sm-2" >
                                                                    <a href="#" class="btn btn-success" id="btnUpdate" onClick={update}>Update</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card-body p-0">
                                                            <div class="row list-persons" id="addcon">
                                                                <div id="div-note" class="row" style={{ display: `${mealPlans.length < 1 ? "" : "none"}` }}>
                                                                    <div class="col-sm-12">
                                                                        <div class="card">
                                                                            <div class="card-body">
                                                                                <h5 class="text-center" id="show-note">No Orders found</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div id="dv-data" style={{ display: `${mealPlans.length > 0 ? "" : "none"}` }}>
                                                                    <div class="col-xl-12 xl-100 col-md-12">
                                                                        <div class="table-responsive">
                                                                            <table class="table table-sm">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th scope="col" colspan='12'>#</th>
                                                                                        <th scope="col">
                                                                                            <label class="form-check-label" style={{ marginBottom: " 0rem" }} for="gridCheck">Select&nbsp;all</label>
                                                                                            <input class="form-check-input" id="chkAll" onChange={checkAll} type="checkbox" />
                                                                                        </th>
                                                                                        <th scope="col" colspan='12'>Meal&nbsp;plan</th>
                                                                                        <th scope="col" colspan='12'>Slot</th>
                                                                                        <th scope="col" colspan='12'>Menu</th>
                                                                                        <th scope="col" colspan='12'>Calories</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody id="tblDataBody">
                                                                                    {mealPlans.map((meal, index) => {
                                                                                        return (
                                                                                            <>
                                                                                                <tr class="table-active">
                                                                                                    <th colspan="12" data-bs-toggle="collapse" id="accordionclose0" data-bs-target="#collapse10" role="button" aria-expanded="true" aria-controls="0">
                                                                                                        <i style={{ color: "red" }} class="fa fa-arrow-circle-right" onClick={() => setTab(index)}></i>
                                                                                                    </th>
                                                                                                    <th colspan="1" style={{ textAlign: "center" }}>
                                                                                                        <input id="chk" onChange={() => check(index)} class="form-check-input ChkAllItems chk" type="checkbox" />
                                                                                                    </th>
                                                                                                    <th colspan="12" style={{ textAlign: "center" }}> Customer&nbsp;-&gt;&nbsp;{meal.customer.name}&nbsp;-&nbsp;{meal.customer.mobileNumber}</th>
                                                                                                    <th colspan="12" style={{ textAlign: "center" }}>Update&nbsp;Status
                                                                                                        <select class="form-control" id="ddlStatus0" onChange={(e) => pushStatus(e, index)}>
                                                                                                            <option value="6">Delivered</option>
                                                                                                            <option value="7">Return</option>
                                                                                                        </select>
                                                                                                    </th>
                                                                                                    <th colspan="12" style={{ textAlign: "center" }}> </th>
                                                                                                    <th colspan="12" style={{ textAlign: "center" }}> </th>
                                                                                                </tr>
                                                                                                {meal.kotMenuDetails.map(((menu, i) => {
                                                                                                    return (
                                                                                                        <tr class="collapse show" id="collapse10" data-bs-parent="#accordionclose0" style={{ display: `${tab == i ? "" : "none"}` }}>
                                                                                                            <td colspan="12">{i + 1}</td>
                                                                                                            <td colspan="12">{menu.mealPlan}</td>
                                                                                                            <td colspan="12">{menu.slotName}</td>
                                                                                                            <td colspan="12">{menu.menuName}</td>
                                                                                                            <td colspan="12">{menu.portion}</td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                }))}
                                                                                            </>
                                                                                        )
                                                                                    })}
                                                                                    {/* <tr class="table-active">
                                                                                        <th colspan="12" data-bs-toggle="collapse" id="accordionclose0" data-bs-target="#collapse10" role="button" aria-expanded="true" aria-controls="0"><i style={{ color: "red" }} class="fa fa-arrow-circle-right"></i></th>
                                                                                        <th colspan="1" style={{ textAlign: "center" }}>
                                                                                            <input id="chk0" onchange="Check(0)" class="form-check-input ChkAllItems" type="checkbox" />
                                                                                        </th>
                                                                                        <th colspan="12" style={{ textAlign: "center" }}> Customer&nbsp;-&gt;&nbsp;Salman Ahmed&nbsp;-&nbsp;75984568</th>
                                                                                        <th colspan="12" style={{ textAlign: "center" }}>Update&nbsp;Status<select class="form-control" id="ddlStatus0" onchange="PushStatus(0)"><option value="6">Delivered</option><option value="7">Return</option></select></th>
                                                                                        <th colspan="12" style={{ textAlign: "center" }}> </th>
                                                                                        <th colspan="12" style={{ textAlign: "center" }}> </th>
                                                                                    </tr>
                                                                                    <tr class="collapse show" id="collapse10" data-bs-parent="#accordionclose0">
                                                                                        <td colspan="12">1</td>
                                                                                        <td colspan="12">30 Days Meal Plan</td>
                                                                                        <td colspan="12">Breakfast</td>
                                                                                        <td colspan="12">Greek Fruit Yogurt + granola + almonds</td>
                                                                                        <td colspan="12">200</td>
                                                                                    </tr> */}
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
                    </div >
                </div >
            </div >
        </AccountLayout >
    )
}
