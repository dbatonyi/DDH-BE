const React = require("react");
const MainLayout = require("./layouts/mainLayout");
const Sidebar = require("./partials/sidebar");

function users(props) {
  const usersData = props.users;
  const page = props.page;

  return (
    <MainLayout title={props.title}>
      <div className="dashboard-container">
        <Sidebar title={props.title} role={props.role} />
        <div className="dashboard-container__main">
          {props.systemMessage ? (
            <div className="system-message">{props.systemMessage}</div>
          ) : null}
          <div className="users-container">
            <table
              className="sortable"
              id="userTable"
              data-size={props.listLength}
            >
              <thead>
                <tr>
                  <th className="order-by">User</th>
                  <th className="sorttable_nosort">Role</th>
                  <th className="sorttable_nosort">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(usersData).map((item, i) => {
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
            <div className="pagination">
              {page && page > 1 ? (
                <div className="pagination--prev">Prev</div>
              ) : null}
              <div className="pagination__container">
                {props.listLength > 1
                  ? [...Array(props.listLength)].map((x, i) => (
                      <div
                        key={i + 1}
                        page-number={i + 1}
                        className="pagination__container--number"
                      >
                        {i + 1}
                      </div>
                    ))
                  : null}
              </div>
              {page < props.listLength ? (
                <div className="pagination--next">Next</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

module.exports = users;
