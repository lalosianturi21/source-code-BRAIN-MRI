import React, { useState } from "react";
import Webcam from "react-webcam";
import './ImageSelector.css';

const ImageSelector = ({ setImageData, setClassificationResult }) => {
  const [useCamera, setUseCamera] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const webcamRef = React.useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("File size exceeds 5 MB. Please upload a smaller image.");
        return;
      }
      setErrorMessage(null);
      setImageData(file);
      setClassificationResult(null);
    }
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const file = dataURLtoFile(imageSrc, "captured-image.jpg");

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Captured image size exceeds 5 MB. Please try again.");
        return;
      }

      setErrorMessage(null);
      setImageData(file);
      setClassificationResult(null);
      setUseCamera(false);
    }
  };

  const dataURLtoFile = (dataUrl, fileName) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  };

  const toggleCamera = () => {
    setUseCamera((prevUseCamera) => {
      if (!prevUseCamera) {
        setImageData(null);
        setClassificationResult(null);
      }
      return !prevUseCamera;
    });
  };

  return (
    <div className="image-selector">
      <div className="toggle-container">
        <button onClick={toggleCamera} className="toggle-button">
          {useCamera ? (
            <>
              <i className="fa-solid fa-rectangle-xmark"></i> Close Camera
            </>
          ) : (
            <>
              <i className="fas fa-camera"></i> Use Camera
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="error-message">
          <p className="text-error">{errorMessage}</p>
        </div>
      )}

      {useCamera ? (
        <div className="camera-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam"
          />
          <button onClick={captureImage} className="capture-button">
            <i className="fa-solid fa-image"></i> Capture Image
          </button>
        </div>
      ) : (
        <div className="file-upload-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-upload-input"
          />
          <p>Or select an image from your device</p>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;
