const React = require('react');
 
const Sidebar = (props) => (
        <div className="dashboard-container__sidebar">
        <h2>{props.title}</h2>
            <div className="dashboard-menu">
                <ul className="menu">
                <li className="menu-item"><a href="/profile">Profile</a></li>
                <li className="menu-item"><a href="/users">Users</a></li>
                {props.role === "Admin" ? <li className="menu-item"><a href="/settings">Settings</a></li> : <></>}
                    
                    <li className="menu-item"><a href="/logout">Logout</a></li>
                </ul>
            </div>
        </div>
    );
 
module.exports = Sidebar;