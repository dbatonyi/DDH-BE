const React = require('react');
const MainLayout = require('./layouts/mainLayout');
const Sidebar = require('./partials/sidebar');
 
function settings(props) {
  return (
    <MainLayout title={props.title}>
        <div className="dashboard-container">
        <Sidebar path="settings" role={props.role} />
          <div className="dashboard-container__main">
            {props.systemMessage && props.systemMessage[0] ? <div className='system-message'>{props.systemMessage}</div> : null}
              <div className="settings-container">
              <h1>{props.title}</h1>
              <div className="settings-container__item settings-container__export">
                    <label>Export database</label>
            <a className="url-btn" href='/export-database'>Export tasks table</a>
            </div>
            <div className="settings-container__item settings-container__import">
                <label>Import database</label>
                <a className="url-btn" href='/upload-db'>Import tasks table</a>
            </div>
            
              </div>
          </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = settings;