import React, { useState, useEffect, useContext } from "react";
import ReactModal from "react-modal";

import { CardLayer } from "../ListCards/Card";
import { Cont } from "../CardDetailsSection/Cont";

import axios from "axios";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";

import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

import { CircularProgress, TextField } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { TransferContext } from "../../../TransferContext";
import { ImageContext } from "../../../ImageContext";
import { NotificationContext } from "../../../NotificationContext";

let randomatic = require("randomatic");
let moment = require("moment");

const Exchange = () => {
  return {
    RON: { EUR: 0.21, USD: 0.22, GBP: 0.17 },
    EUR: { RON: 4.95, USD: 1.13, GBP: 0.85 },
    USD: { EUR: 0.87, RON: 4.35, GBP: 0.74 },
    GBP: { EUR: 1.17, USD: 1.33, RON: 5.8 },
    DEFAULT: {},
  };
};

export const Transfer = (props) => {
  // console.log(props.objectTransfer);

  const colorStatus = ["green", "rgb(159 158 27)", "red"];

  const colorStatusChoose = (status_transfer) => {
    if (status_transfer.toLowerCase() === "accept") return colorStatus[0];

    if (status_transfer.toLowerCase() === "pending") return colorStatus[1];
    else return colorStatus[2];
  };

  return (
    <div className="transfer">
      <div className="image-transfer-block">
        <img
          className="image-transfer"
          src={`data:image/png;base64,${btoa(
            new Uint8Array(
              props.objectTransfer.transfer_type_avatar.data
            ).reduce(function (data, byte) {
              return data + String.fromCharCode(byte);
            }, "")
          )}`}
          placeholder="flag"
        />
      </div>
      <div>
        <p className="text-left">{props.objectTransfer.transfer_unit}</p>
        <p
          className="text-left"
          style={{
            color: colorStatusChoose(props.objectTransfer.transfer_status),
            fontWeight: 900,
          }}
        >
          {props.objectTransfer.transfer_status}
        </p>
      </div>
      <div>
        <p>
          {" "}
          {props.objectTransfer.transfer_price}{" "}
          {props.objectTransfer.transfer_price_currency}
        </p>
        <p> {props.objectTransfer.transfer_date.slice(0, 10)}</p>
      </div>
    </div>
  );
};

export const DescriptionTransfer = (props) => {
  const object = props.transferInformation;

  console.log(object);

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={() => props.setOpenCloseModal("notOpen")}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={true}
      className="Modal-description-transfer"
      overlayClassName="Overlay"
    >
      <Button
        className="close-button"
        onClick={() => {
          props.setOpenCloseModal("notOpen");
        }}
      >
        X
      </Button>
      <div className="information-title">
        <h2> Transfer information</h2>
      </div>
      <form className="information-transfer">
        <div>
          <p>Name </p>
          <p className="border-left">{object.transfer_unit}</p>
        </div>
        <div>
          <p> Phone </p>
          <p className="border-left"> {object.transfer_unit_phone}</p>
        </div>

        {object.transfer_status_type.toLowerCase() === "send" ? (
          <div>
            <p> IBAN Send</p>
            <p className="border-left"> {object.transfer_cont_give} </p>
          </div>
        ) : (
          <div>
            <p> IBAN Receive </p>
            <p className="border-left"> {object.transfer_cont_receive}</p>
          </div>
        )}

        <div>
          <p> Status </p>
          <p className="border-left"> {object.transfer_status}</p>
        </div>

        <div>
          <p> Date {object.transfer_status.toUpperCase()} </p>
          <p className="border-left">
            {" "}
            {moment(object.transfer_date_status).format("LLL")}
          </p>
        </div>
      </form>
    </ReactModal>
  );
};

