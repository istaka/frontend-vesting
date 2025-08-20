import axios from "axios";
import { setloader } from "../../redux/reducers/Loader/loaderslice";
import { SITE_URL } from "../../Constant";
import { storeInstance } from "../../App";

axios.defaults.baseURL = SITE_URL;
// axios request interceptor~~~~~~~~~~~~
let token: any;

// axios.interceptors.request.use(
//   (config: any) => {
//     console.log(
//       "storeInstance.getState()",
//       storeInstance.getState()?.loginSlice
//     );
//     config.baseURL == SITE_URL;
//     // if (config.baseURL == SITE_URL_TA) {
//     //   token = storeInstance.getState()?.loginSlice?.accessToken?.accessToken;
//     //   config.headers["authorization"] = token;
//     // } else if (config.baseURL == SITE_URL_STO) {
//     //   token = STOApiKey;
//     //   config.headers["x-api-key"] = token;
//     // }
//     return config;
//   },
//   (error: any) => {
//     // TokenExpiryFunction(error);
//     return error;
//   }
// );

// axios response interceptor~~~~~~~~~~~~~~~

axios.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    return error;
  }
);

// function to format url as and if params

function formatUrl(url: any, params: any) {
  if (params) {
    params =
      params && Object.keys(params)?.length > 0
        ? `?${new URLSearchParams(params).toString()}`
        : "";
  }
  return `${url}${params}`;
}
export const apiCallPostHeader = (
  url: any,
  data: object,
  params: any,
  jwt: any
) =>
  new Promise((resolve, reject) => {
    // store.dispatch(l)
    const headers = {
      "Content-Type": "application/json",
      authorization: jwt,
      "Access-Control-Allow-Origin": "*",
    };
    axios
      .post(formatUrl(url, params), Object.keys(data).length ? data : {}, {
        headers: headers,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((error: any) => {
        reject(error?.data);
      });
  });

  export const apiCallGetHeader = (url: any, params: any, jwt: any) =>
    new Promise((resolve, reject) => {
      const headers = {
        "Content-Type": "application/json",
        authorization: jwt,
        "Access-Control-Allow-Origin": "*",
      };
      axios
        .get(formatUrl(url, params), {
          headers: headers,
        })
        .then((res) => {
          resolve(res);
        })
        .catch((error: any) => {
          reject(error?.data);
        });
    });

// get request function~~~~~~~~
export const apiCallGet = (
  url: any,
  params = {},
  platformType: any,
  headers?: Record<string, string>
): Promise<{ [key: string]: any }> => {
  return new Promise((resolve, reject) => {
    // setBaseUrlFunction(platformType);
    storeInstance.dispatch(setloader(true));
    return axios
      .get(formatUrl(url, params), { headers })
      .then((res) => {
        storeInstance.dispatch(setloader(false));
        resolve(res.data);
      })
      .catch((error: any) => {
        storeInstance.dispatch(setloader(false));
        reject(error?.data);
      });
    // }
  });
};

// delete request function
export const apiCallPost = (
  url: any,
  data: object,
  params = {}
  //   platformType: any
) => {
  // storeInstance.dispatch(setloader(true));
  return new Promise((resolve, reject) => {
    axios
      .post(formatUrl(url, params), Object.keys(data)?.length ? data : null)
      .then((res) => {
        storeInstance.dispatch(setloader(false));
        resolve(res);
      })
      .catch((error: any) => {
        console.log("api call post error", error);
        reject(error);
        storeInstance.dispatch(setloader(false));
      });
  });
};

// put(update) request function~~~~~~~~
export const apiCallPut = (url: any, data: object, params = {}) => {
  storeInstance.dispatch(setloader(true));
  return new Promise((resolve, reject) => {
    axios
      .put(formatUrl(url, params), data)
      .then((res) => {
        storeInstance.dispatch(setloader(false));
        resolve(res.data);
      })
      .catch((error: any) => {
        storeInstance.dispatch(setloader(false));
        reject(error);
      });
  });
};

// delete request function~~~~~~~~
export const apiCallDelete = (url: any, data: object, params = {}) =>
  new Promise((resolve) => {
    axios
      .delete(formatUrl(url, params), data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error: any) => {
        resolve(null);
      });
  });
