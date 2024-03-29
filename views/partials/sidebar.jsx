const React = require('react');
 
const Sidebar = (props) => (
        <div className="dashboard-container__sidebar">
            <a className='home-btn' href='/dashboard'><h2>DDH Dashboard</h2></a>
            <div className="dashboard-menu">
                <ul className="menu">
                <li className={props.path === "profile" ? "menu-item active-link" : "menu-item"}><a href="/profile">Profile</a><div className='decor-line'></div></li>
                {["Admin", "Developer"].includes(props.role) ?
                    <li className={props.path === "users" ? "menu-item active-link" : "menu-item"}><a href="/users">Users</a><div className='decor-line'></div></li>
                    :
                    <></>
                }   
                {props.role === "Admin" ? <li className={props.path === "settings" ? "menu-item active-link" : "menu-item"}><a href="/settings">Settings</a><div className='decor-line'></div></li> : <></>}
                    
                    <li className="menu-item"><a href="/logout">Logout</a><div className='decor-line'></div></li>
                </ul>
            </div>
        </div>
    );
 
module.exports = Sidebar;