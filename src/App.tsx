import React, { Component } from "react";
import Particles from "./components/Particles";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import FaceRecognition, { Box } from "./components/FaceRecognition/FaceRecognition";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Modal from "./components/Modal/Modal";
import Profile from "./components/Profile/Profile";
import "./App.css";
import User from "./models/User";

interface Props { }

interface State {
  input: string;
  imageUrl: string;
  boxes: Box[],
  route: string;
  isSignedIn: boolean;
  isProfileOpen: boolean;
  user: User;
}

const initialState = {
  input: "",
  imageUrl: "",
  boxes: [],
  route: "signin",
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
    avatar: "",
  },
};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3005/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data && data.id) {
            fetch(`http://localhost:3005/profile/${data.id}`, {
              method: "get",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            })
              .then((resp) => resp.json())
              .then((user) => {
                if (user && user.email) {
                  this.loadUser(user);
                  this.onRouteChange("home");
                }
              });
          }
        })
        .catch(console.log);
    }
  }

  saveAuthTokenInSessions = (token: string) => {
    window.sessionStorage.setItem("token", token);
  };

  loadUser = (user: User) => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined,
        avatar: user.avatar,
      },
    });
  };

  calculateFaceLocations = (data) => {
    if (data && data.outputs) {
      const image = document.getElementById("inputimage") as HTMLImageElement;
      const width = Number(image?.width);
      const height = Number(image?.height);
      return data.outputs[0].data.regions.map((face) => {
        const clarifaiFace = face.region_info.bounding_box;
        const celibrity = face.data.concepts[0];
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - clarifaiFace.right_col * width,
          bottomRow: height - clarifaiFace.bottom_row * height,
          name: celibrity.name,
          certainty: celibrity.value,
        };
      });
    }
    return;
  };

  displayFaceBoxes = (boxes: Box[]) => {
    if (boxes) {
      this.setState({ boxes });
    }
  };

  onInputChange = (event) => this.setState({ input: event.target.value });

  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input, boxes: [] });
    if (!this.state.input) {
      alert("Image URL field left empty. Please fill it.");
    } else {
      fetch("http://localhost:3005/imageurl", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: window.sessionStorage.getItem("token") || "",
        },
        body: JSON.stringify({ input: this.state.input }),
      })
        .catch(() => {
          alert(
            "Unable to connect to the server. Please check your internet connection."
          );
        })
        .then((response: Response) => response.json())
        .then((response) => {
          if (response === "unable to work with API") {
            alert(
              "Unable to read image URL. Please make sure you paste in an image address/link/URL."
            );
          } else if (response) {
            fetch("http://localhost:3005/image", {
              method: "put",
              headers: {
                "Content-Type": "application/json",
                Authorization: window.sessionStorage.getItem("token") || "",
              },
              body: JSON.stringify({ id: this.state.user.id }),
            })
              .then((response) => response.json())
              .then((count) =>
                this.setState(
                  {
                    ...this.state,
                    user: {
                      ...this.state.user,
                      entries: count
                    }
                  }
                )
              )
              .catch(console.log);
          }
          this.displayFaceBoxes(this.calculateFaceLocations(response));
        })
        .catch((err) => console.log(err));
    }
  };

  onRouteChange = (route: string) => {
    if (route === "signout") return this.setState(initialState);
    else if (route === "home") this.setState({ isSignedIn: true });
    this.setState({ route });
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen,
    }));
  };

  render() {
    const {
      isSignedIn,
      imageUrl,
      route,
      boxes,
      isProfileOpen,
      user,
    } = this.state;
    return (
      <>
        <div className="particles">
          <Particles />
        </div>

        <div className="App">
          <Navigation
            isSignedIn={isSignedIn}
            onRouteChange={this.onRouteChange}
            toggleModal={this.toggleModal}
            user={user}
          />
          {isProfileOpen && (
            <Modal>
              <Profile
                toggleModal={this.toggleModal}
                loadUser={this.loadUser}
                user={user}
              />
            </Modal>
          )}
          {route === "home" ? (
            <React.Fragment>
              <Logo />
              <Rank name={user.name} entries={user.entries} />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onPictureSubmit={this.onPictureSubmit}
              />
              <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </React.Fragment>
          ) : route === "signin" || route === "signout" ? (
            <Signin
              loadUser={this.loadUser}
              onRouteChange={this.onRouteChange}
              saveAuthTokenInSessions={this.saveAuthTokenInSessions}
            />
          ) : (
            <Register
              loadUser={this.loadUser}
              onRouteChange={this.onRouteChange}
              saveAuthTokenInSessions={this.saveAuthTokenInSessions}
            />
          )}
        </div>
      </>
    );
  }
}

export default App;
