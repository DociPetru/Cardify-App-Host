import React, { useEffect, useState, useRef } from "react";

import "../../../styles/main-styles/list-card.scss";

import { Card, AddCard, DeleteCard } from "./Card";
import AddButton from "../../reusable-buttons/add-button";
import DeleteButton from "../../reusable-buttons/delete-button";

import Slider from "react-slick";

import axios from "axios";

const ListCard = (props) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [addCard, setAddCard] = useState(false);
  const [deleteCard, setDeleteCard] = useState(false);

  const [cardsList, setCardsList] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await axios.get(
          `https://cardify-app-host.herokuapp.com/getCard/${currentUser.costumer_id}`,
          currentUser.costumer_id
        );

        await axios
          .all([data])
          .then(
            axios.spread((...responses) => {
              const data = responses[0].data;

              setCardsList(data);

              localStorage.setItem("listCard", JSON.stringify(data));
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

  // console.log(cardsList);

  /// STATES FOR REMOVE  A CARD ///
  const [borderCardToDelete, setBorderCardToDelete] = useState(false);
  const [isChoose, setIsChose] = useState([]);

  // DETECT click outside element
  let ref = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (
        borderCardToDelete &&
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setBorderCardToDelete((prevState) => !prevState);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [borderCardToDelete]);

  return (
    <div className="section-cards">
      <div className="list-card">
        <Slider
          dots={false}
          infinite={false}
          speed={500}
          arrows={false}
          slidesToShow={1}
          slidesToScroll={1}
          variableWidth={true}
          adaptiveHeight={true}
        >
          {cardsList.map((value, index) => (
            <Card
              key={index}
              mainSection={props.mainSection}
              setMainSection={props.setMainSection}
              /////////////////////////////
              object={value}
              setCardChose={props.setCardChose}
              /////////////////////////////
              borderCardToDelete={borderCardToDelete}
              setBorderCardToDelete={setBorderCardToDelete}
              //////////////////////////////
              isChoose={isChoose}
              setIsChose={setIsChose}
              setDeleteCard={setDeleteCard}
            />
          ))}
        </Slider>
      </div>
      <div>
        <div onClick={() => setAddCard(true)}>
          <AddButton />
        </div>
        <div
          onClick={() => {
            setBorderCardToDelete((prevState) => !prevState);
          }}
        >
          <DeleteButton />
        </div>
      </div>
      {addCard ? (
        <AddCard
          addCard={addCard}
          setAddCard={setAddCard}
          cardsList={cardsList}
          setCardsList={setCardsList}
        />
      ) : (
        console.log()
      )}
      {deleteCard ? (
        <DeleteCard
          deleteCard={deleteCard}
          setDeleteCard={setDeleteCard}
          /////
          cardsList={cardsList}
          setCardsList={setCardsList}
          /////
          isChoose={isChoose}
          setBorderCardToDelete={setBorderCardToDelete}
        />
      ) : (
        console.log()
      )}
    </div>
  );
};

export default ListCard;
