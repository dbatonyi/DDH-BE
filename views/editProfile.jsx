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
                      <form className="profile-edit-container__form" id="editProfile" name="editProfile" method="post" action="/profile/edit">
                    <label htmlFor="fname">Firstname:</label>
                    <div className='profile-container__firstname'>
                          <input type="text" id="fname" name="fname" placeholder={props.firstname}></input>
                    </div>
                    <label htmlFor="lname">Lastname:</label>
                    <div className='profile-container__lastname'>
                          <input type="text" id="lname" name="lname" placeholder={props.lastname}></input>
                    </div>
                    <label htmlFor="userEmail">Email:</label>
                    <div className='profile-container__email'>
                          <input type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" id="email" name="userEmail" placeholder={props.email}></input>
                          </div>
                          <div className='profile-container__password'>
                          <input type="password" id="password" name="password" required></input>
                          </div>
                          <div className="profile-container__form--submit-btn">
                    <input className="btn" type="submit" value="Save" />
                </div>
                    </form>
              </div>
          </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = profile;