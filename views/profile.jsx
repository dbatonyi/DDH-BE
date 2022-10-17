const React = require('react');
const MainLayout = require('./layouts/mainLayout');
const Sidebar = require('./partials/sidebar');
 
function profile(props) {
  return (
    <MainLayout title={props.title}>
        <div className="dashboard-container">
        <Sidebar path="profile" role={props.role} />
          <div className="dashboard-container__main">
            {props.systemMessage ? <div className='system-message'>{props.systemMessage}</div> : null}
              <div className="profile-container">
                    <h1>{props.title}</h1>
                    <div className='profile-container__item profile-container__firstname'>
                    <label>Firstname:</label>
                      <p>{props.firstname}</p>
                    </div>
                    <div className='profile-container__item profile-container__lastname'>
                    <label>Lastname:</label>
                      <p>{props.lastname}</p>
                    </div>
                    <div className='profile-container__item profile-container__email'>
                    <label>Email:</label>
                      <p>{props.email}</p>
                    </div>
                    <div className='profile-container__item profile-container__permission'>
                    <label>Role:</label>
                      <p>{props.role}</p>
                    </div>
            <a className='url-btn' href='/profile/edit'>Edit profile</a>
            <a className='url-btn' href='/profile/reset-password'>New password</a>
              </div>
          </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = profile;