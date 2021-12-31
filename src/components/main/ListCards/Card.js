import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";

let randomize = require("randomatic");
let moment = require("moment");

import { Shake } from "reshake";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import "../../../styles/main-styles/list-card.scss";

import axios from "axios";
import { MenuItem, Select } from "@mui/material";

export const CardLayer = (props) => {
  const [rotate, setRotate] = useState(false);

  return (
    <div className="card ">
      <RemoveRedEyeIcon
        className="icon-flip-card"
        onClick={() => {
          setRotate((prevState) => !prevState);
          props.setViewCardBackDatails((prevState) => !prevState);
        }}
      />

      {!props.viewCardBackDetails ? (
        <div>
          <img
            className="image-bank"
            src={`data:image/png;base64,${btoa(
              new Uint8Array(props.object.card_layer_front.data).reduce(
                function (data, byte) {
                  return data + String.fromCharCode(byte);
                },
                ""
              )
            )}`}
            placeholder="flag"
          />
          <div className="information-front-card">
            <p className="layer-number-card"> {props.object.card_number}</p>
            <div className="layer-name-date-card">
              <p> {props.object.card_owner_name}</p>

              <p>
                {" "}
                {moment(props.object.card_expire_date).format("L").slice(0, 3) +
                  moment(props.object.card_expire_date).format("L").slice(6)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <img
            className="image-bank"
            src={`data:image/png;base64,${btoa(
              new Uint8Array(props.object.card_layer_back.data).reduce(
                function (data, byte) {
                  return data + String.fromCharCode(byte);
                },
                ""
              )
            )}`}
            placeholder="flag"
          />
          <div className="information-front-card">
            <p className="layer-cvv-card"> {props.object.card_CVV}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const Card = (props) => {
  const [viewCardBackDetails, setViewCardBackDatails] = useState(false);

  //Set new state of the View Main
  const detailButton = () => {
    props.setMainSection("detailesMain");
  };

  const transactionButton = () => {
    props.setMainSection("transactionMain");
  };

  return (
    <Shake
      h={3}
      v={1}
      r={2}
      dur={230}
      int={42.3}
      max={100}
      fixed={true}
      fixedStop={false}
      freez={false}
      active={props.borderCardToDelete ? true : false}
    >
      <div
        className={`card-block  ${
          props.borderCardToDelete ? "border-to-delete" : ""
        }`}
        onClick={() => {
          props.setIsChose(props.object);
          if (props.borderCardToDelete === true) props.setDeleteCard(true);
        }}
      >
        <CardLayer
          object={props.object}
          viewCardBackDetails={viewCardBackDetails}
          setViewCardBackDatails={setViewCardBackDatails}
        />

        <ButtonGroup
          fullWidth={true}
          orientation="horizontal"
          aria-label="vertical outlined button group"
        >
          <Button
            key="one"
            onClick={() => {
              detailButton();
              props.setCardChose(props.object);
            }}
          >
            Details
          </Button>
          <Button
            key="two"
            onClick={() => {
              transactionButton();
              props.setCardChose(props.object);
            }}
          >
            Transactions
          </Button>
        </ButtonGroup>
      </div>
    </Shake>
  );
};

export const AddCard = (props) => {
  useEffect(() => props.setAddCard(true), []);

  const curentCostumer_id = JSON.parse(
    localStorage.getItem("currentUser")
  ).costumer_id;

  const costumer_id = curentCostumer_id;
  const [cardNumber, setCardNumber] = useState("");
  const [cardOwner, setCardOwner] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [bank, setBank] = useState("");
  const [expireDate, setExpireDate] = useState(null);

  const handleChange = (event) => {
    setBank(event.target.value);
    console.log(event.target.value);
  };

  const [verifyContactInfo, setVerifyContactInfo] = useState(true);

  function onlyNumberKey(evt) {
    // Only ASCII character in that range allowed
    var ASCIICode = evt.which ? evt.which : evt.keyCode;
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
    return true;
  }

  return (
    <ReactModal
      isOpen={props.addCard}
      ariaHideApp={false}
      onRequestClose={() => props.setAddCard(false)}
      shouldCloseOnOverlayClick={true}
      className="Modal-add-card"
      overlayClassName="Overlay"
    >
      <Button className="close-modal" onClick={() => props.setAddCard(false)}>
        X
      </Button>
      <div className="information-create-card">
        <h1> Add CARD</h1>
        <div className="block-bank-select">
          <p>Select card bank</p>
          <FormControl sx={{ m: 1, minWidth: 150 }}>
            <InputLabel id="demo-simple-select-label">Bank Name </InputLabel>
            <Select
              variant="outlined"
              label="Bank Name"
              value={bank}
              onChange={handleChange}
              error={bank === "" && verifyContactInfo === false}
              // helperText={bank === "" ? "Cannot be empty!" : " "}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem className="button-bank" value="BNK_Transilvania">
                Banca Transilvania
              </MenuItem>
              <MenuItem className="button-bank" value="BNK_BCR">
                BCR
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="block-input">
          <TextField
            fullWidth={true}
            className="input"
            variant="outlined"
            label="Card Number"
            onChange={(e) => {
              setCardNumber(e.target.value);
            }}
            onInput={(e) => {
              e.target.value = (
                e.target.value.replace(/\s+/g, " ").trim().length % 4 === 0 &&
                e.target.value.length > 1
                  ? e.target.value.concat(" ")
                  : e.target.value
              ).slice(0, 19);
            }}
            error={cardNumber === "" && verifyContactInfo === false}
            helperText={cardNumber === "" ? "Cannot be empty!" : " "}
          />
        </div>
        <div className="block-input">
          <TextField
            required
            fullWidth={true}
            className="input"
            variant="outlined"
            label="Owner"
            onChange={(e) => setCardOwner(e.target.value)}
            error={cardOwner === "" && verifyContactInfo === false}
            helperText={cardOwner === "" ? "Cannot be empty!" : " "}
          />
        </div>
        <div className="block-input">
          <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth={true}>
            <DatePicker
              label="Expire Date"
              value={expireDate}
              onChange={(newValue) => {
                setExpireDate(newValue);
              }}
              error={expireDate === "" && verifyContactInfo === false}
              className="calendar-block"
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={expireDate === "" && verifyContactInfo === false}
                  helperText={expireDate === "" ? "Cannot be empty!" : " "}
                />
              )}
            />
          </LocalizationProvider>
        </div>
        <div className="block-input">
          <TextField
            onChange={(e) => setCardCVV(e.target.value)}
            fullWidth={true}
            variant="outlined"
            label="CVV"
            error={cardCVV === "" && verifyContactInfo === false}
            helperText={cardCVV === "" ? "Cannot be empty!" : " "}
          />
        </div>
        <Button
          variant="contained"
          className="create-button"
          onClick={async (e) => {
            //  const [verifyContactInfo, setVerifyContactInfo]
            // e.preventDefault();

            if (
              bank === "" ||
              cardCVV === "" ||
              cardNumber === "" ||
              cardOwner === "" ||
              expireDate === ""
            ) {
              setVerifyContactInfo(false);
            } else {
              setVerifyContactInfo(true);
              props.setAddCard(false);

              const card_id = randomize("A0", 15);
              const card_expire_date = moment(expireDate).format(
                "YYYY-MM-DD HH:mm:ss"
              ); //Convert in specific format

              window.location.reload();

              await axios
                .get(
                  `https://cardify-app-host.herokuapp.com/getImage_Card/${bank}`,
                  bank
                )
                .then((response) => {
                  //response.data[0];

                  props.setCardsList((prevState) => [
                    ...prevState,
                    {
                      card_id: card_id,
                      card_number: cardNumber,
                      card_owner_name: cardOwner,
                      card_expire_date: card_expire_date,
                      card_CVV: cardCVV,
                      bank_id: bank,
                      card_bank_layer: response.data[0].card_bank_layer,
                      costumer_id,
                    },
                  ]);
                })
                .then(
                  await axios.post(
                    "https://cardify-app-host.herokuapp.com/insertCard",
                    {
                      card_id: card_id,
                      card_number: cardNumber,
                      card_owner_name: cardOwner,
                      card_expire_date: card_expire_date,
                      card_CVV: cardCVV,
                      bank_id: bank,
                      costumer_id,
                    }
                  )
                );

              console.log(getImage);
            }

            console.log(props.cardsList);
          }}
        >
          ADD
        </Button>
      </div>
    </ReactModal>
  );
};

export const DeleteCard = (props) => {
  // console.log(props.isChoose);

  useEffect(() => props.setBorderCardToDelete(false), []);
  return (
    <ReactModal
      isOpen={props.deleteCard}
      ariaHideApp={false}
      onRequestClose={() => props.setDeleteCard(false)}
      shouldCloseOnOverlayClick={true}
      className="Modal-remove-card"
      overlayClassName="Overlay"
    >
      <ClearRoundedIcon
        className="close-button"
        onClick={() => {
          props.setDeleteCard(false);
          props.setBorderCardToDelete(false);
        }}
      >
        X
      </ClearRoundedIcon>
      <div className="section-remove-card">
        <h1>
          {" "}
          Are you sure do you wan't to remove the <br />{" "}
          {props.isChoose.card_number} card?{" "}
        </h1>
        <div>
          <Button
            variant="outlined"
            onClick={async () => {
              props.setDeleteCard(false);
              props.setBorderCardToDelete(false);

              const newState = props.cardsList.filter(
                (value) => value.card_number !== props.isChoose.card_number
              );

              await axios
                .delete(
                  `https://cardify-app-host.herokuapp.com/deleteCard/${props.isChoose.card_id}`,
                  props.isChoose.card_id
                )
                .then(props.setCardsList(newState));
            }}
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              props.setDeleteCard(false);
              props.setBorderCardToDelete(false);
            }}
          >
            No
          </Button>
        </div>
      </div>
    </ReactModal>
  );
};
