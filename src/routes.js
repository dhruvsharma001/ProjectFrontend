/*!

=========================================================
* Argon Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2019 Whispering Homes (https://www.creative-tim.com)

* Coded by Whispering Homes

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import Alternative from 'views/pages/dashboards/Alternative.js';
// import Buttons from 'views/pages/components/Buttons.js';
// import Calendar from 'views/pages/Calendar.js';
// import Cards from 'views/pages/components/Cards.js';
// import Charts from 'views/pages/Charts.js';
// import Components from 'views/pages/forms/Components.js';
// import Dashboard from 'views/pages/dashboards/Dashboard.js';
// import Elements from 'views/pages/forms/Elements.js';
// import Google from 'views/pages/maps/Google.js';
// import Grid from 'views/pages/components/Grid.js';
// import Icons from 'views/pages/components/Icons.js';
// import Lock from 'views/pages/examples/Lock.js';
import Login from 'views/pages/examples/Login.js';
// import Notifications from 'views/pages/components/Notifications.js';
// import Pricing from 'views/pages/examples/Pricing.js';
import Profile from 'views/pages/examples/Profile.js';
// import ReactBSTables from 'views/pages/tables/ReactBSTables.js';
import Register from 'views/pages/examples/Register.js';
// import Sortable from 'views/pages/tables/Sortable.js';
// import Tables from 'views/pages/tables/Tables.js';
// import Timeline from 'views/pages/examples/Timeline.js';
// import Typography from 'views/pages/components/Typography.js';
// import Validation from 'views/pages/forms/Validation.js';
// import Vector from 'views/pages/maps/Vector.js';
// import Widgets from 'views/pages/Widgets.js';
import Products from 'views/pages/Products.js';
import Customers from 'views/pages/Customers.js';
import Expenses from 'views/pages/Expenses';
import ExpensesLogs from 'views/pages/ExpensesLogs';
import Orders from 'views/pages/Orders.js';
import ThirdPartyOrders from 'views/pages/ThirdPartyOrders';
import Logs from 'views/pages/Logs.js';
import OrderLogs from 'views/pages/OrderLogs.js';
import InventoryUpdate from 'views/pages/InventoryUpdate.js';
import InventoryUpdateProduct from 'views/pages/InventoryUpdateProduct.js';
import OrderDeliveryStatus from 'views/pages/OrderDeliveryStatus';
import Revenue from 'views/pages/Revenue';
import Sales from 'views/pages/Sales';
// import Employees from 'views/pages/tables/Employees';
// import EmployeeTimeSheet from 'views/pages/EmployeeTimeSheet';
// import Timesheet from 'views/pages/Timesheet';
// import Eod from 'views/pages/Eod';
// import LeaveLog from 'views/pages/LeaveLog';
// import TypingGame from 'views/pages/game/Typing/typingGame';
// import Game from 'views/pages/game/TicTacToe/index.js';
// import LeaveLogs from 'views/pages/LeaveLogs';
// import Spy from 'views/pages/spy/Spy';

// import Chat from 'views/pages/examples/Chat.js';

const routes = [
  {
    invisible: true,

    collapse: true,
    name: 'Dashboard',
    icon: 'ni ni-shop text-primary',
    state: 'dashboardsCollapse',
    views: [
      // {
      //   path: '/dashboard',
      //   name: 'Dashboard',
      //   component: Dashboard,
      //   layout: '/admin',
      // },
      {
        invisible: true,

        path: '/alternative-dashboard',
        name: 'Alternative',
        component: Alternative,
        layout: '/admin',
      },
    ],
  },
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   icon: 'ni ni-shop text-primary',
  //   component: Dashboard,
  //   layout: '/admin',
  // },
  {
    path: '/customers',
    name: 'Customers',
    icon: 'ni ni-single-02 text-green',
    component: Customers,
    layout: '/admin',
  },
  {
    path: '/orders',
    name: 'Orders',
    icon: 'ni ni-single-copy-04 text-pink',
    component: Orders,
    layout: '/admin',
  },
  {
    path: '/thirdPartyOrders',
    name: 'ThirdPartyOrders',
    icon: 'ni ni-single-copy-04 text-red',
    component: ThirdPartyOrders,
    layout: '/admin',

  },
  {
    path: '/revenue',
    name: 'Revenue',
    icon: 'ni ni-money-coins text-red',
    component: Revenue,
    layout: '/admin',
  },
  {
    path: '/expenses',
    name: 'Expenses',
    icon: 'ni ni-credit-card text-red',
    component: Expenses,
    layout: '/admin',
  },

  {
    path: '/sales',
    name: 'Sales',
    icon: 'ni ni-chart-pie-35 text-green',
    component: Sales,
    layout: '/admin',
  },

  {
    path: '/products',
    name: 'Products Listing',
    icon: 'ni ni-bag-17 text-yellow',
    component: Products,
    layout: '/admin',
  },
  {
    path: '/inventoryUpdate',
    name: 'Inventory Update',
    icon: 'ni ni-archive-2 text-red',
    component: InventoryUpdate,
    layout: '/admin',
  },

  {
    path: '/logs',
    name: 'Logs',
    icon: 'ni ni-single-copy-04 text-red',
    component: Logs,
    layout: '/admin',
  },
  {
    path: '/orderlogs',
    name: 'Order Logs',
    icon: 'ni ni-book-bookmark text-yellow',
    component: OrderLogs,
    layout: '/admin',
  },
  {
    path: '/expenseLogs',
    name: 'Expenses Logs',
    icon: 'ni ni-credit-card text-green',
    component: ExpensesLogs,
    layout: '/admin'
  },
 
  {
    collapse: true,
    name: 'My Links',
    icon: 'ni ni-ungroup text-orange',
    state: 'examplesCollapse',
    views: [
      // {
      //   invisible: true,

      //   path: '/pricing',
      //   name: 'Pricing',
      //   component: Pricing,
      //   layout: '/auth',
      // },
      {
        path: '/login',
        name: 'Login',
        component: Login,
        layout: '/auth',
      },
      {
        invisible: true,

        path: '/register',
        name: 'Register',
        component: Register,
        layout: '/auth',
      },
      // {
      //   path: '/lock',
      //   name: 'Mark Break',
      //   component: Lock,
      //   layout: '/auth',
      // },
      // {
      //   invisible: true,

      //   path: '/timeline',
      //   name: 'Timeline',
      //   component: Timeline,
      //   layout: '/admin',
      // },
      {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        layout: '/admin',
      },
    ],
  },
  // {
  //   collapse: true,
  //   invisible: true,
  //   name: 'Components',
  //   icon: 'ni ni-ui-04 text-info',
  //   state: 'componentsCollapse',
  //   views: [
  //     {
  //       path: '/buttons',
  //       name: 'Buttons',
  //       component: Buttons,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/cards',
  //       name: 'Cards',
  //       component: Cards,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/grid',
  //       name: 'Grid',
  //       component: Grid,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/notifications',
  //       name: 'Notifications',
  //       component: Notifications,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/icons',
  //       name: 'Icons',
  //       component: Icons,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/typography',
  //       name: 'Typography',
  //       component: Typography,
  //       layout: '/admin',
  //     },
  //     {
  //       collapse: true,
  //       name: 'Multi Level',
  //       state: 'multiCollapse',
  //       views: [
  //         {
  //           path: '#pablo',
  //           name: 'Third level menu',
  //           component: () => {},
  //           layout: '/',
  //         },
  //         {
  //           path: '#pablo',
  //           name: 'Just another link',
  //           component: () => {},
  //           layout: '/',
  //         },
  //         {
  //           path: '#pablo',
  //           name: 'One last link',
  //           component: () => {},
  //           layout: '/',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   invisible: true,

  //   collapse: true,
  //   name: 'Forms',
  //   icon: 'ni ni-single-copy-04 text-pink',
  //   state: 'formsCollapse',
  //   views: [
  //     {
  //       path: '/elements',
  //       name: 'Elements',
  //       component: Elements,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/components',
  //       name: 'Components',
  //       component: Components,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/validation',
  //       name: 'Validation',
  //       component: Validation,
  //       layout: '/admin',
  //     },
  //   ],
  // },
  {
    invisible: true,
    collapse: true,
    name: 'Whispering Homes',
    icon: 'ni ni-align-left-2 text-default',
    state: 'tablesCollapse',
    views: [
      // {
      //   path: '/tables',
      //   name: 'Tables',
      //   component: Tables,
      //   layout: '/admin',
      // },
      {
        invisible: true,
        path: '/inventoryUpdateProduct/edit/:id',
        // icon: 'ni ni-align-left-2 text-blue',
        exact: false,
        name: 'Inventory Update Product',
        component: InventoryUpdateProduct,
        layout: '/admin',
      },
      {
        invisible: true,
        path: '/orderDeliveryStatus/waybill/:id',
        // icon: 'ni ni-align-left-2 text-blue',
        exact: false,
        name: 'Order Delivery Status',
        component: OrderDeliveryStatus,
        layout: '/admin',
      },
      // {
      //   path: '/sortable',
      //   name: 'Sortable',
      //   component: Sortable,
      //   layout: '/admin',
      // },
      // {
      //   path: '/react-bs-table',
      //   name: 'React BS Tables',
      //   component: ReactBSTables,
      //   layout: '/admin',
      // },
    ],
  },

  // {
  //   invisible: true,

  //   path: '/widgets',
  //   name: 'Widgets',
  //   icon: 'ni ni-archive-2 text-green',
  //   component: Widgets,
  //   layout: '/admin',
  // },

  // {
  //   path: '/eod',
  //   name: 'Eod Report',
  //   icon: 'ni ni-archive-2 text-warning',
  //   component: Eod,
  //   layout: '/admin',
  // },
  // {
  //   path: '/leave',
  //   name: 'Leaves',
  //   icon: 'ni ni-archive-2 text-green',
  //   component: LeaveLog,
  //   layout: '/admin',
  // },
  // {
  //   path: '/leavelogs',
  //   name: 'Leaves Logs',
  //   icon: 'ni ni-ui-04 text-info',
  //   component: LeaveLogs,
  //   layout: '/admin',
  // },
  // {
  //   invisible: true,

  //   path: '/charts',
  //   name: 'Charts',
  //   icon: 'ni ni-chart-pie-35 text-info',
  //   component: Charts,
  //   layout: '/admin',
  // },
  // {
  //   path: '/calendar',
  //   name: 'Calendar',
  //   icon: 'ni ni-calendar-grid-58 text-red',
  //   component: Calendar,
  //   layout: '/admin',
  // },
  // {
  //   path: '/game',
  //   name: 'Games',
  //   icon: 'ni ni-map-big text-primary',
  //   component: TypingGame,
  //   layout: '/admin',
  // },
  // {
  //   invisible: false,
  //   collapse: true,
  //   name: 'Games',
  //   icon: 'ni ni-map-big text-primary',
  //   state: 'tablesCollapse',
  //   views: [
  //     {
  //       path: '/typing',
  //       name: 'Typing',
  //       component: TypingGame,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/tictactoe',
  //       name: 'Tic-Tac-Toe',
  //       component: Game,
  //       layout: '/admin',
  //     },
  //   ],
  // },
  // {
  //   invisible: true,
  //   collapse: true,
  //   name: 'Maps',
  //   icon: 'ni ni-ui-04 text-warning',
  //   state: 'mapsCollapse',
  //   views: [
  //     {
  //       invisible: true,

  //       path: '/google',
  //       name: 'Google',
  //       component: Google,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/vector',
  //       name: 'World Map',
  //       component: Vector,
  //       layout: '/admin',
  //     },
  //   ],
  // },
  // {
  //   invisible: false,
  //   collapse: true,
  //   name: 'Status',
  //   icon: 'ni ni-ui-04 text-warning',
  //   state: 'mapsCollapse',
  //   views: [
  //     {
  //       path: '/spy',
  //       name: 'Monitor',
  //       component: Spy,
  //       layout: '/admin',
  //     },
  //   ],
  // },
];

export default routes;
