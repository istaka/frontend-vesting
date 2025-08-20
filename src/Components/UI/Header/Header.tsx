import { Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../Assets/Icon/logo_2x.png";
import logoMob from "../../../Assets/Icon/logo-mob.png";
import CustomButton from "../CustomButton/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "../../common/Toasts/Toast";
import { useAccount } from "wagmi";
import CustomSelect from "../Select/CustomSelect";
import "./Header.scss";
import { useCallback, useEffect, useState } from "react";
import { trimAddress } from "../../../CommonHelper";
import {
  setOwner,
  setSelectedVestingAddress,
  setTokenDecimal,
  setSelectedOptions,
} from "../../../redux/reducers/login/address/address";
import { Paza_Address } from "../../../Constant";
import {
  checkBalances,
  getDecimal,
  checkOwner,
  checkVestingList,
} from "../ConnectWallet/connectWalletHelper";
import { handleAdd, handleSelect } from "./HeaderHelper";
import ConnectWallet from "../ConnectWallet/ConnectWallet";
import { apiCallPost } from "../../../service/apiServices/ApiServices";
import { CloseIcon, ThreeDotIcon } from "../../../Assets/Icon/svg/SvgIcons";
import { UserList } from "../../../service/apiModels/userApiService/Post/userApiService";

type propTypes = {
  active?: boolean;
  handleActive?: () => void;
};

// Add this interface at the top of the file
interface ApiResponse {
  data: string[];
}

const Header = (props: any) => {
  const dispatch = useDispatch();

  const [options, setOptions] = useState<any>([]);
  const [selectedOption, setselectedOption] = useState<any>();
  const [hasInitiallyFetched, setHasInitiallyFetched] = useState(false);

  const wallet_Type = useSelector((state: any) => state?.address?.walletType);
  const wallet_Address = useSelector(
    (state: any) => state?.address?.walletAddress
  );
  const selectOptions = useSelector(
    (state: any) => state?.address?.selectedOptions
  );
  const selectedOption1 = useSelector(
    (state: any) => state?.address?.selectedVestingAddress
  );

  const addToken = () => {
    if (wallet_Address) {
      handleAdd(dispatch, wallet_Type);
    } else {
      toast.error("Please Connect Wallet To Add Token");
    }
  };

  const getAllUserListFunction = async (selectOptions: any) => {
    try {
      let finalData: any =
        selectOptions &&
        selectOptions?.map((item: any) => {
          let temp = {
            value: item?.contractAddress,
            label: (
              <div className="vesting-option">
                <span>{trimAddress(item?.contractAddress)}</span>
              </div>
            ),
            type: item.type,
          };
          return temp;
        });
      setOptions(finalData);
    } catch (error) {
      console.log("errorerror in select options", error);
    }
  };

  useEffect(() => {
    if (!selectOptions) {
      setselectedOption("");
    } else if (selectedOption1) {
      let data: any = {
        value: selectedOption1?.contractAddress,
        label: (
          <div className="vesting-option">
            <span>{trimAddress(selectedOption1?.contractAddress)}</span>
          </div>
        ),
        type: selectedOption1.type,
      };
      setselectedOption(data);
    }
    getAllUserListFunction(selectOptions);
  }, [selectOptions]);

  const checkUserVestingList = useCallback(async () => {
    if (!hasInitiallyFetched && wallet_Address) {
      try {
        let combineData = [];
        let onChainData = await checkOwner(dispatch, wallet_Address);

        let data = {
          userAddress: onChainData?.beneficiary || wallet_Address,
        };

        if (onChainData) {
          combineData.push(onChainData);
        }

        // Update the type assertion here
        const apiData: any = await UserList(data);
        // const apiData = await apiCallPost("/getAllUserVestingContract", data, {}) as ApiResponse;

        if (combineData?.length > 0 && apiData?.data) {
          const filterData = apiData.data.filter(
            (item: string) =>
              item.toLowerCase() !==
              combineData[0].contractAddress.toLowerCase()
          );

          filterData?.forEach((item: string) => {
            combineData.push({
              type: "multi",
              beneficiary: wallet_Address,
              contractAddress: item,
            });
          });
        } else if (apiData?.data) {
          apiData?.data.forEach((item: string) => {
            combineData.push({
              type: "multi",
              beneficiary: wallet_Address,
              contractAddress: item,
            });
          });
        }

        if (combineData?.length > 0) {
          dispatch(setSelectedOptions(combineData));
        }
        setHasInitiallyFetched(true);
      } catch (error) {
        console.error("Error fetching vesting list:", error);
      }
    }
  }, [wallet_Address, dispatch, hasInitiallyFetched]);

  useEffect(() => {
    checkUserVestingList();
  }, [checkUserVestingList]);

  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const data = [
    { value: "/", label: "Vesting" },
    { value: "/sell", label: "Sell" },
  ];
  const placeholderText = location.pathname === "/sell" ? "Sell" : "Vesting";

  const handleChange = (option) => {
    navigate(option.value);
  };



  return (
    <header className="header">
      <Container>
        <div className="header__inner">
          <Link className="me-4 header-logo" to="/">
            <img className="full_logo" src={logo} alt="full-logo" />
            <img className="small_logo" src={logoMob} alt="small-logo" />
          </Link>

          <div className="header__inner__actions">
            <ul className={`header_ul ${show ? "show" : ""}`}>
              <button className="close_btn" onClick={() => setShow(false)}>
                <CloseIcon />
              </button>
              <li>
                <CustomSelect
                  onChange={handleChange}
                  options={data}
                  className="vesting-select"
                  isSearchable={false}
                  placeholder={placeholderText}
                />
              </li>
              <li>
                {" "}
                {options?.length > 0 && 
                location.pathname !== "/sell" &&
                (
                  <CustomSelect
                    options={options}
                    isSearchable={false}
                    className="vesting-select"
                    onChange={(item: any) =>
                      handleSelect(
                        item,
                        dispatch,
                        wallet_Address,
                        setselectedOption
                      )
                    }
                    selectedOption={selectedOption}
                  />
                )}
              </li>
              <li>
                {" "}
                <CustomButton
                  className="outline-btn"
                  text="Add To Wallet"
                  onClick={addToken}
                />
              </li>
            </ul>
            <ConnectWallet from="header" />
            <CustomButton
              onClick={() => setShow(true)}
              className="menu_btn"
              text={
                <>
                  <ThreeDotIcon />
                </>
              }
            />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
