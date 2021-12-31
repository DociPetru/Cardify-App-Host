import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";

let randomize = require("randomatic");
let moment = require("moment");

import { Button, TextField } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import "../../../styles/main-styles/list-conts.scss";
import axios from "axios";

import { Slide } from "react-slideshow-image";

import { GiPayMoney } from "react-icons/gi";

export const Cont = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const object = props.contObject;

  const openContDetails = () => {
    setIsOpen((prevState) => !prevState);
  };

  const openContToDelete = () => {
    props.borderContToDelete === ""
      ? openContDetails()
      : props.setDeleteCont
      ? props.setDeleteCont(true)
      : null;
  };

  // console.log(props.contTransferChose);

  //const cont_idCurrent = props.contTransferChose.cont_id;

  return (
    <div>
      <div
        className={`cont ${props.borderContToDelete} ${
          props.contTransferId === object.cont_id ? props.contSyleChoose : ""
        } 
        -
        `}
        onClick={() => {
          openContToDelete();

          props.setContToDelete ? props.setContToDelete(object) : null;
        }}
      >
        <p> {object.cont_name}</p>
        <p> {object.cont_IBAN}</p>
        <div className="label-price-courency">
          {object.cont_price}{" "}
          {props.newPrice &&
            props.contTransferId === object.cont_id &&
            (props.newPrice === 1 || props.newPrice === "NaN" ? (
              " "
            ) : (
              <h6 className="price-convert"> {`+` + props.newPrice} </h6>
            ))}
          {object.county_courency}
        </div>
        <div>
          <img
            className="image-flag"
            src={`data:image/png;base64,${btoa(
              String.fromCharCode(...new Uint8Array(object.country_flag.data))
            )}`}
            placeholder="flag"
          />
        </div>
      </div>
      {isOpen && (
        <ContDetails
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          object={props.contObject}
        />
      )}
    </div>
  );
};

const ContDetails = (props) => {
  const object = props.object;
  console.log(props);

  const closeModal = () => {
    props.setIsOpen(false);
  };

  return (
    <ReactModal
      isOpen={props.isOpen}
      ariaHideApp={false}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={true}
      className="Modal-cont-description"
      overlayClassName="Overlay"
    >
      <Button onClick={closeModal}>X</Button>
      <div className="information-title">
        <h2> Cont Details</h2>
        <div></div>
      </div>
      <div className="information">
        <div>
          <p>Cont Name</p>
          <p className="object-information">{object.cont_name}</p>
        </div>
        <div>
          <p> IBAN</p>
          <p className="object-information">{object.cont_IBAN}</p>
        </div>
        <div>
          <p> Price</p>
          <p className="object-information">
            {object.cont_price} {object.county_courency}
          </p>
        </div>
        <div>
          <p> Create Date</p>
          <p className="object-information">
            {" "}
            {moment(object.cont_create_date).format("LLL")}
          </p>
        </div>
      </div>
    </ReactModal>
  );
};

