const React = require('react');
const MainLayout = require('./layouts/mainLayout');
const Sidebar = require('./partials/sidebar');
 
function dashboard(props) {
  return (
    <MainLayout title={props.title}>
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-container__main">
                <h5>{props.username} successfully logged in!</h5>
            </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = dashboard;