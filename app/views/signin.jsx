const React = require('react');
const MainLayout = require('./layouts/mainLayout');
 
function signIn(props) {
  return (
    <MainLayout title={props.title}>
      <div className="login-background">
        <div className="login-container">
            <div className="login-container__title"><h1>Login</h1></div>
            <form className="login-container__form" id="login" name="signin" method="post" action="login">
                <label htmlFor="email">Email Address</label>
                    {props.isEmailError ?
                        <div className="errorinputdiv">
                            <input className="text errmessage" name="email" type="email" />
                            <div className="error">{props.errmessage}</div>
                        </div>
                        :
                        <input className="text" name="email" type="email" />   
                    } 
                <label htmlFor="password">Password</label>
                    {props.isPasswordError ?
                        <div className="errorinputdiv">
                            <input className="errmessage" name="password" type="password" />
                            <div className="error">{props.errmessage}</div>
                        </div>
                        :
                        <input name="password" type="password" />
                    }
                <div className="login-container__form--submit-btn">
                    <input className="btn" type="submit" value="Sign In" />
                </div>
            </form>
            <div className="login-container__sign-up"><p>New User? <a href="/signup">Create new account!</a></p></div>
            <div className="login-container__reset-pass"><a href="/reset-pass">Reset password!</a></div>
            </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = signIn;