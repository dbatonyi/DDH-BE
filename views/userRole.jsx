const React = require("react");
const MainLayout = require("./layouts/mainLayout");
const Sidebar = require("./partials/sidebar");

function userRole(props) {
  const { id, username, role } = props.user.dataValues;
  const currentUserRole = props.role;

  return (
    <MainLayout title={props.title}>
      <div className="dashboard-container">
        <Sidebar title={props.title} role={props.role} />
        <div className="dashboard-container__main">
          {props.systemMessage ? (
            <div className="system-message">{props.systemMessage}</div>
          ) : null}
          <div className="user-role-container">
            <div>
              {username} current permission: {role}
            </div>
            <div>Change permission</div>
            <form
              className="user-role-container__form"
              id="userRole"
              name="userRole"
              method="post"
              action={`/user/edit-role/${id}`}
            >
              <label htmlFor="newRole">Choose permission:</label>
              <select name="newRole" id="newRole" defaultValue="" required>
                <option value="" disabled>
                  Choose option
                </option>
                {currentUserRole === "Admin" ? (
                  <option value="Admin">Admin</option>
                ) : (
                  ""
                )}
                <option value="Developer">Developer</option>
                <option value="Editor">Editor</option>
                <option value="User">User</option>
              </select>
              <div className="user-role-container__form--back-btn">
                <a href="/users">Back</a>
              </div>
              <div className="user-role-container__form--submit-btn">
                <input className="btn" type="submit" value="Save" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

module.exports = userRole;
