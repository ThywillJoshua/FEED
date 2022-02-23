import { storage } from "@/lib/firebase";
import Loader from "./Loader";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setdownloadURL] = useState(null);

  const uploadFile = async (e) => {
    const file = Array.from(e.target.files)[0];
    if (!file) return;

    // const extension = file.type.split("/")[1];

    const uploadRef = ref(
      storage,
      `uploads/${auth.currentUser.uid}${Date.now()}.${file}`
    );

    const uploadTask = uploadBytesResumable(uploadRef, file);

    //upload files
    const next = function (snapshot) {
      setUploading(true);
      setProgress(
        Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      );
    };

    const error = function (err) {
      setUploading(false);
      console.error(err.message);
      toast.error("Oops! Something went wrong.");
    };

    const complete = function () {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        setdownloadURL(url);
        setUploading(false);
      });
    };

    uploadTask.on("state_changed", next, error, complete);
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}
      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Img
            <input
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif, image/jpeg"
            />
          </label>
        </>
      )}

      {downloadURL && (
        <code className="upload-snippet">{`![alt](${downloadURL})`}</code>
      )}
    </div>
  );
}
