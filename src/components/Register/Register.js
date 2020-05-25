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

  onNameChange = (event) => this.setState({ name: event.target.value });

  onEmailChange = (event) => this.setState({ email: event.target.value });

  onPasswordChange = (event) => this.setState({ password: event.target.value });

  onSubmitRegister = () => {
    fetch("http://localhost:3005/register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        name: this.state.name,
      }),
    })
      .catch(console.log)
      .then((response) => response.json())
      .then((session) => {
        if (session && session.success === "true") {
          this.props.saveAuthTokenInSessions(session.token);
          this.props.loadUser(session.user);
          this.props.onRouteChange("home");
        }
      });
  };

  render() {
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="register" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0 white-80">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6 white-80" htmlFor="name">
                  Name
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black white-80"
                  type="text"
                  name="name"
                  id="name"
                  onChange={this.onNameChange}
                />
              </div>
              <div className="mt3">
                <label
                  className="db fw6 lh-copy f6 white-80"
                  htmlFor="email-address"
                >
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white-80 w-100 hover-black white-80"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mv3">
                <label
                  className="db fw6 lh-copy f6 white-80"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba b--white-80 bg-transparent hover-bg-black hover-white w-100 hover-black white-80"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitRegister}
                className="b ph3 pv2 input-reset ba b--white-80 bg-transparent grow pointer f6 dib white-80"
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
