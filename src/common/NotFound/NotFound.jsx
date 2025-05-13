import React from "react";
import './NotFound.css';
import { Link } from "react-router-dom";
import error from '../../assets/images/comman/404.svg';

const NotFound = () => {
  return (
    <>
      <div className="not-found">
        <img src={error} alt="404" loading="lazy" className="img-fluid" width="300px" />
        <h5>OOPS! Something Went Wrong.</h5>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link to="/" className="home-btn">
          <button>
            Back Home
          </button>
        </Link>
      </div>
    </>
  );
};

export default NotFound;
