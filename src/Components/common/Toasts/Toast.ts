/** @format */

import cogoToast from "cogo-toast";

class Toaster {
  success = (message: string) => {
    let options: any = { position: "top-right", heading: "Success" };
    cogoToast.success(message, options);
  };

  loading = (message: string) => {
    let options: any = { position: "top-right", heading: "Loading" };
    cogoToast.loading(message, options);
  };

  error = (message: string) => {
    let options: any = { position: "top-right", heading: "Error" };
    cogoToast.error(message, options);
  };

  info = (message: string) => {
    let options: any = { position: "top-right", heading: "Info" };
    cogoToast.info(message, options);
  };
}

export const toast = new Toaster();
