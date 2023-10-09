import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-3">
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
      </div>
    </div>
  );
}

export default Home;
