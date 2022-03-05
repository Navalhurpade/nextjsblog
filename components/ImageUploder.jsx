import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import React, { useContext, useState } from 'react';
import { storage } from '../lib/firebase';
import Loader from './Loader';
import AuthContext from './../lib/AuthContext';
import toast from 'react-hot-toast';

function ImageUploder(props) {
  const [isUploading, setIsUploding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const { user } = useContext(AuthContext);

  const uploadFile = async (e) => {
    try {
      setIsUploding(true);
      const file = Array.from(e.target.files)[0];
      const extention = file.type.split('/')[1];
      const storageRef = ref(storage, `uploads/${user.uid}/${Date.now()}.${extention}`);
      let uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('progress', currentProgress);
          setProgress(currentProgress);
        },
        (error) => {
          toast.error('Failed to upload IMG, please try againg !');
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDownloadUrl(downloadURL);
          });
          toast.success('Image uploaded !');
        }
      );
      setIsUploding(false);
    } catch (error) {
      console.log('ERROR::', error);
    }
  };

  const copyToClipbord = () => {
    navigator.clipboard.writeText(`![alt](${downloadUrl})`);
    alert('Text copied');
  };

  return (
    <div className="box">
      {isUploading && (
        <>
          <Loader show={isUploading} />
          <h3>{progress}%</h3>
        </>
      )}
      {!isUploading && (
        <>
          <label className="btn">
            {' '}
            📸 Upload Img
            <input type="file" onChange={uploadFile}></input>
          </label>
        </>
      )}
      {downloadUrl && (
        <>
          <code>{`![alt](${downloadUrl})`}</code>
          <div class="tooltip">
            <button title="Copy to clipbord" onClick={copyToClipbord}>
              Copy to clipboard
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ImageUploder;
