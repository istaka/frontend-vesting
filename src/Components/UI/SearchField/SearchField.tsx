import { Form } from "react-bootstrap";
import "./SearchField.scss";
import { SearchIcon } from "../../../Assets/Icon/svg/SvgIcons";

const SearchField = () => {
  return (
    <div className="search-field">
      <Form>
        <div className="search-field__search">
          <Form.Control
            type="text"
            placeholder="Search by User and Wallet Address"
          />
          <button type="button">
            <SearchIcon />
          </button>
        </div>
      </Form>
    </div>
  );
};

export default SearchField;
