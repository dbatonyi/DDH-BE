const React = require('react');
 
function MainLayout(props) {
  return (
    <html>
        <head>
            <title>{props.title}</title>
              <link rel="stylesheet" type="text/css" href="/css/base.css" />
              <link rel="stylesheet" type="text/css" href="/css/dashboard.css" />
              <link rel="stylesheet" type="text/css" href="/css/login.css" />
        </head>
      <body>{props.children}</body>
    </html>
  );
}
 
module.exports = MainLayout;