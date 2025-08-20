import { useEffect, useState } from "react";
import moment from "moment";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
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
import { SellPaza_TransactionList } from "../../../service/apiModels/userApiService/Post/userApiService";
import { setloader } from "../../../redux/reducers/Loader/loaderslice";

const HistorySec = ({ isSold }) => {
  const fields = [
    "Sr No",
    "Date",
    "Quantity (USDC)",
    "Quantity (PAZA)",
    "Txn Hash",
  ];
  const [activePage, setactivePage] = useState(1);
  const [itemsCountPerPage, setitemsCountPerPage] = useState(10);
  const [totalItemsCount, settotalItemsCount] = useState<any>();
  const [tokenDecimal, setTokenDecimal] = useState<any>(18);
  const [transactionList, setTransactionlist] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const wallet_Address = useSelector(
    (state: any) => state?.address?.walletAddress
  );
  const selectedVesting = useSelector(
    (state: any) => state?.address?.selectedVestingAddress
  );

  const getTransactionListFunction = async (search: any, activePage: any) => {
    setIsLoading(true);
    try {
      let data: any = {
        userAddress: wallet_Address,
        page: activePage,
        perPage: itemsCountPerPage,
      };

      const result: any = await SellPaza_TransactionList(data);
      // console.log('result of sell transaction', result);
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
  }

  const handlePagination = (e: any) => {
    getTransactionListFunction("", e);
    setactivePage(e);
  };

  useEffect(() => {
    if (wallet_Address) {
      getTransactionListFunction("", activePage);
    }
  }, [wallet_Address, isSold]);

  return (
    <section className="history-sec">
      <Container>
        <div className="history-sec__wrap">
          <h2 className="h1 text-center">
            Sell History
            {/* Token Claim <span className="text-secondary">History</span> */}
          </h2>
          <CustomTable
            fields={fields}
            isLoading={isLoading}
            // noRecordFound={transactionList ? true : false}
          >
            {wallet_Address &&
              !isLoading &&
              transactionList?.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{(activePage - 1) * 10 + index + 1}</td>
                  <td>{moment(item?.updatedAt).format("DD MMM YYYY") || ""}</td>
                  <td>
                    {(item?.returnValues?.usdcAmount / 1e6).toFixed(2) || ""}
                  </td>
                  <td>
                    {(item?.returnValues?.tokenAmount / 1e18).toFixed(2) || ""}
                  </td>
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
