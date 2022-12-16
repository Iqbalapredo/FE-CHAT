/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { BulletList } from 'react-content-loader';
import io from 'socket.io-client';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { getListUser } from '../redux/actions/listUser';
import { getMyProfile } from '../redux/actions/myProfile';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faMagnifyingGlass, faUser, faRightFromBracket, faGear, faBars } from '@fortawesome/free-solid-svg-icons';
import Style from '../assets/styles/Chat.module.css';
import { Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import Swal from 'sweetalert2';

export default function Chat() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const listUser = useSelector((state) => state.listUser);
  const myProfile = useSelector((state) => state.myProfile);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [socketIo, setSocketIo] = useState(null);
  const [chat, setChat] = useState([]);
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    phone: '',
    description: '',
    image: 'profile-default.png',
  });
  const [chatWindow, setChatWindow] = useState(false);
  const [receiver, setReceiver] = useState({});
  const [message, setMessage] = useState({
    type: '',
    value: '',
  });
  const [name, setName] = useState('');
  const createNotification = (sender, message) => {
    return NotificationManager.info(message, `New chat from: ${sender}`, 5000);
  };
  const searchUser = (e) => {
    e.preventDefault();
    dispatch(getListUser(token, name));
  };
  const toggle = () => setDropdownOpen(!dropdownOpen);
  const toggleDrawer1 = () => {
    setIsOpen1(!isOpen1);
  };
  const toggleDrawer2 = () => {
    setIsOpen2(!isOpen2);
  };
  const selectReceiver = (dataReceiver) => {
    setReceiver(dataReceiver);
    localStorage.setItem('receiver', JSON.stringify(dataReceiver));
    socketIo.emit('join-room', parseInt(userId));
    const data = {
      sender: parseInt(userId),
      receiver: parseInt(dataReceiver.id),
    };
    socketIo.emit('chat-history', data);
    setChat([]);
    setChatWindow(true);
  };
  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };
  const onSendMessage = (e) => {
    e.preventDefault();
    const payload = {
      sender_id: parseInt(userId),
      receiver_id: parseInt(receiver.id),
      type: message.type,
      message: message.value,
    };
    setChat([...chat, payload]);
    socketIo.emit('send-message', payload);
    setMessage({
      type: '',
      value: '',
    });
  };
  const deleteMessage = (messageId) => {
    const payload = {
      sender: parseInt(userId),
      receiver: parseInt(receiver.id),
      idmessage: messageId,
    };
    Swal.fire({
      title: 'Yakin Hapus Pesan Ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'green',
      confirmButtonText: 'Yaa, Saya akan Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        socketIo.emit('delete-message', payload);
      }
    });
  };
  useEffect(() => {
    if (myProfile.data.length !== 0) {
      setProfileData({
        name: myProfile.data[0].name,
        username: myProfile.data[0].username,
        phone: myProfile.data[0].phone,
        description: myProfile.data[0].description,
        image: myProfile.data[0].image,
      });
    }
  }, [myProfile]);
  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_URL);
    socket.on('send-message-response', (response) => {
      const receiver = JSON.parse(localStorage.getItem('receiver'));
      if (response.length > 0) {
        if (parseInt(receiver.id) === response[0].sender_id || parseInt(receiver.id) === response[0].receiver_id) {
          setChat(response);
        } else {
          createNotification(response[response.length - 1].sender_name, response[response.length - 1].message);
        }
      }
    });
    setSocketIo(socket);
  }, []);
  useEffect(() => {
    document.title = 'Telegram - Chat';
    dispatch(getListUser(token, name));
    dispatch(getMyProfile(token));
  }, []);
  useEffect(() => {
    if (chatWindow) {
      document.getElementById('chatWindow').scrollTo(0, document.getElementById('chatWindow').scrollHeight);
    }
  }, [chat]);
  return (
    <div className="container-fluid d-flex w-100" style={{ padding: '0px', height: '100vh' }}>
      <div className="d-flex flex-column" style={{ width: '25%', padding: '30px', borderRight: '1px solid #E8E8E8' }}>
        <div className="d-flex align-items-center w-100" style={{ color: '#7E98DF', marginBottom: '30px' }}>
          <h3 style={{ fontWeight: '700' }}>INSAN CITA CHAT</h3>
          <Drawer open={isOpen1} onClose={toggleDrawer1} direction="left" style={{ width: '25%' }}>
            <div className="d-flex flex-column align-items-center" style={{ width: '100%', padding: '30px', overflowY: 'auto', overflowX: 'hidden' }}>
              <div className="d-flex align-items-center w-100" style={{ marginBottom: '40px' }}>
                <h4
                  className={Style.backButton}
                  onClick={() => {
                    toggleDrawer1();
                  }}
                ></h4>
                <h4 style={{ marginLeft: 'auto', marginRight: 'auto', fontWeight: '700' }}>INSAN CITA CHAT</h4>
              </div>
              <div
                style={{
                  border: '3px solid #7E98DF',
                  marginTop: '-12px',
                  marginBottom: '10px',
                  width: '170px',
                  height: '170px',
                  backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}/${profileData.image}')`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '100%',
                }}
              />
              <h3 style={{ color: '#000' }}>Account</h3>
              <h5 style={{ color: '#000', fontWeight: '700' }}>{profileData.name}</h5>
              <p style={{ color: '#848484' }}>{profileData.username || ''}</p>
              <div className="d-flex flex-column w-100" style={{ marginTop: '-6px' }}>
                <p style={{ color: '#848484' }}>Contact</p>
                <p style={{ color: '#000', marginTop: '-3px' }}>{profileData.phone || 'data tidak ada'}</p>
                <hr style={{ width: '100%', color: 'black', marginTop: '-3px' }} />
                <p style={{ color: '#848484' }}>Username</p>
                <p style={{ fontWeight: '500', color: '#000', marginTop: '-3px' }}>{profileData.username || 'data tidak ada'}</p>
                <hr style={{ width: '100%', color: 'black', marginTop: '-3px' }} />
                <p style={{ color: '#848484' }}>Description</p>
                <p style={{ fontWeight: '500', color: '#000', marginTop: '-3px' }}>{profileData.description || 'data tidak ada'}</p>
              </div>
            </div>
          </Drawer>
          <Dropdown isOpen={dropdownOpen} toggle={toggle} style={{ marginLeft: 'auto', marginRight: '0px' }}>
            <DropdownToggle style={{ border: 'none', backgroundColor: 'rgb(126, 152, 223)' }}>
              <h3>
                <FontAwesomeIcon icon={faAlignLeft} />
              </h3>
            </DropdownToggle>
            <DropdownMenu style={{ backgroundColor: 'rgb(126, 152, 223)', borderRadius: '40px 5px', marginLeft: '-150px' }}>
              <DropdownItem
                style={{ color: 'white' }}
                onClick={() => {
                  toggleDrawer1();
                }}
              >
                <FontAwesomeIcon icon={faUser} /> :: {profileData.name}
              </DropdownItem>
              <DropdownItem divider />
              <Link to="/edit" style={{ textDecoration: 'none' }}>
                <DropdownItem style={{ color: 'white' }}>
                  <FontAwesomeIcon icon={faGear} /> Edit Profile
                </DropdownItem>
              </Link>
              <DropdownItem
                onClick={() => {
                  logout();
                }}
                style={{ color: 'red' }}
              >
                <FontAwesomeIcon icon={faRightFromBracket} /> Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="d-flex align-items-center w-100" style={{ marginBottom: '30px' }}>
          <div className="d-flex align-items-center" style={{ width: '90%', paddingLeft: '20px', backgroundColor: '#FAFAFA', color: '#848484', borderRadius: '15px' }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <form
              style={{ width: '100%' }}
              onSubmit={(e) => {
                searchUser(e);
              }}
            >
              <input
                className={Style.searchClass}
                type="text"
                placeholder="Search..."
                style={{ width: '120%', border: 'none', padding: '10px', backgroundColor: '#FAFAFA', borderRadius: '20px' }}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <input type="submit" style={{ display: 'none' }} />
            </form>
          </div>
        </div>
        <div className="d-flex flex-row align-items-center ms-4 mb-3" style={{ gap: '10px' }}>
          <div className=" text-center">
            <button className="btn rounded-5" style={{ backgroundColor: '#7E98DF' }}>
              All
            </button>
          </div>
          <div className=" text-center">
            <button className="btn rounded-5">Unread</button>
          </div>
          <div className="text-center">
            <button className="btn rounded-5">Important</button>
          </div>
        </div>

        <div className={`d-flex flex-column ${Style.style2}`} style={{ width: '100%', overflowY: 'auto', overflowX: 'hidden', textOverflow: 'ellipsis' }}>
          {/* Start list user */}
          {listUser.isLoading ? (
            <BulletList />
          ) : listUser.isError ? (
            <div>{listUser.errorMessage}</div>
          ) : listUser.data.length > 0 ? (
            listUser.data.map((item, index) =>
              item.user.id !== parseInt(userId) ? (
                <div
                  key={index}
                  className={`d-flex align-items-center w-100 ${Style.userTab}`}
                  onClick={() => {
                    selectReceiver(item.user);
                  }}
                  style={{ marginBottom: '30px', borderRadius: '10px' }}
                >
                  <div
                    style={{
                      border: '3px solid #7E98DF',
                      borderRadius: '100%',
                      width: '150px',
                      marginRight: '15px',
                      height: '100px',
                      backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}/${item.user.image}')`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                  <div className="d-flex flex-column" style={{ width: '80%', marginLeft: 'auto', marginRight: '0px' }}>
                    <div className="d-flex align-items-center" style={{ width: '100%' }}>
                      <h4 style={{ fontWeight: '700' }}>{item.user.name}</h4>
                    </div>
                    <div className="d-flex align-items-center" style={{ width: '100%' }}>
                      <p style={{ marginBottom: 'auto', marginTop: 'auto', color: '#7E98DF' }}>{item.lastChat === 'No Chat' ? 'No Chat' : item.lastChat.message}</p>
                    </div>
                  </div>
                </div>
              ) : null
            )
          ) : (
            <div>Tidak Ada Pengguna</div>
          )}
        </div>
      </div>
      <Drawer open={isOpen2} onClose={toggleDrawer2} direction="right" className="bla bla bla" style={{ width: '25%' }}>
        <div className="d-flex flex-column align-items-center" style={{ width: '100%', padding: '30px', overflowY: 'auto', overflowX: 'hidden' }}>
          <div className="d-flex align-items-center w-100" style={{ marginBottom: '40px', color: '#7E98DF' }}>
            <h4 style={{ marginLeft: 'auto', marginRight: 'auto', fontWeight: '700' }}>INSAN CITA CHAT</h4>
          </div>
          <div
            style={{
              border: '3px solid #7E98DF',
              borderRadius: '100%',
              marginBottom: '30px',
              width: '170px',
              height: '170px',
              backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}/${receiver.image}')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div className="d-flex align-items-center w-100" style={{ marginBottom: '30px' }}>
            <div className="d-flex flex-column">
              <h3 style={{ color: '#000', fontWeight: '700', marginLeft: '7rem' }}>{receiver.name}</h3>
              <p style={{ color: '#000', marginLeft: '7.5rem' }}>Active</p>
            </div>
          </div>
          <div className="d-flex flex-column w-100">
            <hr />
            <h6 style={{ color: '#000' }}>Phone</h6>
            <p style={{ color: '#000' }}>{receiver.phone || 'No phone number'}</p>
            <hr />
            <h6 style={{ color: '#000' }}>Description</h6>
            <p style={{ color: '#000', marginBottom: '0px' }}>{receiver.description || 'No bio'}</p>
            <hr style={{ width: '100%', border: '2px solid #E5E5E5' }} />
          </div>
        </div>
      </Drawer>
      {chatWindow ? (
        <div className="d-flex flex-column" style={{ width: '75%' }}>
          {/* Start header */}
          <div
            className={`d-flex align-items-center w-100 ${Style.backButton}`}
            style={{ padding: '3px 50px 3px 50px' }}
            onClick={() => {
              toggleDrawer2();
            }}
          >
            <div
              style={{
                border: '3px solid #7E98DF',
                borderRadius: '100%',
                width: '65px',
                marginRight: '20px',
                height: '65px',
                backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}/${receiver.image}')`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <div className="d-flex flex-column">
              <h4 style={{ fontWeight: '700' }}>{receiver.name}</h4>
              <p style={{ color: 'green' }}>Active</p>
            </div>
          </div>
          <div className={`d-flex flex-column w-100 ${Style.style2}`} id="chatWindow" style={{ height: '100%', backgroundColor: '#FAFAFA', padding: '10px 50px 10px 50px', overflowY: 'auto', overflowX: 'hidden' }}>
            {/* history chat goes here */}
            {chat.length === 0 ? (
              <p>No messages</p>
            ) : (
              chat.map((item, index) =>
                item.sender_id === parseInt(userId) ? (
                  <div key={index} className="d-flex justify-content-end" style={{ width: '100%', marginBottom: '10px', position: 'relative' }}>
                    <div className={`d-flex justify-content-end align-items-center ${Style.divChat}`}>
                      <p
                        onClick={() => {
                          deleteMessage(item.id);
                        }}
                        className="text-danger"
                        style={{ fontWeight: '700', cursor: 'pointer' }}
                      >
                        X{' '}
                      </p>

                      <p style={{ padding: '15px 30px', backgroundColor: '#FFF', color: '#000', borderRadius: '35px 10px 35px 35px', maxWidth: '89%', margin: 'auto 20px 0px 0px' }}>{item.message}</p>
                      <div className="d-flex justify-content-end" style={{ width: '11%' }}>
                        <div
                          style={{
                            border: '3px solid #7E98DF',
                            borderRadius: '100%',
                            width: '55px',
                            height: '55px',
                            backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}/${profileData.image}')`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={index} className="d-flex justify-content-start" style={{ width: '100%', marginBottom: '10px', position: 'relative' }}>
                    <div className="d-flex justify-content-start" style={{ width: '50%' }}>
                      <div className="d-flex justify-content-end" style={{ width: '11%' }}>
                        <div
                          style={{
                            border: ' 3px solid #7E98DF',
                            borderRadius: '100%',
                            width: '55px',
                            height: '55px',
                            backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}/${receiver.image}')`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                          }}
                        />
                      </div>
                      <p className={Style.receiverChat} style={{ marginLeft: '1rem' }}>
                        {item.message}
                      </p>
                    </div>
                  </div>
                )
              )
            )}
          </div>
          {/* Start chat input field */}
          <div className="d-flex align-items-center w-100" style={{ padding: '30px 50px 30px 50px' }}>
            <div className="d-flex align-items-center" style={{ width: '100%', paddingRight: '20px', backgroundColor: '#FAFAFA', borderRadius: '15px' }}>
              <form
                style={{ width: '100%' }}
                onSubmit={(e) => {
                  onSendMessage(e);
                }}
              >
                <input
                  style={{ border: '3px solid #7E98DF' }}
                  className={Style.chatInput}
                  type="text"
                  placeholder="Mengetik Pesan..."
                  value={message.value}
                  onChange={(e) => {
                    setMessage({ type: 'text', value: e.target.value });
                  }}
                />
                <input type="submit" style={{ display: 'none' }} disabled={!message.value ? true : false} />
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ width: '75%', backgroundColor: '#FAFAFA', color: '#848484' }}>
          <h3>Mulailah Menghubungi Teman anda</h3>
        </div>
      )}
      <NotificationContainer />
    </div>
  );
}
