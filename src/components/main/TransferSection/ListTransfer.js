import React, { useEffect, useState } from "react";

import "../../../styles/main-styles/list-transfer.scss";
import {
  Transfer,
  ModifyPendingTransfer,
  CreateTransfer,
  DescriptionTransfer,
  CreateTransferBettwenConts,
} from "./Transfer";

import { Button, TextField, InputLabel } from "@mui/material";

import axios from "axios";

import { TransferProvider } from "../../../TransferContext";

const ListTransfer = () => {
  const curentCostumer_id = JSON.parse(
    localStorage.getItem("currentUser")
  ).costumer_id;

  const [allTransfer, setAllTransfer] = useState([]);
  const [OpenCloseModal, setOpenCloseModal] = useState("notOpen");

  const [transferInformation, setTransferInformation] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await axios.get(`https://cardify-app-host.herokuapp.com/getTransfer`, {
          params: { costumer_id: curentCostumer_id },
        });

        await axios
          .all([data])
          .then(
            axios.spread((...responses) => {
              const data = responses[0].data;

              console.log(responses);

              setAllTransfer(data);
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

  return (
    <div className="section-transfer">
      <div className="list-transfer">
        {allTransfer.map((value, index) => {
          return (
            <div
              key={index}
              className="transfer-block"
              onClick={() => {
                setTransferInformation(value);

                if (value.transfer_status.toLowerCase() === "pending") {
                  setOpenCloseModal("transfer-pending-modal");
                } else {
                  setOpenCloseModal("transfer-information-modal");
                }
              }}
            >
              <Transfer objectTransfer={value} />
            </div>
          );
        })}
      </div>
      <div className="information-block">
        <Button
          variant="contained"
          sx={{ width: 200 }}
          onClick={() => setOpenCloseModal("create-transfer-modal")}
        >
          MAKE A TRANSFER
        </Button>
        <Button
          variant="contained"
          sx={{ width: 200 }}
          onClick={() =>
            setOpenCloseModal("create-transfer-bettwen-conts-modal")
          }
        >
          TRANSFER BETTWEN CONTS
        </Button>
      </div>
      {OpenCloseModal === "transfer-information-modal" && (
        <DescriptionTransfer
          setOpenCloseModal={setOpenCloseModal}
          transferInformation={transferInformation}
        />
      )}
      {OpenCloseModal === "transfer-pending-modal" && (
        <ModifyPendingTransfer
          setOpenCloseModal={setOpenCloseModal}
          transferInformation={transferInformation}
        />
      )}
      {OpenCloseModal === "create-transfer-modal" && (
        <CreateTransfer setOpenCloseModal={setOpenCloseModal} />
      )}
      {OpenCloseModal === "create-transfer-bettwen-conts-modal" && (
        <TransferProvider>
          <CreateTransferBettwenConts setOpenCloseModal={setOpenCloseModal} />
        </TransferProvider>
      )}
    </div>
  );
};

export default ListTransfer;
