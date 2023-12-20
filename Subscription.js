import React, { useEffect, useState } from 'react'
import { subscriptionsUrl } from '../../assets/Api/api'
import AccountLayout from '../../layout/account-layout/AccountLayout'
import axios from '../../assets/axios/axios'
import BodyContainer from '../../layout/body-container/BodyContainer'
import { Link } from 'react-router-dom'
import { Printer } from 'react-feather'

export default function Subscription() {
    const user = JSON.parse(window.localStorage.getItem("user"))

    const sdata = {
        pageNo: 1,
        pageSize: 5,
        vendorsId: user.id,
    }

    const [postData, setPostData] = useState(sdata)
    const [tab, setTab] = useState(0)
    const [subscriptions, setSubscriptions] = useState()
    const [details, setDetails] = useState()

    const getData = (data) => {
        axios.post(`${subscriptionsUrl}/GetVendorSubscriptionsOnFilter`, data)
            .then(response => {
                console.log(response);
                setSubscriptions(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getData(postData)
    }, [])

    const getSubscriptionDetails = (id) => {
        axios.get(`${subscriptionsUrl}/GetSubscription/${id}`)
            .then(response => {
                console.log(response);
                setDetails(response.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }

    const next = () => {
        if (subscriptions.pageNo < subscriptions.totalPages) {
            const page = postData
            page.pageNo = subscriptions.pageNo + 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }

    const previous = () => {
        if (subscriptions.pageNo > 1) {
            const page = postData
            page.pageNo = subscriptions.pageNo - 1
            setPostData(page)
            getData(page)
            // console.log(page);
        }
    }

    return (
        <AccountLayout title="Subscription" loader={false}>
            <BodyContainer>
                <div class="email-wrap bookmark-wrap">
                    <div class="row">
                        <div class="col-xl-12 col-md-12 box-col-12">
                            <div class="email-right-aside bookmark-tabcontent contacts-tabs">
                                <div class="card email-body radius-left">
                                    <div class="ps-0">
                                        <div class="tab-content">
                                            <div class="tab-pane fade active show" id="pills-personal"
                                                role="tabpanel" aria-labelledby="pills-personal-tab">
                                                <div class="file-content">
                                                    <div class="card mb-0">
                                                        <div class="card-body p-0">
                                                            <div id="div-not-found" class="row" style={{ display: "none" }}>
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
                                                                        <div id="div-subscription">
                                                                            {subscriptions && subscriptions.subscriptions.map((sub, i) => {
                                                                                return (
                                                                                    <Link to="#" id="subscription" class="nav-link" onClick={() => getSubscriptionDetails(sub.id)}>
                                                                                        <div class="media">
                                                                                            <div class="media-body">
                                                                                                <h6> <span class="first_name_0">{sub.name}</span></h6>
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
                                                                                Showing <span id="spn-pageNo">{subscriptions && subscriptions.pageNo}</span> of <span id="spn-totalPages">{subscriptions && subscriptions.totalPages}</span> pages
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="col-xl-8 xl-70 col-md-7">
                                                                    <div class="tab-content" id="v-pills-tabContent">
                                                                        <div class="tab-pane contact-tab-0 tab-content-child fade show active" id="div-subscription-details" role="tabpanel" aria-labelledby="v-pills-user-tab" style={{ display: `${details ? "" : "none"}` }}>
                                                                            <div class="profile-mail">
                                                                                <div class="media">
                                                                                    <div class="media-body mt-0">
                                                                                        <h5>
                                                                                            <span class="first_name_0" id="spn-lableName">{details && details.name}</span>
                                                                                        </h5>
                                                                                        <p class="email_add_0">
                                                                                            3 Months
                                                                                        </p>
                                                                                        <ul>
                                                                                            <li>
                                                                                                <Link id="txtDetails" to="#" onClick={() => setTab(0)}>Details</Link>
                                                                                            </li>
                                                                                            <li>
                                                                                                <Link id="txtHistory" to="#" onClick={() => setTab(1)}>Order History</Link>
                                                                                            </li>
                                                                                            <li>
                                                                                                <Link id="txtSpecification" to="#" onClick={() => setTab(2)}>Specification</Link>
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="email-general">
                                                                                    <div id="dvSpecification" style={{ display: `${tab == 2 ? "" : "none"}` }} >
                                                                                        <div class="table-responsive">
                                                                                            <table class="table">
                                                                                                <thead>
                                                                                                    <tr>
                                                                                                        <th scope="col">
                                                                                                            #
                                                                                                        </th>
                                                                                                        <th scope="col">
                                                                                                            Specification
                                                                                                        </th>
                                                                                                        <th scope="col">
                                                                                                            Status
                                                                                                        </th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody id="tblSpecifications">
                                                                                                    {details && details.subscriptionDetails.map((specification, i) => {
                                                                                                        return (
                                                                                                            <tr>
                                                                                                                <td>{i + 1}</td>
                                                                                                                <td>{specification.specifications}</td>
                                                                                                                <td>{specification.status ? "Active" : "Inactive"}</td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    })}
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div id="dvHistory" style={{ display: `${tab == 1 ? "" : "none"}` }}>
                                                                                        {/* <!-- End InvoiceTop--> */}
                                                                                        <div class="table-responsive">
                                                                                            <table class="table">
                                                                                                <thead>
                                                                                                    <tr>
                                                                                                        <th scope="col">
                                                                                                            #
                                                                                                        </th>

                                                                                                        <th scope="col">
                                                                                                            Order number
                                                                                                        </th>
                                                                                                        <th scope="col">
                                                                                                            Store name
                                                                                                        </th>
                                                                                                        <th scope="col">
                                                                                                            Start date
                                                                                                        </th>
                                                                                                        <th scope="col">
                                                                                                            End date
                                                                                                        </th>
                                                                                                        <th scope="col">
                                                                                                            Amount
                                                                                                        </th>
                                                                                                        <th scope="col">
                                                                                                            Print
                                                                                                        </th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody id="tblOrders">
                                                                                                    {subscriptions && subscriptions.subscriptionOrders.map((order, i) => {
                                                                                                        if (order.storeSubscriptions.subscriptionsId == details?.id) {
                                                                                                            return (
                                                                                                                <tr>
                                                                                                                    <td>{i + 1}</td>
                                                                                                                    <td>{order.transactionNumber}</td>
                                                                                                                    <td>{order.stores.name}</td>
                                                                                                                    <td>{order.storeSubscriptions.startDate.split('T')[0]}</td>
                                                                                                                    <td>{order.storeSubscriptions.endDate.split('T')[0]}</td>
                                                                                                                    <td>{order.grandTotal}</td>
                                                                                                                    <td>
                                                                                                                        <Link to='#' onclick='print(key)' data-bs-original-title=''><i class='icofont icofont-print'></i><Printer /></Link>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                    })}
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                        {/* <!-- End Table--> */}
                                                                                    </div>
                                                                                    <div id="dvGeneral" style={{ display: `${tab == 0 ? "" : "none"}` }}>
                                                                                        <h6 class="mb-3">General Details</h6>
                                                                                        <ul>
                                                                                            <li>Name <span class="font-primary first_name_0" id="spn-name">{details && details.name}</span></li>
                                                                                            <li>Tenure <span class="font-primary" id="spn-tenure">{details && details.duration}</span></li>
                                                                                            <li>Selling Price<span class="font-primary city_0" id="spn-price">{details && details.sellingPrice}</span></li>
                                                                                            <li>Description <span class="font-primary email_add_0" id="spn-description">{details && details.description}</span></li>
                                                                                            <li>Status<span class="badge badge-primary" id="spn-status">{details && details.status ? "Active" : "Inactive"}</span></li>
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
                            </div>
                        </div>
                    </div>
                </div>
            </BodyContainer>
        </AccountLayout>
    )
}
