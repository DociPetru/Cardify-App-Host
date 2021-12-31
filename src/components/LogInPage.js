import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";

const randomatic = require("randomatic");

import "../styles/logIn-page-styles/logIn-page.scss";
import axios from "axios";

import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { Link } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { ImageContext } from "../ImageContext";

function toBase64(arr) {
  arr = new Uint8Array(arr); //if it's an ArrayBuffer
  return btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ""));
}

const LogInPage = () => {
  const history = useNavigate();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [validUser, setValidUser] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const openCreateAccountModal = () => {
    setIsOpenModal((prevState) => !prevState);
  };

  const [allUser, setALLUser] = useState([]);
  const [allAvatars, setAllAvatar] = useState([]);

  useEffect(() => {
    let abortController = new AbortController();
    const fetch = async () => {
      try {
        const { data } = await axios.get(
          `https://cardify-app-host.herokuapp.com/logInUsername`
        );

        const allAvatar = await axios.get(
          `https://cardify-app-host.herokuapp.com/getAvatar`
        );

        await axios
          .all([data, allAvatar])
          .then(
            axios.spread((...responses) => {
              const allUsers = responses[0];
              const allAvatar = responses[1].data;

              console.log(responses);

              setALLUser(allUsers);

              localStorage.setItem("allUsers", JSON.stringify(allUsers));

              setAllAvatar(allAvatar);
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

    return () => {
      abortController.abort();
    };
  }, []);

  let actualUser = {};
  const logIn = () => {
    console.log(allUser);

    if (
      allUser.some((value, index) => {
        //  console.log(value.costumer_email, user);
        //  console.log(value.costumer_password, password);

        if (
          value.costumer_email === user &&
          value.costumer_password === password
        ) {
          actualUser = value;
        }

        return (
          value.costumer_email === user && value.costumer_password === password
        );
      })
    ) {
      localStorage.setItem("currentUser", JSON.stringify(actualUser));

      history("/main");
    } else {
      setValidUser(true);
    }

    setTimeout(() => setValidUser(false), 2000);
  };

  let value = useContext(ImageContext);

  value = value.filter((item) => item.image_id.includes("image_logIn"));

  console.log(value);

  return (
    <div className="section-login-page">
      <Slider
        arrows={false}
        className="slider-details"
        draggable={true}
        autoplay={true}
        fade={true}
        speed={500}
      >
        {value.map((value, index) => {
          return (
            <div className="slider-image" key={index}>
              <h1>
                Manage your finance <br /> with <br /> CARDIFY{" "}
              </h1>
              <svg className="image">
                <image
                  className="img"
                  height="100%"
                  href={`data:image/svg+xml;base64, ${toBase64(
                    value.image_data.data
                  )}`}
                  // placeholder="image-tech"
                />
              </svg>
            </div>
          );
        })}
      </Slider>
      <div className="section-login">
        <form>
          <TextField
            id="input-with-icon-textfield"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            label="Email"
            variant="outlined"
            type="text"
            onChange={(e) => setUser(e.target.value.toString())}
          />
          <TextField
            id="outlined-basic"
            className="password-label"
            label="Outlined"
            variant="outlined"
            type="text"
            onChange={(e) => setPassword(e.target.value.toString())}
          />

          <Button
            variant="contained"
            endIcon={<LoginIcon />}
            onClick={(e) => {
              e.preventDefault();
              logIn();
            }}
          >
            Log In
          </Button>

          <p>
            Don't have an account{" "}
            <Link onClick={openCreateAccountModal}> Create one!</Link>
          </p>
          {!validUser ? (
            ""
          ) : (
            <p className="warning">No valid account! Please recheck!</p>
          )}
        </form>
        {isOpenModal && (
          <CreateAcoount
            isOpenModal={isOpenModal}
            setIsOpenModal={setIsOpenModal}
            allAvatars={allAvatars}
            setAllAvatar={setAllAvatar}
          />
        )}
      </div>
    </div>
  );
};

const CreateAcoount = (props) => {
  let value = useContext(ImageContext);
  value = value.filter((item) => item.image_id === "image_create_account");

  const [avatarChose, setAvatarChose] = useState({
    press: false,
    avatar_id: null,
    avatar_chose: null,
  });

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [adress, setAdress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rewritePassword, setRewritePassword] = useState("");

  const [verifyContactInfo, setVerifyContactInfo] = useState(true);

  const handleCreateAccount = async () => {
    if (
      name === "" ||
      country === "" ||
      city === "" ||
      adress === "" ||
      phone === "" ||
      email === "" ||
      password === "" ||
      rewritePassword === "" ||
      avatarChose.avatar_id === null
    ) {
      setVerifyContactInfo(false);
    } else {
      setVerifyContactInfo(true);

      closeModal();

      window.location.reload(false);

      const id_adress = randomatic("Aa", 10);

      await axios
        .post(`https://cardify-app-host.herokuapp.com/insertAdress`, {
          id_adress,
          adress,
          country,
          city,
        })
        .then(
          await axios.post(
            `https://cardify-app-host.herokuapp.com/insertUser`,
            {
              costumer_id: randomatic("A0", 15),
              id_adress,
              costumer_phone: phone,
              costumer_email: email,
              costumer_password: password,
              avatar_id: avatarChose.avatar_id,
              costumer_name: name,
            }
          )
        );
    }
  };

  const closeModal = () => {
    props.setIsOpenModal(false);
  };

  return (
    <ReactModal
      isOpen={props.isOpenModal}
      ariaHideApp={false}
      onRequestClose={closeModal}
      className="Modal-Create-Account"
      overlayClassName="Overlay"
    >
      <Button className="button-close-modal" onClick={closeModal}>
        X
      </Button>
      <div className="image-create-account">
        <svg className="image">
          <image
            height="100%"
            href={`data:image/svg+xml;base64, ${toBase64(
              value[0].image_data.data
            )}`}
            alt="Image-create-account"
          />
        </svg>
      </div>
      <div className="information">
        <h1>Create Acount</h1>
        <form>
          <p> SELECT YOUR AVATAR</p>
          <div
            className={`avatar-block ${
              !avatarChose.avatar_id === true && verifyContactInfo === false
                ? "check-valid"
                : ""
            }`}
          >
            {props.allAvatars.map((value, index) => {
              return (
                <img
                  key={index}
                  className={`image-avatar ${
                    (avatarChose.avatar_chose === index) & avatarChose.press
                      ? "border-chose"
                      : ""
                  }`}
                  onClick={() => {
                    setAvatarChose((prevState) => {
                      return {
                        ...prevState,
                        press: true,
                        avatar_id: value.avatar_id,
                        avatar_chose: index,
                      };
                    });
                  }}
                  src={`data:image/png;base64,${btoa(
                    new Uint8Array(value.avatar.data).reduce(function (
                      data,
                      byte
                    ) {
                      return data + String.fromCharCode(byte);
                    },
                    "")
                  )}`}
                  placeholder="flag"
                />
              );
            })}
          </div>

          <div className="inputs-section">
            <TextField
              id="standard-basic"
              label="Your name"
              variant="standard"
              onChange={(e) => setName(e.target.value)}
              error={name === "" && verifyContactInfo === false}
              helperText={name === "" ? "Cannot be empty!" : " "}
            />
            <TextField
              id="standard-basic"
              label="Country"
              variant="standard"
              onChange={(e) => setCountry(e.target.value)}
              error={country === "" && verifyContactInfo === false}
              helperText={country === "" ? "Cannot be empty!" : " "}
            />
            <TextField
              id="standard-basic"
              label="City"
              variant="standard"
              onChange={(e) => setCity(e.target.value)}
              error={city === "" && verifyContactInfo === false}
              helperText={city === "" ? "Cannot be empty!" : " "}
            />
            <TextField
              id="standard-basic"
              label="Adress"
              variant="standard"
              onChange={(e) => setAdress(e.target.value)}
              error={adress === "" && verifyContactInfo === false}
              helperText={adress === "" ? "Cannot be empty!" : " "}
            />
            <TextField
              id="standard-basic"
              label="Phone"
              variant="standard"
              onChange={(e) => setPhone(e.target.value)}
              error={phone === "" && verifyContactInfo === false}
              helperText={phone === "" ? "Cannot be empty!" : " "}
            />
            <TextField
              id="standard-basic"
              label="Email"
              variant="standard"
              onChange={(e) => setEmail(e.target.value)}
              error={email === "" && verifyContactInfo === false}
              helperText={email === "" ? "Cannot be empty!" : " "}
            />
            <TextField
              id="outlined-password-input"
              label="Password"
              variant="standard"
              onChange={(e) => setPassword(e.target.value)}
              error={password === "" && verifyContactInfo === false}
              helperText={password === "" ? "Cannot be empty!" : " "}
            />
            <TextField
              id="outlined-password-input"
              label="Rewrite Password"
              variant="standard"
              onChange={(e) => setRewritePassword(e.target.value)}
              error={
                (rewritePassword === "" && verifyContactInfo === false) ||
                password != rewritePassword
              }
              helperText={rewritePassword === "" ? "Cannot be empty!" : " "}
            />
          </div>

          <Button
            variant="outlined"
            className="create-button"
            onClick={handleCreateAccount}
          >
            {" "}
            Create
          </Button>
        </form>
      </div>
    </ReactModal>
  );
};

export default LogInPage;
