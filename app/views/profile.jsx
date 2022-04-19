const React = require('react');
const MainLayout = require('./layouts/mainLayout');
const Header = require('./partials/header');
 
function profile(props) {
  return (
    <MainLayout title={props.title}>
        <div className="dashboard-container">
            <div className="dashboard-container__sidebar">
                <h2>Profile</h2>
                <Header />
            </div>
            <div className="dashboard-container__main">
                <h5>{props.username} successfully logged in!</h5>
            </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = profile;