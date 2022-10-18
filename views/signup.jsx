const React = require('react');
const MainLayout = require('./layouts/mainLayout');
 
function signUp(props) {
  return (
    <MainLayout title={props.title}>
        <div className="signup-background">
            <div className="signup-container">
                <div className="signup-container__title"><h1>Registration</h1></div>
                {props.errMessage ?
                    <div className="error">{props.errMessage}</div>
                    :
                    <></>
                }
                {props.successMessage ?
                    <div className="success">{props.successMessage}</div>
                    :
                    <></>
                }
                <form className="signup-container__form" id="signup" name="signup" method="post" action="/signup">
                    <label htmlFor="email">Email Address</label>
                    <input className={props.errMessage && props.errMessage.includes("email") ? "text errmessage" : "text"} name="email" type="email" />
                    <label htmlFor="firstname">Firstname</label>
                    <input name="firstname" type="text" />
                    <label htmlFor="lastname">Lastname</label>
                    <input name="lastname" type="text" />
                    <label htmlFor="password">Password</label>
                    <input className={props.errMessage && props.errMessage.includes("match") ? "password errmessage" : "password"} name="password" type="password" />
                    <label htmlFor="repassword">Re-Password</label>
                    <input className={props.errMessage && props.errMessage.includes("match") ? "password errmessage" : "password"} name="repassword" type="password" />
                    <div className="signup-container__form--submit-btn">
                        <input className="url-btn" type="submit" value="Sign Up" />
                    </div>
                </form>
            </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = signUp;