// import { Field } from "formik";
// import Label from "../Label/Label";
// import "./Input.scss";

// const Input = (props: any) => {
//   return (
//     <>
//       <div className={`input ${props.className || ""}`}>
//         {props.label && <Label htmlFor={props.name} label={props.label} />}
//         <div className="inner">
//           <Field
//             placeholder={props.placeholder}
//             name={props.name}
//             className={props.icon ? "icon_input" : ""}
//             value={props.value}
//             // onChange={(e: any) => props?.onChange(e.target.value)}
//             id={props?.id}
//             type={props.type}
//           />
//           {props.icon && <span className="icon">{props.icon}</span>}
//         </div>
//         {props.children}
//         {/* <ErrorMessage name={props.name} component={ErrorText} /> */}
//       </div>
//     </>
//   );
// };

// export default Input;


import { useFormContext } from "react-hook-form";
import Label from "../Label/Label";
import "./Input.scss";

const Input = (props: any) => {
  const methods = useFormContext(); // ✅ Get form methods

  if (!methods) {
    throw new Error("Input must be used inside a FormProvider"); // ❗ Error if used incorrectly
  }

  const { register } = methods;

  return (
    <div className={`input ${props.className || ""}`}>
      {props.label && <Label htmlFor={props.name} label={props.label} />}
      <div className="inner">
        <input
          {...register(props.name)} // ✅ Register field
          placeholder={props.placeholder}
          className={props.icon ? "icon_input" : ""}
          id={props?.id}
          type={props.type}
        />
        {props.icon && <span className="icon">{props.icon}</span>}
      </div>
      {props.children}
    </div>
  );
};

export default Input;


