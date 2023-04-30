import React, { useState } from "react";
import "../assets/styles/signup.css";
import Form from "./Form";
import bg from "../assets/images/hero-bg.png";

const Signup = () => {
  const [type, setType] = useState("Sign In");
  const onClick = (e) => {
    setType(e.target.innerText);
  };
  return (
    <main className="has-bg-image" style={{ backgroundImage: `url(${bg})` }}>
      {
        <section className="section hero" aria-labelledby="hero-label">
          <div className="container">
            <div className="hero-content">
              <h1 className="headline-lg" id="hero-label">
                Use <span className="span">ChitChat</span> with your{" "}
                <span className="span">Customers</span>
                {", "} Friends & Family
              </h1>

              <p className="title-md has-before">
                Invite your Customers or Friends to Signup and add each other.
                Also I'm your friend, You can add me by "Aminu" and say Hi.
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
