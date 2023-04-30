import React from "react";
import { useSelector } from "react-redux";
import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

export default function ToastNotification({ modalClosed, setModalClosed }) {
  const user = useSelector((state) => state.user);

  return (
    <div
      className={`notification-toast ${modalClosed ? "closed" : ""}`}
      data-toast
    >
      <button
        className="toast-close-btn"
        onClick={() => setModalClosed((state) => !state)}
        data-toast-close
      >
        <IonIcon icon={closeOutline} />
      </button>

      {user.error !== "" ? (
        <p className="showcase-title">{user.error}</p>
      ) : (
        <>
          <div className="toast-banner">
            <img
              src={
                user.notifyContact.photo
                  ? `https://res.cloudinary.com/dqzvvp77h/image/upload/ar_1.0,c_fill,w_250/r_max/f_auto/${user.notifyContact.photo}.jpg`
                  : ""
              }
              alt="Rose Gold Earrings"
              width="80"
              height="70"
            />
          </div>

          <div className="toast-detail">
            <p className="toast-message">{`Hey ${user.username}~`}</p>
            <p className="toast-title">{`${user.notifyContact.username} sent you a message`}</p>
            <p className="toast-meta">
              <time dateTime="PT2M">Seconds ago</time>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
