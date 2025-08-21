/** @format */

import { Col, Row } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import DepositWithdraw from "../../UI/depositWithdraw/DepositWithdraw";
import paza from "../../../Assets/Images/paza.png";
import usdt from "../../../Assets/Images/usdt.png";
import wallet from "../../../Assets/Images/wallet_img.jpg";
import "./TransactionCardStyle.scss";
import CustomTable from "../../UI/Table/CustomTable1";
import CustomTableNFT from "../../UI/Table/CustomTableNFT";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import RefreshBtn from "../../../Assets/Images/refresh_btn.png";
import web3Service from "../../../service/contractServices/web3.service";
// @ts-ignore
import txHistoryService from "../../../service/apiModels/txhistory/txHistoryService";
import { ButtonCustom } from "../../UI/button/ButtonCustom";
import CommonModal from "../../UI/Modal/CommonModal";
import BorrowersService, {
  BorrowersData,
  BorrowersHistoryService,
} from "../../../service/apiModels/borrowers/BorrowersService";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "../../common/Toasts/Toast";
// import copycode from "../../../assets/images/icons/copy.svg";
import decFunction from "../../common/Decimal";
import { fetchTokenBalances } from "../../../service/apiServices/ApiServiceHelper";
import { perPage } from "../../../Constants";
import { CustomButton } from "../../UI";
// import { multiplier } from "universal-calci-pro";

interface TransactionCardPorps {
  address: string;
  value: number;
  walletInfo: number;
  fetchtrnxHistory?: boolean;
}

