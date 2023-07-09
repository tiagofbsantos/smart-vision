import React, { useState } from "react";
import "../Signin/Signin.css";
import User from "../../models/User";

interface Props {
  saveAuthTokenInSessions: (token: string) => void;
  loadUser: (user: User) => void;
  onRouteChange: (route: string) => void;
}

const Register = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") onSubmitRegister();
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value);

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);

  const onSubmitRegister = async () => {
    if (!email || !password || !name) {
      alert("Unable to register user. Name, Email, Password fields were left empty, please fill them.");
    } else if (!email.includes("@")) {
      alert("Unable to register. Filled email is not a valid email address. A valid email address must include @ symbol. Please fill in a valid email address.");
    } else {
      let connectError = false;

      try {
        const response = await fetch("http://localhost:3005/register", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            name
          })
        });

        const session = await response.json();
        if (session && session.success === "true") {
          props.saveAuthTokenInSessions(session.token);
          props.loadUser(session.user);
          props.onRouteChange("home");
        } else if (!connectError) {
          alert("Unable to register user. User email is already registered. Please signin instead or register a different email.");
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
          <fieldset id="register" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0 white-90">Register</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6 white-90" htmlFor="name">
                Name
              </label>
              <input
                className="pa2 input-reset ba b--white-90 bg-transparent hover-bg-black hover-white w-100 hover-black white-90"
                type="text"
                name="name"
                id="name"
                onChange={onNameChange}
                onKeyDown={onKeyDown}
              />
            </div>
            <div className="mt3">
              <label
                className="db fw6 lh-copy f6 white-90"
                htmlFor="email-address"
              >
                Email
              </label>
              <input
                className="pa2 input-reset ba b--white-90 bg-transparent hover-bg-black hover-white-90 w-100 hover-black white-90"
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
                className="b pa2 input-reset ba b--white-90 bg-transparent hover-bg-black hover-white w-100 hover-black white-90"
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
              onClick={onSubmitRegister}
              className="b ph3 pv2 input-reset ba b--white-90 bg-transparent grow pointer f6 dib white-90"
              type="submit"
              value="Register"
            />
          </div>
        </div>
      </main>
    </article>
  );
}

export default Register;
