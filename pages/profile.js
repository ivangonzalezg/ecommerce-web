import React, { useContext, useEffect, useRef, useState } from "react";
import Router from "next/router";
import { Edit } from "@material-ui/icons";
import styles from "../styles/profile.module.css";
import { StateContext } from "../contexts/state";
import { StatusContext } from "../contexts/status";
import API, { getErrorMessage } from "../api";
import Card from "../components/Card";

export default function Profile() {
  const { jwt, user, updateUser } = useContext(StateContext);
  const { isLoading, updateErrorMessage, updateSuccessMessage } = useContext(StatusContext);
  const fileInput = useRef(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (user.id) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhone(user.phone);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!jwt && !isLoading) {
      Router.replace("/");
    }
  }, [jwt, isLoading]);

  const isEditing =
    JSON.stringify({ firstName, lastName, email, phone }) !==
      JSON.stringify({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone }) || photo;

  const saveUserData = async () => {
    try {
      setDisabled(true);
      const data = {
        firstName,
        lastName,
        phone,
        email,
        username: email
      };
      if (photo) {
        const formData = new FormData();
        formData.append("files", photo);
        const response = await API(jwt).post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        data.photo = response.data[0].id;
      }
      const _user = await API(jwt).put(`/users/${user.id}`, data);
      if (user.photo && photo) {
        await API(jwt).delete(`/upload/files/${user.photo.id}`);
      }
      updateUser(_user.data);
      setDisabled(false);
      setPhoto();
      updateSuccessMessage("Datos actualizados");
    } catch (error) {
      setDisabled(false);
      updateErrorMessage(getErrorMessage(error));
    }
  };

  const onSave = e => {
    e.preventDefault();
    saveUserData();
  };

  return (
    <div className={styles.container}>
      <Card style={styles.card}>
        <h3 className={styles.title}>Tu perfil</h3>
        <br />
        <button className={styles.profile_photo_container} onClick={() => fileInput.current.click()} disabled={disabled}>
          <img
            src={photo ? URL.createObjectURL(photo) : user.photo?.url ? user.photo?.url : "/images/profile.png"}
            alt="profile photo"
            className={styles.profile_photo}
          />
          <div className={styles.edit_icon}>
            <Edit color="inherit" fontSize="small" />
          </div>
          <input
            className={styles.hidden_input}
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={e => setPhoto(e.target.files[0])}
          />
        </button>
        <br />
        <form onSubmit={onSave}>
          <div className={styles.fullname_container}>
            <div className={styles.input_container}>
              <h3 className={styles.subtitle}>Nombre(s)</h3>
              <input
                className={styles.input}
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                disabled={disabled}
              />
            </div>
            <div className={styles.input_container}>
              <h3 className={styles.subtitle}>Apellido(s)</h3>
              <input
                className={styles.input}
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                disabled={disabled}
              />
            </div>
          </div>
          <div className={styles.input_container}>
            <h3 className={styles.subtitle}>Email</h3>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={disabled}
            />
          </div>
          <div className={styles.input_container}>
            <h3 className={styles.subtitle}>Teléfono</h3>
            <input
              className={styles.input}
              pattern="\d{10}"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              disabled={disabled}
            />
          </div>
          <button className={styles.save_button} type="submit" disabled={disabled || !isEditing}>
            Guardar
          </button>
        </form>
      </Card>
    </div>
  );
}
