import React, { useEffect, useState } from "react";
import AccountLayout from "../../layout/account-layout/AccountLayout";
// import CountUp from 'react-countup';
import {
  Database,
  ShoppingBag,
  MessageCircle,
  UserPlus,
  ArrowDown,
  ArrowUp,
} from "react-feather";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { setLanguage, translate } from "react-switch-lang";
import axios from "../../assets/axios/axios";
import { adminDashboardUrl } from "../../assets/Api/api";

function Dashboard({ t }) {
  const user = JSON.parse(window.localStorage.getItem("user"));
  const store = JSON.parse(window.localStorage.getItem("store"));

  const [summary, setSummary] = useState();
  // const [selectedLanguage, setSelectedLanguage] = useState("en")

  useEffect(() => {
    axios
      .get(`${adminDashboardUrl}/GetVendorDashboardInfo/${store.id}/${user.id}`)
      .then((response) => {
        console.log(response);
        setSummary(response.data.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);

  // const changeLanguage = (e) => {
  //     setLanguage(e.target.value)
  //     setSelectedLanguage(e.target.value)
  // }
  return (
    <div>
      <AccountLayout title={t("dashboard.dashboard")} loader={false}>
        <Container fluid={true}>
          {/* <select value={selectedLanguage} onChange={changeLanguage}>
                        <option value="en">English</option>
                        <option value="ur">urdu</option>
                    </select> */}
          <Row>
            <Col sm="6" xl="3" lg="6">
              <Card className="o-hidden">
                <CardBody className="bg-primary b-r-4 card-body">
                  <div className="media static-top-widget">
                    <div className="align-self-center text-center">
                      <Database />
                    </div>
                    <div className="media-body">
                      <span className="m-0">{t("dashboard.earnings")}</span>
                      <h4 className="mb-0 counter">
                        {/* <CountUp end={6659} /> */}
                        {summary && summary.symbol}{" "}
                        {summary && summary.collections}
                      </h4>
                      <Database className="icon-bg" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="6" xl="3" lg="6">
              <Card className="o-hidden">
                <div className="bg-secondary b-r-4 card-body">
                  <div className="media static-top-widget">
                    <div className="align-self-center text-center">
                      <ShoppingBag />
                    </div>
                    <div className="media-body">
                      <span className="m-0">{t("dashboard.stores")}</span>
                      <h4 className="mb-0 counter">
                        {/* <CountUp end={9856} /> */}
                        {summary && summary.stores}
                      </h4>
                      <ShoppingBag className="icon-bg" />
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col sm="6" xl="3" lg="6">
              <Card className="o-hidden">
                <CardBody className="bg-primary b-r-4">
                  <div className="media static-top-widget">
                    <div className="align-self-center text-center">
                      <MessageCircle />
                    </div>
                    <div className="media-body">
                      <span className="m-0">{t("dashboard.programs")}</span>
                      <h4 className="mb-0 counter">
                        {/* <CountUp end={893} /> */}
                        {summary && summary.programs}
                      </h4>
                      <MessageCircle className="icon-bg" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="6" xl="3" lg="6">
              <Card className="o-hidden">
                <CardBody className="bg-primary b-r-4">
                  <div className="media static-top-widget">
                    <div className="align-self-center text-center">
                      <UserPlus />
                    </div>
                    <div className="media-body">
                      <span className="m-0">{t("dashboard.mealplans")}</span>
                      <h4 className="mb-0 counter">
                        {/* <CountUp end={4563} /> */}
                        {summary && summary.mealPlans}
                      </h4>
                      <UserPlus className="icon-bg" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="6" className="xl-100 box-col-12">
              <Card className="widget-joins widget-arrow">
                <Row>
                  <Col sm="6" className="pr-0">
                    <div className="media border-after-xs">
                      <div className="align-self-center mr-3 text-left">
                        <h6 className="mb-1">{t("dashboard.sale")}</h6>
                        <h4 className="mb-0">{t("dashboard.today")}</h4>
                      </div>
                      <div className="media-body align-self-center">
                        <ArrowDown style={{ color: "white" }} />
                      </div>
                      <div className="media-body">
                        <h5 className="mb-0">
                          {summary && summary.symbol}
                          <span className="counter">
                            {/* <CountUp end={25698} /> */}
                            {summary && summary.todaySale}
                          </span>
                        </h5>
                      </div>
                    </div>
                  </Col>
                  <Col sm="6" className="pl-0">
                    <div className="media">
                      <div className="align-self-center mr-3 text-left">
                        <h6 className="mb-1">{t("dashboard.sale")}</h6>
                        <h4 className="mb-0">{t("dashboard.month")}</h4>
                      </div>
                      <div className="media-body align-self-center">
                        <ArrowUp style={{ color: "white" }} />
                      </div>
                      <div className="media-body pl-2">
                        <h5 className="mb-0">
                          {summary && summary.symbol}
                          <span className="counter">
                            {/* <CountUp end={6954} /> */}
                            {summary && summary.monthlySale}
                          </span>
                        </h5>
                        {/* <span className="mb-1">{"+$369(15%)"}</span> */}
                      </div>
                    </div>
                  </Col>
                  <Col sm="6" className="pr-0">
                    <div className="media border-after-xs">
                      <div className="align-self-center mr-3 text-left">
                        <h6 className="mb-1">{t("dashboard.sale")}</h6>
                        <h4 className="mb-0">{t("dashboard.week")}</h4>
                      </div>
                      <div className="media-body align-self-center">
                        <ArrowUp style={{ color: "white" }} />
                      </div>
                      <div className="media-body">
                        <h5 className="mb-0">
                          {summary && summary.symbol}
                          <span className="counter">
                            {/* <CountUp end={63147} /> */}
                            {summary && summary.weeklySale}
                          </span>
                        </h5>
                        {/* <span className="mb-1">{"+$69(65%)"}</span> */}
                      </div>
                    </div>
                  </Col>
                  <Col sm="6" className="pl-0">
                    <div className="media">
                      <div className="align-self-center mr-3 text-left">
                        <h6 className="mb-1">{t("dashboard.sale")}</h6>
                        <h4 className="mb-0">{t("dashboard.year")}</h4>
                      </div>
                      <div className="media-body align-self-center pl-3">
                        <ArrowUp style={{ color: "white" }} />
                      </div>
                      <div className="media-body pl-2">
                        <h5 className="mb-0">
                          {summary && summary.symbol}
                          <span className="counter">
                            {/* <CountUp end={963198} /> */}
                            {summary && summary.yearlySale}
                          </span>
                        </h5>
                        {/* <span className="mb-1">{"+$3654(90%)"}</span> */}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </AccountLayout>
    </div>
  );
}

export default translate(Dashboard);
