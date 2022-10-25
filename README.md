# Drupal Development Helper - BE (DDH) Documentation

**Author:** dbatonyi

**Stack:** Node.js

**Main modules:** Sequlize (ORM), Express/Axios (API), Passport/bcrypt-nodejs/JWT (Authentication), Multer (File handleing), Nodemailer (Email handleing)

## Short description:

The Drupal Development Helper (DDH) was made for help Drupal CMS based projects. The main goal was to help project managers and developers to create Drupal sites more efficiently.
The application has separeta backend and frontend.

Backend made in Node.js, the ORM was Sequlize and the authentication based on Passport with JWT.
DDH BE handle authentication, emails, user roles and task table import/export.

**Frontend github link:** https://github.com/dbatonyi/DDH-FE

## Setup:

Before starting the backend, you need to create two configuration files based on the examples.

First create the **/config/config.json** file, sequelize needs this file to set up the database.
Next, create an **app-config.json** file in the root of the project that contains the variables needed to run the app and the administrator credentials.

> When DDH BE first runs, it checks the Users table and, if it is empty,
> creates an admin user based on the adminCredentials specified in the
> app-config.json file. The DDH Task Manager form endpoint automatically
> creates the table and column in Trello with a given checklist.

> DDH uses Trello as a task manager, so you need to register an account
> in Trello, then create an API key and an API token that you declare in
> the app-config.json file.

To start, run the following command:

    npm run start

Scss conversion can be achieved with the following code:

    npm run build-css

## Backend functions:

- User registration
- User profile modification
- List Users
- Change users roles
- Delete users
- Export task table from database as csv
- Import task table from csv (Append exist table / Clear the table then
  import)
- Delete 90 days older inactive accounts on start
- Create Admin user if the Users table empty on start based on config

## API endpoints:

In order to be able to access the endpoints, a **bearer token** is required, which must be specified in config-app.json, which will also appear on the **/settings** page.

| Endpoint name                       | Endpoint url                           | Endpoint url                          | Endpoint url |
| ----------------------------------- | -------------------------------------- | ------------------------------------- | ------------ |
| **Authenticate user**               | /api/login                             | /api/logout                           | /api/user    |
| **Register user**                   | /api/register                          |                                       |              |
| **Reset user password**             | /api/password/new                      | /api/password/reset/:id **{reghash}** |              |
| **Activate user account**           | /api/account-confirm/:id **{reghash}** |                                       |              |
| **Task list**                       | /api/task/list                         |                                       |              |
| **Single task**                     | /api/task/:id **{id}**                 |                                       |              |
| **Add task**                        | /api/task/new                          |                                       |              |
| **Edit task**                       | /api/task/edit/:id **{id}**            |                                       |              |
| **Delete task**                     | /api/task/:id **{uuid}**               |                                       |              |
| **Post form via Task Manager Form** | /tmf-form                              |                                       |

## Task Manager Form (TMF) endpoint valide input list:

- title,
- devUrl,
- devSsh,
- dUpdate,
- ourServer,
- oldUrl,
- dVersion,
- migration,
- packages,
- webshop,
- moreLanguage,
- otherLanguage,
- paymentMethod,
- paymentMethodOther,
- currency,
- currencyOther,
- customWebshop,
- customerRegistration,
- uniqueProductVariation,
- upvAdditional,
- invoiceSystem,
- stockManagement,
- stockUpdate,
- additionalCurrencies,
- additionalCurrenciesOther,
- additionalVat,
- additionalVatOther,
- couponSystem,
- productFilters,
- additionalFilters,
- productPages,
- webshopFeatures,
- extraElements,
- extraElementsOther,
- flexibleLayout,
- uniqueDesign,
- uniqueDesignUrl,
- uniqueEmail,
- extraFeatures,
