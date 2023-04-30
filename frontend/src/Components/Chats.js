import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import "../assets/styles/chats.css";
import bg from "../assets/images/course-bg.png";

export default function Chats() {
  const user = useSelector((state) => state.user);

  return (
    <div className="card aside-card" style={{ backgroundImage: `url(${bg})` }}>
      <ul className="comment-list">
        {user.chatHistory.map((chat) => {
          return (
            <li key={chat.id}>
              <div className="comment-card">
                <div
                  className={`profile-card ${
                    chat.from === user.username ? "right" : ""
                  }`}
                >
                  <figure className="profile-banner img-holder">
                    <img
                      src={`https://res.cloudinary.com/dqzvvp77h/image/upload/ar_1.0,c_fill,w_250/r_max/f_auto/${
                        chat.from === user.username
                          ? user.photo
                          : user.currentContact.photo
                      }.jpg`}
                      width="42"
                      height="42"
                      loading="lazy"
                      alt={user.username}
                    />
                  </figure>

                  <div>
                    <p className="card-title">{chat.from}</p>

                    <time className="card-date" dateTime="2022-04-15">
                      {moment
                        .utc(chat.timestamp * 1000)
                        .local()
                        .startOf("sec")
                        .fromNow()}
                    </time>
                  </div>
                </div>
                <blockquote
                  className={`card-text ${
                    chat.from === user.username ? "right-text" : ""
                  }`}
                >
                  {chat.message}
                </blockquote>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
