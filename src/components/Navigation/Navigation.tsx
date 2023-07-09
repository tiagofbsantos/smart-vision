import ProfileIcon from "../Profile/ProfileIcon";
import User from "../../models/User";

interface Props {
  onRouteChange: (route: string) => void;
  isSignedIn: boolean;
  toggleModal: () => void;
  user: User;
}

const Navigation = ({ onRouteChange, isSignedIn, toggleModal, user }: Props) => {
  if (isSignedIn) {
    return (
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <ProfileIcon
          onRouteChange={onRouteChange}
          toggleModal={toggleModal}
          user={user}
        />
      </nav>
    );
  } else {
    return (
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <p
          onClick={() => onRouteChange("signin")}
          className="f3 link dim white-90 underline pa3 pointer"
        >
          Sign In
        </p>

        <p
          onClick={() => onRouteChange("register")}
          className="f3 link dim white-90 underline pa3 pointer"
        >
          Register
        </p>
      </nav>
    );
  }
};

export default Navigation;
