import packageJson from "../package.json";
import { removeAddress } from "./redux/reducers/login/address/address";
import store from "./redux/store";

export const resetRedux = () => {
  store.dispatch(removeAddress());
};

export const versionManager = async () => {
  try {
    const version = packageJson.version;
    const react_version = localStorage.getItem("react_version");
    if (react_version && version !== react_version) {
      resetRedux();
      localStorage.clear();
    }
    if (!react_version) {
      resetRedux();
      localStorage.clear();
    }
    localStorage.setItem("react_version", version);
  } catch (error) {
    console.log("Error in versionManager =>", error);
  }
};
