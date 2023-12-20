import React, { useEffect, useState } from 'react'
import { Download } from 'react-feather'
import { customersUrl } from '../../assets/Api/api'
import AccountLayout from '../../layout/account-layout/AccountLayout'
import BodyContainer from '../../layout/body-container/BodyContainer'
import axios from '../../assets/axios/axios'
import BodyHeader from '../../layout/body-header/BodyHeader'
import DataTable from 'react-data-table-component'

export default function CustomerReport() {
    const store = JSON.parse(window.localStorage.getItem("store"))

    const columns = [
        {
            name: '#',
            selector: (row, i) => i + 1,
            sortable: true,
            compact: true,
            width: "100px"
        },
        {
            name: 'Customer Name',
            selector: row => row.customers.name,
            sortable: true,
            compact: true
        },
        {
            name: 'Total orders',
            selector: row => row.totalOrders,
            sortable: true,
            compact: true
        },
        {
            name: 'Total Collection',
            selector: row => (row.symbol + row.totalCollection),
            sortable: true,
            compact: true
        },
        {
            name: 'Status',
            selector: row => row.customers.status ? "Active" : "Inactive",
            sortable: true,
            compact: true
        }
    ]

    const paginationComponentOptions = {
        rowsPerPageText: 'Show Entries',
        rangeSeparatorText: 'of',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'All',
    };

    const rdata = {
        storesId: store.id,
        name: '',
        mobileNumber: '',
        status: ''
    }

    const [search, setSearch] = useState(false);
    const [reports, setReports] = useState()
    const [customerReports, setCustomerReports] = useState([])
    const [postData, setPostData] = useState(rdata)
    const [filterText, setFilterText] = useState('')

    const getData = (data) => {
        axios.post(`${customersUrl}/GetCustomerOrdersForReport`, data)
            .then(response => {
                console.log(response);
                setReports(response)
                setCustomerReports(response.data.data.customerOrdersForReport)
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getData(postData)
    }, [])

    const ordersByFilter = () => {
        getData(postData)
    }

    const clearFilter = () => {
        getData(rdata)
        setPostData(rdata)
    }

    const handleSearch = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value
        })
    }

    const searchItem = (row) => {
        return row.filter(
            (row) => row.customers.name.toLowerCase().indexOf(filterText) > -1 ||
                row.totalOrders.toString().toLowerCase().indexOf(filterText) > -1 ||
                row.totalCollection.toString().toLowerCase().indexOf(filterText) > -1
        )
    }

    return (
        <AccountLayout title="Customer report">
            <BodyContainer>
                <div className="card-header">
                    <BodyHeader search={search} setSearch={setSearch} addBtn={false} >
                        <div className="btn btn-primary" id="btnAdd">
                            <Download />Download
                        </div>
                    </BodyHeader>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="card" id="dvSearch" style={{ display: `${search ? "block" : "none"}` }}>
                                <div class="card-body">
                                    <form id="frm-customers-search">
                                        <div class="mb-3 col-md-12 my-0">
                                            <div class="row">
                                                <div class="col-sm-4">
                                                    <label for="con-phone">
                                                        Customer Name
                                                    </label>
                                                    <input class="form-control" id="txtSearchCustomerName" type="text" name='name' value={postData.name} onChange={handleSearch} />
                                                </div>
                                                <div class="col-sm-2">
                                                    <label for="con-phone">
                                                        Mobile Number
                                                    </label>
                                                    <input class="form-control" id="txtSearchMobileNumber" type="number" name='mobileNumber' onChange={handleSearch} value={postData.mobileNumber} />
                                                </div>
                                                <div class="col-sm-2">
                                                    <label for="con-mail">Status</label>
                                                    <select class="form-control" id="ddlSearchStatus" name='status' value={postData.status} onChange={handleSearch}>
                                                        <option value="" selected>Select</option>
                                                        <option value="1">Active</option>
                                                        <option value="2">Inactive</option>
                                                    </select>
                                                </div>
                                                <div class="mb-3 col-md-12 my-0">
                                                    <div class="row">
                                                        <div class="col-sm-9">
                                                            <label for="">&nbsp;</label>
                                                            <br />
                                                            <button type="button" id="btnCloseFilter" class="btn btn-outline-primary" onClick={() => { setSearch(false); setPostData(rdata) }}>
                                                                Close
                                                            </button>
                                                        </div>
                                                        <div class="col-sm-3">
                                                            <label for="">&nbsp;</label>
                                                            <br />
                                                            <button type="button" id="btnFilter" class="btn btn-outline-primary me-1" onClick={ordersByFilter}>
                                                                Search
                                                            </button>
                                                            <button type="button" id="btnClearFilter" class="btn btn-outline-primary" onClick={clearFilter}>
                                                                Clear filter
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        {/* <div class="row" id="div-data-not-found" style={{ display: "none" }}>
                            <div class="col-sm-12">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="text-center">
                                            No data
                                            is available
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div class="row list-persons" id="div-customer-list">
                            <div >
                                <label style={{ float: "right" }}>
                                    Search : &nbsp;
                                    <input class="form-control" id="txtSearchCustomerName" type="text" value={filterText} onChange={(e) => setFilterText(e.target.value)} style={{ width: 'auto', display: 'inline-block' }} />
                                </label>
                            </div>
                            <div class="col-xl-12 xl-100 col-md-12">
                                <div class="table-responsive">
                                    <DataTable
                                        columns={columns}
                                        data={searchItem(customerReports)}
                                        paginationComponentOptions={paginationComponentOptions}
                                        pagination
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BodyContainer>
        </AccountLayout>
    )
}
