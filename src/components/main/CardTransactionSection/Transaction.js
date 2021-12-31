import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { Button } from "@mui/material";

const moment = require("moment");
const Transaction = (props) => {
  const [open, setOpen] = useState(false);

  const [imageTransaction, setImageTransaction] = useState([]);

  useEffect(async () => {
    await axios
      .get(
        `https://cardify-app-host.herokuapp.com/getImage_Transaction/${props.object.transaction_type_id}`,
        props.object.transaction_type_id
      )
      .then((response) => {
        console.log(response);
        let base64String = btoa(
          String.fromCharCode(
            ...new Uint8Array(response.data[0].type_image.data)
          )
        );

        setImageTransaction(base64String);
      });
  }, []);

  return (
    <div>
      <div className="transaction" onClick={() => setOpen(true)}>
        <div className="image-transaction-block">
          <img
            className="image-transaction"
            src={`data:image/png;base64,${imageTransaction}`}
            alt="Image"
          ></img>
        </div>
        <h1>{props.object.comerciant_name}</h1>
        <h1>{moment(props.object.transaction_date).format("l")}</h1>
        <h1>
          {props.object.transaction_price}{" "}
          {props.object.transaction_price_currency}
        </h1>
      </div>
      {open ? (
        <TranscactionDetail
          open={open}
          setOpen={setOpen}
          object={props.object}
        />
      ) : (
        ""
      )}
    </div>
  );
};

const TranscactionDetail = (props) => {
  console.log(props.object);
  const closeModal = () => {
    props.setOpen(false);
  };

  return (
    <ReactModal
      isOpen={props.open}
      ariaHideApp={false}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={true}
      className="Modal-transaction-detail"
      overlayClassName="Overlay"
    >
      <Button className="close-modal" variant="outlined" onClick={closeModal}>
        X
      </Button>
      <div className="information-table">
        <h2> Transaction Details</h2>
        <div className="row-table">
          <h2>Transcation Type</h2>
          <div>{props.object.transaction_type_id}</div>
        </div>
        <div className="row-table">
          <h2>Comerciant Name</h2>
          <div>{props.object.comerciant_name}</div>
        </div>
        <div className="row-table">
          <h2>Comerciant Location</h2>
          <div>{props.object.comerciant_location}</div>
        </div>
        <div className="row-table">
          <h2>Transaction Price</h2>
          <div>
            {props.object.transaction_price}{" "}
            {props.object.transaction_price_currency}
          </div>
        </div>
        <div className="row-table">
          <h2>Transcation Date</h2>
          <div>{moment(props.object.transaction_date).format("LLL")}</div>
        </div>
      </div>
    </ReactModal>
  );
};

export default Transaction;
