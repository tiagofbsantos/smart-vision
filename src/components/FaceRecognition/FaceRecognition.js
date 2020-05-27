import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, boxes }) => {
  return (
    <div className="center">
      <div className="absolute mv8">
        <img
          id="inputimage"
          alt=""
          src={imageUrl}
          width="500px"
          height="auto"
        />
        {boxes.map((box, i) => {
          return (
            <div
              key={i}
              className="bounding-box"
              style={{
                top: box.topRow,
                right: box.rightCol,
                bottom: box.bottomRow,
                left: box.leftCol,
              }}
            >
              <div key={`d${i}`} className="celebDescription">
                <span key={`s${i}`}>
                  {box.name}, {Math.trunc(box.certainty * 100)}% sure
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaceRecognition;
