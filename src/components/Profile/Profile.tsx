import React, { useState, useEffect, useCallback } from "react";
import "./Profile.css";
import User from "../../models/User";

interface UserUpdatableData {
  name?: string;
  avatar?: string;
}

interface Props {
  user: User;
  toggleModal: () => void;
  loadUser: (user: User) => void;
}

const Profile = (props: Props) => {
  const [name, setName] = useState(props.user.name);
  const [avatar, setAvatar] = useState(props.user.avatar);
  const [deleteAvatar, setDeleteAvatar] = useState(false);

  const { toggleModal, user } = props;

  const onProfileUpdate = useCallback(async (data: UserUpdatableData) => {
    try {
      const response = await fetch(`http://localhost:3005/profile/${props.user.id}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: window.sessionStorage.getItem("token") || "",
        },
        body: JSON.stringify({ formInput: data }),
      });

      if (response.status === 200 || response.status === 304) {
        props.toggleModal();
        props.loadUser({ ...props.user, ...data }); //overrides user with data differences
      }

    } catch (error) {
      alert("Unable to connect to the server. Please check your internet connection.");
      console.error(error);
    }
  }, [props]);

  useEffect(() => {
    (async () => {
      if (!avatar && deleteAvatar) {
        await onProfileUpdate({ avatar });
        setDeleteAvatar(false);
      }
    })();
  }, [avatar, deleteAvatar, onProfileUpdate]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, data: UserUpdatableData) => {
    if (event.key === "Enter") {
      onProfileUpdate(data);
    }
  };

  const onFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case "user-name":
        setName(event.target.value);
        break;
      case "user-avatar":
        setAvatar(event.target.value);
        break;
      default:
        return;
    }
  };

  const onDeleteAvatar = () => {
    setAvatar("");
    setDeleteAvatar(true);
  };

  return (
    <div className="profile-modal">
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
        <main className="pa4 black-80 w-80">
          {user.avatar ? (
            <img src={user.avatar} className="h3 w3 dib" alt="avatar" />
          ) : (
            <img
              src={`https://robohash.org/set_set3/${name}`}
              className="h3 w3 dib"
              alt="avatar"
            />
          )}
          <h1 className="mv1">{name}</h1>
          <h4 className="mb1">{`Images Submitted: ${user.entries}`}</h4>
          <p className="mb1">{`Member since: ${new Date(
            user.joined
          ).toLocaleDateString()}`}</p>
          <hr className="mv1" />
          <label className="mv1 fw6" htmlFor="user-name">
            Name:
          </label>
          <input
            onChange={onFormChange}
            className="pa2 ba w-100"
            placeholder={user.name}
            type="text"
            name="user-name"
            id="name"
            onKeyDown={(event) => onKeyDown(event, { name, avatar })}
          />
          <label className="mt2 fw6" htmlFor="user-avatar">
            Default avatar is generated based on your name. To use a custom
            avatar post a picture url here:
          </label>
          <input
            onChange={onFormChange}
            className="pa2 ba w-100"
            placeholder={user.avatar}
            type="text"
            name="user-avatar"
            id="avatar"
            onKeyDown={(event) => onKeyDown(event, { name, avatar })}
          />
          <button
            onClick={() => onDeleteAvatar()}
            className="b pa2 grow pointer hover-white w-100 mv2 bg-light-green b--black-20"
          >
            Delete Custom Avatar
          </button>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <button
              onClick={() => onProfileUpdate({ name, avatar })}
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
};

export default Profile;
