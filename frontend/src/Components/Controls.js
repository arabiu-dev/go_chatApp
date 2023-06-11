import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userSlice from "../redux/userSlice";
import { IonIcon } from "@ionic/react";
import { gridOutline, sendOutline } from "ionicons/icons";
import socketHandler from "../websocket/ws";

export default function Controls({ setActive, setModalClosed }) {
  const [msg, setMsg] = useState("");
  const [socketSendMsg, setSocketSendMsg] = useState(undefined);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const socket = useRef(null);
  const cb = useRef(null);

  useEffect(() => {
    socket.current = new WebSocket(`ws://chat.devonnex.tech/ws`);
  }, []);

  cb.current = (message) => {
    const msg = JSON.parse(message.data);
    if (user.username === msg.to && user.currentContact.username === msg.from) {
      dispatch(userSlice.actions.updateChatHistory(msg));
    } else if (user.username !== msg.from) {
      dispatch(userSlice.actions.setNotifyContact(msg.from));
      setModalClosed((prev) => !prev);

      setTimeout(() => setModalClosed((prev) => !prev), 5000);
    }
  };

  useEffect(() => {
    if (socket.current.readyState === WebSocket.OPEN) {
      socket.current.removeEventListener("open", cb.current);
    }
    setSocketSendMsg(socketHandler(socket.current, cb.current, user.username));
  }, [user.currentContact.username, user.username]);

  const onClick = () => {
    if (!msg.trim()) return;

    const chat = {
      type: "message",
      chat: {
        from: user.username,
        to: user.currentContact.username,
        message: msg,
      },
    };

    socketSendMsg(chat);
    dispatch(
      userSlice.actions.updateChatHistory({
        ...chat.chat,
        timestamp: Date.now() / 1000,
        id: Date.now(),
      })
    );
    setMsg("");
  };

  return (
    <div className="mobile-bottom-navigation">
      <button
        className="action-btn"
        data-mobile-menu-open-btn
        onClick={() => setActive((state) => !state)}
      >
        <IonIcon icon={gridOutline} />
      </button>
      <div className="header-search-container">
        <input
          type="search"
          name="search"
          className="search-field"
          value={msg}
          placeholder="Enter your text..."
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.code === "Enter" && onClick()}
        />

        <button className="search-btn" onClick={onClick}>
          <IonIcon icon={sendOutline} />
        </button>
      </div>
    </div>
  );
}
