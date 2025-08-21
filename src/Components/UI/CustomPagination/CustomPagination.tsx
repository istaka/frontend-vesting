import Pagination from "react-bootstrap/Pagination";
import "./CustomPagination.scss";

const CustomPagination = () => {
  return (
    <Pagination className="custom-pagination">
      <Pagination.Prev>&lt;</Pagination.Prev>
      <Pagination.Item active>{1}</Pagination.Item>
      <Pagination.Item>{2}</Pagination.Item>
      <Pagination.Item>{3}</Pagination.Item>
      <Pagination.Item>{4}</Pagination.Item>
      <Pagination.Ellipsis className="ellipses" />
      <Pagination.Item>{40}</Pagination.Item>
      <Pagination.Next>&gt;</Pagination.Next>
    </Pagination>
  );
};

export default CustomPagination;
