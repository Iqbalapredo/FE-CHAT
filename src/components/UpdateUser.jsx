import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, updatePhoto } from '../redux/actions/updateUser';
import { getMyProfile } from '../redux/actions/myProfile';
import swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Style from '../assets/styles/auth.module.css';

export default function EditProfile() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myProfileData = useSelector((state) => state.myProfile);
  const [form, setForm] = useState({
    name: '',
    username: '',
    phone: '',
    description: '',
  });
  const [profilePhoto, setProfilePhoto] = useState('profile-default.png');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [buttonVisibility, setButtonVisibility] = useState(false);
  const photoSubmit = (e) => {
    e.preventDefault();
    setLoadingPhoto(true);
    const formData = new FormData();
    formData.append('image', image);
    updatePhoto(formData, token)
      .then((response) => {
        swal.fire('Success!', response.message, 'success').then(() => {
          dispatch(getMyProfile(token));
        });
        setButtonVisibility(!buttonVisibility);
      })
      .catch((err) => {
        swal.fire('Failed!', err.response.data.message, 'error');
        setButtonVisibility(!buttonVisibility);
      })
      .finally(() => {
        setLoadingPhoto(false);
      });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!form.name) {
      swal.fire('Error!', 'Fullname cannot be blank', 'error');
      setLoading(false);
    } else {
      updateProfile(form, token)
        .then((response) => {
          swal.fire('Success!', response.message, 'success').then(() => {
            navigate('/');
          });
        })
        .catch((err) => {
          swal.fire('Failed!', err.response.data.message, 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    dispatch(getMyProfile(token));
    document.title = 'Telegram - Edit Profile';
  }, []);
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
      <div className="row">
        <div className="col-md-6" style={{ backgroundColor: '#7E98DF' }}></div>
        <div className="col-md-6">
          <div className="container" style={{ marginLeft: '50px' }}>
            <div style={{ display: 'flex', width: '80%', marginBottom: '30px', marginLeft: '10px', color: '#7E98DF' }}>
              <h3 style={{ margin: '32px auto 0px auto', fontWeight: '700' }}>INSAN CITA CHAT</h3>
            </div>
            <div
              // eslint-disable-next-line no-undef
              style={{
                width: '180px',
                height: '180px',
                marginBottom: '30px',
                marginLeft: '27%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}/${profilePhoto}')`,
                borderRadius: '100%',
                border: '3px solid #7E98DF',
              }}
            ></div>
            {buttonVisibility ? (
              <button
                style={{ backgroundColor: '#7E98DF', color: '#FFF', border: 'none', borderRadius: '20px', padding: '15px', marginBottom: '30px', marginLeft: '31%' }}
                onClick={() => {
                  document.getElementById('submit').click();
                }}
              >
                {loadingPhoto ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    &nbsp;Loading
                  </>
                ) : (
                  'Click Update'
                )}
              </button>
            ) : (
              <button
                style={{ backgroundColor: '#7E98DF', color: '#FFF', border: 'none', borderRadius: '20px', padding: '15px', marginBottom: '30px', marginLeft: '31%' }}
                onClick={() => {
                  document.getElementById('image').click();
                }}
              >
                Change Image
              </button>
            )}
            <form id="form" onSubmit={(e) => photoSubmit(e)}>
              <input
                type="file"
                id="image"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  setButtonVisibility(!buttonVisibility);
                }}
                style={{ display: 'none' }}
              />
              <input type="submit" id="submit" style={{ display: 'none' }} />
            </form>
            <form
              style={{ width: '80%' }}
              onSubmit={(e) => {
                onSubmit(e);
              }}
            >
              <p style={{ color: '#848484', margin: '0px' }}>Name</p>
              <input
                type="text"
                className={Style.inputForm}
                placeholder="Your fullname"
                style={{ borderBottom: '1px solid #232323', marginBottom: '30px' }}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                }}
                value={form.name}
              />
              <p style={{ color: '#848484', margin: '0px' }}>Username</p>
              <input
                type="text"
                className={Style.inputForm}
                placeholder="Your username"
                style={{ borderBottom: '1px solid #232323', marginBottom: '30px' }}
                onChange={(e) => {
                  setForm({ ...form, username: e.target.value });
                }}
                value={form.username}
              />
              <p style={{ color: '#848484', margin: '0px' }}>Phone</p>
              <input
                type="number"
                className={Style.inputForm}
                placeholder="Your phone"
                style={{ borderBottom: '1px solid #232323', marginBottom: '30px' }}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                }}
                value={form.phone}
              />
              <p style={{ color: '#848484', margin: '0px' }}>Description</p>
              <textarea
                className={Style.inputForm}
                placeholder="Your bio"
                style={{ marginBottom: '30px', border: '1px solid #232323' }}
                onChange={(e) => {
                  setForm({ ...form, description: e.target.value });
                }}
                value={form.description}
              />
              <button type="submit" style={{ width: '100%', backgroundColor: '#7E98DF', color: '#FFF', border: 'none', borderRadius: '20px', padding: '20px', marginBottom: '30px' }}>
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    &nbsp;Loading
                  </>
                ) : (
                  'Update'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
