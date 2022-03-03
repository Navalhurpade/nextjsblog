import { ref, uploadBytes } from 'firebase/storage';
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
      const file = Array.from(e.target.files)[0];
      const extention = file.type.split('/')[1];

      const storageRef = ref(storage, `uploads/${user.uid}/${Date.now()}.${extention}`);
      console.log('FILE::', file, extention);
      let data = await uploadBytes(storageRef, file);

      console.log('Uploaded ', data);
      toast.success('Image uploaded!');
    } catch (error) {
      console.log('ERROR::', error);
    }
  };

  return (
    <div className="box">
      {isUploading && <Loader show={isUploading} />}
      {isUploading && <h3>{progress}%</h3>}
      {!isUploading && (
        <>
          <label className="btn">
            {' '}
            📸 Upload Img
            <input type="file" onChange={uploadFile}></input>
          </label>
        </>
      )}
      {downloadUrl && <code>{`![alt](${downloadUrl})`}</code>}
    </div>
  );
}

export default ImageUploder;
