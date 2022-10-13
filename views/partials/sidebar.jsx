const React = require('react');
 
const Sidebar = (props) => (
        <div className="dashboard-container__sidebar">
        <h2>DDH Dashboard</h2>
            <div className="dashboard-menu">
                <ul className="menu">
                <li className="menu-item"><a href="/profile">Profile</a><div className='decor-line'></div></li>
                <li className="menu-item"><a href="/users">Users</a><div className='decor-line'></div></li>
                {props.role === "Admin" ? <li className="menu-item"><a href="/settings">Settings</a><div className='decor-line'></div></li> : <></>}
                    
                    <li className="menu-item"><a href="/logout">Logout</a><div className='decor-line'></div></li>
                </ul>
            </div>
        </div>
    );
 
module.exports = Sidebar;