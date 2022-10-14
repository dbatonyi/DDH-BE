const React = require('react');
const MainLayout = require('./layouts/mainLayout');
 
function signUp(props) {
  return (
    <MainLayout title={props.title}>
        <div className="signup-background">
            <div className="signup-container">
                <div className="signup-container__title"><h1>Registration</h1></div>
                <form className="signup-container__form" id="signup" name="signup" method="post" action="/signup">
                    <label htmlFor="email">Email Address</label>
                        {props.isEmailError ?
                            <div className="errorinputdiv">
                                <input className="text errmessage" name="email" type="email" />
                                <div className="error">{props.isEmailError}</div>
                            </div>
                            :    
                            <input className="text" name="email" type="email" />
                        }
                    <label htmlFor="firstname">Firstname</label>
                    <input name="firstname" type="text" />
                    <label htmlFor="lastname">Lastname</label>
                    <input name="lastname" type="text" />
                    <label htmlFor="password">Password</label>
                    {props.isPasswordError ?
                        <div className="errorinputdiv">
                            <input className="errmessage" name="password" type="password" />
                            <div className="error">{props.isPasswordError}</div>
                        </div>
                        :    
                        <input name="password" type="password" />
                    }
                    <label htmlFor="repassword">Re-Password</label>
                    {props.isPasswordError ?
                        <div className="errorinputdiv">
                            <input className="errmessage" name="repassword" type="password" />
                        </div>
                        :    
                        <input name="repassword" type="password" />
                    }
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