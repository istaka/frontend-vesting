import { useSelector } from "react-redux";
import "./Loader.scss";

const Loader = () => {
  const loader: any = useSelector((state: any) => state?.loaderSlice?.loader);
 

  return (
    <>
      {loader ? (
        <div className="loader">
          <div className="loader__spinner"></div>
        </div>
      ) : null}
    </>
  );
};

export default Loader;
