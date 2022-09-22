const React = require('react');
const MainLayout = require('./layouts/mainLayout');
const Sidebar = require('./partials/sidebar');
 
function resetPass(props) {
  return (
    <MainLayout title={props.title}>
        <div className="dashboard-container">
        <Sidebar />
          <div className="dashboard-container__main">
            {props.systemMessage ? <div className='system-message'>{props.systemMessage}</div> : null}
                <div className="profile-container">
                      <form className="profile-edit-container__form" id="resetPass" name="resetPass" method="post" action="/profile/reset-password">
                          <label htmlFor="newPassword">New password</label>
                    <div className='profile-container__current-new-password'>
                        <input type="password" id="password" name="newPassword" required></input>
                          </div>
                          <label htmlFor="reNewPassword">New password again</label>
                    <div className='profile-container__current-re-password'>
                        <input type="password" id="reNewPassword" name="reNewPassword" required></input>
                          </div>
                          <label htmlFor="currPassword">Current password</label>
                    <div className='profile-container__current-password'>
                        <input type="password" id="currPassword" name="currPassword" required></input>
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
 
module.exports = resetPass;