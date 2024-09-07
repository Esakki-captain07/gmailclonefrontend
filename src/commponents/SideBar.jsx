import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

function SideBar({ isOpen, onComposeClick }) {
  return (
    <div className={`gmail-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className='toggle-button'>
        <i className="bi bi-border-width h3"></i>
      </button>
      <ul>
        <li>
          <Button variant="dark" onClick={onComposeClick}>
            <i className="bi bi-pencil"></i>
            {isOpen && <span>Compose</span>}
          </Button>
        </li>
        <li>
          <Link to={'/inbox'}>
            <i className="bi bi-inbox-fill"></i>
            {isOpen && <span>Inbox</span>}
          </Link>
        </li>
        <li>
          <Link to={'/star'}>
          <i className="bi bi-star"></i>
          {isOpen && <span>Starred</span>}
          </Link>
        </li>
        <li>
          <Link to={'/sent'}>
            <i className="bi bi-send"></i>
            {isOpen && <span>Sent</span>}
          </Link>
        </li>
        <li>
          <Link to={'/draft'}>
          <i className="bi bi-envelope"></i>
          {isOpen && <span>Drafts</span>}
          </Link>
        </li>
        <li>
          <Link to={'/trash'}>
          <i className="bi bi-trash"></i>
          {isOpen && <span>Trash</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
