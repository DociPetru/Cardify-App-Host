import React, { useEffect, useState } from "react";

import { FcDown } from "react-icons/fc";
import { FcUp } from "react-icons/fc";

const moment = require("moment");

import Transaction from "./Transaction";

const ListTransaction = (props) => {
  console.log(props.contList);
  const [verifyElementList, setVerifyElementLis] = useState(false);

  useEffect(() =>
    setVerifyElementLis(props.contList.length === 0 ? true : false)
  );

  const exchange = {
    RON: { EUR: 0.21, USD: 0.22, GBP: 0.17, RON: 1 },
    EUR: { RON: 4.95, USD: 1.13, GBP: 0.85 },
    USD: { EUR: 0.87, RON: 4.35, GBP: 0.74 },
    GBP: { EUR: 1.17, USD: 1.33, RON: 5.8 },
  };

  return (
    <div className="section-transaction-list">
      <div className="label-transaction">
        <h1> Transcation</h1>
        <div className="label-sort">
          <p>Data</p>
          <FcUp
            className="button-sort"
            onClick={() => {
              const sortedActivities = props.contList
                .slice()
                .sort(
                  (a, b) =>
                    Date.parse(moment(b.transaction_date).format("l")) -
                    Date.parse(moment(a.transaction_date).format("l"))
                )
                .reverse();

              props.setContList(sortedActivities);
            }}
          />
          <FcDown
            className="button-sort"
            onClick={() => {
              const sortedActivities = props.contList
                .slice()
                .sort(
                  (a, b) =>
                    Date.parse(moment(b.transaction_date).format("l")) -
                    Date.parse(moment(a.transaction_date).format("l"))
                );

              props.setContList(sortedActivities);
            }}
          />
        </div>
        <div className="label-sort">
          <p>Price</p>
          <FcUp
            className="button-sort"
            onClick={() => {
              const sortedActivities = props.contList
                .slice()
                .sort(function (a, b) {
                  b =
                    b.transaction_price /
                    exchange["RON"][b.transaction_price_currency];

                  a =
                    a.transaction_price /
                    exchange["RON"][a.transaction_price_currency];

                  return b - a;
                });

              props.setContList(sortedActivities.reverse());
            }}
          />
          <FcDown
            className="button-sort"
            onClick={() => {
              const sortedActivities = props.contList
                .slice()
                .sort(function (a, b) {
                  b =
                    b.transaction_price /
                    exchange["RON"][b.transaction_price_currency];

                  a =
                    a.transaction_price /
                    exchange["RON"][a.transaction_price_currency];

                  return b - a;
                });

              props.setContList(sortedActivities);
            }}
          />
        </div>
        <div></div>
      </div>
      <div className="list-transaction">
        {verifyElementList ? (
          <h2 className="no-elements">
            NO TRANSCATIONS ALREADY <br /> Go buy something 😅!
          </h2>
        ) : (
          props.contList.map((value, index) => (
            <Transaction key={index} object={value} />
          ))
        )}
      </div>
    </div>
  );
};

export default ListTransaction;