export const AddCont = (props) => {
  //console.log(props.cardUsed);

  const [contName, setContName] = useState("");
  const [IBAN, setIBAN] = useState("");
  const [currency, setCurrency] = useState("");
  const [countryId, setCountryId] = useState("");

  const [verifyContactInfo, setVerifyContactInfo] = useState(true);

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setCurrency(newAlignment);

      if (newAlignment === "RON") setCountryId("ROMANIA");
      if (newAlignment === "EUR") setCountryId("UE");
      if (newAlignment === "USD") setCountryId("USA");
      if (newAlignment === "GBP") setCountryId("ENGLAND");

      setIBAN(
        // currency.slice(0, 2) +
        randomize("0", 2) +
          props.cardUsed.bank_id.split("_").join("").slice(0, 5).toUpperCase() +
          randomize("0", 7) +
          randomize("A", 3) +
          randomize("0", 5)
      );
    }
  };

  return (
    <ReactModal
      isOpen={props.addCont}
      ariaHideApp={false}
      onRequestClose={() => props.setAddCont(false)}
      shouldCloseOnOverlayClick={true}
      className="Modal-cont-add"
      overlayClassName="Overlay"
    >
      <Button
        className="button-close-modal"
        onClick={() => props.setAddCont(false)}
      >
        X
      </Button>
      <div className="information-add-card">
        <h1> Create cont</h1>
        <div>
          CONT NAME
          <TextField
            label="min(5) caracters"
            value={contName}
            onChange={(e) => setContName(e.target.value)}
            error={
              contName === "" &&
              contName.length < 5 &&
              verifyContactInfo === false
            }
            helperText={contName === "" ? "Cannot be empty!" : " "}
          ></TextField>
        </div>
        <div>
          <ToggleButtonGroup
            color="primary"
            value={currency}
            exclusive
            onChange={handleChange}
            className={`currency-container ${
              currency === "" && verifyContactInfo === false
                ? "error-handling"
                : " "
            } `}
          >
            <ToggleButton className="currency-button" value="RON">
              RON
            </ToggleButton>
            <ToggleButton className="currency-button" value="EUR">
              EURO
            </ToggleButton>
            <ToggleButton className="currency-button" value="USD">
              USD
            </ToggleButton>
            <ToggleButton className="currency-button" value="GBP">
              GBP
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div>
          <p> IBAN will generate automaticaly </p>
        </div>
        <p>{IBAN}</p>
        <div>
          PRICE
          <p>
            {0} {currency}
          </p>
        </div>
        <Button
          variant="outlined"
          className="create-button"
          onClick={async (e) => {
            e.preventDefault;

            if (contName === "" || currency === "" || contName.length < 5) {
              setVerifyContactInfo(false);
            } else {
              setVerifyContactInfo(true);

              const cont_id = randomize("Aa0", 10);
              const cont_create_date = moment().format("YYYY-MM-DD HH:mm:ss");

              const newCont = {
                cont_id: cont_id,
                card_id: props.cardUsed.card_id,
                cont_name: contName,
                cont_IBAN: IBAN,
                cont_price: 0,
                id_country: countryId,
                cont_create_date: cont_create_date,
              };

              const getCountry = await axios
                .get(
                  `https://cardify-app-host.herokuapp.com/getCountry/${countryId}`,
                  countryId
                )
                .then((response) => {
                  return response.data[0];
                });

              console.log(getCountry);

              const newObjectState = {
                cont_id: cont_id,
                card_id: props.cardUsed.card_id,
                cont_name: contName,
                cont_IBAN: IBAN,
                cont_price: 0,
                cont_create_date: cont_create_date,
                county_courency: getCountry.county_courency,
                country_flag: getCountry.country_flag,
              };

              // console.log(newCont);

              if (
                !Object.values(newCont).some((value) => {
                  return value === "";
                })
              ) {
                props.setAddCont(false);
                // setValidForm(true);

                console.log(newCont);
                props.setListCont((prevState) => [
                  ...prevState,
                  newObjectState,
                ]);

                await axios.post(
                  `https://cardify-app-host.herokuapp.com/insertCont`,
                  newCont
                );
              }
            }
          }}
        >
          Create
        </Button>
      </div>
    </ReactModal>
    // {
    //validForm === false && (
    //<h1 className="section-invalid-form">All FIELDS REQUARIED</h1>
    // )}
    ///  }
    // {
    //setTimeout(() => setValidForm(true), 3000)}
    // }
  );
};

