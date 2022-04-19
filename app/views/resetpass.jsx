const React = require('react');
const MainLayout = require('./layouts/mainLayout');
 
function resetPass(props) {
  return (
    <MainLayout title={props.title}>
        <div className="reset-pass-background">
        <div className="reset-pass-container">
            <div className="reset-pass-container__title"><h1>Reset Password</h1></div>
            <form className="reset-pass-container__form" id="reset-pass" name="reset-pass" method="post" action="reset-pass">
                <label htmlFor="email">Email Address</label>
                
                <input className="text" name="email" type="email" />

                <div className="reset-pass-container__form--submit-btn">
                    <input className="btn" type="submit" value="Reset password" />
                </div>
            </form>
                {props.isPasswordReset ?
                    <div className="error">{props.resetmessage}</div>
                    :
                    <></>
                }
            </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = resetPass;