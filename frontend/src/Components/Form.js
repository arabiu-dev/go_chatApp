import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { userLogin, userSignUp } from "../redux/userSlice.js";
import { fetchContacts } from "../redux/chatThunks.js";
import userSlice from "../redux/userSlice";
import "../assets/styles/form.css";
import { IonIcon } from "@ionic/react";
import { personCircle, eyeOffOutline, eyeOutline } from "ionicons/icons";

const Wrapper = (props) => {
  return (
    <div className="form-wrapper">
      <label htmlFor={props.name.toLowerCase()} className="form-label">
        {props.name}
      </label>
      <div className="input-wrapper">{props.children}</div>
    </div>
  );
};

const Form = ({ type }) => {
  const [showPSWD, setShowPSWD] = useState(false);
  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const validate = () => {
    if (!username.trim() || !password.trim()) {
      dispatch(userSlice.actions.setError("Username or Password is blank"));
      return false;
    }

    if (password.trim().length < 6) {
      dispatch(userSlice.actions.setError("Password too small - min 6 char"));
      setPassword("");
      return false;
    }

    if (type === "Sign Up" && !photo.trim()) {
      dispatch(userSlice.actions.setError("Please upload a picture"));
      return false;
    }

    return true;
  };

  const uploadPhoto = async (file) => {
    if (!["image/png", "image/jpeg"].includes(file.type)) return;

    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", "vua0iayr");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dqzvvp77h/auto/upload`,
      {
        method: "POST",
        body,
      }
    );
    const data = await res.json();
    setPhoto(data.public_id);
  };

  const onSubmit = async (type) => {
    if (type === "Sign In") {
      await dispatch(userLogin({ username, password }));
      await dispatch(fetchContacts(username));
    } else {
      await dispatch(userSignUp({ username, password, photo }));
    }
  };

  return (
    <div className={`form-container ${type === "Sign Up" ? "sign-in" : ""}`}>
      <h3>
        {type === "Sign In" ? "Login to your account" : "Create an account"}
      </h3>
      <div className="contact-form">
        <Wrapper name="Username">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your Name"
            required
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <IonIcon icon={personCircle} />
        </Wrapper>
        <Wrapper name="Password">
          <input
            type={showPSWD ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Password"
            required
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <IonIcon
            icon={showPSWD ? eyeOutline : eyeOffOutline}
            style={{ cursor: "pointer" }}
            onClick={() => setShowPSWD((prev) => !prev)}
          />
        </Wrapper>
        {type === "Sign Up" && (
          <Wrapper name="Profile Picture">
            <input
              type="file"
              name="photo"
              id="photo"
              required
              className="input-field"
              style={{ paddingLeft: "10px" }}
              onChange={(e) => uploadPhoto(e.target.files[0])}
            />
          </Wrapper>
        )}
        <button
          onSubmit={() => {}}
          className="btn btn-primary"
          onClick={async () => {
            const isValid = validate();
            if (isValid === true) await onSubmit(type);
          }}
        >
          {type === "Sign In" ? "Login" : "Create an account"}
        </button>
      </div>
    </div>
  );
};

export default Form;
