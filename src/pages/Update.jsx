import React, { useState, useEffect } from 'react';
import Edit from '../components/UpdateUser';
import { useSelector } from 'react-redux';

export default function Update() {
  const myProfileData = useSelector((state) => state.myProfile);
  const [form, setForm] = useState({
    name: '',
    username: '',
    phone: '',
    description: '',
  });
  const [profilePhoto, setProfilePhoto] = useState('profile-default.png');

  useEffect(() => {
    if (myProfileData.data.length !== 0) {
      setForm({
        name: myProfileData.data[0]?.name,
        username: myProfileData.data[0]?.username,
        phone: myProfileData.data[0]?.phone,
        description: myProfileData.data[0]?.description,
      });
      setProfilePhoto(myProfileData.data[0]?.image);
    }
  }, [myProfileData]);
  return (
    <>
      <Edit />
    </>
  );
}
