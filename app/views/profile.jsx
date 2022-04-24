const React = require('react');
const MainLayout = require('./layouts/mainLayout');
const Sidebar = require('./partials/sidebar');
 
function profile(props) {
  return (
    <MainLayout title={props.title}>
        <div className="dashboard-container">
        <Sidebar />
          <div className="dashboard-container__main">
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
                    <label>Permission level:</label>
                    <div className='profile-container__permission'>
                      <p>{props.permissionlevel}</p>
                    </div>
              </div>
          </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = profile;