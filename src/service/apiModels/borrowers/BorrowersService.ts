import { APIURL } from "../../../Constants";
import {
  apiCallPostHeader,
  apiCallGetHeader,
} from "../../../service/apiServices/ApiServices";
import { borrowersAction } from "../../../redux/reducers/borrowers/borrowersSlice";

/**
 * function to show the list of loans
 * @param data pagination object for showing the data
 * @param dispatch dispatch function for redux
 * @returns api response
 */
const BorrowersService = async (data: any, dispatch: any) => {
  try {
    const accessToken = localStorage.getItem("access-token");
    const result: any = await apiCallPostHeader(
      APIURL.BORROWERS,
      data,
      {},
      accessToken
    );
    if (result) {
      dispatch(borrowersAction(result));
      return result;
    }
  } catch (error: any) {
    console.log(error.mesage);
  }
};
export const BorrowersHistoryService = async (data: any, dispatch: any) => {
  try {
    const accessToken = localStorage.getItem("access-token");
    const result: any = await apiCallPostHeader(
      APIURL.BORROWER_HISTORY,
      data,
      {},
      accessToken
    );
    if (result) {
      dispatch(borrowersAction(result));
      return result;
    }
  } catch (error: any) {
    console.log(error.mesage);
  }
};
export const IngestedService = async (data: any, dispatch: any) => {
  try {
    const accessToken = localStorage.getItem("access-token");
    const result: any = await apiCallPostHeader(
      APIURL.INGESTED,
      data,
      {},
      accessToken
    );
    if (result) {
      dispatch(borrowersAction(result));
      return result;
    }
  } catch (error: any) {
    console.log(error.mesage);
  }
};

/**
 * function to fetch general information on the borrower tab
 * @returns api response
 */
export const BorrowersData = async () => {
  try {
    const accessToken = localStorage.getItem("access-token");
    const result: any = await apiCallGetHeader(
      APIURL.TOTAL_FIGURE_BORROWER,
      {},
      accessToken
    );
    if (result) {
      return result;
    }
  } catch (error: any) {
    console.log(error.mesage);
  }
};

export default BorrowersService;
