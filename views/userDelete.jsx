const React = require("react");
const MainLayout = require("./layouts/mainLayout");
const Sidebar = require("./partials/sidebar");

function userDelete(props) {
  const { uuid, username } = props.user.dataValues;

  return (
    <MainLayout title={props.title}>
      <div className="dashboard-container">
        <Sidebar title={props.title} role={props.role} />
        <div className="dashboard-container__main">
          {props.systemMessage ? (
            <div className="system-message">{props.systemMessage}</div>
          ) : null}
          <div className="user-delete-container">
            <div>Are you sure you want to delete {username} user profile?</div>
            <button>
              <a href="/users">No</a>
            </button>
            <button>
              <a href={`/remove-user/${uuid}`}>Yes</a>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

module.exports = userDelete;
