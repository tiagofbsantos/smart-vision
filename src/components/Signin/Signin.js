import React from "react";
import "./Signin.css";

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: "",
      signInPassword: "",
    };
  }

  onEmailChange = (event) => this.setState({ signInEmail: event.target.value });

  onPasswordChange = (event) =>
    this.setState({ signInPassword: event.target.value });

  onSubmitSignIn = () => {
    fetch("http://localhost:3005/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword,
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
      })
      .catch(console.log);
  };

  render() {
    const { onRouteChange } = this.props;
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
                  onChange={this.onEmailChange}
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
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--white-90 bg-transparent grow pointer f6 dib white-90"
                type="submit"
                value="Sign in"
              />
            </div>
            <div className="lh-copy mt3">
              <p
                onClick={() => onRouteChange("register")}
                className="f6 link dim white-90 db pointer"
              >
                Register
              </p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Signin;
