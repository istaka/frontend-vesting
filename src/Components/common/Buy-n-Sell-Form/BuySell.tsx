// import React, { useState } from "react";
// import { Form, Input, InputNumber } from "antd";
// import { Link } from "react-router-dom";
// // import CommonModal from "../../ui/Modal/CommonModal";

// import "./BuySell.scss";

// const BuySell = (props: any) => {
//   const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

//   const showModal = () => {
//     setIsModalVisible(true);
//   };
//   const disabledCharacters = ["e", "E", "+", "-"];
//   const onKeyDown = (e: any) => {
//     if (props.disableDecimal) {
//       disabledCharacters.push(".");
//     }

//     /** RESTRICT USER TO ENTER MORE THEN MAX LENGTH IN INPUT TYPE NUBER */
//     return props.type === "number"
//       ? (disabledCharacters?.includes(e.key) ||
//           (e.key !== "Backspace" &&
//             props.maxlength &&
//             e.target.value.length === props.maxlength)) &&
//           e.preventDefault()
//       : "";
//   };

//   return (
//     <>
//       <Form.Item
//         label={props.label}
//         name={props.name}
//         className="wrap_inborder"
//       >
//         <Input
//           type={props?.type}
//           placeholder={props?.placeholder}
//           disabled={props?.disabled}
//           defaultValue={props.defaultValue}
//           maxLength={props?.maxLength}
//           value={props?.value}
//           onKeyDown={onKeyDown}
//           onChange={props?.onChange}
//           min={props?.min}
//         />
//         <Link className="choose" to="#" onClick={showModal}>
//           <div className="left">
//             <img src={props.icon} alt="" />
//           </div>
//           <div className="right">
//             <h5>{props.heading}</h5>
//             <span title={props.amountToShow || props.subheading}>
//               {props.subheading}
//             </span>
//           </div>
//         </Link>
//       </Form.Item>
//     </>
//   );
// };

// export default BuySell;


import React, { useState, useRef, useEffect } from "react";
import { Form, Input, InputNumber } from "antd";
import { Link } from "react-router-dom";
// import CommonModal from "../../ui/Modal/CommonModal";

import "./BuySell.scss";

const BuySell = (props: any) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const cursorPosRef = useRef<number>(0);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const disabledCharacters = ["e", "E", "+", "-"];

  const onKeyDown = (e: any) => {
    if (props.disableDecimal) {
      disabledCharacters.push(".");
    }

    // Prevent non-numeric input while allowing backspace, delete, arrow keys etc
    if (props.type === "number") {
      const isNavigationKey = (
        e.key === "Backspace" || 
        e.key === "Delete" || 
        e.key === "ArrowLeft" || 
        e.key === "ArrowRight" ||
        e.key === "Tab"
      );
      
      const isNumberKey = /^[0-9.]$/.test(e.key);
      
      if (!isNavigationKey && !isNumberKey) {
        e.preventDefault();
        return;
      }

      // Check max length
      if (!isNavigationKey && 
          props.maxlength && 
          e.target.value.length >= props.maxlength) {
        e.preventDefault();
        return;
      }

      // Prevent multiple decimal points
      if (e.key === "." && e.target.value.includes(".")) {
        e.preventDefault();
        return;
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numeric values with optional decimal
    if (props.type === "number" && value !== "") {
      const isValid = /^\d*\.?\d*$/.test(value);
      if (!isValid) {
        return;
      }
    }

    // Store cursor position before parent updates value
    cursorPosRef.current = e.target.selectionStart || 0;
    props?.onChange?.(e);
  };

  // Use effect to restore cursor position after parent updates value
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosRef.current, cursorPosRef.current);
    }
  }, [props.value]);

  return (
    <>
      <Form.Item
        label={props.label}
        name={props.name}
        className="wrap_inborder"
      >
        <Input
          ref={inputRef}
          type="text" // Always use text type for selection support
          inputMode="decimal" // Show numeric keyboard on mobile
          placeholder={props?.placeholder}
          disabled={props?.disabled}
          defaultValue={props.defaultValue}
          maxLength={props?.maxLength}
          value={props?.value}
          onKeyDown={onKeyDown}
          onChange={handleChange}
          min={props?.min}
        />
        <Link className="choose" to="#" onClick={showModal}>
          <div className="left">
            <img src={props.icon} alt="" />
          </div>
          <div className="right">
            <h5>{props.heading}</h5>
            <span title={props.amountToShow || props.subheading}>
              {props.subheading}
            </span>
          </div>
        </Link>
      </Form.Item>
    </>
  );
};

export default BuySell;

