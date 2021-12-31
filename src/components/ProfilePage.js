import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import "../styles/profile-page-styles/profile-page.scss";

const ProfilePage = () => {
  const navigateTo = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [update, setUpdate] = useState(false);

  const actualUser = JSON.parse(localStorage.getItem("currentUser"));
  // console.log(actualUser);
  const costumer_id = actualUser.costumer_id;

  ///infomation about the actual person state
  const [informations, setInformations] = useState([]);

  const [awaitt, setAwait] = useState(false);

  const [allAvatar, setAllAvatar] = useState([]);

  const [avatarUpdate, setAvatarUpdate] = useState({
    choose: false,
    avatar_id: actualUser.avatar_id,
    avatar: actualUser.avatar,
  });

  const [updateInformationMessage, setUpdateInformationMessage] = useState({
    update: false,
    message: "",
    type_message: "",
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await axios.get(
          `https://cardify-app-host.herokuapp.com/getCostumer/${costumer_id}`,
          {
            params: { costumer_id },
          }
        );

        const dataAllAvatar = await axios.get(
          `https://cardify-app-host.herokuapp.com/getAvatar`
        );

        await axios
          .all([data, dataAllAvatar])
          .then(
            axios.spread((...responses) => {
              console.log(responses);
              const data = responses[0];
              const dataAllAvatar = responses[1];

              // use/access the results
              setAllAvatar(dataAllAvatar.data);
              setInformations(data.data[0]);
              setAwait(true);
            })
          )
          .catch((errors) => {
            console.log(errors);
          });
      } catch (err) {
        console.error(err);
      }
    };
    setTimeout(() => fetch(), 500);
  }, []);

  console.log(informations);

  const openDeleteAccountModal = () => {
    setIsOpenModal((prevState) => !prevState);
  };

  if (!awaitt) {
    return (
      <Box className="wait-response" sx={{ display: "flex" }} thickness={0.001}>
        <CircularProgress />
      </Box>
    );
  } else
    return (
      <div className="profile-section">
        <div className="logo" onClick={() => navigateTo("/main")}>
          {" "}
          CARDIFY
        </div>
        <div className="section-1">
          <div>
            {" "}
            <img
              className="image-avatar"
              src={`data:image/png;base64,${btoa(
                new Uint8Array(avatarUpdate.avatar.data).reduce(function (
                  data,
                  byte
                ) {
                  return data + String.fromCharCode(byte);
                },
                "")
              )}`}
              alt="Image"
            />
          </div>
          {update && (
            <div className="list-profile-pic">
              {allAvatar.map((value, index) => {
                // console.log(value);
                return (
                  <img
                    key={index}
                    className={`image-avatar  ${
                      avatarUpdate.choose === true &&
                      avatarUpdate.avatar_id === value.avatar_id
                        ? "border-avatar-choose"
                        : ""
                    }`}
                    src={`data:image/png;base64,${btoa(
                      new Uint8Array(value.avatar.data).reduce(function (
                        data,
                        byte
                      ) {
                        return data + String.fromCharCode(byte);
                      },
                      "")
                    )}`}
                    alt="Image"
                    onClick={() => {
                      setAvatarUpdate({
                        choose: true,
                        avatar_id: value.avatar_id,
                        avatar: value.avatar,
                      });
                    }}
                  />
                );
              })}
            </div>
          )}
          <h1>{informations.costumer_name}</h1>
        </div>
        <div className="section-2">
          {!update ? (
            <form>
              <label>
                <TextField
                  id="outlined-read-only-input"
                  label="Name"
                  value={informations.costumer_name}
                  InputLabelProps={{
                    readOnly: true,
                  }}
                  disabled
                />
              </label>
              <label>
                <TextField
                  id="outlined-read-only-input"
                  label="Country"
                  value={informations.id_country}
                  InputLabelProps={{
                    readOnly: true,
                  }}
                  disabled
                />
              </label>
              <label>
                <TextField
                  id="outlined-read-only-input"
                  label="City"
                  value={informations.adress_city_name}
                  InputLabelProps={{
                    readOnly: true,
                  }}
                  disabled
                />
              </label>
              <label>
                <TextField
                  id="outlined-read-only-input"
                  label="Adress"
                  value={informations.adress}
                  InputLabelProps={{
                    readOnly: true,
                  }}
                  disabled
                />
              </label>
              <label>
                <TextField
                  id="outlined-read-only-input"
                  label="Phone"
                  type="number"
                  value={informations.costumer_phone}
                  InputLabelProps={{
                    readOnly: true,
                  }}
                  disabled
                />
              </label>
              <label>
                <TextField
                  id="outlined-read-only-input"
                  label="Email"
                  type="email"
                  value={informations.costumer_email}
                  InputLabelProps={{
                    readOnly: true,
                  }}
                  disabled
                />
              </label>
              <label>
                <TextField
                  id="outlined-read-only-input"
                  label="Password"
                  value={informations.costumer_password}
                  InputLabelProps={{
                    readOnly: true,
                  }}
                  disabled
                />
              </label>
            </form>
          ) : (
            <FormAccountDetails
              setUpdate={setUpdate}
              informations={informations}
              setInformations={setInformations}
              actualUser={actualUser}
              avatarUpdate={avatarUpdate}
              setAvatarUpdate={setAvatarUpdate}
              updateInformationMessage={updateInformationMessage}
              setUpdateInformationMessage={setUpdateInformationMessage}
            />
          )}
          {!update ? (
            <div>
              <Button
                onClick={() => setUpdate(true)}
                variant="contained"
                sx={{ width: 100 }}
              >
                Update Information
              </Button>
              <Button
                onClick={openDeleteAccountModal}
                variant="contained"
                sx={{ width: 100 }}
              >
                Delete Account
              </Button>
            </div>
          ) : (
            ""
          )}
        </div>
        {isOpenModal && (
          <DeleteAcoount
            isOpenModal={isOpenModal}
            setIsOpenModal={setIsOpenModal}
          />
        )}
      </div>
    );
};

