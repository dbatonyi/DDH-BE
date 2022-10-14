const React = require('react');
const MainLayout = require('./layouts/mainLayout');
const Sidebar = require('./partials/sidebar');
 
function resetPass(props) {
  return (
    <MainLayout title={props.title}>
        <div className="dashboard-container">
        <Sidebar role={props.role} />
          <div className="dashboard-container__main">
            {props.systemMessage ? <div className='system-message'>{props.systemMessage}</div> : null}
                <div className="profile-container">
                <h1>{props.title}</h1>
                      <form className="profile-edit-container__form" id="resetPass" name="resetPass" method="post" action="/profile/reset-password">     
                    <div className='profile-container__item  profile-container__current-new-password'>
                    <label htmlFor="newPassword">New password:</label>
                        <input type="password" id="password" name="newPassword" required></input>
                          </div>      
                    <div className='profile-container__item  profile-container__current-re-password'>
                    <label htmlFor="reNewPassword">New password again:</label>
                        <input type="password" id="reNewPassword" name="reNewPassword" required></input>
                          </div>     
                    <div className='profile-container__item  profile-container__current-password'>
                    <label htmlFor="currPassword">Current password:</label>
                        <input type="password" id="currPassword" name="currPassword" required></input>
                    </div>
                    <div className="profile-container__form--back-btn">
                        <a className='url-btn' href="/profile">Back</a>
                    </div>
                    <div className="profile-container__form--submit-btn">
                    <input className="url-btn" type="submit" value="Save" />
                </div>
                    </form>
              </div>
          </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = resetPass;