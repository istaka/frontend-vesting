// import { ReactNode } from "react";
// import { Table } from "react-bootstrap";
// import { NoRecord } from "../../../Assets/Icon/svg/SvgIcons";
// import "./CustomTable.scss";

// const CustomTable = ({
//   className,
//   fields,
//   children,
//   noRecordFound,
// }: {
//   className?: string;
//   fields?: string[];
//   sortbuttons?: boolean;
//   children?: ReactNode | any;
//   noRecordFound?: any;
// }) => {
//   return (
//     <div className="custom-table">
//       <Table responsive className={`custom-table__table ${className}`}>
//         {fields && (
//           <thead>
//             <tr>
//               {fields?.map((item) => (
//                 <th key={item}>{item}</th>
//               ))}
//             </tr>
//           </thead>
//         )}
//         <tbody>
//           {typeof children == "object" && children?.length > 0 ? (
//             children
//           ) : typeof children != "object" && children ? (
//             children
//           ) : noRecordFound ? (
//             noRecordFound
//           ) : (
//             <tr className="no_record text-center border-0">
//               <td colSpan={fields?.length}>
//                 <div className="no_record_box ">
//                   <NoRecord />
//                   <h4>No Record Found</h4>
//                 </div>
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </Table>
//     </div>
//   );
// };

// export default CustomTable;

import { ReactNode } from "react";
import { Table } from "react-bootstrap";
import { NoRecord } from "../../../Assets/Icon/svg/SvgIcons";
import "./CustomTable.scss";

const CustomTable = ({
  className,
  fields,
  children,
  noRecordFound,
  isLoading,
}: {
  className?: string;
  fields?: string[];
  sortbuttons?: boolean;
  children?: ReactNode | any;
  noRecordFound?: any;
  isLoading?: boolean;
}) => {
  return (
    <div className="custom-table">
      <Table responsive className={`custom-table__table ${className}`}>
        {fields && (
          <thead>
            <tr>
              {fields?.map((item) => (
                <th key={item}>{item}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={fields?.length} className="text-center">
                Loading...
              </td>
            </tr>
          ) : typeof children == "object" && children?.length > 0 ? (
            children
          ) : typeof children != "object" && children ? (
            children
          ) : noRecordFound ? (
            noRecordFound
          ) : (
            <tr className="no_record text-center border-0">
              <td colSpan={fields?.length}>
                <div className="no_record_box ">
                  <NoRecord />
                  <h4>No Record Found</h4>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default CustomTable;

