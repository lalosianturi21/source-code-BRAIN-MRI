import React from 'react';
import './ImageResult.css';

const ImageResult = ({ classificationResult }) => {
  if (!classificationResult) return null;

  return (
    <div className="result">
      <h2>Classification Result</h2>
      <p><strong>Class Category:</strong> {classificationResult.class_category}</p>
      <p><strong>Accuracy:</strong> {classificationResult.accuracy}</p>
      <p><strong>Description:</strong> {classificationResult.description}</p>
      <p><strong>Solution:</strong> {classificationResult.solution}</p>
    </div>
  );
};

export default ImageResult;
