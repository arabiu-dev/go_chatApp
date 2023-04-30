import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { addContact, fetchChatHistory } from "../redux/chatThunks";
import { userLogout } from "../redux/userSlice";
import { IonIcon } from "@ionic/react";
import { closeOutline, personAddOutline } from "ionicons/icons";

export default function Sidebar({ setActive, active }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [newContact, setNewContact] = useState("");
  const handleNewContact = () => {
    if (!newContact.trim()) return;

    dispatch(addContact({ username: newContact }));
  };

  return (
    <>
      <div
        className={`overlay ${active ? "active" : ""}`}
        data-overlay
        onClick={() => setActive((state) => !state)}
      ></div>
      <div
        className={`sidebar  has-scrollbar ${active ? "active" : ""}`}
        data-mobile-menu
      >
        <div className="sidebar-category">
          <div className="sidebar-top">
            <h2 className="sidebar-title">Contacts</h2>

            <button
              className="sidebar-close-btn"
              data-mobile-menu-close-btn
              onClick={() => setActive((state) => !state)}
            >
              <IonIcon icon={closeOutline} />
            </button>
          </div>

          <div className="showcase-wrapper">
            <div className="showcase-container">
              {user.contacts.length <= 0 ? (
                <p className="showcase-title">
                  {" "}
                  Your Contacts will appear here...
                </p>
              ) : (
                user.contacts.map((contact) => {
                  return (
                    <div
                      className="showcase"
                      key={contact.username}
                      onClick={() => {
                        dispatch(
                          fetchChatHistory([user.username, contact.username])
                        );
                        setActive((state) => !state);
                      }}
                    >
                      <button className="showcase-img-box">
                        <img
                          src={`https://res.cloudinary.com/dqzvvp77h/image/upload/ar_1.0,c_fill,w_250/r_max/f_auto/${contact.photo}.jpg`}
                          alt={contact.username}
                          width="65"
                          height="65"
                          className="showcase-img"
                        />
                      </button>

                      <div className="showcase-content">
                        <button>
                          <h4 className="showcase-title">{contact.username}</h4>
                        </button>

                        <div className="date-box">
                          <p className="showcase-title">
                            {moment(contact.last_activity * 1000)
                              .local(true)
                              .format("MMM Do YYYY")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="product-showcase">
          <h3 className="showcase-heading">Add new contact</h3>

          <div className="header-search-container">
            <input
              type="text"
              name="search"
              className="search-field"
              value={newContact}
              placeholder="Enter a username..."
              onChange={(e) => setNewContact(e.target.value)}
            />

            <button className="search-btn" onClick={handleNewContact}>
              <IonIcon icon={personAddOutline} />
            </button>
          </div>

          <div
            className="product-showcase"
            style={{
              position: "absolute",
              bottom: "30px",
            }}
          >
            <h3 className="showcase-heading">Account</h3>

            <div className="header-search-container">
              <div className="showcase">
                <img
                  src={`https://res.cloudinary.com/dqzvvp77h/image/upload/ar_1.0,c_fill,w_250/r_max/f_auto/${user.photo}.jpg`}
                  alt={user.username}
                  width="65"
                  height="65"
                  className="showcase-img"
                />

                <div className="showcase-content">
                  <h4 className="showcase-title">{user.username}</h4>

                  <div className="date-box">
                    <button
                      className="showcase-title btn btn-secondary"
                      style={{ padding: "2px 5px", color: "#fff" }}
                      onClick={() => dispatch(userLogout())}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
