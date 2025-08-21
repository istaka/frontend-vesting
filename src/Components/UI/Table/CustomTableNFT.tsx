/** @format */

import { useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/lib/table";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./CustomTable.scss";
import { EXPLORER, perPage } from "../../../Constants";

const CustomTableNFT = (props: any) => {
  const { setpage, total, page, txHistoryNft } = props;
  const [sizePage, setSizePage] = useState<number>(perPage);

  interface DataType {
    srno: number;
    id: number;
    tokenId: number;
    tx_hash: string;
  }

  const [currentPage, setCurrentPage] = useState<number>(1);

  const columns: ColumnsType<DataType> = [
    {
      title: "Sr No",
      dataIndex: "srno",
      key: "id",
      render: (index) => {
        return (page - 1) * 10 + index;
      },
    },
    {
      title: "Loan ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Token ID",
      dataIndex: "tokenId",
      key: "tokenId",
    },
    {
      title: "TxID",
      dataIndex: "tx_hash",
      key: "tx_hash",
      render: (text) => (
        <a
          href={`${EXPLORER}/tx/${text}`}
          target="_blank"
          style={{ textDecoration: "underline" }}
        >
          {text.slice(0, 4) + "..." + text.substring(text.length - 4)}
        </a>
      ),
    },
    {
      title: "Type",
      dataIndex: "loanType",
      key: "loanType",
      render: (text) =>
        text == "normalLoan" ? "Normal Loans" : "Ingested Loans",
    },
  ];

  /**
   * function when user change the pagination page
   * @param pagination page which user wants to visit
   */

  const handleChange = (pagination: any) => {
    setCurrentPage(pagination?.current);
    setpage(pagination?.current);
    setSizePage(pagination?.pageSize);
    txHistoryNft(pagination?.current, pagination?.pageSize);
  };

  return (
    <>
      {txHistoryNft && txHistoryNft?.length ? (
        <Table
          className="borrow_table"
          columns={columns}
          dataSource={props.txHisNFT}
          onChange={handleChange}
          pagination={
            total <= sizePage
              ? false
              : {
                  pageSize: sizePage,
                  total: total,
                  current: currentPage,
                  hideOnSinglePage: true,
                }
          }
        />
      ) : null}
    </>
  );
};
export default CustomTableNFT;
