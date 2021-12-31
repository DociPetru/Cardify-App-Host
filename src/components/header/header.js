import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/header-styles/header.scss";

import Button from "@mui/material/Button";
import { Popover } from "@mui/material";

import { Spring, animated } from "react-spring";

import { MdSpeakerNotes } from "react-icons/md";

import { NotificationContext } from "../../NotificationContext";

const Header = () => {
  const navigator = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const notificationContext = useContext(NotificationContext);

  console.log(notificationContext);

  const allNotifications = notificationContext[0];

  let notificationsNotRead = allNotifications.filter(
    (value) => value.notification_read_status != 1
  ).length;

  console.log(allNotifications);

  const [isOpen, setIsOpen] = useState({
    popUpNotification: false,
    popUpAvatar: false,
  });

  const [anchorEl, setanchorEl] = useState(null);

  const handleClick = (event) => {
    setanchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setanchorEl(null);

    setIsOpen({ popUpNotification: false, popUpAvatar: false });
  };

  return (
    <div className=" header">
      <h1> CARDIFY</h1>
      <div className="iconProfile">
        <Spring
          loop
          delay={2500}
          from={{ opacity: 1, color: "black" }}
          to={[
            { opacity: 1, color: "black" },
            { opacity: 0.7, color: "gray" },
            { opacity: 1, color: "black" },
          ]}
        >
          {(styles) => (
            <animated.h2 style={styles}>
              HELLO{" "}
              {currentUser.costumer_name.substr(
                0,
                currentUser.costumer_name.indexOf(" ")
              )}
            </animated.h2>
          )}
        </Spring>

        <div className="section-notification">
          <div
            className="notification-number"
            style={{
              backgroundColor: `${
                notificationsNotRead >= 1 ? "#df0707" : "gray"
              }`,
            }}
          >
            {notificationsNotRead}{" "}
          </div>
          <MdSpeakerNotes
            style={{ fontSize: 30, cursor: "pointer", minWidth: 50 }}
            onClick={(e) => {
              setIsOpen({ popUpNotification: true, popUpAvatar: false });
              handleClick(e);
            }}
          />
        </div>
        <Popover
          open={isOpen.popUpNotification === true ? Boolean(anchorEl) : false}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            horizontal: "center",
            vertical: "top",
          }}
          transformOrigin={{
            horizontal: "center",
            vertical: "top",
          }}
        >
          <div className="block-notification">
            {allNotifications.map((value, index) => {
              return (
                <div
                  className="notification"
                  key={index}
                  style={{
                    borderColor: `${
                      value.notification_read_status != 1
                        ? "red"
                        : "var(--primary-color)"
                    }`,
                  }}
                  onClick={() => {
                    if (value.notification_read_status != 1) {
                      const updateStatusNotification = notificationContext[2];
                      updateStatusNotification(value.notification_id);
                    }
                  }}
                >
                  {value.notification_text}
                </div>
              );
            })}
          </div>
        </Popover>

        <Button
          onClick={(e) => {
            setIsOpen({ popUpNotification: false, popUpAvatar: true });
            handleClick(e);
          }}
          className="image-avatar-block"
        >
          <img
            className="image-avatar"
            src={`data:image/png;base64,${btoa(
              new Uint8Array(currentUser.avatar.data).reduce(function (
                data,
                byte
              ) {
                return data + String.fromCharCode(byte);
              },
              "")
            )}`}
            placeholder="flag"
          />
        </Button>
        <Popover
          open={isOpen.popUpAvatar === true ? Boolean(anchorEl) : false}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            horizontal: "center",
            vertical: "top",
          }}
          transformOrigin={{
            horizontal: "center",
            vertical: "top",
          }}
        >
          <div className="blockOption">
            <Button
              className="button-option"
              variant="contained"
              onClick={() => navigator("/profile")}
            >
              Cont Details
            </Button>
            <Button
              className="button-option"
              variant="contained"
              onClick={() => navigator("/")}
            >
              Log Out
            </Button>
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