const TransactionCard: React.FC<TransactionCardPorps> = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const walletDebutData: any = useSelector(
    (state: any) => state?.walletSlice?.walletDetails
  );
  const storeRes: any = useSelector((state) => state);
  const walletData: any = useSelector((state: any) => state?.loginSlice);
  const walletVerifyData: any = useSelector((state: any) => state?.walletSlice);
  const persona: string = useSelector(
    (state: any) => state?.loginSlice?.loginDetail?.persona
  );

  const [txHis, setTxHis] = useState<any>([]);
  const [txHisNFT, setTxHisNFT] = useState<any>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [total, settotal] = useState<number>(0);
  const [pageViewAll, setPageViewAll] = useState<number>(1);
  const [totalViewAll, settotalViewAll] = useState<number>(0);
  const [totalNft, setTotalNft] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalOneVisible, setIsModalOneVisible] = useState<boolean>(false);
  const [pazaPrice, setPazaPrice] = useState<any>();

  useEffect(() => {
    let timeout: any;
    if (isCopied) {
      timeout = setTimeout(() => {
        setIsCopied(!isCopied);
      }, 3000);
    }
    return () => clearInterval(timeout);
  }, [isCopied]);
  const showCommonModal = () => {
    txHistoryNft(0, perPage);
    setIsModalVisible(true);
  };
  useEffect(() => {
    if (props?.fetchtrnxHistory) txHistory(0);
  }, [props]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showCommonOneModal = () => {
    setIsModalOneVisible(true);
  };

  // const handleOneOk = () => {
  //   setIsModalOneVisible(false);
  // };

  const handleOneCancel = () => {
    // setPage(0);
    settotalViewAll(0);
    setPageViewAll(1);
    setIsModalOneVisible(false);
  };

  useEffect(() => {
    fetchTokenBalances(dispatch, setPazaPrice);
    // txHistory(0);
    txHistoryNft(0, perPage);
    totalNftValue();
  }, []);

  /**
   * function to handle transaction history
   * @param pageVal current page number
   */
  const txHistory = async (pageVal: number) => {
    const paginationData = {
      current: pageVal ? pageVal - 1 : pageViewAll - 1,
      perPage: 10,
      page: pageVal ? pageVal - 1 : pageViewAll - 1,
    };
    const apiRes: any = await txHistoryService(paginationData, dispatch);
    if (apiRes?.status === 401) {
      // window.localStorage.clear();
      // navigate("/login");
    } else if (apiRes?.data?.error === false) {
      const pazaDec: any = await web3Service?.getDecimalsPaza();
      // const getPazaPrice: any = await web3Service?.getPazaTokenPrice();
      const getPazaPrice: any = await web3Service.getBuyUsdcPrice("1000000");

      settotal(apiRes?.data?.totalCount);
      const apidata = apiRes?.data?.data || [];
      apidata?.map((data: any, index: any) => {
        data.count = index + 1;
        data.time = moment(data?.createdAt).format("hh:mm a");
        data.date = moment(data?.createdAt).format("DD-MM-YYYY");
        data.paza = (data?.amount / getPazaPrice).toFixed(2);
        data.amount = (data?.amount / 10 ** pazaDec).toFixed(2);
        data.action = data?.type === "pazasell" ? "SELL" : "BUY";
      });
      setTxHis(apidata);
    }
  };

  /**
   * function to handle history of NFT data
   * @param pageVal current page number
   */
  const txHistoryNft = async (pageVal: number, pageSize: number) => {
    const paginationData = {
      current: pageVal ? pageVal - 1 : pageViewAll - 1,
      perPage: pageSize,
      page: pageVal ? pageVal - 1 : pageViewAll - 1,
    };
    const apiRes: any = await BorrowersHistoryService(paginationData, dispatch);
    if (apiRes?.status === 401) {
      // window.localStorage.clear();
      // navigate("/login");
    } else if (apiRes?.data?.error === false) {
      settotalViewAll(apiRes?.data?.totalCount);
      console.log("apiRes?.data?.data", apiRes?.data?.data);

      const apidata = apiRes?.data?.data || [];
      let filteredLoanData =
        apidata &&
        apidata
          .filter((data: any) => data?.staked_amount !== 0)
          .map((data: any, index: any) => {
            return data;
          });
      filteredLoanData = JSON.parse(JSON.stringify(filteredLoanData));
      filteredLoanData?.map((data: any, index: any) => {
        data.srno = index + 1;
      });
      setTxHisNFT(filteredLoanData);
    }
  };

  /**
   * function to refresh values
   */
  const getBal = async () => {
    fetchTokenBalances(dispatch, setPazaPrice);
    await txHistory(0);
  };

  /**
   * function to call when user hits activate wallet
   */
  const handleSubmit = () => {
    if (walletData?.loginDetail?.twoFactorAuthenticationStatus === false) {
      navigate("/auth/settings");
    } else if (walletData?.loginDetail?.walletActivated) {
      navigate("/auth/wallet-verify");
    } else {
      navigate("/auth/store-seeds");
    }
  };

  /**
   * function to set total numbers of NFTs
   */
  const totalNftValue = async () => {
    const apiRes: any = await BorrowersData();
    if (apiRes?.status === 401) {
      // window.localStorage.clear();
      // navigate("/login");
    } else if (apiRes?.status) {
      setTotalNft(apiRes?.data?.data);
    }
  };

  return (
    <div
      className={
        walletData?.isWallet && walletDebutData?.address
          ? "transactioncard"
          : "transactioncard not-connected"
      }
    >
      {walletVerifyData?.verifiedDetail ? (
        <div className="transactioncard__wallet">
          <p
            className={
              walletData?.isWallet && walletDebutData?.address
                ? "connected"
                : "not-connected"
            }
          >
            Wallet Address:&nbsp;
            <span>
              {walletData?.isApproved == true ||
              (walletVerifyData?.verifiedDetail == true &&
                walletDebutData?.address)
                ? `${(walletDebutData?.address).slice(
                    0,
                    5
                  )}...${(walletDebutData?.address).slice(-4)}`
                : ""}
            </span>
            &nbsp;&nbsp;
            {isCopied ? null : (
              <CopyToClipboard
                text={walletDebutData?.address}
                onCopy={() => {
                  setIsCopied(true);
                  toast.success("Copied");
                }}
              >
                <img src={""} alt="copy_twofa" className="code_code" />
              </CopyToClipboard>
            )}
          </p>{" "}
          {/* <button className='not_connctd' onClick={notConneted}>
            {walletData?.isWallet || walletDebutData?.address
              ? null
              : "Not Active"}
          </button> */}
        </div>
      ) : (
        ""
      )}
      <div className="transactioncard__detail">
        {
        // walletVerifyData?.verifiedDetail ? (
          <div className="transactioncard__detail__conn">
            <div className="t_vale">
              <h4>
                Total Value:{" "}
                <span
                  title={
                    pazaPrice > 0
                      ? (
                          decFunction(walletData?.usdtBal) +
                          Number((walletData?.pazzaBal / pazaPrice).toFixed(2))
                        ).toLocaleString()
                      : "0.000"
                  }
                >
                  {pazaPrice > 0
                    ? (
                        decFunction(walletData?.usdtBal) +
                        Number((walletData?.pazzaBal / pazaPrice).toFixed(2))
                      )
                        .toLocaleString()
                        .substring(0, 15) + "..."
                    : "0.000"}
                  USDC
                </span>
                {/* <span>
                  {(
                    walletData?.usdtBal + walletData?.pazzaBal
                  ).toLocaleString()}{" "}
                  USD
                </span> */}
              </h4>
              <button className="rfresh_btn" onClick={getBal}>
                <img src={RefreshBtn} alt="icon" />
              </button>
            </div>
            <div className="transactioncard__detail__coins">
              <Row gutter={15}>
                <Col xs={24} sm={12} xl={24}>
                  <DepositWithdraw
                    img={paza}
                    coinName="PAZA"
                    value={walletData?.pazzaBal / 10 ** 18}
                    balBox={true}
                    staked={totalNft?.total_staking_rewards_paza}
                    pazaPrice={pazaPrice}
                  />
                </Col>
                <Col xs={24} sm={12} xl={24}>
                  <DepositWithdraw
                    img={usdt}
                    coinName="USDT"
                    value={walletData?.usdtBal}
                    pazaPrice={pazaPrice}
                    balBox={false}
                    staked={0}
                  />
                </Col>
                <Col xs={24}>
                  <p className="tran_history">
                    {persona === "Lender" && (
                      <Link to="#" onClick={showCommonOneModal}>
                        View Transaction History
                      </Link>
                    )}
                  </p>
                  <CommonModal
                    className="table-modal"
                    title=""
                    isModalVisible={isModalOneVisible}
                    handleOk={() => setIsModalOneVisible(false)}
                    handleCancel={handleOneCancel}
                  >
                    <div className="common-table px-2">
                      <h3 style={{ textAlign: "center" }}>
                        Transaction History
                      </h3>
                      <CustomTable
                        txHis={txHis}
                        setpage={setPage}
                        page={page}
                        total={total}
                        txHistory={txHistory}
                      />
                    </div>
                  </CommonModal>
                </Col>
              </Row>
            </div>
          </div>
        // ) 
        //  (
        //   <div className="transactioncard__detail__notconn">
        //     <img src={wallet} alt="icon" />
        //     {!walletData?.loginDetail?.walletActivated ? (
        //       <h3>
        //         Your Wallet is not activated yet. Please activate your Wallet.
        //       </h3>
        //     ) : walletData?.loginDetail?.walletActivated ? (
        //       <h3>Your Wallet is activated. Please verify your Wallet.</h3>
        //     ) : null}
        //     {props?.walletInfo == 2 &&
        //       walletData.loginDetail?.walletActivated === false && (
        //         <CustomButton
        //           text="Activate Wallet"
        //           className="activate_wallet_btn"
        //           onClick={handleSubmit}
        //         />
        //       )}
        //     {walletData?.loginDetail?.walletActivated === true && (
        //       <>
        //         <CustomButton
        //           text="Login to Wallet"
        //           className="activate_wallet_btn"
        //           onClick={handleSubmit}
        //         />
        //       </>
        //     )}
        //   </div>
        // )
        }
      </div>

      {walletVerifyData?.verifiedDetail ? (
        <div className="transactioncard__wallet bottom">
          {persona === "Lender" && (
            <p>
              Total NFT:{" "}
              {totalNft?.total_nft ? <span>{totalNft?.total_nft}</span> : 0}
            </p>
          )}
          {persona === "Lender" && (
            <p>
              Total Loan:{" "}
              {totalNft?.total_loans
                ? ` $${decFunction(
                    totalNft?.total_loans / 1000
                  ).toLocaleString()}` + " K"
                : 0}
            </p>
          )}
          {persona === "Lender" && (
            <ButtonCustom label="View All" onClick={showCommonModal} />
          )}
          <CommonModal
            className="table-modal"
            title=""
            isModalVisible={isModalVisible}
            handleOk={handleOk}
            handleCancel={handleCancel}
          >
            <div className="common-table px-2">
              <h3 style={{ textAlign: "center" }}>History</h3>
              <CustomTableNFT
                txHisNFT={txHisNFT}
                setpage={setPageViewAll}
                page={pageViewAll}
                total={totalViewAll}
                txHistoryNft={txHistoryNft}
              />
            </div>
          </CommonModal>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default TransactionCard;
