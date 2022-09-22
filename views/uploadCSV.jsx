const React = require('react');
const MainLayout = require('./layouts/mainLayout');
const Sidebar = require('./partials/sidebar');
 
function importDB(props) {
  return (
    <MainLayout title={props.title}>
        <div className="dashboard-container">
        <Sidebar />
          <div className="dashboard-container__main">
            {props.systemMessage ? <div className='system-message'>{props.systemMessage}</div> : null}
                <div className="dbimport-container">
                      <form className="dbimport-edit-container__form" id="importDB" name="importDB" encType="multipart/form-data" method="post" action="/upload-db">
                          <span>Upload CSV:</span>  
                        <input type="file" name="dbfile" required/> 
                    <div className="dbimport-container__form--submit-btn">
                    <input className="btn" type="submit" value="Upload" />
                </div>
                    </form>
              </div>
          </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = importDB;