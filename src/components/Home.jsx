import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { fetchData } from '../API/api';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill, faHistory, faChartPie, faComments, faList, faUser } from '@fortawesome/free-solid-svg-icons';
import Updates from './Updates';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyB6c1DCp7f_f-ufTLflyWvqayFfYc4Id-I",
      authDomain: "billsplitter-537ad.firebaseapp.com",
      projectId: "billsplitter-537ad",
      storageBucket: "billsplitter-537ad.appspot.com",
      messagingSenderId: "651821715309",
      appId: "1:651821715309:web:bea27585037af4819f1464",
      measurementId: "G-1X6M6RPVEB"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const messaging = getMessaging();
    if (!localStorage.getItem('v2:currentToken')) {
      getToken(messaging, { vapidKey: 'BBkht21cIywqjb8nZCW5-5DPJMEoLGMgUga9E4OzokZV1vgDX8LfutZg80wnvNM_oEdXxBRXFYFHFijACSwhWNU' }).then((currentToken) => {
        if (currentToken && JSON.parse(localStorage.getItem('v1:userInfo')).name) {
          console.log(currentToken);
          let payload = '&user=' + JSON.parse(localStorage.getItem('v1:userInfo')).name + '&key=' + currentToken;
          fetchData('writeKey', payload)
            .then((data) => {
              localStorage.setItem('v2:currentToken', currentToken)
            })
            .catch((error) => {
              console.error('Error :', error);
            });
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });
      onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        showNotification(payload)
      });
    }
  }, [])


  // Array containing options for each card in the grid
  const options = [
    { title: 'Create New Split', link: '/new-split', icon: faMoneyBill },
    { title: 'View History', link: '/view-history', icon: faHistory },
    { title: 'View Summary', link: '/summary', icon: faChartPie },
    { title: 'Discuss', link: '/chat', icon: faComments },
    { title: 'Unpublished Splits', link: '/unpublished', icon: faList },
    { title: 'Switch User', action: () => { localStorage.removeItem('v1:userInfo'); navigate('/login') }, icon: faUser },
  ];

  // Function to show notifications
  function showNotification(title, options) {
    if (Notification.permission === "granted") {
      const notification = new Notification(title, options);

      notification.addEventListener("click", () => {
        if (title.startsWith("New Split:")) {
          navigate('/view-history');
        } else {
          navigate('/chat');
        }
        notification.close();
      });
    }
  }


  return (
    <div className="container home-container mt-3">
      <div className="row">
        {options.map((option, index) => (
          <div onClick={option.action} key={index} className="col-sm-12 col-6 col-md-4 col-lg-2 mb-3">
            <Link to={option.link} className="text-decoration-none">
              <div className="card card-1 p-3 text-center shadow">
                <FontAwesomeIcon icon={option.icon} size="4x" className="mb-3" />
              </div>
              <p className="text-center mt-2">{option.title}</p>
            </Link>
          </div>
        ))}
        <div className="col-12">
          <Updates></Updates>
        </div>
      </div>
    </div>
  );
}

export default Home;
