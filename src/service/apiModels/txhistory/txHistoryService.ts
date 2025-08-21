import { APIURL } from "../../../Constants";
import { apiCallPostHeader } from "../../apiServices/ApiServices";
import { txHistoryAction } from "../../../redux/reducers/txHistory/txHistorySlice";

/**
 * function to show transaction history
 * @param data pagination object
 * @param dispatch dispatch function for redux
 * @returns api response
 */
const txHistoryService = async (data: any, dispatch: any) => {
  try {
    const accessToken = localStorage.getItem("access-token");
    const result: any = await apiCallPostHeader(
      APIURL.TX_HISTORY,
      data,
      {},
      accessToken
    );

    if (result) {
      dispatch(txHistoryAction(result));
      return result;
    }
  } catch (error: any) {
    console.log(error.mesage);
  }
};

export default txHistoryService;
