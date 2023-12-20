import React, { useEffect, useState } from 'react'
import { kotUrl } from '../../assets/Api/api'
import AccountLayout from '../../layout/account-layout/AccountLayout'
import axios from '../../assets/axios/axios'
import BodyContainer from '../../layout/body-container/BodyContainer'

export default function KotDetails() {
    const kotId = window.sessionStorage.getItem("kotId")

    const [kotDetails, setKotDetails] = useState()
    const [details, setDetails] = useState({
        delivered: 0,
        undelivered: 0,
        totalMenus: 0,
        closedCount: 0,
        openCount: 0
    })

    useEffect(() => {
        axios.get(`${kotUrl}/GetKOTById/${kotId}`)
            .then(response => {
                console.log(response);
                setKotDetails(response.data.data)
                getDetails(response.data.data)
            })
            .catch(error => {
                console.log(error.response);
            })
    }, [])

    const getDetails = (details) => {
        const data = details
        let delivered = 0
        let undelivered = 0
        let totalMenus = 0
        let closedCount = 0
        let openCount = 0
        data.kotDetails.map(kot => {
            undelivered = kot.undelivered
            if (kot.status == 6) {
                delivered = delivered + 1
            }
            totalMenus = kot.kotMenuDetails.length;
            kot.kotMenuDetails.map(menu => {
                if (kot.status == 6) {
                    closedCount = closedCount + 1
                }
                else if (kot.status == 2 || kot.status == 3 || kot.status == 4 || kot.status == 5) {
                    openCount = openCount + 1
                }
            })
        })
        let totalDetails = {
            delivered,
            undelivered,
            totalMenus,
            closedCount,
            openCount
        }
        setDetails(totalDetails)
        // console.log(totalDetails);
    }
    return (
        <AccountLayout title="Kot Details" loader={false}>
            {/* <BodyContainer> */}
            <div class="row projectdetails">
                <div class="col-xl-4 col-sm-6">
                    <div class="card">
                        <div class="card-body">
                            <div class="media">
                                <h5 class="mb-0">Customers</h5>
                            </div>
                            <div class="project-widgets text-center">
                                <h1 class="font-primary counter" id="h-customer-count">{kotDetails && kotDetails.kotDetails.length}</h1>
                                <h6 class="mb-0"> To Be Delivered</h6>
                            </div>
                        </div>
                        <div class="card-footer project-footer">
                            <div class="row">
                                <div class="col-xl-6 col-sm-6">
                                    <h6 class="mb-0 pull-left">Delivered: <span class="counter" id="spn-delivered">{details.delivered}</span></h6>
                                </div>
                                <div class="col-xl-6 col-sm-6">
                                    <h6 class="mb-0 pull-right">Undelivered: <span class="counter" id="spn-undelivered">{details.undelivered}</span></h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-sm-6">
                    <div class="card">
                        <div class="card-body">
                            <div class="media">
                                <h5 class="mb-0">Menu item</h5>
                            </div>
                            <div class="project-widgets text-center">
                                <h1 class="font-primary counter" id="h-menus-count">{details.totalMenus}</h1>
                                <h6 class="mb-0">Total menus</h6>
                            </div>
                        </div>
                        <div class="card-footer project-footer">
                            <div class="row">
                                <div class="col-xl-6 col-sm-6">
                                    <h6 class="mb-0 pull-left">Closed today: <span class="counter" id="spn-closed">{details.closedCount}</span></h6>
                                </div>
                                <div class="col-xl-6 col-sm-6">
                                    <h6 class="mb-0 pull-right">Open: <span class="counter" id="spn-open">{details.openCount}</span></h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-sm-6">
                    <div class="card">
                        <div class="card-body">
                            <div class="media">
                                <h5 class="mb-0">Box</h5>
                            </div>
                            <div class="project-widgets text-center">
                                <h1 class="font-primary counter" id="h-box-pending-count">{kotDetails && kotDetails.boxToBeDelivered}</h1>
                                <h6 class="mb-0">to be delivered</h6>
                            </div>
                        </div>
                        <div class="card-footer project-footer">
                            <div class="row">
                                <div class="col-xl-6 col-sm-6">
                                    <h6 class="mb-0 pull-left">Delivered: <span class="counter" id="spn-box-delivered">{kotDetails && kotDetails.boxDelivered}</span></h6>
                                </div>
                                <div class="col-xl-6 col-sm-6">
                                    <h6 class="mb-0 pull-right">Undelivered: <span class="counter" id="spn-box-undelivered">{kotDetails && kotDetails.undelivered}</span></h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" id="dv-menus">

                {kotDetails && kotDetails.menus.map(menu => {
                    let total = 0
                    return (
                        <div class="col-xl-4">
                            <div class="card">
                                <div class="card-body">
                                    <h2>{menu.menuName}</h2>
                                    <br />
                                    {menu.portions.map(portion => {
                                        total = total + Number(portion.calories)
                                        return <li class="list-group-item d-flex justify-content-between align-items-center">
                                            P1<span class="badge badge-primary counter">{portion.calories}</span>
                                        </li>
                                    })}
                                    <ul class="list-group">
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            Total<span class="badge badge-light text-dark counter">{total}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    )
                })}
            </div>
            {/* </BodyContainer> */}
        </AccountLayout>
    )
}