const DeleteAcoount = (props) => {
  const navigateTo = useNavigate();

  const closeModal = () => {
    props.setIsOpenModal(false);
  };

  return (
    <ReactModal
      isOpen={props.isOpenModal}
      ariaHideApp={false}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={true}
      className="Modal-delete"
      overlayClassName="Overlay-modal-delete"
    >
      <Button onClick={closeModal}>X</Button>
      <div>
        <h1> Are you sure do you wan't to delete this account? </h1>
        <div>
          <Button
            variant="outlined"
            onClick={() => navigateTo("/main")}
            color="success"
          >
            Yes
          </Button>
          <Button variant="outlined" onClick={closeModal} color="error">
            No
          </Button>
        </div>
      </div>
    </ReactModal>
  );
};

const FormAccountDetails = (props) => {
  const costumer_id = props.informations.costumer_id;
  const [name, setName] = useState(props.informations.costumer_name);
  const [country, setCountry] = useState(props.informations.id_country);
  const [city, setCity] = useState(props.informations.adress_city_name);
  const [adress, setAdress] = useState(props.informations.adress);
  const [phone, setPhone] = useState(props.informations.costumer_phone);
  const [email, setEmail] = useState(props.informations.costumer_email);
  const [password, setPassword] = useState(
    props.informations.costumer_password
  );

  return (
    <form>
      <h1> Update you profile!</h1>
      <label>
        <h4> Name </h4>{" "}
        <TextField
          defaultValue={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </label>
      <label>
        <h4> Country </h4>{" "}
        <Select
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
          }}
          sx={{ width: 210, height: 30 }}
        >
          <MenuItem value={"ENGLAND"}>ENGLAND</MenuItem>
          <MenuItem value={"GERMANY"}>GERMANY</MenuItem>
          <MenuItem value={"IRELAND"}>IRELAND</MenuItem>
          <MenuItem value={"ITALY"}>ITALY</MenuItem>
          <MenuItem value={"PORTUGAL"}>PORTUGAL</MenuItem>
          <MenuItem value={"ROMANIA"}>ROMANIA</MenuItem>
          <MenuItem value={"SPAIN"}>SPAIN</MenuItem>
        </Select>
      </label>
      <label>
        <h4> City</h4>{" "}
        <TextField
          defaultValue={city}
          onChange={(e) => {
            setCity(e.target.value);
          }}
        />
      </label>
      <label>
        <h4> Adress </h4>{" "}
        <TextField
          defaultValue={adress}
          onChange={(e) => {
            setAdress(e.target.value);
          }}
        />
      </label>
      <label>
        <h4> Phone</h4>{" "}
        <TextField
          defaultValue={phone}
          onChange={(e) => {
            setPhone(e.target.value);
          }}
        />
      </label>
      <label>
        <h4> Email </h4>{" "}
        <TextField
          defaultValue={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </label>
      <label>
        <h4> Password </h4>{" "}
        <TextField
          defaultValue={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </label>
      <div className="button-container">
        <Button
          variant="contained"
          onClick={async (e) => {
            try {
              /// window.location.reload();
              ///  e.preventDefault;
              props.setUpdate(false);

              props.setInformations((prevState) => ({
                ...prevState,
                costumer_name: name,
                country_id: country,
                adress_city_name: city,
                adress,
                costumer_phone: phone,
                costumer_email: email,
                costumer_password: password,
              }));

              localStorage.setItem(
                "currentUser",
                JSON.stringify({
                  costumer_id,
                  id_adress: props.actualUser.id_adress,
                  costumer_phone: phone,
                  costumer_email: email,
                  costumer_password: password,
                  avatar_id: props.avatarUpdate.avatar_id,
                  avatar: props.avatarUpdate.avatar,
                  costumer_name: name,
                  country_id: country,
                })
              );

              await axios
                .put(`https://cardify-app-host.herokuapp.com/updateAdress`, {
                  id_adress: props.actualUser.id_adress,
                  adress,
                  country_id: country,
                  adress_city_name: city,
                })
                .then(
                  await axios.put(
                    `https://cardify-app-host.herokuapp.com/updateCostumer`,
                    {
                      costumer_id,
                      id_adress: props.actualUser.id_adress,
                      costumer_phone: phone,
                      costumer_email: email,
                      costumer_password: password,
                      avatar_id: props.avatarUpdate.avatar_id,
                      costumer_name: name,
                    }
                  )
                );
            } catch (error) {}
          }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          onClick={(e) => {
            e.preventDefault;

            props.setAvatarUpdate({
              choose: false,
              avatar_id: props.actualUser.avatar_id,
              avatar: props.actualUser.avatar,
            });

            props.setUpdate(false);
          }}
        >
          Close
        </Button>
      </div>
    </form>
  );
};

export default ProfilePage;
