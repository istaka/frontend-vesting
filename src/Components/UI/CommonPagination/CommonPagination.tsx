import React from "react";
// @ts-ignore
import Pagination from "react-js-pagination";
import { NextArrowIcon, PrevArrowIcon } from "../../../Assets/Svg/SvgImages";
import "./CommonPagination.scss";

const CommonPagination = (props: any) => {
  return (
    <>
      <div className="common-pagination">
        <Pagination
          itemClassFirst="very-first"
          itemClassLast="extreme-last"
          activePage={props.activePage}
          itemsCountPerPage={props.itemsCountPerPage}
          totalItemsCount={props.totalItemsCount}
          hideFirstLastPages={props.hideFirstLastPages}
          pageRangeDisplayed={props.pageRangeDisplayed}
          firstPageText={
            <>
              <PrevArrowIcon /> <PrevArrowIcon />
            </>
          }
          lastPageText={
            <>
              <NextArrowIcon /> <NextArrowIcon />
            </>
          }
          prevPageText={<PrevArrowIcon />}
          nextPageText={<NextArrowIcon />}
          onChange={props.onChange}
        />
      </div>
    </>
  );
};

export default CommonPagination;
