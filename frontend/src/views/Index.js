import { useEffect, useMemo, useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import { getSalesAndOrders, getSuppliersAndCategories } from "api/products";

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [setChartExample1Data] = useState("data1");
  const [isLoadingCharts, setIsLoadingCharts] = useState(false);
  const [chartsError, setChartsError] = useState("");
  const [salesChartData, setSalesChartData] = useState(null);
  const [ordersChartData, setOrdersChartData] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [tablesError, setTablesError] = useState("");

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  // Fixed labels: Jan to Jun
  const janToJuneLabels = useMemo(
    () => ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    []
  );

  // Fetch and map API response into chart datasets
  useEffect(() => {
    let isCancelled = false;

    const mapResponseToCharts = (resp) => {
      const labels = janToJuneLabels;
      const sales = labels.map((m) => {
        const val = resp && resp[m] ? resp[m].totalSales || 0 : 0;
        return Math.round(val / 1000); // keep "k" scale used by chart options
      });
      const orders = labels.map((m) =>
        resp && resp[m] ? resp[m].totalOrders || 0 : 0
      );

      const salesData = {
        labels,
        datasets: [
          {
            label: "Sales",
            data: sales,
          },
        ],
      };
      const ordersData = {
        labels,
        datasets: [
          {
            label: "Orders",
            data: orders,
            maxBarThickness: 10,
          },
        ],
      };
      return { salesData, ordersData };
    };

    const fetchData = async () => {
      setIsLoadingCharts(true);
      setChartsError("");
      try {
        const resp = await getSalesAndOrders();
        if (!isCancelled) {
          const { salesData, ordersData } = mapResponseToCharts(resp || {});
          setSalesChartData(salesData);
          setOrdersChartData(ordersData);
        }
      } catch (err) {
        if (!isCancelled) {
          setChartsError(err?.message || "Failed to load charts");
          // Provide zeroed charts to avoid empty UI
          const { salesData, ordersData } = mapResponseToCharts({});
          setSalesChartData(salesData);
          setOrdersChartData(ordersData);
        }
      } finally {
        if (!isCancelled) setIsLoadingCharts(false);
      }
    };

    fetchData();

    // Refresh periodically to reflect API changes
    const intervalId = setInterval(fetchData, 60_000);
    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [janToJuneLabels]);

  // Fetch suppliers and categories for the tables
  useEffect(() => {
    let cancelled = false;
    const fetchTables = async () => {
      setIsLoadingTables(true);
      setTablesError("");
      try {
        const resp = await getSuppliersAndCategories();
        if (!cancelled) {
          setSuppliers(
            Array.isArray(resp?.["Supplier data"]) ? resp["Supplier data"] : []
          );
          setCategories(
            Array.isArray(resp?.["Category data"]) ? resp["Category data"] : []
          );
        }
      } catch (e) {
        if (!cancelled)
          setTablesError(e?.message || "Failed to load table data");
      } finally {
        if (!cancelled) setIsLoadingTables(false);
      }
    };
    fetchTables();
    const intervalId = setInterval(fetchTables, 60_000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Sales value</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  {chartsError && (
                    <div className="text-warning mb-2" style={{ fontSize: 12 }}>
                      {chartsError}
                    </div>
                  )}
                  {isLoadingCharts && !salesChartData ? (
                    <div className="text-light">Loading sales data...</div>
                  ) : (
                    <Line
                      data={salesChartData || chartExample1["data1"]}
                      options={chartExample1.options}
                      getDatasetAtEvent={(e) => console.log(e)}
                    />
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Total orders</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  {isLoadingCharts && !ordersChartData ? (
                    <div>Loading orders data...</div>
                  ) : (
                    <Bar
                      data={ordersChartData || chartExample2.data}
                      options={chartExample2.options}
                    />
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Supplier Data</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      onClick={() => {
                        try {
                          window.location.assign("/admin/suppliers");
                        } catch (_) {}
                      }}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Unit</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {tablesError && (
                    <tr>
                      <td colSpan={4} className="text-danger">
                        {tablesError}
                      </td>
                    </tr>
                  )}
                  {isLoadingTables &&
                    suppliers.length === 0 &&
                    !tablesError && (
                      <tr>
                        <td colSpan={4}>Loading suppliers...</td>
                      </tr>
                    )}
                  {suppliers.map((s, idx) => (
                    <tr key={idx}>
                      <th scope="row">{s?.Name ?? "-"}</th>
                      <td>{s?.Quantity ?? 0}</td>
                      <td>{s?.Unit ?? 0}</td>
                      <td>{s?.Price ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Category Data</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      onClick={() => {
                        try {
                          window.location.assign("/admin/categories");
                        } catch (_) {}
                      }}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Category name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {tablesError && (
                    <tr>
                      <td colSpan={3} className="text-danger">
                        {tablesError}
                      </td>
                    </tr>
                  )}
                  {isLoadingTables &&
                    categories.length === 0 &&
                    !tablesError && (
                      <tr>
                        <td colSpan={3}>Loading categories...</td>
                      </tr>
                    )}
                  {categories.map((c, idx) => (
                    <tr key={idx}>
                      <th scope="row">{c?.["Category name"] ?? "-"}</th>
                      <td>{c?.Quantity ?? 0}</td>
                      <td>{c?.Price ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
