import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const NotificationContext = createContext();

export const NotificationProvider = (props) => {
  console.log("context-notification-working");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [allNotification, setAllNotification] = useState([]);

  const [updateState, setUpdateState] = useState(false);

  useEffect(async () => {
    await axios
      .get(
        `https://cardify-app-host.herokuapp.com/getAllNotifications/${currentUser.costumer_id}`,
        currentUser.costumer_id
      )
      .then((response) => {
        setAllNotification(response.data);
      })
      .catch((err) => console.log(err));
  }, [updateState]);

  console.log(allNotification);

  const addNotification = (
    notification_id = "",
    costumer_id = "",
    notification_text = "",
    notification_read_status = 0
  ) => {
    try {
      axios
        .post(`https://cardify-app-host.herokuapp.com/addNotification`, {
          notification_id: notification_id,
          costumer_id: costumer_id,
          notification_text: notification_text,
          notification_read_status: notification_read_status,
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }

    setUpdateState((prevState) => !prevState);
  };

  const updateStatus = (notification_id = "") => {
    axios
      .put(
        `https://cardify-app-host.herokuapp.com/updateStatusNotification/${notification_id}`,
        notification_id
      )
      .catch((err) => console.log(err));

    setUpdateState((prevState) => !prevState);
  };

  return (
    <NotificationContext.Provider
      value={[allNotification, addNotification, updateStatus]}
    >
      {props.children}
    </NotificationContext.Provider>
  );
};
