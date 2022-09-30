const React = require("react");
const MainLayout = require("./layouts/mainLayout");
const Sidebar = require("./partials/sidebar");

function users(props) {
  return (
    <MainLayout title={props.title}>
      <div className="dashboard-container">
        <Sidebar title={props.title} role={props.role} />
        <div className="dashboard-container__main">
          {props.systemMessage ? (
            <div className="system-message">{props.systemMessage}</div>
          ) : null}
          <div className="users-container">
            <table className="sortable" id="userTable">
              <thead>
                <tr>
                  <th className="order-by-desc">User</th>
                  <th className="sorttable_nosort">Role</th>
                  <th className="sorttable_nosort">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(props.users).map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{item[1].dataValues.username}</td>
                      <td>{item[1].dataValues.role}</td>
                      <td>
                        <button>
                          <a href={`/user/role/${item[1].dataValues.id}`}>
                            Role
                          </a>
                        </button>
                        <button>
                          <a href={`/user/delete/${item[1].dataValues.id}`}>
                            Delete
                          </a>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

module.exports = users;
