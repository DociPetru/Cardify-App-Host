import React, { useEffect, useState } from "react";
import { CardLayer } from "../ListCards/Card";
import ListConts from "./ListConts";

import "../../../styles/main-styles/card-details.scss";
import axios from "axios";

const CardDetails = (props) => {
  const [viewCardBackDetails, setViewCardBackDatails] = useState(false);

  console.log(props.card);

  const [listCont, setListCont] = useState([]);

  useEffect(async () => {
    await axios
      .get(
        `https://cardify-app-host.herokuapp.com/getCont/${props.card.card_id}`,
        props.card.card_id
      )
      .then((response) => setListCont(response.data));
  }, []);

  console.log(listCont);

  return (
    <div className="container-block">
      <div className="card-block ">
        <CardLayer
          className="card"
          object={props.card}
          viewCardBackDetails={viewCardBackDetails}
          setViewCardBackDatails={setViewCardBackDatails}
        />
      </div>

      <div className="list-container-block">
        <ListConts
          listCont={listCont}
          setListCont={setListCont}
          cardUsed={props.card}
        />
      </div>
    </div>
  );
};

export default CardDetails;
