import React, { useContext, useState } from "react";

import "../../styles/main-styles/main.scss";

import ListCard from "./ListCards/ListCard";
import CardDetails from "./CardDetailsSection/SectionCardDetails";
import CardTransaction from "./CardTransactionSection/SectionCardTransaction";
import ListTransfer from "./TransferSection/ListTransfer";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";

const Main = (props) => {
  const [mainSection, setMainSection] = useState("homeMain");

  // Set wath card is transmit at details , transcation
  const [cardChose, setCardChose] = useState();

  const goBack = () => {
    mainSection === "detailesMain" ||
    mainSection === "transactionMain" ||
    mainSection === "transferMain" ||
    mainSection === "subcriptionMain"
      ? setMainSection("homeMain")
      : "";
  };

  return (
    <div className="main">
      <div className="page-back-button" onClick={goBack}>
        {mainSection != "homeMain" ? <ArrowBackIcon /> : ""}
      </div>

      {mainSection === "homeMain" && (
        <div>
          <ListCard
            mainSection={mainSection}
            setMainSection={setMainSection}
            setCardChose={setCardChose}
            currentUser={props.currentUser}
          />
          <div className="section-actions-main">
            <Button
              classes={{ root: "button-transfer" }}
              variant="outlined"
              className="section-transfer-bettwen-cards"
              onClick={() => setMainSection("transferMain")}
            >
              Transfers
            </Button>
            {/* <Button
              variant="outlined"
              className="section-subscriptions"
              onClick={() => setMainSection("subcriptionMain")}
            >
              Subscriptions
            </Button> */}
          </div>
        </div>
      )}
      {mainSection === "detailesMain" && (
        <CardDetails
          mainSection={mainSection}
          setMainSection={setMainSection}
          /// After press we transmit the state with the card object
          card={cardChose}
        />
      )}
      {mainSection === "transactionMain" && (
        <CardTransaction
          mainSection={mainSection}
          setMainSection={setMainSection}
          card={cardChose}
        />
      )}
      {mainSection === "transferMain" && <ListTransfer />}
      {/*mainSection === "subcriptionMain" ? <div>Subscriptions</div> : "" */}
    </div>
  );
};

export default Main;
