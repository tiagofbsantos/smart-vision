import React from "react";
import "./Profile.css";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.user.name,
      avatar: this.props.user.avatar,
    };
  }

  onFormChange = (event) => {
    switch (event.target.name) {
      case "user-name":
        this.setState({ name: event.target.value });
        break;
      case "user-avatar":
        this.setState({ avatar: event.target.value });
        break;
      default:
        return;
    }
  };

  onProfileUpdate = (data) => {
    fetch(`http://localhost:3005/profile/${this.props.user.id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: window.sessionStorage.getItem("token"),
      },
      body: JSON.stringify({ formInput: data }),
    })
      .then((resp) => {
        if (resp.status === 200 || resp.status === 304) {
          this.props.toggleModal();
          this.props.loadUser({ ...this.props.user, ...data }); //overrides user with data differences
        }
      })
      .catch(console.log);
  };

  render() {
    const { toggleModal, user } = this.props;
    const { name, avatar } = this.state;
    return (
      <div className="profile-modal">
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
          <main className="pa4 black-80 w-80">
            {user.avatar ? (
              <img src={user.avatar} className="h3 w3 dib" alt="avatar" />
            ) : (
              <img
                src={`https://robohash.org/${name}?set=set3`}
                className="h3 w3 dib"
                alt="avatar"
              />
            )}
            <h1>{this.state.name}</h1>
            <h4>{`Images Submitted: ${user.entries}`}</h4>
            <p>{`Member since: ${new Date(
              user.joined
            ).toLocaleDateString()}`}</p>
            <hr />
            <label className="mt2 fw6" htmlFor="user-name">
              Name:
            </label>
            <input
              onChange={this.onFormChange}
              className="pa2 ba w-100"
              placeholder={user.name}
              type="text"
              name="user-name"
              id="name"
            />
            <label className="mt2 fw6" htmlFor="user-avatar">
              Default avatar is generated based on your name. To use a custom
              avatar post a picture url here:
            </label>
            <input
              onChange={this.onFormChange}
              className="pa2 ba w-100"
              placeholder={user.avatar}
              type="text"
              name="user-avatar"
              id="avatar"
            />
            <button
              onClick={() => this.setState({ avatar: "" })}
              className="b pa2 grow pointer hover-white w-100 mv4 bg-light-green b--black-20"
            >
              Delete Custom Avatar
            </button>
            <div
              className="mt4"
              style={{ display: "flex", justifyContent: "space-evenly" }}
            >
              <button
                onClick={() => this.onProfileUpdate({ name, avatar })}
                className="b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20"
              >
                Save
              </button>
              <button
                className="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20"
                onClick={toggleModal}
              >
                Cancel
              </button>
            </div>
          </main>
          <div className="modal-close" onClick={toggleModal}>
            &times;
          </div>
        </article>
      </div>
    );
  }
}

export default Profile;
