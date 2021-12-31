import React, { useContext, useEffect, useState } from "react";
import { CardLayer } from "../ListCards/Card";
import ListTransaction from "./ListTransaction";

import "../../../styles/main-styles/card-transcation.scss";
import axios from "axios";

const CardTransaction = (props) => {
  const [viewCardBackDetails, setViewCardBackDatails] = useState(false);
  //console.log(props.card);

  const [contList, setContList] = useState([]);

  useEffect(async () => {
    await axios
      .get(
        `https://cardify-app-host.herokuapp.com/getTransaction/${props.card.card_id}`,
        props.card.card_id
      )
      .then((response) => setContList(response.data));
  }, []);

  return (
    <div className="section-transaction">
      <div className="card-block">
        <CardLayer
          className="card"
          object={props.card}
          viewCardBackDetails={viewCardBackDetails}
          setViewCardBackDatails={setViewCardBackDatails}
        />
      </div>
      <ListTransaction contList={contList} setContList={setContList} />
    </div>
  );
};

export default CardTransaction;
