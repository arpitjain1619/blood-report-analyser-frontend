import { useState } from "react";
import ImageUpload from "./ImageUpload";
import Result from "./Result";

const Body = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleImageSelect = (selectedImage) => {
    setImage(selectedImage);
  };

  const handleAnalyzeReport = async () => {
    if (image === null) {
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://127.0.0.1:8005/analyze-report", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="mt-5">
      <span>
        Upload a report image to get a general, non-diagnostic summary.
      </span>
      <ImageUpload onImageSelect={handleImageSelect} />
      <button
        className="mt-10 p-5 px-20 border border-gray-800 bg-gray-100 text-[#16171d] text-2xl rounded-2xl cursor-pointer"
        onClick={handleAnalyzeReport}
      >
        Analyze Report
      </button>

      {result && <Result data={result} />}
    </div>
  );
};

export default Body;
