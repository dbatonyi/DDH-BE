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
                            <div className="error">{props.isEmailError}</div>
                        </div>
                        :
                        <input className="text" name="email" type="email" />   
                    } 
                <label htmlFor="password">Password</label>
                    {props.isPasswordError ?
                        <div className="errorinputdiv">
                            <input className="errmessage" name="password" type="password" />
                            <div className="error">{props.isPasswordError}</div>
                        </div>
                        :
                        <input name="password" type="password" />
                    }
                <div className="login-container__form--submit-btn">
                    <input className="btn" type="submit" value="Sign In" />
                </div>
            </form>
                <div className="login-container__sign-up"><p>New User? <a href="/signup">Create new account!</a></p></div>
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
            </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = signIn;