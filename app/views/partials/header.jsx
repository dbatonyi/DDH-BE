const React = require('react');
 
const Header = () => (
    <div className="dashboard-menu">
        <ul className="menu">
            <li className="menu-item"><a href="/profile">Profile</a></li>
            <li className="menu-item"><a href="/logout">Logout</a></li>
        </ul>
    </div>
);
 
module.exports = Header;