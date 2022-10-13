const React = require('react');
const MainLayout = require('./layouts/mainLayout');
const Sidebar = require('./partials/sidebar');
 
function dashboard(props) {
  return (
    <MainLayout title={props.title}>
        <div className="dashboard-container">
            <Sidebar role={props.role} />
            <div className="dashboard-container__main">
              <div className='index-container'>
                <h5>{props.username} successfully logged in!</h5>
              </div>
            </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = dashboard;