export const DeleteCont = (props) => {
  const object = props.contToDelete;

  const [errorMesage, setErrorMessage] = useState(false);

  console.log(object);

  const exchange = {
    RON: { EUR: 0.21, USD: 0.22, GBP: 0.17 },
    EUR: { RON: 4.95, USD: 1.13, GBP: 0.85 },
    USD: { EUR: 0.87, RON: 4.35, GBP: 0.74 },
    GBP: { EUR: 1.17, USD: 1.33, RON: 5.8 },
  };

  const [contCurrency, setContCurrency] = useState(object.county_courency);
  const [contTransferChose, setContTransferChose] = useState({
    cont_courency: object.county_courency,
  });
  const [contTransferId, setContTransferId] = useState(undefined);
  const [contTransferIBAN, setContTransferIban] = useState(undefined);
  const [contSyleChoose, setContSyleChoose] = useState(undefined);

  const [newPrice, setnewPrice] = useState(1);

  const handleExchangeCurrency = (cont, contTransfer) => {
    if (contTransfer != undefined) {
      if (cont != contTransfer) {
        useEffect(() =>
          setnewPrice(
            (object.cont_price * exchange[cont][contTransfer]).toFixed(3)
          )
        );
      } else useEffect(() => setnewPrice(object.cont_price * 1));

      return cont === contTransfer
        ? " "
        : ` Universal Change ${1 + " " + cont} - ${
            exchange[cont][contTransfer] + " " + contTransfer
          }`;
    } else return "";
  };

  // List State without the cont which need to remove
  const objectList = props.listCont.filter(
    (value) => value.cont_id !== object.cont_id
  );

  console.log(contCurrency, contTransferChose.cont_courency);

  return (
    <ReactModal
      isOpen={props.deleteCont}
      ariaHideApp={false}
      onRequestClose={() => {
        props.setDeleteCont(false);
        props.setBorderContToDelete("");
      }}
      shouldCloseOnOverlayClick={true}
      className="Modal-cont-discard"
      overlayClassName="Overlay"
    >
      <Button
        className="close-modal-button"
        onClick={() => {
          props.setDeleteCont(false);
          props.setBorderContToDelete("");
        }}
      >
        X
      </Button>
      <div className="information-delete-cont">
        <div className="container-transfer">
          <div className="list-conts  remodeled">
            <Cont contObject={object} />
          </div>
          <GiPayMoney className="icon-transfer" />
          <div className="slide-container">
            <Slide
              autoplay={false}
              arrows={true}
              onChange={() => {
                setContSyleChoose(undefined);
                setnewPrice(1);
              }}
              transitionDuration={10}
            >
              {objectList.map((value, index) => {
                return (
                  <div
                    className="list-conts remodeled"
                    key={index}
                    onClick={() => {
                      setContTransferChose({
                        cont_courency: value.county_courency,
                      });
                      setContSyleChoose("to-transfer");
                      setContTransferId(value.cont_id);
                      setContTransferIban(value.cont_IBAN);
                    }}
                  >
                    <Cont
                      key={index}
                      contObject={value}
                      /////
                      contSyleChoose={contSyleChoose}
                      contTransferId={contTransferId}
                      contTransferChose={contTransferChose}
                      setContTransferChose={setContTransferChose}
                      //////

                      newPrice={newPrice}
                    />
                  </div>
                );
              })}
            </Slide>
          </div>
        </div>
        <p>
          {handleExchangeCurrency(
            contCurrency,
            contTransferChose.cont_courency
          )}
        </p>

        {errorMesage && (
          <p className="error-discard-card">
            {" "}
            Select a cont where the money transfer!
          </p>
        )}

        <Button
          variant="outlined"
          className="discard-cont-button"
          onClick={async () => {
            let moneyCont = 0;

            if (contSyleChoose != undefined) {
              props.setDeleteCont(false);
              props.setBorderContToDelete("");

              objectList.map((value) => {
                if (value.cont_id === contTransferId) {
                  console.log(value.cont_price);
                  moneyCont = Number(value.cont_price);

                  value.cont_price =
                    Number(value.cont_price) + Number(newPrice);
                }
              });

              props.setListCont(objectList);

              await axios
                .put(
                  `https://cardify-app-host.herokuapp.com/updateAmountCont`,
                  {
                    cont_id: contTransferIBAN,
                    amount: Number(newPrice),
                    transfer_cont_amount: moneyCont,
                  }
                )
                .then(() => {
                  axios.delete(
                    `https://cardify-app-host.herokuapp.com/deleteCont/${object.cont_id}`,
                    object.cont_id
                  );
                });

              setErrorMessage(false);
            } else {
              setErrorMessage(true);

              setTimeout(() => setErrorMessage(false), 3000);
            }
          }}
        >
          Remove
        </Button>
      </div>
    </ReactModal>
  );
};
