const React = require('react');
const MainLayout = require('./layouts/mainLayout');
const Sidebar = require('./partials/sidebar');
 
function profile(props) {
  return (
    <MainLayout title={props.title}>
        <div className="dashboard-container">
        <Sidebar />
          <div className="dashboard-container__main">
            {props.systemMessage ? <div className='system-message'>{props.systemMessage}</div> : null}
              <div className="profile-container">
                    <label>Firstname:</label>
                    <div className='profile-container__firstname'>
                      <p>{props.firstname}</p>
                    </div>
                    <label>Lastname:</label>
                    <div className='profile-container__lastname'>
                      <p>{props.lastname}</p>
                    </div>
                    <label>Email:</label>
                    <div className='profile-container__email'>
                      <p>{props.email}</p>
                    </div>
                    <label>Role:</label>
                    <div className='profile-container__permission'>
                      <p>{props.role}</p>
                    </div>
                    <a href='/export-database'>Export tasks table (WIP)</a>
              </div>
          </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = profile;