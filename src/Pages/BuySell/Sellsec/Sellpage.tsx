/** @format */

import { Link } from "react-router-dom";
import swap from "../../Assets/Images/swap.png";
import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
// import TransactionCard from "../../../Components/common/TransactionCard/TransactionCard";
import { CustomButton } from "../../../Components/UI";
import { Input } from "antd";
import BuySell from "../../../Components/common/Buy-n-Sell-Form/BuySell";
import { InfoIcon } from "../../../Assets/Svg/SvgImages";
import "./Sellpage.scss";
// import demo from "../../Assets/Icon/logo-mob.png"
import paza from "../../../Assets/Images/paza.png";
import usdt from "../../../Assets/Images/usdt.png";
import { toast } from "../../../Components/common/Toasts/Toast";
import { TOAST_MESSAGE } from "../../../Components/common/Toasts/ConstVar";
import { setloader } from "../../../redux/reducers/Loader/loaderslice";
import { useDispatch, useSelector } from "react-redux";
import { swapCoins } from "../../../Constants";
import decFunction from "../../../Components/common/Decimal";
import web3Service from "../../../service/contractServices/web3.service";
import { debounce } from "lodash";
import { getSellPazaPriceFun, getSellUsdcPriceFun } from "./SellHelper";
import { sellCap } from "../../../service/apiModels/userApiService/Post/userApiService";
import {
  BONDINGCURVE_ADDRESS,
  PAZZA_ADDRESS,
  TRADE_ADDRESS,
} from "../../../Constants";
import {
  pazazUserBalAction,
  usdtUserBalAction,
} from "../../../redux/reducers/login/loginSlice";

