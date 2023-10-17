import { React, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes

import Home from './components/Home';
import NewSplit from './components/NewSplit';
import ViewHistory from './components/ViewHistory';
import Summary from './components/Summary';
import Login from './components/Login';
import ChatComponent from './components/Chat';
import PublishSplits from './components/Unpublised';
import { ToastContainer, toast } from 'react-toastify';


function App() {

  const [showInstallButton, setShowInstallButton] = useState(false);
  const [promtEvent, setPromoteEvent] = useState(false);


  useEffect(() => {
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted");
        }
      });
    }
  }, []);


  const handleInstallPrompt = (event) => {
    setPromoteEvent(event);
    event.preventDefault();
    setShowInstallButton(true);
  };

  const handleInstallClick = async () => {
    console.log('here');
    const promptEvent = promtEvent;
    if (promptEvent) {
      await promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowInstallButton(false);
      }
    }
  };


  // useEffect(() => {
  //   setTimeout(() => {
  //     if (document.getElementsByTagName('vercel-live-feedback').length) {
  //       document.getElementsByTagName('vercel-live-feedback')[0].style.display = 'none'
  //     }
  //   }, 2000)
  // }, [])

  return (
    <>
      {showInstallButton && (
        <div class="fixed-top d-flex align-items-center justify-content-center" style={{ height: '100vh', width: '100vw', backgroundColor: 'rgb(27 14 129 / 90%)' }}>
          <button className='btn btn-outline-info rounded-pill p-3' style={{ fontSize: '1.2rem', fontWeight: 'bold', border: '2px solid #fff', color: '#fff' }} onClick={handleInstallClick}>
            <span>Install App</span>
          </button>
        </div>
      )}
      <Router>
        {/* Use Routes as the parent element */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Use "element" prop */}
          <Route path="/new-split" element={<NewSplit />} />
          <Route path="/view-history" element={<ViewHistory />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<ChatComponent />} />
          <Route path='/unpublished' element={<PublishSplits />} />
          {/* Add more routes if needed */}
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
