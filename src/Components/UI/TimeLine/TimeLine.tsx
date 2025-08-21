import "./TimeLine.scss";
import moment from "moment";
import Slider from "react-slick";
import LoaderInner from "../Loader/LoaderInner";
import { toast } from "../../common/Toasts/Toast";
import { useEffect, useRef, useState } from "react";
import CustomTooltip from "../Tooltip/CustomTooltip";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../CustomButton/CustomButton";
import { setloader } from "../../../redux/reducers/Loader/loaderslice";
import {
  CheckIcon,
  SliderLeftIcon,
  SliderRightIcon,
} from "../../../Assets/Icon/svg/SvgIcons";
import {
  checkBalanceAfterClaim,
  claimFunction, 
  settings,
} from "./TimeLineHelper";
import { setSelectedVestingAddress } from "../../../redux/reducers/login/address/address";
import { ALL_TransactionList } from "../../../service/apiModels/userApiService/Post/userApiService";
import {
  TOAST_MESSAGE,
  XPAZA_ClAIMABLE,
  XPAZA_ClAIMED,
} from "../../common/Toasts/ConstVar";
import store from "../../../redux/store";

const TimeLine = () => {
  const slider = useRef(null);
  const dispatch = useDispatch();
  const [count, setCount] = useState<any>(0);
  const [trxLength, setTrxLength] = useState<number>(0);
  const [transactionList, setTransactionlist] = useState<any>();

  const selectedVesting = useSelector(
    (state: any) => state?.address?.selectedVestingAddress
  );
  const ownerBalances = useSelector(
    (state: any) => state?.address?.ownerBalances
  );
  const wallet_Address = useSelector(
    (state: any) => state?.address?.walletAddress
  );
  

  const getAllTransactionListFunction = async () => {
    try {
      let count1 = 0;
      let count2 = 0;
      let data: any = {
        vestingAddress: selectedVesting?.contractAddress,
        userAddress: wallet_Address?.toLowerCase(),
      };
      const result: any = await ALL_TransactionList(data);
      setTrxLength(result?.data?.length);
      let tempdata: any = result.data?.map((item: any, index: any) => {
        if (item?.isClaimable || item?.isClaimed) {
          count1 = count1 + 1;
          setCount(count1);
        }
        return item;
      });
      setTransactionlist(result?.data);
    } catch (error) {
      console.log("error-------ALL TRANSACTION----", error);
    }
  };

  const handleClaim = async () => {
    try {
      dispatch(setloader(true));
      setTimeout(() => {
      }, 500);

      let data: any = selectedVesting;
      let res: any = await claimFunction(data, dispatch, wallet_Address);
      if (res?.blockHash) {
        
        setCount(0);
        toast.success(TOAST_MESSAGE.claim);
        setTimeout(async () => {
          await checkBalanceAfterClaim(data, dispatch, wallet_Address);
          await getAllTransactionListFunction();
          dispatch(setSelectedVestingAddress(selectedVesting));
          dispatch(setloader(false));
        }, 2000);
      } else {
      
        dispatch(setloader(false));
      }
    } catch (error) {
      console.log("handle claim error", error);
    }
  };

  useEffect(() => {
    if (selectedVesting) getAllTransactionListFunction();
  }, [wallet_Address, selectedVesting]);

  //LOGS
  
  return (
    <>
      {wallet_Address && selectedVesting && (
        <div className="timeline-outer">
          <h2 className="h1">Vesting Timeline</h2>
          {transactionList ? (
            <>
              <div className="timeline">
                <div className="timeline-line" />
                <div className="timeline-wrap">
                  <Slider {...settings} ref={slider}>
                    {transactionList?.map((item: any, index: any) => (
                      <div key={index}>
                        <div
                          className={`timeline-card ${
                            item?.isClaimed ? "claimed" : ""
                          } ${item?.isClaimable ? "claimable" : ""} ${
                            item?.isNotClaim ? "isNotClaim" : ""
                          }`}
                        >
                          {index == count - 1 &&
                            ownerBalances?.balance_Vested != 0 &&
                            ownerBalances?.claimed !=
                              ownerBalances?.total_Allocation && (
                              <CustomButton
                                text="Claim Now"
                                className="outline-btn"
                                onClick={() => handleClaim()}
                              />
                           )} 

                          <span className="timeline-card-dot">
                            {item?.isClaimed && <CheckIcon />}
                          </span>
                          <CustomTooltip
                            placement="bottom"
                            content={
                              item?.isClaimed
                                ? item?.amount
                                : item.isClaimable
                                ? item?.amount
                                : 0
                            }
                          >
                            <p className="timeline-card-year">
                              {moment(item?.timeStamp).format("DD MMM YYYY") ||
                                ""}
                            </p>
                            {item.isClaimed ? (
                              <p className="timeline-card-claim">
                                {item?.amount
                                  ? `${item?.amount}  ${XPAZA_ClAIMED}`
                                  : 0}
                              </p>
                            ) : item.isClaimable ? (
                              <p className="timeline-card-claim">
                                {`${item?.amount}  ${XPAZA_ClAIMABLE}`}
                              </p>
                            ) : (
                              <p className="timeline-card-claim">{`0 PAZA Claimmable`}</p>
                            )}
                          </CustomTooltip>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
              <div className="timeline-btns">
                <button
                  onClick={() => slider?.current?.slickPrev()}
                  type="button"
                >
                  <SliderLeftIcon />
                </button>
                <button
                  onClick={() => slider?.current?.slickNext()}
                  type="button"
                >
                  <SliderRightIcon />
                </button>
              </div>
            </>
          ) : (
            <LoaderInner />
          )}
        </div>
      )}
    </>
  );
};

export default TimeLine;
