import { Upload } from "lucide-react";
import { useState } from "react";

const ImageUpload = ({ onImageSelect }) => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImagePreview(URL.createObjectURL(event.target.files[0]));
      onImageSelect(event.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <label
        htmlFor="image-upload"
        className="flex flex-col items-center justify-center w-200 h-64 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-600"
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Uploaded preview"
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <div className="flex items-center">
            <div>
              <p className="text-lg font-semibold text-gray-700">
                Upload Blood Report
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Click to select an image
              </p>

              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, JPEG or WEBP
              </p>
            </div>

            <Upload
              size={60}
              strokeWidth={2.5}
              className="text-gray-700 ml-6"
            />
          </div>
        )}

        <input
          id="image-upload"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
};

export default ImageUpload;
