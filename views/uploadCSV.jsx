const React = require('react');
const MainLayout = require('./layouts/mainLayout');
const Sidebar = require('./partials/sidebar');
 
function importDB(props) {
  return (
    <MainLayout title={props.title}>
        <div className="dashboard-container">
        <Sidebar title={props.title} role={props.role} />
          <div className="dashboard-container__main">
            {props.systemMessage ? <div className='system-message'>{props.systemMessage}</div> : null}
                <div className="dbimport-container">
            <form className="dbimport-edit-container__form" id="importDB" name="importDB" encType="multipart/form-data" method="post" action="/upload-db">
              <input type="radio" id="append" name="importHandle" value="append" required/>
              <label htmlFor="append">Append tasks table</label>
              <input type="radio" id="clear" name="importHandle" value="clear" required/>
              <label htmlFor="clear">Clear table, then import data</label>
                          <label htmlFor="dbfile">Upload CSV:</label>  
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