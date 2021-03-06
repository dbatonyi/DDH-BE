const React = require('react');
 
const Sidebar = () => (
    <div className="dashboard-container__sidebar">
        <h2>Dashboard</h2>
        <div className="dashboard-menu">
            <ul className="menu">
                <li className="menu-item"><a href="/profile">Profile</a></li>
                <li className="menu-item"><a href="/logout">Logout</a></li>
            </ul>
        </div>
    </div>
);
 
module.exports = Sidebar;