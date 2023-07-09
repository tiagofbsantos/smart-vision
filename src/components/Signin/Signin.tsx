import React, { useState } from "react";
import "./Signin.css";
import User from "../../models/User";

interface Props {
  saveAuthTokenInSessions: (token: string) => void;
  loadUser: (user: User) => void;
  onRouteChange: (route: string) => void;
}

const Signin = (props: Props) => {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") onSubmitSignIn();
  };

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setSignInEmail(event.target.value);

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setSignInPassword(event.target.value);

  const onSubmitSignIn = async () => {
    if (!signInEmail || !signInPassword) {
      alert("Unable to signin. Email and/or Password fields were left empty, please fill them.");
    } else if (!signInEmail.includes("@")) {
      alert("Unable to signin. Filled email is not a valid email address. A valid email address must include @ symbol. Please fill in a valid email address.");
    } else {
      let connectError = false;

      try {
        const response = await fetch("http://localhost:3005/signin", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: signInEmail,
            password: signInPassword
          })
        });

        const session = await response.json();

        if (session && session.success === "true") {
          props.saveAuthTokenInSessions(session.token);
          props.loadUser(session.user);
          props.onRouteChange("home");
        } else if (!connectError) {
          alert("Wrong credentials, please check email and password are correct.");
        }
      } catch (error) {
        connectError = true;
        alert("Unable to connect to the server. Please check your internet connection.");
      }
    }
  };

  return (
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <div className="measure">
          <fieldset id="sign_in" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0 white-90">Sign In</legend>
            <div className="mt3">
              <label
                className="db fw6 lh-copy f6 white-90"
                htmlFor="email-address"
              >
                Email
              </label>
              <input
                className="pa2 input-reset ba white-90 b--white-90 bg-transparent hover-bg-black hover-white-90 w-100 hover-black"
                type="email"
                name="email-address"
                id="email-address"
                onChange={onEmailChange}
                onKeyDown={onKeyDown}
              />
            </div>
            <div className="mv3">
              <label
                className="db fw6 lh-copy f6 white-90"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="b pa2 input-reset ba white b--white-90 bg-transparent hover-bg-black hover-white-90 w-100 hover-black"
                type="password"
                name="password"
                id="password"
                onChange={onPasswordChange}
                onKeyDown={onKeyDown}
              />
            </div>
          </fieldset>
          <div className="">
            <input
              onClick={onSubmitSignIn}
              className="b ph3 pv2 input-reset ba b--white-90 bg-transparent grow pointer f6 dib white-90"
              type="submit"
              value="Sign in"
            />
          </div>
          <div className="lh-copy mt3">
            <p
              onClick={() => props.onRouteChange("register")}
              className="f6 link dim white-90 db pointer"
            >
              Register
            </p>
          </div>
        </div>
      </main>
    </article>
  );
};

export default Signin;
