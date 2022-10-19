const React = require("react");
const MainLayout = require("./layouts/mainLayout");
const Sidebar = require("./partials/sidebar");

function users(props) {
  const usersData = props.users;
  const page = props.page;
  const listLength = Math.ceil(props.listLength);

  return (
    <MainLayout title={props.title}>
      <div className="dashboard-container">
        <Sidebar path="users" role={props.role} />
        <div className="dashboard-container__main">
          {props.systemMessage && props.systemMessage[0] ? (
            <div className="system-message">{props.systemMessage}</div>
          ) : null}
          <div className="users-container">
          <h1>{props.title}</h1>
            <table
              className="users-table"
              id="userTable"
              data-size={listLength}
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
                      <td className="table-actions">
                          <a className="table-btn" href={`/user/role/${item[1].dataValues.id}`}>
                            Role
                          </a>
                          <a className="table-btn" href={`/user/delete/${item[1].dataValues.id}`}>
                            Delete
                          </a>
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
                {listLength > 1 ? (
                  [...Array(listLength)].map((x, i) => (
                    <div
                      key={i + 1}
                      page-number={i + 1}
                      className="pagination__container--number"
                    >
                      {i + 1}
                    </div>
                  ))
                ) : (
                  <div
                    key={1}
                    page-number={1}
                    className="pagination__container--number--disabled pag-active"
                  >
                    1
                  </div>
                )}
              </div>
              {page < listLength ? (
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
