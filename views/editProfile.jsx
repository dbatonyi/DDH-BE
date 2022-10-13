const React = require("react");
const MainLayout = require("./layouts/mainLayout");
const Sidebar = require("./partials/sidebar");

function editProfile(props) {
  return (
    <MainLayout title={props.title}>
      <div className="dashboard-container">
        <Sidebar role={props.role} />
        <div className="dashboard-container__main">
          {props.systemMessage ? (
            <div className="system-message">{props.systemMessage}</div>
          ) : null}
          <div className="profile-container">
          <h1>{props.title}</h1>
            <form
              className="profile-edit-container__form"
              id="editProfile"
              name="editProfile"
              method="post"
              action="/profile/edit"
            >
              <div className="profile-container__item profile-container__firstname">
              <label htmlFor="fname">Firstname:</label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  placeholder={props.firstname}
                ></input>
              </div>
              <div className="profile-container__item profile-container__lastname">
              <label htmlFor="lname">Lastname:</label>
                <input
                  type="text"
                  id="lname"
                  name="lname"
                  placeholder={props.lastname}
                ></input>
              </div>
              <div className="profile-container__item profile-container__email">
              <label htmlFor="userEmail">Email:</label>
                <input
                  type="email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                  id="email"
                  name="userEmail"
                  placeholder={props.email}
                ></input>
              </div>
              <div className="profile-container__item profile-container__password">
              <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                ></input>
              </div>
              <div className="profile-container__form--back-btn">
                <a className='url-btn' href="/profile">Back</a>
              </div>
              <div className="profile-container__form--submit-btn">
                <input className=" url-btn" type="submit" value="Save" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

module.exports = editProfile;
