import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imagesUrls: [],
  });
  const [imageUploadError, setimageUploadError] = useState(false);
  const [uploading, setuploading] = useState(false);

  // Uploading multiple images on server
  const handleImageSubmit = () => {
    if (
      files.length > 0 &&
      files.length < 7 &&
      formData.imagesUrls.length < 7
    ) {
      setuploading(true);
      setimageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storageImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imagesUrls: formData.imagesUrls.concat(urls),
          });
          setimageUploadError(false);
          setuploading(false);
        })
        .catch((error) => {
          setuploading(false);
          setimageUploadError("Image upload failed (2 MB max per image)");
        });
    } else {
      setuploading(false);
      setimageUploadError("You can upload 6 images per listing");
    }
  };

  // Uploading single - single file on firebase
  const storageImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "stage_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };


  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imagesUrls: formData.imagesUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            id="name"
            maxLength="62"
            minLength="10"
            required
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
          ></input>
          <textarea
            id="description"
            required
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
          ></textarea>
          <input
            id="address"
            maxLength="62"
            minLength="10"
            required
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
          ></input>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-items items-center gap-2">
              <input
                type="number"
                className="p-3 border-gray-300 rounded-lg"
                id="bedroom"
                min="1"
                max="10"
                required
              />
              <p>Beds</p>
            </div>
            <div className="flex flex-items items-center gap-2">
              <input
                type="number"
                className="p-3 border-gray-300 rounded-lg"
                id="bathrooms"
                min="1"
                max="10"
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex flex-items items-center gap-2">
              <input
                type="number"
                className="p-3 border-gray-300 rounded-lg"
                id="regularPrice"
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex flex-items items-center gap-2">
              <input
                type="number"
                className="p-3 border-gray-300 rounded-lg"
                id="discountPrice"
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold ">
            Images{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first will be the cover (max - 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              // to accept only images and selecting multiple
              accept="image/*"
              multiple
              onChange={(e) => setFiles(...files, e.target.files)}
            />
            <button
            disabled={uploading}
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imagesUrls.length > 0 &&
            formData.imagesUrls.map((url, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          <button
            className="p-3 rounded-lg bg-slate-700 text-white upper
      hover:opacity-95 disabled:text-opacity-90"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
