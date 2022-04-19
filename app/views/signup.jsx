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
                                <div className="error">{props.errmessage}</div>
                            </div>
                            :    
                            <input className="text" name="email" type="email" />
                        }
                    <label htmlFor="firstname">Firstname</label>
                    <input name="firstname" type="text" />
                    <label htmlFor="lastname">Lastname</label>
                    <input name="lastname" type="text" />
                    <label htmlFor="password">Password</label>
                    <input name="password" type="password" />
                    <div className="signup-container__form--submit-btn">
                        <input className="btn" type="submit" value="Sign Up" />
                    </div>
                </form>
            </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = signUp;