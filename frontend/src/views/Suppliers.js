import { useEffect, useState } from "react";
import Header from "components/Headers/Header.js";
import { getAllSuppliers } from "api/products";
import {
  Card,
  CardHeader,
  CardFooter,
  Container,
  Row,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await getAllSuppliers({ page, limit });
        if (!cancelled) {
          const items = Array.isArray(data?.items) ? data.items : [];
          setSuppliers(items);
          setHasNext(!!data?.hasNext);
        }
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
  }, [page, limit]);

  const goToPage = (p) => {
    if (p < 1) return;
    if (p === page) return;
    setPage(p);
  };

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
              <CardFooter className="py-4">
                <nav aria-label="Supplier pagination">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem disabled={page === 1}>
                      <PaginationLink
                        href="#prev"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) goToPage(page - 1);
                        }}
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem active={page === 1}>
                      <PaginationLink
                        href="#page-1"
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(1);
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {page > 1 && (
                      <PaginationItem active>
                        <PaginationLink
                          href={`#page-${page}`}
                          onClick={(e) => e.preventDefault()}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    {hasNext && (
                      <PaginationItem>
                        <PaginationLink
                          href={`#page-${page + 1}`}
                          onClick={(e) => {
                            e.preventDefault();
                            goToPage(page + 1);
                          }}
                        >
                          {page + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    <PaginationItem disabled={!hasNext}>
                      <PaginationLink
                        href="#next"
                        onClick={(e) => {
                          e.preventDefault();
                          if (hasNext) goToPage(page + 1);
                        }}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Suppliers;
