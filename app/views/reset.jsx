const React = require('react');
const MainLayout = require('./layouts/mainLayout');
 
function reset(props) {
  return (
    <MainLayout title={props.title}>
        <div className="reset-pass-background">
        <div className="reset-pass-container">
            <div className="reset-pass-container__title"><h1>Reset Password</h1></div>
            <form className="reset-pass-container__form" id="reset-pass" name="newpass" method="post" action={`/reset/${props.reghash}`}>
                <label htmlFor="email">New password</label>
                
                <input name="password" type="password" />

                <label htmlFor="email">New password again</label>
                
                <input name="repassword" type="password" />

                <div className="reset-pass-container__form--submit-btn">
                    <input className="btn" type="submit" value="Submit" />
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
 
module.exports = reset;