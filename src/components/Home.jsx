import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { fetchData } from '../API/api';
import { useNavigate } from 'react-router-dom';

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
    if (!localStorage.getItem('v1:currentToken')) {
      getToken(messaging, { vapidKey: 'BBkht21cIywqjb8nZCW5-5DPJMEoLGMgUga9E4OzokZV1vgDX8LfutZg80wnvNM_oEdXxBRXFYFHFijACSwhWNU' }).then((currentToken) => {
        if (currentToken && JSON.parse(localStorage.getItem('v1:userInfo')).name) {
          console.log(currentToken);
          let payload = '&user=' + JSON.parse(localStorage.getItem('v1:userInfo')).name + '&key=' + currentToken;
          fetchData('writeKey', payload)
            .then((data) => {
              localStorage.setItem('v1:currentToken', currentToken)
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
    <div className="container mt-3">
      AUTH GUARD ENBLED
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Create New Split</h5>
              <p className="card-text">Split expenses equally among friends.</p>
              <Link to="/new-split" className="btn btn-primary">Go to New Split</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 pt-2">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">View History</h5>
              <p className="card-text">View your expense history.</p>
              <Link to="/view-history" className="btn btn-primary">Go to View History</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 pt-2">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">View Summary</h5>
              <p className="card-text">View a summary of your expenses.</p>
              <Link to="/summary" className="btn btn-primary">Go to Summary</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 pt-2">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">discuss</h5>
              <p className="card-text">View a discuss of your team.</p>
              <Link to="/chat" className="btn btn-primary">Go to discuss</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 pt-2">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Unpublished Splits</h5>
              <p className="card-text">Publish Unpublished Split</p>
              <Link to="/unpublished" className="btn btn-primary">Go to Unpublished Splits</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
