import React, { useState } from "react";
import "../assets/styles/signup.css";
import Form from "./Form";
import bg from "../assets/images/hero-bg.png";

const Signup = () => {
  const [type, setType] = useState("Sign In");

  // Handle button click to toggle between Sign In and Sign Up
  const onClick = (e) => {
    setType(e.target.innerText);
  };

  return (
    <main className="has-bg-image" style={{ backgroundImage: `url(${bg})` }}>
      {
        // Hero section with main content
        <section className="section hero" aria-labelledby="hero-label">
          <div className="container">
            <div className="hero-content">
              <h1 className="headline-lg" id="hero-label">
                Use <span className="span">ChitChat</span> to Connect with{" "}
                <span className="span">Customers</span>,
                <span className="span"> Friends</span>, and
                <span className="span"> Family</span>
              </h1>

              <p className="title-md has-before">
                Invite your customers or friends to sign up and connect with
                each other. I'm also your friend! You can add me by searching
                for "Aminu" and say Hi.
              </p>

              <div className="btn-group">
                <button onClick={(e) => onClick(e)} className="btn btn-primary">
                  Sign In
                </button>
                <button
                  onClick={(e) => onClick(e)}
                  className="btn btn-secondary"
                >
                  Sign Up
                </button>
              </div>
            </div>
            <Form type={type} />
          </div>
        </section>
      }
    </main>
  );
};

export default Signup;