const Sellpage = ({ onSell }) => {
  const [show, setShow] = useState(false);
  const [slipPageVal, setSlipPageVal] = useState(0.5);
  const [sellLimit, SetSellLimit] = useState<any>({
    max: 250,
    remaining: 250,
  });
  const [sellDisable, setSellDisable] = useState<boolean>(true);
  const [pazaTokenprice, setPazaTokenPrice] = useState<number>(0);
  const wallet_Address = useSelector(
    (state: any) => state?.address?.walletAddress
  );
  const dispatch = useDispatch();
  const [count, setCount] = useState<any>(0);
  const storeRes: any = useSelector((state: any) => state);
  const [input1Err, setInput1Err] = useState<boolean>(false);
  const [taxonSell, setTaxOnSell] = useState(0);
  const [pazaBalExceed, setPazaBalExceed] = useState<boolean>(false);
  const [poolBalanceEXceed, setPoolBalanceEXceed] = useState<boolean>(false);
  const [decimal, setdecimal] = useState<number>(0);

  const [input1, setinput1] = useState<any>({
    inputValue: "",
    convertedValue: "",
  });

  const [input2, setinput2] = useState<any>({
    inputValue: "",
    convertedValue: "",
  });

  const [swapCoinState, setSwapCoinsState] = useState<{
    token1: string;
    token2: string;
  }>({
    token1: swapCoins.coin1,
    token2: swapCoins.coin2,
  });
  const [swapIcons, setSwapIcons] = useState<{
    icon1: string;
    icon2: string;
  }>({
    icon1: usdt,
    icon2: paza,
  });

  const inputRef1 = useRef<HTMLInputElement | null>(null);

  const [field, setField] = useState<any>("");
  const [usdcBalExceed, SetusdcBalExceed] = useState<boolean>(false);
  const [swapBal, setSwapBal] = useState<any>({
    bal1: storeRes.loginSlice.usdtBal,
    bal2: storeRes.loginSlice.pazzaBal,
  });

  const sellCalculateAgainstUsdc = useCallback(
    debounce(async (e: any) => {
      if (e?.convertedValue > 0) {
        let token2Price = await getSellPazaPriceFun(e.convertedValue);
        // setonlySellDisable(false);

        setinput2(token2Price);
        let calculateTaxOnSell: any = await web3Service.calculateTaxPercent(
          token2Price?.convertedValue
        );

        // calculateTaxOnSell = await web3Service.dividedBy10ToTheDecimal(
        //   calculateTaxOnSell["1"],
        //   6
        // );
        calculateTaxOnSell = (calculateTaxOnSell["1"] / 1e6).toFixed(3);

        setTaxOnSell(calculateTaxOnSell);
        let userBalance = await web3Service.userBalancePazza(wallet_Address);

        userBalance = await web3Service.dividedBy10ToTheDecimal(
          userBalance,
          18
        );

        if (Number(token2Price?.inputValue) > Number(userBalance)) {
          setPazaBalExceed(true);
          return;
          // setonlySellDisable(true);
        }
        setPazaBalExceed(false);
        setSellDisable(false);
      } else {
        // setinput1("");
        // setinput2("");
        setSellDisable(true);
        setinput2({
          inputValue: "",
          convertedValue: "",
        });
      }
    }, 1000), // (*)
    []
  );

  const handleSlipPageChange = (e: any) => {
    const value = e.target.value;

    if (
      value === "" || // Allow empty values
      ((/^\d{1,2}(\.\d{0,2})?$/.test(value) || value === "100") &&
        Number(value) <= 100)
    ) {
      setSlipPageVal(value);
    }
  };

  // const handleInputOne = async (data: any, field: any) => {
  //   const regex = /^[+]?\d*(?:[.]\d*)?$/;
  //   const isValidValue = regex.test(data);

  //   if (!isValidValue) {
  //     setSellDisable(true);
  //     return;
  //   }

  //   let values = data;

  //   if (data.includes(".")) {
  //     const [beforeDecimal, afterDecimal] = data.split(".");
  //     // Ensure before decimal is max 6 digits
  //     if (beforeDecimal.length > 6) {
  //       return; // Stop execution if before decimal exceeds 6 digits
  //     }
  //     if (afterDecimal.length > 2) {
  //       return; // Stop execution if before decimal exceeds 6 digits
  //     }

  //     // Ensure after decimal is max 2 digits
  //     values = `${beforeDecimal}.${afterDecimal.slice(0, 2)}`;
  //   } else {
  //     // If no decimal, ensure max 6 digits
  //     if (data.length > 6) {
  //       return;
  //     }
  //   }

  //   setTaxOnSell(0);
  //   setSellDisable(true);
  //   setField(field);
  //   setInput1Err(false);

  //   if (data >= 0) {
  //     // if (buySellStatus) {
  //     if (Number(data) < 20) {
  //       setInput1Err(true);
  //       setSellDisable(true);
  //     }
  //     if (Number(data) > Number(storeRes?.loginSlice?.usdtBal)) {
  //       setSellDisable(true);
  //       // setBuySellBtn(true);
  //     }
  //     // }
  //     let convertedValue: any = await web3Service.multiplyBy10ToTheDecimal(
  //       data.toString(),
  //       6
  //     );
  //     const finalValue = {
  //       convertedValue: convertedValue,
  //       inputValue: values,
  //     };
  //     setinput1(finalValue);

  //     let usdcPoolBalance = await web3Service.getUsdcPoolBalance();
  //     // setBuySellBtn(true);
  //     if (Number(finalValue.convertedValue) < Number(usdcPoolBalance)) {
  //       sellCalculateAgainstUsdc(finalValue);
  //       setPoolBalanceEXceed(false);
  //     } else {
  //       setSellDisable(true);

  //       setPoolBalanceEXceed(true);
  //       toast.error("Insufficient USDC balance in the pool to sell");
  //     }
  //   } else {
  //     setinput1({
  //       inputValue: "",
  //       convertedValue: "",
  //     });
  //     setinput2({
  //       inputValue: "",
  //       convertedValue: "",
  //     });
  //     setSellDisable(true);
  //     return false;
  //   }
  // };

  const handleInputOne = async (data: any, field: any) => {
    const regex = /^[+]?\d*(?:[.]\d*)?$/;
    const isValidValue = regex.test(data);

    if (!isValidValue) {
      setSellDisable(true);
      return;
    }

    let values = data;

    if (data.includes(".")) {
      const [beforeDecimal, afterDecimal] = data.split(".");

      // Ensure before decimal is max 6 digits
      if (beforeDecimal.length > 6) {
        return;
      }

      // Ensure after decimal is max 2 digits
      if (afterDecimal.length > 2) {
        return;
      }

      values = `${beforeDecimal}.${afterDecimal.slice(0, 2)}`;
    } else {
      // If no decimal, ensure max 6 digits
      if (data.length > 6) {
        return;
      }
    }

    // Prevent values greater than 250.00
    if(sellLimit?.remaining === 0){
      toast.error('You have consumed your daily limit of $250');
      setSellDisable(true);
      return;
    }
    if (Number(values) > sellLimit?.remaining) {
      toast.error(`Daily limit amount exceeded.`);
      setSellDisable(true);
      return;
    }

    setTaxOnSell(0);
    setSellDisable(true);
    setField(field);
    setInput1Err(false);

    if (Number(data) >= 0) {
      if (Number(data) < 20) {
        setInput1Err(true);
        setSellDisable(true);
      }
      if (Number(data) > Number(storeRes?.loginSlice?.usdtBal)) {
        setSellDisable(true);
      }

      let convertedValue: any = await web3Service.multiplyBy10ToTheDecimal(
        data.toString(),
        6
      );
      const finalValue = {
        convertedValue: convertedValue,
        inputValue: values,
      };
      setinput1(finalValue);

      let usdcPoolBalance = await web3Service.getUsdcPoolBalance();

      if (Number(finalValue.convertedValue) < Number(usdcPoolBalance)) {
        sellCalculateAgainstUsdc(finalValue);
        setPoolBalanceEXceed(false);
      } else {
        setSellDisable(true);
        setPoolBalanceEXceed(true);
        toast.error("Insufficient USDC balance in the pool to sell");
      }
    } else {
      setinput1({
        inputValue: "",
        convertedValue: "",
      });
      setinput2({
        inputValue: "",
        convertedValue: "",
      });
      setSellDisable(true);
      return false;
    }
  };


  

  const sellCalculateAgainstToken = useCallback(
    debounce(async (e: any) => {
      if (Number(e?.convertedValue) > 0) {
        let token1Price = await getSellUsdcPriceFun(e.convertedValue);
        if (!token1Price) {
          setPoolBalanceEXceed(true);
          
          return;
        }
        setPoolBalanceEXceed(false);
        setinput1(token1Price); 
    
        let calculateTaxOnSell: any = await web3Service.calculateTaxPercent(
          e?.convertedValue
        );
        calculateTaxOnSell = (calculateTaxOnSell["1"] / 1e6).toFixed(3);
        setTaxOnSell(calculateTaxOnSell);
        let userBalance = await web3Service.userBalancePazza(wallet_Address);

        userBalance = await web3Service.dividedBy10ToTheDecimal(
          userBalance,
          18
        );

        if (Number(e?.inputValue) > Number(userBalance)) {
          setPazaBalExceed(true);
          return;
        }
        setPazaBalExceed(false);

        setSellDisable(false);
      } else {
        // setinput1("");
        setSellDisable(true);
        setinput1({
          inputValue: "",
          convertedValue: "",
        });
      }
    }, 1000), // (*)
    []
  );

  const handleInputTwo = async (data: any, field: any) => {
    // data checks
    
    const regex = /^[+]?\d*(?:[.]\d*)?$/;
    const isValidValue = regex.test(data);
    if (!isValidValue) {
      setSellDisable(true);
      return;
    }

    let values = data;

    if (data.includes(".")) {
      const [beforeDecimal, afterDecimal] = data.split(".");
      // Ensure before decimal is max 6 digits
      if (beforeDecimal.length > 6) {
        return; // Stop execution if before decimal exceeds 6 digits
      }
      if (afterDecimal.length > 2) {
        return; // Stop execution if before decimal exceeds 6 digits
      }

      // Ensure after decimal is max 2 digits
      values = `${beforeDecimal}.${afterDecimal.slice(0, 2)}`;
    } else {
      // If no decimal, ensure max 6 digits
      if (data.length > 6) {
        return;
      }
    }

    let one_paza_to_USDC = 1 / pazaTokenprice;
    let usdcValue = (one_paza_to_USDC * data) * 1e18;
    // debugger;

    if(sellLimit?.remaining === 0){
      toast.error('You have consumed your daily limit of $250');
      setSellDisable(true);
      return;
    }

    if (Number(usdcValue) > sellLimit?.remaining) {
      toast.error(`Daily limit amount exceeded.`);
      setSellDisable(true);
      return;
    }


    setTaxOnSell(0);
    setInput1Err(false);
    setField(field); 
    setSellDisable(true);

    if (data >= 0) {
      let convertedValue: any = await web3Service.multiplyBy10ToTheDecimal(
        data?.toString(),
        18
      );
      const finalValue = { inputValue: values, convertedValue: convertedValue };

      setinput2(finalValue);

      setSellDisable(true);
     
      sellCalculateAgainstToken(finalValue);
    } else {
      setinput2({
        inputValue: "",
        convertedValue: "",
      });
      setSellDisable(true);
      return false;
    }
  };
  const handleSell = async () => {
    setInput1Err(false);

    if (input2 === "" || Number(input2?.convertedValue) < 0) {
      setSellDisable(true);
      return;
    }

    // get slippage Tolerance for transaction

    let slippageTolerance: number = 0;

    let deadLine: number = Date.now() + 5 * 60 * 1000;

    if (!wallet_Address) {
      toast.error("Please Connect Your Wallet");
      return;
    } else if (field == 1 && wallet_Address) {
      slippageTolerance =
        Math.round(((input2?.inputValue * (100 - slipPageVal)) / 100) * 1e6) /
        1e6;

      const usdcPoolBalance = await web3Service.getUsdcPoolBalance();

      if (Number(input1?.convertedValue) > Number(usdcPoolBalance)) {
        toast.error(
          "Sorry we don't have enough USDC at this time please try after some time"
        );
        return;
      }

      // setShowTrnxModal(true);
      if (input1.inputValue <= 0) {
        setInput1Err(true);
        setSellDisable(true);
        return;
      }
      const checkAllowence: any = await web3Service.sellPazaAllowance(
        wallet_Address,
        BONDINGCURVE_ADDRESS
      );

      if (
        Number(checkAllowence.contractValue) >= Number(input2.convertedValue)
      ) {
        let convertedValue: any = await web3Service.multiplyBy10ToTheDecimal(
          slippageTolerance?.toString(),
          18
        );
        slippageTolerance = convertedValue;

        dispatch(setloader(true));

        const sellRes: any = await web3Service.getsellWithExactUsdc(
          wallet_Address,
          input1?.convertedValue, //amount
          slippageTolerance, // (amount * slippageTolerance) / 1000;
          deadLine
        );
        dispatch(setloader(false));
        if (!sellRes.error) {
          toast.success(
            `Sold ${Number(input2?.inputValue).toFixed(
              4
            )} PAZA Token Successfully`
          );
          setinput1({
            inputValue: "",
            convertedValue: "",
          });
          setinput2({
            inputValue: "",
            convertedValue: "",
          });
          setSellDisable(true);
        } else {
          if (sellRes?.code == "ACTION_REJECTED") {
            toast.error("Transaction Rejected by User");
            return;
          }
          toast.error("Error occured when trying to Sell");
        }
      } else {
        const payload = {
          _spender: BONDINGCURVE_ADDRESS,
          _amounts: input2?.convertedValue,
          _token: PAZZA_ADDRESS,
        };
        dispatch(setloader(true));

        const approvalRes: any = await web3Service.approvalOfTokens(
          wallet_Address,
          payload
        );
        dispatch(setloader(false));
        if (!approvalRes?.error) {
          toast.success(
            `Approved ${Number(input2?.inputValue).toFixed(
              4
            )} Paza Token Successfully`
          );

          let convertedValue: any = await web3Service.multiplyBy10ToTheDecimal(
            slippageTolerance?.toString(),
            18
          );
          slippageTolerance = convertedValue;

          dispatch(setloader(true));

          const sellRes: any = await web3Service.getsellWithExactUsdc(
            wallet_Address,
            input1?.convertedValue,
            slippageTolerance,
            deadLine
          );
          dispatch(setloader(false));
          if (!sellRes?.error) {
            setinput1({
              inputValue: "",
              convertedValue: "",
            });
            setinput2({
              inputValue: "",
              convertedValue: "",
            });

            setSellDisable(true);

            toast.success(
              `Sold ${Number(input2?.inputValue).toFixed(
                4
              )} PAZA Token Successfully`
            );
          } else {
            if (sellRes?.code == "ACTION_REJECTED") {
              toast.error("Transaction Rejected by User");
              return;
            }
            toast.error("Error occure when trying to Sell");
          }
        } else {
          if (approvalRes?.code == "ACTION_REJECTED") {
            toast.error("Transaction Rejected by User");
            return;
          }
          toast.error("Error occured when trying to approve transaction");
        }
      }
      setTimeout(() => {
        onSell();
        getSellCap();
      }, 4000);
    } else if (field == 2 && wallet_Address) {
      slippageTolerance = parseFloat(
        ((input1?.inputValue * (100 - slipPageVal)) / 100).toFixed(6)
      );

      // slippageTolerance =
      //   input2?.inputValue * (100 - slipPageVal)/ 100

      if (input2.inputValue <= 0) {
        setInput1Err(true);
        return;
      }
      const usdcPoolBalance = await web3Service.getUsdcPoolBalance();

      if (Number(input1?.convertedValue) > Number(usdcPoolBalance)) {
        toast.error(
          "Sorry we don't have enough USDC at this time please try after some time"
        );
        return;
      }
      // setShowTrnxModal(true);
      const checkAllowence: any = await web3Service.sellPazaAllowance(
        wallet_Address,
        BONDINGCURVE_ADDRESS
      );

      if (
        Number(checkAllowence.contractValue) >= Number(input2.convertedValue)
      ) {
        let convertedValue: any = await web3Service.multiplyBy10ToTheDecimal(
          slippageTolerance?.toString(),
          6
        );
        slippageTolerance = convertedValue;

        dispatch(setloader(true));

        const sellRes: any = await web3Service.getsellWithExactToken(
          wallet_Address,
          input2?.convertedValue,
          slippageTolerance,
          deadLine
        );

        dispatch(setloader(false));

        if (!sellRes.error) {
          setSellDisable(true);
          setinput1({
            inputValue: "",
            convertedValue: "",
          });
          setinput2({
            inputValue: "",
            convertedValue: "",
          });

          toast.success(
            `Sold ${Number(input2?.convertedValue / 1e18).toFixed(
              4
            )} Paza Token Successfully`
          );
        } else {
          setSellDisable(false);
          if (sellRes?.code == "ACTION_REJECTED") {
            toast.error("Transaction Rejected by User");
            return;
          }
          toast.error("Error occured when trying to Sell");
        }
      } else {
        try {
          const payload = {
            _spender: BONDINGCURVE_ADDRESS,
            _amounts: input2?.convertedValue,
            _token: PAZZA_ADDRESS,
          };
          dispatch(setloader(true));

          const approvalRes: any = await web3Service.approvalOfTokens(
            wallet_Address,
            payload
          );
          dispatch(setloader(false));

          if (!approvalRes?.error) {
            toast.success(
              `Approved ${Number(input2?.inputValue).toFixed(
                4
              )} Paza Token Successfully`
            );

            let convertedValue: any =
              await web3Service.multiplyBy10ToTheDecimal(
                slippageTolerance?.toString(),
                6
              );
            slippageTolerance = convertedValue;

            dispatch(setloader(true));

            const sellRes: any = await web3Service.getsellWithExactToken(
              wallet_Address,
              input2?.convertedValue,
              slippageTolerance,
              deadLine
            );
            dispatch(setloader(false));

            if (!sellRes.error) {
              setinput1({
                inputValue: "",
                convertedValue: "",
              });
              setinput2({
                inputValue: "",
                convertedValue: "",
              });
              toast.success(
                `Sold ${Number(input2?.convertedValue / 1e18).toFixed(
                  4
                )} PAZA Token Successfully`
              );
            } else {
              if (sellRes?.code == "ACTION_REJECTED") {
                toast.error("Transaction Rejected by User");
                return;
              }
              toast.error("Transaction failed!");
            }
          } else {
            if (approvalRes?.code == "ACTION_REJECTED") {
              toast.error("Transaction Rejected by User");
              return;
            }
            toast.error("Error occured when trying to Approve transaction");
          }
        } catch (error) {
          toast.error("Error occured when trying to Sell");
        }
      }
      setTimeout(() => {
        onSell();
      }, 4000);
    }
  };
  // fetching usdc and paza token balance //
  const fetchTokenBalance = async () => {
    if (wallet_Address) {
      const usdtUserBal: string = (await web3Service?.userBalanceUsdt(
        wallet_Address
      )) as string;
      dispatch(usdtUserBalAction(usdtUserBal as any));
      const pazzaUserBal: any = (await web3Service?.userBalancePazza(
        wallet_Address
      )) as string;
      const pazaDec: any = await web3Service?.getDecimalsPaza();
      dispatch(pazazUserBalAction(pazzaUserBal));
    } else {
      dispatch(usdtUserBalAction(0));
      dispatch(pazazUserBalAction(0));
    }
  };

  const getTokenPrice = async () => {
    const pazaDec: any = await web3Service?.getDecimalsPaza();
    setdecimal(pazaDec);
    // const pazaPriceVal: any = await web3Service?.getPazaTokenPrice();
    const pazaPriceVal: any = await web3Service.getSellPazaPrice("1000000");
    // setPazaPrice(pazaPriceVal / 10 ** pazaDec);
    // let tokenprice: any = (pazaPriceVal);
    setPazaTokenPrice(pazaPriceVal);
  };

  const getSellCap = async () => {
    // setIsLoading(true);
    try {
      let userAddress = wallet_Address;
      const result: any = await sellCap(userAddress);
      
      if (result?.data && result?.data.length > 0) {
        SetSellLimit({
          max: result?.data[0]?.maxUsdc,
          remaining: Math.max(0, ((result?.data[0]?.maxUsdc * 1e6) - result?.data[0]?.totalUsdcAmount)/1e6).toFixed(4).replace(/\.?0+$/, ''),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (wallet_Address) {
      fetchTokenBalance();
      getTokenPrice();
      getSellCap();
    } else {
      dispatch(usdtUserBalAction(0));
      dispatch(pazazUserBalAction(0));
      setPazaTokenPrice(0);
    }
  }, [wallet_Address, onSell]);

  // fetching balances //
  useEffect(() => {
    setSwapBal({
      bal1: storeRes.loginSlice.usdtBal,
      bal2: storeRes.loginSlice.pazzaBal / 10 ** 18,
    });
  }, [storeRes.loginSlice.pazzaBal, storeRes.loginSlice.usdtBal]);

  useEffect(() => {
    // Reset form states when wallet is disconnected
    if (!wallet_Address) {
      setinput1({
        inputValue: "",
        convertedValue: "",
      });
      setinput2({
        inputValue: "",
        convertedValue: "",
      });
      setSellDisable(true);
      setInput1Err(false);
      setPazaBalExceed(false);
      setPoolBalanceEXceed(false);
      setTaxOnSell(0);
    }
  }, [wallet_Address]);

  return (
    <>
      <div className="sell_page">
        <Row justify="center">
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <div className="buy-n-sell-box">
              <h2>Sell PAZA</h2>
              <div className="buy-n-sell-box-inner">
                <div className="slippage-container">
                  <h5>Exchange</h5>
                  <div className="rightgroup">
                    {" "}
                    <span title="Slippage refers to the difference between the expected price of a trade and the actual price at execution.">
                      <InfoIcon />
                    </span>
                    <span>Slippage %</span>
                    <Input
                      placeholder="    "
                      type="text"
                      onChange={handleSlipPageChange}
                      value={slipPageVal}
                      className="slipagebox"
                      disabled={wallet_Address ? false : true}
                    />
                  </div>
                </div>

                <div className="top field_box">
                  <BuySell
                    type="number"
                    label="From"
                    name="from"
                    value={input1?.inputValue}
                    defaultValue={input1}
                    placeholder="0.0"
                    icon={swapIcons?.icon1}
                    heading={swapCoinState?.token1}
                    amountToShow={`${decFunction(
                      swapBal.bal1
                    ).toLocaleString()} ${swapCoinState?.token1}`}
                    subheading={`${decFunction(
                      swapBal.bal1
                    ).toLocaleString()} ${swapCoinState?.token1}`}
                    onChange={(e: any) => {
                      handleInputOne(e.target.value, 1);
                    }}
                    disabled={wallet_Address ? false : true}
                    maxLength={18}
                    min={0}
                  />

                  {/* {input1Err &&
                  input1?.inputValue !== "" &&
                  storeRes.loginSlice.usdtBal > 0 ? (
                    <p style={{ color: "red" }}>
                      {" "}
                      Amount should be greater than or equal to 20 USDC
                    </p>
                  ) : (
                    ""
                  )} */}
                  {/* {amountMaxErr ? (
                    <p style={{ color: "red" }}>
                      {" "}
                      Entered amount exceeds max balance of USDC
                    </p>
                  ) : (
                    ""
                  )} */}
                </div>

                <div className="bottom field_box">
                  <BuySell
                    type="number"
                    label="To"
                    name="to"
                    value={input2?.inputValue}
                    placeholder="0.0"
                    icon={swapIcons?.icon2}
                    heading={swapCoinState?.token2}
                    subheading={`${decFunction(
                      swapBal.bal2
                    ).toLocaleString()} ${swapCoinState?.token2}`}
                    onChange={(e: any) => {
                      handleInputTwo(e?.target?.value, 2);
                    }}
                    disabled={wallet_Address ? false : true}
                    maxLength={18}
                    min={0}
                  />
                  {pazaBalExceed &&
                  input1?.inputValue !== "" &&
                  input2?.inputValue !== "" ? (
                    <p className="error">
                      Entered amount exceeds max balance of PAZA
                    </p>
                  ) : (
                    ""
                  )}
                  <ul className="pricebar">
                    <li>
                      <div className="left_tax">
                        <span>Tax = </span>
                        &nbsp;
                        <b>$ {taxonSell}</b>
                      </div>
                      <div className="right_tax">
                        <span className="price">Price </span>

                        <span>
                          1 USDC ={" "}
                          {(Number(pazaTokenprice) / 10 ** 18).toFixed(2)} PAZA
                        </span>
                      </div>
                    </li>
                    <li className="mid">Note</li>
                    <li className="right">
                      <h2>
                        Daily Sell Limit :<span> $ {sellLimit.max} </span>
                      </h2>
                      <h2>
                        Remaining for Sell :
                        <span> $ {sellLimit.remaining} </span>
                      </h2>
                    </li>
                  </ul>
                </div>

                <CustomButton
                  text={"Sell"}
                  className="ant-btn-primary w-100"
                  onClick={() => handleSell()}
                  // disabled={poolBalanceEXceed || buySellDisable || pazaBalExceed || input1Err || !input1?.inputValue}
                  disabled={
                    !input1?.inputValue ||
                    !input2?.inputValue ||
                    poolBalanceEXceed ||
                    pazaBalExceed ||
                    sellDisable 
                  }
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Sellpage;
