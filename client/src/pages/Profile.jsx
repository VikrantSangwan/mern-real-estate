import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { app } from "../firebase.js";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setfile] = useState(null);
  const [fileUploadPerc, setfileUploadPerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData, setformData] = useState({});
  const [updateSuccess, setupdateSuccess] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    // Initialize Firebase storage service using the Firebase app instance
    const storage = getStorage(app);
    // Generate a unique file name by combining the current timestamp with the original file name
    const fileName = new Date().getTime() + file.name;
    // Create a reference to the location where the file will be stored in Firebase Storage.
    const storageRef = ref(storage, fileName);
    // Initiate an upload task to upload the file to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file);
    // Set up a listener for state changes in the upload task to track the upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfileUploadPerc(Math.round(progress));
      },
      (error) => {
        setfileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setformData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data.user));
      setupdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(err.message));
    }
  };
  console.log("currentUser", currentUser);
  // file base configuration for adding images file
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1025 * 1024 &&
  // request.resource.contentType.matches('image/.*')
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
        {/* creating a reference and triggering it via on click event of image icon below  */}
        <input
          type="file"
          accept="images/*"
          ref={fileRef}
          hidden
          onChange={(e) => setfile(e.target.files[0])}
        />
        <img
          id="avatar"
          src={formData?.avatar || currentUser?.avatar }
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
          onClick={() => fileRef.current.click()}
        />
        {/* Image uploading percentage */}
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error while uploading file (image size should be less than 2 MB)
            </span>
          ) : fileUploadPerc > 0 && fileUploadPerc < 100 ? (
            <span className="text-slate-700">{`Uploading Image ${fileUploadPerc}%`}</span>
          ) : fileUploadPerc === 100 ? (
            <span className="text-green-700">Image Uploaded Successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          className="border p-3 rounded-lg"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          className="border p-3 rounded-lg"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          className="border p-3 rounded-lg"
          placeholder="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User updated successfully !!': ''}</p>
    </div>
  );
}