export const ModifyPendingTransfer = (props) => {
  const object = props.transferInformation;

  /// The inventory where find the transfers
  const transfer_id_pair = props.transferInformation.transfer_id_pair;

  /// cont where money transfer IN MONEY <-
  const transfer_cont_receive = props.transferInformation.transfer_cont_give;

  /// cont FROM where money transfer OUT MONEY ->
  const transfer_cont_give = props.transferInformation.transfer_cont_receive;

  /// transfer amount
  const amount = props.transferInformation.transfer_price;

  const transfer_status_type = object.transfer_status_type.toUpperCase();

  /// Conts Bettwen Transfer
  const [contsBetwenTransfer, setContsBetwenTransfer] = useState([]);
  let transfer_cont_receive_amount = 0;
  let transfer_cont_give_amount = 0;

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await axios.get(
          `https://cardify-app-host.herokuapp.com/getAmountCount`,
          {
            params: {
              cont_id_receive: transfer_cont_receive,
              cont_id_send: transfer_cont_give,
            },
          }
        );

        await axios
          .all([data])
          .then(
            axios.spread((...responses) => {
              const data = responses[0].data;

              setContsBetwenTransfer(data);

              // set amount corectly for every cont
            })
          )
          .catch((errors) => {
            console.log(errors);
          });
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  //  console.log(objectTransfer);

  if (contsBetwenTransfer != []) {
    contsBetwenTransfer.map((value) => {
      console.log(value.cont_IBAN);
      value.cont_IBAN === transfer_cont_receive
        ? (transfer_cont_receive_amount = value.cont_price)
        : (transfer_cont_give_amount = value.cont_price);
    });
  }

  //  console.log(contsBetwenTransfer);
  //  console.log(transfer_cont_receive_amount, transfer_cont_give_amount);

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={() => props.setOpenCloseModal("notOpen")}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={true}
      className="Modal-pending-transfer"
      overlayClassName="Overlay"
    >
      <Button
        className="close-button"
        onClick={() => {
          props.setOpenCloseModal("notOpen");
        }}
      >
        X
      </Button>

      <div className="information-title">
        <h2> {transfer_status_type} Request</h2>
      </div>
      <form className="information-transfer">
        <div>
          <p>Name </p>
          <p className="border-left">{object.transfer_unit}</p>
        </div>
        <div>
          <p> Phone </p>
          <p className="border-left"> {object.transfer_unit_phone}</p>
        </div>
        <div>
          <p> Descriere </p>
          <p className="border-left"> {object.transfer_description}</p>
        </div>
        <div>
          <p> Amount </p>
          <p className="border-left">
            {object.transfer_price} {object.transfer_price_currency}
          </p>
        </div>
        <div>
          <p>
            {transfer_status_type.toLowerCase() === "receive"
              ? ` ${transfer_status_type} IN`
              : ` ${transfer_status_type} FROM `}
          </p>
          <p className="border-left">
            {transfer_status_type.toLowerCase() === "receive"
              ? object.transfer_cont_receive
              : object.transfer_cont_give}
          </p>
        </div>
        <div>
          <p> Status </p>
          <p className="border-left">{object.transfer_status}</p>
        </div>
        <div>
          <p> Create Date </p>
          <p className="border-left">
            {moment(object.transfer_date).format("lll")}
          </p>
        </div>
      </form>
      {transfer_status_type.toLowerCase() === "receive" && (
        <div className="button-block">
          <Button
            variant="contained"
            color="success"
            onClick={async () => {
              await axios
                .put(
                  `https://cardify-app-host.herokuapp.com/updateStatusTransfer`,
                  {
                    transfer_id_pair: transfer_id_pair,
                    user_choice: "accept",
                  }
                )
                .then(() => {
                  axios.put(
                    `https://cardify-app-host.herokuapp.com/updateAmountCont`,
                    {
                      cont_id: transfer_cont_give,
                      amount: -amount,
                      transfer_cont_amount: transfer_cont_give_amount,
                    }
                  );
                  axios.put(
                    `https://cardify-app-host.herokuapp.com/updateAmountCont`,
                    {
                      cont_id: transfer_cont_receive,
                      amount,
                      transfer_cont_amount: transfer_cont_receive_amount,
                    }
                  );
                });
            }}
          >
            ACCEPT
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={async () => {
              await axios.put(
                `https://cardify-app-host.herokuapp.com/updateStatusTransfer`,
                {
                  transfer_id_pair: transfer_id_pair,
                  user_choice: "reject",
                }
              );
            }}
          >
            REJECT
          </Button>
        </div>
      )}
    </ReactModal>
  );
};

