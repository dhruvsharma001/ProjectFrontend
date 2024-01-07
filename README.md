## Quick start

    The frontend is built using React, incorporating Redux for state management and React Router for navigation. It uses the react-router-dom library for routing. Routes are defined for different layouts such as AdminLayout and AuthLayout. The application state is managed using Redux. The <Provider> component wraps the entire application, providing access to the Redux store. The application uses various styles and themes, including Bootstrap, and custom styles from SCSS files. Redux Thunk middleware is used to handle asynchronous actions. In development mode, Redux Logger middleware is added for logging actions and state changes. The Redux store is created by combining reducers and applying middleware. It follows a modular structure with different layouts for admin and authentication pages.  Authentication is handled using JWT tokens, and the application incorporates Bootstrap styles and custom themes for a polished user interface. The higher-order component withAuth ensures that authenticated users can access protected routes. This is a higher-order component (HOC) for handling authentication:
    Authentication Check: The authCheck method verifies the validity of the authentication token stored in localStorage.
    Expiration Check: The checkExpiry method checks if the authentication token has expired using jwt-decode. If expired, the user is redirected to the login page.
    Redux Integration: The component is connected to the Redux store to access user-related actions and state.
    Frontend uses reducer for specifying how the application's state changes in response to different actions( It takes the current state and an action as input and returns the new state. ) Actions are payloads of information that send data from the application to the store. They are the only source of information for the store. Actions are plain JavaScript objects and must have a type property indicating the type of action to be performed. Action creators, actions are created and dispatched to the Redux store. The actual logic for API calls, side effects, etc., is handled in asynchronous action creators using middleware Redux Thunk. These actions and the corresponding reducer are part of a larger Redux state management system. They facilitate the communication between different parts of the application and the state changes in response to various events. These action creators are dispatched when certain events occur in the application (e.g., user signs in, signs out, or when order data needs to be updated). The dispatched actions are then processed by the reducer to update the Redux store accordingly. 

    There are components that serves as the front-end for managing orders, customers, products and expenses in a dashboard-like interface. They interacts with the server to perform CRUD operations on respective data. The user experience is tailored based on the role, with administrators having more control over some modules and components as compared to regular employees. The use of various libraries and components enhances the user interface and provides a seamless experience for managing data.

## Documentation


## File Structure

Within the download you'll find the following directories and files:

```
.
├── README.md
├── ISSUE_TEMPLATE.md
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    ├── actions    
    ├── index.js
    ├── routes.js
    ├── siteDetails.js
    ├── assets
    │   ├── css
    │   │   ├── argon-dashboard-pro-react.css
    │   │   ├── argon-dashboard-pro-react.css.map
    │   │   └── argon-dashboard-pro-react.min.css
    │   ├── fonts
    │   │   └── nucleo
    │   ├── img
    │   │   ├── brand
    │   │   ├── icons
    │   │   │   ├── cards
    │   │   │   ├── common
    │   │   │   └── flags
    │   │   └── theme
    │   ├── scss
    │   │   ├── argon-dashboard-pro-react.scss
    │   │   ├── bootstrap
    │   │   ├── core
    │   │   ├── custom
    │   │   └── react
    │   └── vendor
    │       ├── @fortawesome
    │       │   └── fontawesome-free
    │       ├── animate.css
    │       ├── fullcalendar
    │       │   └── dist
    │       ├── nucleo
    │       ├── quill
    │       │   └── dist
    │       ├── select2
    │       │   └── dist
    │       └── sweetalert2
    │           └── dist
    ├── variables
    │   ├── charts.jsx
    │   └── general.jsx
    ├── layouts
    │   ├── Admin.jsx
    │   └── Auth.jsx
    ├── reducers
    │   ├── index.jsx
    │   └── product_reducer.js   
    │   └── user_reducer.js
    ├── actions
    │   ├── customer_actions.js
    │   └── expense_actions.js   
    │   └── order_actions.js 
    │   └── user_actions.js    
    │   └── product_actions.js                       
    ├── types
    │   └── app.jsx 
    ├── config
    │   └── configureStore.js.  
    ├── components
    │   ├── Footers
    │   │   ├── AdminFooter.jsx
    │   │   └── AuthFooter.jsx
    │   ├── Headers
    │   │   ├── AlternativeHeader.jsx
    │   │   ├── AuthHeader.jsx
    │   │   ├── CardsHeader.jsx
    │   │   ├── IndexHeader.jsx
    │   │   ├── ProfileHeader.jsx
    │   │   └── SimpleHeader.jsx
    │   ├── Navbars
    │   │   ├── AdminNavbar.jsx
    │   │   ├── AuthNavbar.jsx
    │   │   └── IndexNavbar.jsx
    │   └── Sidebar
    │       └── Sidebar.jsx
    └── views
        ├── Index.jsx
        └── pages
            ├── Calendar.js
            ├── Customers.js
            ├── Expenses.js
            ├── ExpensesLogs.js
            ├── Inventory.js
            ├── InventoryUpdates.js
            ├── InventoryUpdateProduct.js
            ├── Logs.js
            ├── OrderDeliveryStatus.js
            ├── OrderLogs.js
            ├── Orders.js
            ├── Products.js
            ├── Revenue.js
            ├── Sales.js
            ├── ThirdPartyOrders.js
            ├── Calendar.jsx
            ├── Charts.jsx
            ├── Widgets.jsx
            ├── components
            │   ├── Buttons.jsx
            │   ├── Cards.jsx
            │   ├── Grid.jsx
            │   ├── Icons.jsx
            │   ├── Notifications.jsx
            │   └── Typography.jsx
            ├── dashboards
            │   ├── Alternative.jsx
            │   └── Dashboard.jsx
            ├── examples
            │   ├── Lock.jsx
            │   ├── Login.jsx
            │   ├── Pricing.jsx
            │   ├── Profile.jsx
            │   ├── Register.jsx
            │   └── Timeline.jsx
            ├── forms
            │   ├── Components.jsx
            │   ├── Elements.jsx
            │   └── Validation.jsx
            ├── maps
            │   ├── Google.jsx
            │   └── Vector.jsx
            └── tables
                ├── ReactBSTables.jsx
                ├── Sortable.jsx
                └── Tables.jsx
```

## Browser Support

All Browser Supported.
