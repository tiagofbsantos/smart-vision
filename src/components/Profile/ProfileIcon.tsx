import { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import User from "../../models/User";

interface Props {
  user: User;
  toggleModal: () => void;
  onRouteChange: (route: string) => void;
}

const ProfileIcon = (props: Props) => {
  const [idDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggle = () => {
    setIsDropdownOpen(!idDropdownOpen);
  };

  const signOut = () => {
    window.sessionStorage.removeItem("token");
    props.onRouteChange("signout");
  };

  return (
    <div className="pa4 tc">
      <Dropdown isOpen={idDropdownOpen} toggle={toggle}>
        <DropdownToggle
          tag="span"
          data-toggle="dropdown"
          aria-expanded={idDropdownOpen}
        >
          {props.user.avatar ? (
            <img
              src={props.user.avatar}
              className="br-100 ba h3 w3 dib"
              alt="avatar"
            />
          ) : (
            <img
              src={`https://robohash.org/set_set3/${props.user.name}`}
              className="br-100 ba h3 w3 dib"
              alt="avatar"
            />
          )}
        </DropdownToggle>
        <DropdownMenu
          right
          className="b--transparent shadow-5"
          style={{
            marginTop: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
          }}
        >
          <DropdownItem onClick={props.toggleModal}>
            View Profile
          </DropdownItem>
          <DropdownItem onClick={signOut}>
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ProfileIcon;
