import React, { useState, useEffect } from "react";

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
import User from "./models/User";
import "./App.css";

const App = () => {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [route, setRoute] = useState("signin");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const token = window.sessionStorage.getItem("token");
        if (token) {
          const response = await fetch("http://localhost:3005/signin", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Authorization: token
            }
          });

          const data = await response.json();
          if (data && data.id) {
            const response = await fetch(`http://localhost:3005/profile/${data.id}`, {
              method: "get",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            });

            const user = await response.json();
            if (user && user.email) {
              loadUser(user);
              onRouteChange("home");
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const saveAuthTokenInSessions = (token: string) => {
    window.sessionStorage.setItem("token", token);
  };

  const loadUser = (user: User) => setUser(user);

  const calculateFaceLocations = (outputs) => {
    if (outputs) {
      const image = document.getElementById("inputimage") as HTMLImageElement;

      const width = Number(image?.width);
      const height = Number(image?.height);

      return outputs[0].data.regions.map((face) => {
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
  };

  const displayFaceBoxes = (boxes: Box[]) => {
    if (boxes) setBoxes(boxes);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setInput(event.target.value);

  const onPictureSubmit = async () => {
    setImageUrl(input);
    setBoxes([]);

    if (!input) {
      alert("Image URL field left empty. Please fill it.");
    } else {
      try {
        const urlResponse = await fetch("http://localhost:3005/imageurl", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: window.sessionStorage.getItem("token") || "",
          },
          body: JSON.stringify({ input })
        });

        const data = await urlResponse.json();

        if (data === "unable to work with API") {
          alert("Unable to read image URL. Please make sure you paste in an image address/link/URL.");
        } else if (data) {
          const imageResponse = await fetch("http://localhost:3005/image", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: window.sessionStorage.getItem("token") || "",
            },
            body: JSON.stringify({ id: user.id })
          });

          const entries = await imageResponse.json();

          setUser({
            ...user,
            entries
          });
        }

        displayFaceBoxes(calculateFaceLocations(data.outputs));
      } catch (error) {
        alert("Unable to connect to the server. Please check your internet connection.");
        console.error(error);
      }
    }
  };

  const onRouteChange = (route: string) => {
    if (route === "signout") {
      setInput("");
      setImageUrl("");
      setBoxes([]);
      setRoute("signin");
      setIsSignedIn(false);
      setIsProfileOpen(false);
      setUser(undefined);

      return;
    } else if (route === "home") {
      setIsSignedIn(true);
    }

    setRoute(route);
  };

  const toggleModal = () => setIsProfileOpen(!isProfileOpen);

  return (
    <>
      <div className="particles">
        <Particles />
      </div>

      <div className="App">
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={onRouteChange}
          toggleModal={toggleModal}
          user={user}
        />

        {
          isProfileOpen && (
            <Modal>
              <Profile
                toggleModal={toggleModal}
                loadUser={loadUser}
                user={user}
              />
            </Modal>
          )
        }

        {
          route === "home" ? (
            <>
              <Logo />

              <Rank name={user.name} entries={user.entries} />

              <ImageLinkForm
                onInputChange={onInputChange}
                onPictureSubmit={onPictureSubmit}
              />

              <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </>
          ) : route === "signin" || route === "signout" ? (
            <Signin
              loadUser={loadUser}
              onRouteChange={onRouteChange}
              saveAuthTokenInSessions={saveAuthTokenInSessions}
            />
          ) : (
            <Register
              loadUser={loadUser}
              onRouteChange={onRouteChange}
              saveAuthTokenInSessions={saveAuthTokenInSessions}
            />
          )
        }
      </div>
    </>
  );
}

export default App;