export const CreateTransfer = (props) => {
  let allCards = JSON.parse(localStorage.getItem("listCard"));
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [viewCardBackDetails, setViewCardBackDatails] = useState(false);

  const [allContFromCard, setAllContFromCard] = useState([]);
  const [openModalConts, setOpenModalConts] = useState(false);

  const [currentContTransfer, setCurrentContTransfer] = useState({
    cont_id: null,
    cont_IBAN: null,
    cont_amount: null,
    county_courency: "DEFAULT",
    setChooseBorder: false,
  });
  console.log(currentContTransfer);

  const handleclickCard = async (card_id) => {
    await axios
      .get(`https://cardify-app-host.herokuapp.com/getCont/${card_id}`, card_id)
      .then((response) => setAllContFromCard(response.data));
  };

  console.log(allContFromCard);

  function appendDots(dots) {
    return (
      <div style={{ backgroundColor: "#eee" }}>
        <ul style={{ margin: "3px" }}> {dots} </ul>
      </div>
    );
  }

  const exchange = Exchange();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [IBAN, setIBAN] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [description, setDescription] = useState("");

  const transfer_id_pair = randomatic("Aa0", 15);

  // Check if form is valid
  const [verifyContactInfo, setVerifyContactInfo] = useState(true);

  // console.log(typeof Number(phone));

  let value = useContext(ImageContext);
  value = value.filter((item) => item.image_id === "image_transfer");

  const calculateAmountTransfert = (amount_transfer) => {
    if (currency === currentContTransfer.county_courency) {
      return Number(amount_transfer) * 1;
    } else {
      return (
        Number(amount_transfer) *
        exchange[currency][currentContTransfer.county_courency]
      );
    }
  };

  function toBase64(arr) {
    arr = new Uint8Array(arr); //if it's an ArrayBuffer
    return btoa(
      arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
  }
  //// for vertical slider
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          position: "absolute",
          top: "0%",
          left: "48%",
          textAlign: "center",
          fontSize: "5rem",
          transform: "rotate(90deg)",
          zIndex: "10",
        }}
        onClick={onClick}
      />
    );
  }

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={() => props.setOpenCloseModal("notOpen")}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={true}
      className="Modal-make-transfer"
      overlayClassName="Overlay"
    >
      <Button
        className="close-button"
        onClick={() => {
          props.setOpenCloseModal("notOpen");
        }}
      >
        X
      </Button>

      <svg className="image">
        <image
          className="img"
          height="100%"
          href={`data:image/svg+xml;base64, ${toBase64(
            value[0].image_data.data
          )}`}
          // placeholder="image-tech"
        />
      </svg>

      <div className="details-block">
        <Slider
          infinite={false}
          appendDots={appendDots}
          arrows={false}
          dots={true}
          className="slider-details"
          draggable={true}
        >
          <div className="slider-element">
            <div className="slide-block">
              <h1>SELECT A CONT</h1>
              <Slider
                dots={false}
                className="innner-slide"
                cssEase={"cubic-bezier(0.165, 0.840, 0.440, 1.000)"}
                vertical={true}
                verticalSwiping={true}
                arrows={true}
                prevArrow={<SamplePrevArrow />}
              >
                {allCards.map((value, index) => {
                  return (
                    <div
                      key={index}
                      className="card-block"
                      onClick={() => {
                        handleclickCard(value.card_id);
                        setOpenModalConts(true);
                      }}
                    >
                      <CardLayer
                        object={value}
                        viewCardBackDetails={viewCardBackDetails}
                        setViewCardBackDatails={setViewCardBackDatails}
                      />
                    </div>
                  );
                })}
              </Slider>
              {openModalConts && (
                <List className="list-conts">
                  {allContFromCard != []
                    ? allContFromCard.map((value, index) => {
                        console.log(value);
                        return (
                          <ListItem key={index} className="cont-section">
                            <div
                              className={`cont-block ${
                                currentContTransfer.setChooseBorder &&
                                currentContTransfer.cont_id === value.cont_id
                                  ? "border-choose"
                                  : ""
                              }`}
                              onClick={() =>
                                setCurrentContTransfer({
                                  cont_id: value.cont_id,
                                  cont_IBAN: value.cont_IBAN,
                                  cont_amount: value.cont_price,
                                  county_courency: value.county_courency,
                                  setChooseBorder: true,
                                })
                              }
                            >
                              <div className="cont-information">
                                <p>{value.cont_name}</p>
                                <p>
                                  {value.cont_price} {value.county_courency}
                                </p>
                              </div>
                              <div>
                                <img
                                  src={`data:image/png;base64,${btoa(
                                    new Uint8Array(
                                      value.country_flag.data
                                    ).reduce(function (data, byte) {
                                      return data + String.fromCharCode(byte);
                                    }, "")
                                  )}`}
                                  placeholder="flag"
                                />
                              </div>
                            </div>
                          </ListItem>
                        );
                      })
                    : console.log("nu e nimic")}
                </List>
              )}
            </div>
          </div>
          <div className="slider-element">
            <form className="make-transfer">
              <h1> Information about transfer!</h1>
              <h1>Transfer TO</h1>
              <div className="person-block">
                <TextField
                  className="input-information"
                  variant="standard"
                  placeholder="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  error={name === "" && verifyContactInfo === false}
                  helperText={name === "" ? "Cannot be empty!" : " "}
                />
                <TextField
                  className="input-information"
                  variant="standard"
                  placeholder="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  error={phone === "" && verifyContactInfo === false}
                  helperText={phone === "" ? "Cannot be empty!" : " "}
                />
                <TextField
                  className="input-information"
                  variant="standard"
                  placeholder="IBAN"
                  value={IBAN}
                  onChange={(e) => {
                    setIBAN(e.target.value);
                  }}
                  error={IBAN === "" && verifyContactInfo === false}
                  helperText={IBAN === "" ? "Cannot be empty!" : " "}
                />
                <div className="input-information-amount">
                  <TextField
                    variant="standard"
                    placeholder="amount"
                    type="Number"
                    value={amount}
                    className="input-information"
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                    error={amount === "" && verifyContactInfo === false}
                    helperText={amount === "" ? "Cannot be empty!" : " "}
                  />
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={currency}
                      onChange={(event) => setCurrency(event.target.value)}
                      label="Currency"
                      className="input-information"
                      error={currency === "" && verifyContactInfo === false}
                    >
                      <MenuItem value={"RON"}>RON</MenuItem>
                      <MenuItem value={"EUR"}>EURO</MenuItem>
                      <MenuItem value={"USD"}>USD</MenuItem>
                      <MenuItem value={"GBP"}>GBP</MenuItem>
                    </Select>
                  </FormControl>
                  <h1></h1>
                </div>

                <TextField
                  className="input-information"
                  variant="standard"
                  placeholder="Description(Optional)"
                  multiline
                  rows={4}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>

              {currency != currentContTransfer.county_courency &&
                currentContTransfer.county_courency != "DEFAULT" &&
                currency != "" && (
                  <p style={{ color: "green", textAlign: "center", margin: 0 }}>
                    Current Exchange 1 {currentContTransfer.county_courency}
                    {" >>> "}
                    {exchange[currentContTransfer.county_courency][currency]}
                    {currency}
                  </p>
                )}

              {/*(currentContTransfer.cont_amount != null) & (amount != "")
                ? console.log(currentContTransfer.cont_amount, Number(amount))
                : "" 

              (currentContTransfer.county_courency != "DEFAULT") &
              (currency != "")
                ? console.log(
                    currentContTransfer.cont_amount <
                      Number(amount) *
                        exchange[currentContTransfer.county_courency][currency],
                    currentContTransfer.cont_amount,
                    Number(amount) *
                      exchange[currency][currentContTransfer.county_courency]
                  )
                : ""*/}

              {amount <= 0 && verifyContactInfo === false && (
                <p style={{ color: "red", textAlign: "center", margin: 0 }}>
                  Can't transfer a negative or zero amount!
                </p>
              )}

              {currentContTransfer.county_courency != "DEFAULT" &&
                currency != "" &&
                currentContTransfer.cont_amount <
                  calculateAmountTransfert(amount) && (
                  <p style={{ color: "red", textAlign: "center", margin: 0 }}>
                    The amount is bigger then the cont amount!
                  </p>
                )}

              {currentContTransfer.cont_id === null &&
                verifyContactInfo === false && (
                  <p style={{ color: "red", textAlign: "center", margin: 0 }}>
                    Please select a cont from withdraw!
                  </p>
                )}
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={async () => {
                  if (
                    currency === "" ||
                    name === "" ||
                    phone === "" ||
                    amount === "" ||
                    currentContTransfer.cont_id === null ||
                    currentContTransfer.cont_amount <
                      Number(amount) *
                        exchange[currency][currentContTransfer.county_courency]
                  ) {
                    setVerifyContactInfo(false);
                  } else {
                    setVerifyContactInfo(true);
                    props.setOpenCloseModal("notOpen");

                    await axios
                      .post(
                        `https://cardify-app-host.herokuapp.com/insertTransfer`,
                        {
                          costumer_id: currentUser.costumer_id,
                          transfer_id: randomatic("Aa", 15),
                          transfer_type_id: "pending_transfer",
                          transfer_status_type: "send",
                          transfer_status: "pending",
                          transfer_cont_give: currentContTransfer.cont_IBAN,
                          transfer_cont_receive: IBAN,
                          transfer_price: amount,
                          transfer_price_currency: currency,
                          transfer_unit: name,
                          transfer_unit_phone: phone,
                          transfer_description: description,
                          transfer_date_status: null,
                          transfer_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                          transfer_id_pair,
                        }
                      )
                      .then((resolve) =>
                        JSON.parse(localStorage.getItem("allUsers")).map(
                          (value, index) => {
                            console.log(value);
                            if (Number(phone) === value.costumer_phone) {
                              console.log(
                                "Sa creat un request si pentru cealalta persoana"
                              );
                              axios.post(
                                `https://cardify-app-host.herokuapp.com/insertTransfer`,
                                {
                                  costumer_id: value.costumer_id,
                                  transfer_id: randomatic("Aa", 15),
                                  transfer_type_id: "pending_transfer",
                                  transfer_status_type: "receive",
                                  transfer_status: "pending",
                                  transfer_cont_give: IBAN,
                                  transfer_cont_receive:
                                    currentContTransfer.cont_IBAN,
                                  transfer_price: amount,
                                  transfer_price_currency: currency,
                                  transfer_unit: currentUser.costumer_name,
                                  transfer_unit_phone:
                                    currentUser.costumer_phone,
                                  transfer_description: description,
                                  transfer_date_status: null,
                                  transfer_date: moment().format(
                                    "YYYY-MM-DD HH:mm:ss"
                                  ),
                                  transfer_id_pair,
                                }
                              );
                            } else {
                              console.log(
                                "NU sa creat cealalta persoana",
                                value
                              );
                            }
                          }
                        )
                      );
                  }
                }}
              >
                Send
              </Button>
            </form>
          </div>
        </Slider>
      </div>
    </ReactModal>
  );
};

