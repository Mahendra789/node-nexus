import { useEffect, useState } from "react";
import Header from "components/Headers/Header.js";
import { getAllCategories } from "api/products";
import { Card, CardHeader, Container, Row, Table } from "reactstrap";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await getAllCategories();
        const items = Array.isArray(data?.["Category data"])
          ? data["Category data"]
          : [];
        if (!cancelled) setCategories(items);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load categories");
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
                <h3 className="mb-0">Categories</h3>
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
                  {isLoading && (
                    <tr>
                      <td colSpan={3}>Loading categories...</td>
                    </tr>
                  )}
                  {error && !isLoading && (
                    <tr>
                      <td colSpan={3} className="text-danger">
                        {error}
                      </td>
                    </tr>
                  )}
                  {!isLoading && !error && categories.length === 0 && (
                    <tr>
                      <td colSpan={3}>No categories found.</td>
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
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Categories;
