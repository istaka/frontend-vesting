import { useEffect, useState } from "react";
import moment from "moment";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  CopyIcon,
  NextArrowIcon,
  PrevArrowIcon,
} from "../../../Assets/Svg/SvgImages";
import { CustomTable } from "../../../Components/UI";
import CommonPagination from "../../../Components/UI/CommonPagination/CommonPagination";

import CopyToClipboard from "react-copy-to-clipboard";

import "./HistorySec.scss";
import { EXPLORER_URL } from "../../../Constant";
import { toast } from "../../../Components/common/Toasts/Toast";
import { TOAST_MESSAGE } from "../../../Components/common/Toasts/ConstVar";
import { getDecimal } from "../../../Components/UI/ConnectWallet/connectWalletHelper";
import { TransactionList } from "../../../service/apiModels/userApiService/Post/userApiService";

const HistorySec = () => {
  const fields = ["Sr No", "Date", "Quantity (PAZA)", "Txn Hash"];
  const [activePage, setactivePage] = useState(1);
  const [itemsCountPerPage, setitemsCountPerPage] = useState(10);
  const [totalItemsCount, settotalItemsCount] = useState<any>();
  const [tokenDecimal, setTokenDecimal] = useState<any>(18);
  const [transactionList, setTransactionlist] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);


  const wallet_Address = useSelector(
    (state: any) => state?.address?.walletAddress
  );
  const selectedVesting = useSelector(
    (state: any) => state?.address?.selectedVestingAddress
  );

  const getTransactionListFunction = async (search: any, activePage: any) => {
    setIsLoading(true);
    try{ 
    let data: any = {
      vestingAddress: selectedVesting?.contractAddress?.toLowerCase(),
      userAddress: wallet_Address,
      page: activePage,
      perPage: itemsCountPerPage,
    };

    const result: any = await TransactionList(data);
    let decimal: any;
    try {
      decimal = await getDecimal();
    } catch (error) {
      decimal = 18;
    }
    setTokenDecimal(decimal);
    setTransactionlist(result?.data);
    settotalItemsCount(result?.totalCount);
  } finally {
    setIsLoading(false);
  }
  };

  const handlePagination = (e: any) => {
    setactivePage(e);
    getTransactionListFunction("", e);
  };

  useEffect(() => {
    if (selectedVesting) {
      getTransactionListFunction("", activePage);
    }
  }, [selectedVesting]);

  return (
    <section className="history-sec">
      <Container>
        <div className="history-sec__wrap">
          <h2 className="h1 text-center">
            Token Claim History
            {/* Token Claim <span className="text-secondary">History</span> */}
          </h2>
          <CustomTable
            fields={fields}
            // noRecordFound={transactionList ? true : false}
          >
            {wallet_Address &&
            !isLoading &&
              transactionList?.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{(activePage - 1) * 10 + index + 1}</td>
                  <td>{moment(item?.timeStamp).format("DD MMM YYYY") || ""}</td>
                  <td>{item?.amount?.toFixed(2) || ""}</td>
                  <td>
                    <div className=" txn_txt">
                      <a
                        href={EXPLORER_URL + item?.transactionHash}
                        target="_blank"
                      >
                        {`${item?.transactionHash?.slice(
                          0,
                          5
                        )}....${item?.transactionHash?.slice(-6)}`}
                      </a>

                      <span className="copy-icon">
                        <CopyToClipboard
                          text={item?.transactionHash}
                          onCopy={() => {
                            toast.success(TOAST_MESSAGE.copy);
                          }}
                        >
                          <button className="bg-transparent border-0">
                            <CopyIcon />
                          </button>
                        </CopyToClipboard>
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            
          </CustomTable>
          {wallet_Address && itemsCountPerPage < totalItemsCount ? (
            <CommonPagination
              activePage={activePage}
              itemsCountPerPage={itemsCountPerPage}
              totalItemsCount={totalItemsCount}
              // hideFirstLastPages={true}
              pageRangeDisplayed={Math.ceil(
                Number(totalItemsCount) / Number(itemsCountPerPage)
              )}
              prevPageText={<PrevArrowIcon />}
              nextPageText={<NextArrowIcon />}
              onChange={(e: any) => handlePagination(e)}
            />
          ) : null}
        </div>
      </Container>
    </section>
  );
};

export default HistorySec;
