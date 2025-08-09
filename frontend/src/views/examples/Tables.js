// reactstrap components
import { useEffect, useRef, useState } from "react";
import { getAllProducts, deleteProductById } from "../../api/products";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  Button,
  Alert,
  Modal,
  ModalBody,
  ModalFooter,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { setApiNotifier, setApiConfirmer } from "../../api/apiRequest";

const Tables = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    color: "success",
    message: "",
  });
  const toastTimerRef = useRef(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmState, setConfirmState] = useState({
    message: "Are you sure?",
    confirmText: "Delete",
    cancelText: "Cancel",
  });
  const confirmResolveRef = useRef(null);

  useEffect(() => {
    setApiNotifier(({ message, color = "success", timeoutMs = 3000 }) => {
      setToast({ visible: true, color, message });
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = window.setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, timeoutMs);
    });
    setApiConfirmer(
      ({ message, confirmText = "Delete", cancelText = "Cancel" }) => {
        return new Promise((resolve) => {
          confirmResolveRef.current = resolve;
          setConfirmState({
            message: message || "Are you sure?",
            confirmText,
            cancelText,
          });
          setIsConfirmOpen(true);
        });
      }
    );
    return () => {
      setApiNotifier(null);
      setApiConfirmer(null);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    getAllProducts()
      .then((data) => {
        if (!isCancelled) setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!isCancelled)
          setErrorMessage(err?.message || "Failed to load products");
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Products</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Product Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Unit Price</th>
                    <th scope="col">Total Price</th>
                    <th scope="col">Order Date</th>
                    <th scope="col">Supplier</th>
                    <th scope="col">Customer Name</th>
                    <th scope="col">Customer Email</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan="10">Loading products...</td>
                    </tr>
                  )}
                  {!isLoading && errorMessage && (
                    <tr>
                      <td colSpan="10" className="text-danger">
                        {errorMessage}
                      </td>
                    </tr>
                  )}
                  {!isLoading && !errorMessage && products.length === 0 && (
                    <tr>
                      <td colSpan="10">No products found.</td>
                    </tr>
                  )}
                  {!isLoading &&
                    !errorMessage &&
                    products.map((product) => (
                      <tr key={product.id || product._id}>
                        <td>{product.product_name}</td>
                        <td>{product.category}</td>
                        <td>{product.quantity}</td>
                        <td>{product.unit_price}</td>
                        <td>{product.total_price}</td>
                        <td>{product.date_ordered}</td>
                        <td>{product.supplier}</td>
                        <td>{product.customer_name}</td>
                        <td>{product.customer_email}</td>
                        <td>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={async () => {
                              if (isDeleting) return;
                              const id = product.id || product._id;
                              setProductToDelete(product);
                              setIsDeleting(true);
                              try {
                                await deleteProductById(id, {
                                  confirmDialog: {
                                    message:
                                      "Are you sure you want to delete this item?",
                                    confirmText: "Delete",
                                    cancelText: "Cancel",
                                  },
                                });
                                setProducts((prev) =>
                                  prev.filter((p) => (p.id || p._id) !== id)
                                );
                                setProductToDelete(null);
                              } catch (err) {
                                if (err && err.__cancelled) {
                                  // silently ignore
                                }
                              } finally {
                                setIsDeleting(false);
                              }
                            }}
                          >
                            <i className="fas fa-trash" aria-hidden="true" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              {/* Snackbar / Toast */}
              <div
                style={{
                  position: "fixed",
                  top: "1rem",
                  right: "1rem",
                  zIndex: 1080,
                  minWidth: "280px",
                  maxWidth: "90vw",
                }}
              >
                <Alert
                  color={toast.color}
                  isOpen={toast.visible}
                  toggle={() =>
                    setToast((prev) => ({ ...prev, visible: false }))
                  }
                  fade
                  className="shadow"
                >
                  {toast.message}
                </Alert>
              </div>
              {/* Global Confirmation Modal controlled via API layer */}
              <Modal
                isOpen={isConfirmOpen}
                toggle={() => {
                  if (!isConfirmOpen) return;
                  if (confirmResolveRef.current)
                    confirmResolveRef.current(false);
                  setIsConfirmOpen(false);
                }}
                backdrop
              >
                <ModalBody>{confirmState.message}</ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    onClick={() => {
                      if (confirmResolveRef.current)
                        confirmResolveRef.current(true);
                      setIsConfirmOpen(false);
                    }}
                  >
                    {confirmState.confirmText || "Delete"}
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => {
                      if (confirmResolveRef.current)
                        confirmResolveRef.current(false);
                      setIsConfirmOpen(false);
                    }}
                  >
                    {confirmState.cancelText || "Cancel"}
                  </Button>
                </ModalFooter>
              </Modal>
              {/* Deletion handler uses global confirmer via apiRequest */}
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
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

export default Tables;