export const CreateTransferBettwenConts = (props) => {
  const [cardTransferFrom, setCardTransferFrom] = useState(null);
  const [cardTransferTo, setCardTransferTo] = useState(null);

  const [valueObjectCardsTo, setValueObjectCardsTo] = useState(null);
  const valueObjectCards = useContext(TransferContext);

  const [ChooseTransfer, setChooseTransfer] = useState({
    color: "green",
    cont_id_from: null,
    cont_id_to: null,
  });

  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");

  const [verifyContactInfo, setVerifyContactInfo] = useState(null);

  const [isReqDone, setIsReqDone] = useState(true);
  const [openTransactionInProgres, setOpenTransactionInProgres] = useState({
    status: false,
    display_icon: null,
  });

  const exchange = Exchange();

  const notificationContext = useContext(NotificationContext);

  const calculateAmountTransfert = (amount_transfer) => {
    if (currency === cardTransferFrom.contTransferFrom.county_courency) {
      return Number(amount_transfer) * 1;
    } else {
      return (
        Number(amount_transfer) *
        exchange[currency][cardTransferFrom.contTransferFrom.county_courency]
      );
    }
  };

  const settingsSlider = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    beforeChange: function (currentSlide, nextSlide) {
      console.log("before change", currentSlide, nextSlide);
    },
    afterChange: function (currentSlide) {
      console.log("after change", currentSlide);
    },
  };

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={() => props.setOpenCloseModal("notOpen")}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={true}
      className="Modal-transfer-bettwen-conts"
      overlayClassName="Overlay"
    >
      <Button
        className="close-button"
        onClick={() => {
          props.setOpenCloseModal("notOpen");
        }}
      >
        X
      </Button>

      <div className="block-list-container">
        <h1>
          {" "}
          TRANSFER <br /> FROM{" "}
        </h1>
        <div>
          <Slider {...settingsSlider} className="slider-components">
            {valueObjectCards.map((value, index) => {
              return (
                <div
                  className="block-card"
                  key={index}
                  onClick={() => {
                    setCardTransferFrom(value);

                    setChooseTransfer((prevState) => ({
                      ...prevState,
                      cont_id_from: null,
                    }));
                  }}
                >
                  <CardLayer object={value}></CardLayer>
                </div>
              );
            })}
          </Slider>
        </div>
        <div className="block-list-container-conts">
          <List className="list-conts">
            {cardTransferFrom != null &&
              cardTransferFrom.conts.map((value, index) => {
                return (
                  <ListItem key={index} className="block-cont-transfer">
                    <ListItemButton
                      className="layer-cont-transfer"
                      sx={
                        ChooseTransfer.cont_id_from === value.cont_id
                          ? { border: 2, borderColor: "green" }
                          : {}
                      }
                      onClick={() => {
                        setCardTransferFrom((prevState) => ({
                          ...prevState,
                          contTransferFrom: value,
                        }));

                        setChooseTransfer((prevState) => ({
                          ...prevState,
                          cont_id_from: value.cont_id,
                        }));

                        if (
                          cardTransferFrom.hasOwnProperty("contTransferFrom")
                        ) {
                          let temporaryArray = [];

                          temporaryArray = valueObjectCards.map((value) => {
                            if (value.card_id === cardTransferFrom.card_id) {
                              return {
                                ...value,
                                conts: value.conts.filter(
                                  (value) =>
                                    value.cont_id !=
                                    cardTransferFrom.contTransferFrom.cont_id
                                ),
                              };
                            }
                            return { ...value };
                          });

                          console.log([...temporaryArray]);

                          setValueObjectCardsTo(null);

                          setValueObjectCardsTo(temporaryArray);
                        }
                      }}
                    >
                      <div>
                        <Cont contObject={value}></Cont>
                      </div>
                    </ListItemButton>
                  </ListItem>
                );
              })}
          </List>
        </div>
      </div>

      <div className="block-information-container">
        <div className="information-container">
          <TextField
            className="input-IBAN"
            label="Cont Send"
            value={
              cardTransferFrom != null &&
              cardTransferFrom.hasOwnProperty("contTransferFrom")
                ? cardTransferFrom.contTransferFrom.cont_IBAN
                : "..."
            }
            InputProps={{
              readOnly: true,
            }}
            error={
              cardTransferFrom != null &&
              cardTransferFrom.hasOwnProperty("contTransferFrom") === false &&
              verifyContactInfo === false
            }
          />
          <TextField
            className="input-IBAN"
            label="Cont Receive"
            value={
              cardTransferTo != null &&
              cardTransferTo.hasOwnProperty("contTransferTo")
                ? cardTransferTo.contTransferTo.cont_IBAN
                : "..."
            }
            InputProps={{
              readOnly: true,
            }}
            error={
              cardTransferTo != null &&
              cardTransferTo.hasOwnProperty("contTransferTo") === false &&
              verifyContactInfo === false
            }
          />

          <div className="cantainer-amount">
            <TextField
              variant="outlined"
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={amount === "" && verifyContactInfo === false}
              helperText={
                amount === "" && verifyContactInfo === false
                  ? "Cannot be empty!"
                  : " "
              }
            />

            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 70, maxWidth: 100 }}
            >
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                label="Currency"
                className="input-information"
                error={currency === "" && verifyContactInfo === false}
              >
                <MenuItem value={"RON"}>RON</MenuItem>
                <MenuItem value={"EUR"}>EURO</MenuItem>
                <MenuItem value={"USD"}>USD</MenuItem>
                <MenuItem value={"GBP"}>GBP</MenuItem>
              </Select>
            </FormControl>
          </div>

          {(cardTransferTo === null || cardTransferFrom === null) &&
            verifyContactInfo === false && (
              <p style={{ color: "red", textAlign: "center", margin: 2 }}>
                Select the conts for transfer!
              </p>
            )}

          {cardTransferFrom != null &&
            cardTransferFrom.hasOwnProperty("contTransferFrom") &&
            currency != "" &&
            cardTransferFrom.contTransferFrom.cont_price <
              calculateAmountTransfert(amount) && (
              <p style={{ color: "red", textAlign: "center", margin: 0 }}>
                The amount is bigger then the cont amount!
              </p>
            )}

          {amount <= 0 && verifyContactInfo === false && (
            <p style={{ color: "red", textAlign: "center", margin: 0 }}>
              Can't transfer a negative or zero amount!
            </p>
          )}

          <Button
            variant="outlined"
            onClick={async () => {
              if (
                cardTransferTo === null ||
                cardTransferFrom === null ||
                amount === "" ||
                currency === "" ||
                cardTransferFrom.contTransferFrom.cont_price <
                  calculateAmountTransfert(amount)
              ) {
                setVerifyContactInfo(false);
              } else {
                setVerifyContactInfo(true);

                await axios
                  .put(
                    `https://cardify-app-host.herokuapp.com/updateAmountCont`,
                    {
                      cont_id: cardTransferFrom.contTransferFrom.cont_IBAN,
                      amount: Number(-calculateAmountTransfert(amount)),
                      transfer_cont_amount:
                        cardTransferFrom.contTransferFrom.cont_price,
                    }
                  )
                  .then(() => {
                    axios
                      .put(
                        `https://cardify-app-host.herokuapp.com/updateAmountCont`,
                        {
                          cont_id: cardTransferTo.contTransferTo.cont_IBAN,
                          amount: Number(
                            cardTransferTo.contTransferTo.county_courency ===
                              currency
                              ? amount * 1
                              : amount *
                                  exchange[currency][
                                    cardTransferTo.contTransferTo
                                      .county_courency
                                  ]
                          ),
                          transfer_cont_amount:
                            cardTransferTo.contTransferTo.cont_price,
                        }
                      )
                      .then(() => setIsReqDone(true))
                      .catch((err) => setIsReqDone(false));
                  })
                  .catch((err) => setIsReqDone(false));

                if (verifyContactInfo === true) {
                  setOpenTransactionInProgres((prevState) => ({
                    ...prevState,
                    status: true,
                  }));

                  setTimeout(() => {
                    const addNotification = notificationContext[1];

                    if (isReqDone === true) {
                      setOpenTransactionInProgres((prevState) => ({
                        ...prevState,
                        display_icon: true,
                      }));

                      const textNotification = `The ${
                        amount + " " + currency
                      } has been transfered succesfully!`;

                      addNotification(
                        randomatic("Aa0", 15),
                        cardTransferTo.costumer_id,
                        textNotification,
                        0
                      );
                    } else if (isReqDone === false) {
                      setOpenTransactionInProgres((prevState) => ({
                        ...prevState,
                        display_icon: false,
                      }));
                    }

                    setTimeout(() => props.setOpenCloseModal("notOpen"), 1500);
                  }, 3000);
                }
              }
            }}
          >
            Transfer
          </Button>
        </div>
      </div>

      {openTransactionInProgres.status && (
        <div className="block-transcation-progres">
          {openTransactionInProgres.display_icon === null && (
            <div>
              <h1>Loading transfer</h1>
              <CircularProgress sx={{ margin: 5 }} />
            </div>
          )}
          {openTransactionInProgres.display_icon === true && (
            <div>
              <h1>Transfer Succed!</h1>
              <CheckCircleIcon
                sx={{ margin: 5, color: "green", fontSize: 100 }}
              />
            </div>
          )}
          {openTransactionInProgres.display_icon === false && (
            <div>
              <h1>
                Transfer Rejected <br /> Something goes wrong! <br /> Try again!
              </h1>
              <CancelIcon sx={{ margin: 5, color: "red", fontSize: 100 }} />
            </div>
          )}
        </div>
      )}

      {valueObjectCardsTo != null && (
        <div className="block-list-container">
          <h1>
            TRANSFER <br /> TO
          </h1>
          <div>
            <Slider {...settingsSlider} className="slider-components">
              {valueObjectCardsTo.map((value, index) => {
                return (
                  <div
                    className="block-card"
                    key={index}
                    onClick={() => {
                      setCardTransferTo(value);

                      setChooseTransfer((prevState) => ({
                        ...prevState,
                        cont_id_to: null,
                      }));
                    }}
                  >
                    <CardLayer object={value}></CardLayer>
                  </div>
                );
              })}
            </Slider>
          </div>
          <div className="block-list-container-conts">
            <List className="list-conts">
              {cardTransferTo != null &&
                cardTransferTo.conts.map((value, index) => {
                  return (
                    <ListItem key={index} className="block-cont-transfer">
                      <ListItemButton
                        className="layer-cont-transfer"
                        sx={
                          ChooseTransfer.cont_id_to === value.cont_id
                            ? { border: 2, borderColor: "green" }
                            : {}
                        }
                        onClick={() => {
                          setCardTransferTo((prevState) => ({
                            ...prevState,
                            contTransferTo: value,
                          }));

                          setChooseTransfer((prevState) => ({
                            ...prevState,
                            cont_id_to: value.cont_id,
                          }));
                        }}
                      >
                        <div>
                          <Cont contObject={value}></Cont>
                        </div>
                      </ListItemButton>
                    </ListItem>
                  );
                })}
            </List>
          </div>
        </div>
      )}
    </ReactModal>
  );
};
