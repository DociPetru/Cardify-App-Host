import React, { useState } from "react";
import { Cont, AddCont, DeleteCont } from "./Cont";

import AddButton from "../../reusable-buttons/add-button";
import DeleteButton from "../../reusable-buttons/delete-button";

import "../../../styles/main-styles/list-conts.scss";

const ListConts = (props) => {
  const [addCont, setAddCont] = useState(false);
  const [deleteCont, setDeleteCont] = useState(false);

  ////// States for delete Option /////////
  const [borderContToDelete, setBorderContToDelete] = useState("");

  const [contToDelete, setContToDelete] = useState({});

  return (
    <div className="section-cont-list">
      <div className="list-conts">
        {props.listCont.map((value, index) => (
          <Cont
            key={index}
            contObject={value}
            ///// FROM DELETE  /////
            borderContToDelete={borderContToDelete}
            setDeleteCont={setDeleteCont}
            setContToDelete={setContToDelete}
          />
        ))}
      </div>
      <div className="section-buttons">
        <div onClick={() => setAddCont(true)}>
          <AddButton />
        </div>
        <div onClick={() => setBorderContToDelete("border-cont-to-delete")}>
          <DeleteButton />
        </div>
      </div>
      {addCont ? (
        <AddCont
          addCont={addCont}
          setAddCont={setAddCont}
          setListCont={props.setListCont}
          cardUsed={props.cardUsed}
        />
      ) : (
        console.log()
      )}
      {deleteCont ? (
        <DeleteCont
          deleteCont={deleteCont}
          setDeleteCont={setDeleteCont}
          //
          setBorderContToDelete={setBorderContToDelete}
          //
          contToDelete={contToDelete}
          //
          listCont={props.listCont}
          setListCont={props.setListCont}
        />
      ) : (
        console.log()
      )}
    </div>
  );
};

export default ListConts;
