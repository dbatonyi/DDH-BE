const React = require('react');
const MainLayout = require('./layouts/mainLayout');
 
function signIn(props) {

  return (
    <MainLayout title={props.title}>
        <div className="login-background">
        <div className="login-container">
            <div className="login-container__title"><h1>Login</h1></div>
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
            <form className="login-container__form" id="login" name="signin" method="post" action="login">
                <label htmlFor="email">Email Address</label>
                <input className="text" name="email" type="email" required /> 
                <label htmlFor="password">Password</label>   
                <input name="password" type="password" required />
                <div className="login-container__form--submit-btn">
                    <input className="url-btn" type="submit" value="Sign In" />
                </div>
            </form>
                <div className="login-container__sign-up"><p>New User? <a href="/signup">Create new account!</a></p></div>
            </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = signIn;