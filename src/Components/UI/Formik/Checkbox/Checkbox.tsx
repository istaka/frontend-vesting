import Form from "react-bootstrap/Form";
import "./Checkbox.scss";

const Checkbox = ({ label }: { label: string }) => {
  return (
    <div className="custom-checkbox">
      <Form.Check type="checkbox" id="checkbox" label={label} />
    </div>
  );
};

export default Checkbox;
