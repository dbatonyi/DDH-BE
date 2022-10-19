const React = require("react");
const MainLayout = require("./layouts/mainLayout");
const Sidebar = require("./partials/sidebar");

function userDelete(props) {
  const { uuid, username } = props.user.dataValues;

  return (
    <MainLayout title={props.title}>
      <div className="dashboard-container">
        <Sidebar path="users" title={props.title} role={props.role} />
        <div className="dashboard-container__main">
          <div className="user-delete-container">
            <p>Are you sure you want to delete <strong>{username}</strong> user profile?</p>
            <div>
              <a className="url-btn" href="/users">No</a>
            </div>
            <div>
              <a className="url-btn del-btn" href={`/remove-user/${uuid}`}>Yes</a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

module.exports = userDelete;
