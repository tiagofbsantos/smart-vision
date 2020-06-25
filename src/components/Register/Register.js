import React from "react";
import "../Signin/Signin.css";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
    };
  }

  keyDown = (event) => {
    if (event.key === "Enter") {
      this.onSubmitRegister();
    }
  };

  onNameChange = (event) => this.setState({ name: event.target.value });

  onEmailChange = (event) => this.setState({ email: event.target.value });

  onPasswordChange = (event) => this.setState({ password: event.target.value });

  onSubmitRegister = () => {
    if (!this.state.email || !this.state.password || !this.state.name) {
      alert(
        "Unable to register user. Name, Email, Password fields were left empty, please fill them."
      );
    } else if (!this.state.email.includes("@")) {
      alert(
        "Unable to register. Filled email is not a valid email address. A valid email address must include @ symbol. Please fill in a valid email address."
      );
    } else {
      let connectError = false;
      fetch("http://localhost:3005/register", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
          name: this.state.name,
        }),
      })
        .catch(() => {
          connectError = true;
          alert(
            "Unable to connect to the server. Please check your internet connection."
          );
        })
        .then((response) => response.json())
        .then((session) => {
          if (session && session.success === "true") {
            this.props.saveAuthTokenInSessions(session.token);
            this.props.loadUser(session.user);
            this.props.onRouteChange("home");
          } else if (!connectError) {
            alert(
              "Unable to register user. User email is already registered. Please signin instead or register a different email."
            );
          }
        })
        .catch(() => {
          if (!connectError) {
            alert(
              "Unable to register user. User email is already registered. Please signin instead or register a different email."
            );
          }
        });
    }
  };

  render() {
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
                  onChange={this.onNameChange}
                  onKeyDown={this.keyDown}
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
                  onChange={this.onEmailChange}
                  onKeyDown={this.keyDown}
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
                  onChange={this.onPasswordChange}
                  onKeyDown={this.keyDown}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitRegister}
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
}

export default Register;
