import React from "react";
import "./ImageLinkForm.css";

interface Props {
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPictureSubmit: () => void;
}

const ImageLinkForm = (props: Props) => {
  const { onInputChange, onPictureSubmit } = props;

  const keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      props.onPictureSubmit();
    }
  };

  return (
    <>
      <p className="white f3">
        This Smart Vision will detect faces in your pictures, and what
        celibrities they look like.
      </p>
      <p className="white f3">Try it out by pasting a picture URL below.</p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input
            className="f4 pa2 w-70 center"
            type="text"
            onChange={onInputChange}
            onKeyDown={keyDown}
          />
          <button
            className="w-30 grow f4 link ph3 pv2 dib white"
            onClick={onPictureSubmit}
          >
            Detect
          </button>
        </div>
      </div>
    </>
  );
}

export default ImageLinkForm;
