import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onPictureSubmit }) => {
  return (
    <React.Fragment>
      <p className="white f3">
        This Smart Vision will detect faces in your pictures, and what
        celibrities they look like.
      </p>
      <p className="white f3">Try it out by pasting a picture URL below.</p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <div className="square xxlarge shade1"></div>
          <div className="square xlarge shade2"></div>
          <div className="square large shade3"></div>
          <div className="square medium shade4"></div>
          <div className="square small shade5"></div>
          <input
            className="f4 pa2 w-70 center"
            type="text"
            onChange={onInputChange}
          />
          <button
            className="w-30 grow f4 link ph3 pv2 dib white"
            onClick={onPictureSubmit}
          >
            Detect
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ImageLinkForm;
