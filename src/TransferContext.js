import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const TransferContext = createContext();

export const TransferProvider = (props) => {
  const allCards = JSON.parse(localStorage.getItem("listCard"));
  const [object, setObject] = useState([]);

  useEffect(() => {
    const handleChangeConts = () => {
      allCards.map(async (value, index) => {
        await axios
          .get(
            `https://cardify-app-host.herokuapp.com/getCont/${value.card_id}`,
            value.card_id
          )
          .then((response) => {
            setObject((prevState) => [
              ...prevState,
              { ...value, conts: response.data },
            ]);
          })

          .catch((err) => {
            console.log(err);
          });
      });
    };
    handleChangeConts();
  }, []);

  console.log(object);

  return (
    <TransferContext.Provider value={object}>
      {props.children}
    </TransferContext.Provider>
  );
};
