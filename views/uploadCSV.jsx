const React = require('react');
const MainLayout = require('./layouts/mainLayout');
const Sidebar = require('./partials/sidebar');
 
function importDB(props) {
  return (
    <MainLayout title={props.title}>
        <div className="dashboard-container">
        <Sidebar path="settings" role={props.role} />
          <div className="dashboard-container__main">
            {props.systemMessage ? <div className='system-message'>{props.systemMessage}</div> : null}
                <div className="settings-container">
                <h1>{props.title}</h1>
            <form className="settings-container__form" id="importDB" name="importDB" encType="multipart/form-data" method="post" action="/upload-db">
              <div className="settings-container__item settings-container__radio">
                <input type="radio" id="append" name="importHandle" value="append" required/>
                <label htmlFor="append">Append tasks table</label>
                <input type="radio" id="clear" name="importHandle" value="clear" required/>
                <label htmlFor="clear">Clear table, then import data</label>
              </div>
              <div className="settings-container__item settings-container__upload">
                <label htmlFor="dbfile">Upload CSV:</label>  
                <input type="file" name="dbfile" required/> 
              </div>
              <div className="settings-container__form--back-btn">
                <a className='url-btn' href="/settings">Back</a>
              </div>    
              <div className="settings-container__form--submit-btn">
                <input className="url-btn" type="submit" value="Upload" />
              </div>
                    </form>
              </div>
          </div>
        </div>
    </MainLayout>
  );
}
 
module.exports = importDB;