import { useEffect, useState } from "react";
import Header from "components/Headers/Header.js";
import { getAllSuppliers } from "api/products";
import { Card, CardHeader, Container, Row, Table } from "reactstrap";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await getAllSuppliers();
        if (!cancelled) setSuppliers(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load suppliers");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Suppliers</h3>
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
                  {isLoading && (
                    <tr>
                      <td colSpan={4}>Loading suppliers...</td>
                    </tr>
                  )}
                  {error && !isLoading && (
                    <tr>
                      <td colSpan={4} className="text-danger">
                        {error}
                      </td>
                    </tr>
                  )}
                  {!isLoading && !error && suppliers.length === 0 && (
                    <tr>
                      <td colSpan={4}>No suppliers found.</td>
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
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Suppliers;
