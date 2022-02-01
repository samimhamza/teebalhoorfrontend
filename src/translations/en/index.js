import datatable from "./datatable"
import common from "./common";
import validations from "./validations";
import TextField from "./textfield";
import Alert from "./alert"
import buttons from "./buttons";
import titles from "./titles";
import menu from "./menu";
import checkbox from "./checkbox";

export default {

  titles: titles,

  common: common,

  buttons: buttons,

  // All Validation Translations
  validations: validations,

  // All TextField and Inputs Translations
  textField: TextField,

  // All Checkbox Translations
  checkbox: checkbox,

  // All alert dialog translations
  alert: Alert,

  error: {
    notfound: 'Page Not Found',
    other: 'An Error Occurred',
  },

  login: {
    title: 'Sign In',
    button: 'Sign In',
    orSign: 'Or sign in with',
    forgot: 'Forgot password?',
    noAccount: 'Don\'t have an account?',
    create: 'Create one here',
    error: 'The email / password combination is invalid'
  },

  menu: menu,


  // Data Table Translations
  datatable: datatable,


  // Vuetify components translations
  $vuetify: {
    badge: 'Badge',
    close: 'Close',
    dataIterator: {
      noResultsText: 'No matching records found',
      loadingText: 'Loading items...'
    },
    dataTable: {
      itemsPerPageText: 'Rows per page:',
      ariaLabel: {
        sortDescending: 'Sorted descending.',
        sortAscending: 'Sorted ascending.',
        sortNone: 'Not sorted.',
        activateNone: 'Activate to remove sorting.',
        activateDescending: 'Activate to sort descending.',
        activateAscending: 'Activate to sort ascending.'
      },
      sortBy: 'Sort by'
    },
    dataFooter: {
      itemsPerPageText: 'Items per page:',
      itemsPerPageAll: 'All',
      nextPage: 'Next page',
      prevPage: 'Previous page',
      firstPage: 'First page',
      lastPage: 'Last page',
      pageText: '{0}-{1} of {2}'
    },
    datePicker: {
      itemsSelected: '{0} selected',
      nextMonthAriaLabel: 'Next month',
      nextYearAriaLabel: 'Next year',
      prevMonthAriaLabel: 'Previous month',
      prevYearAriaLabel: 'Previous year'
    },
    noDataText: 'No data available',
    carousel: {
      prev: 'Previous visual',
      next: 'Next visual',
      ariaLabel: {
        delimiter: 'Carousel slide {0} of {1}'
      }
    },
    calendar: {
      moreEvents: '{0} more'
    },
    fileInput: {
      counter: '{0} files',
      counterSize: '{0} files ({1} in total)'
    },
    timePicker: {
      am: 'AM',
      pm: 'PM'
    },
    pagination: {
      ariaLabel: {
        wrapper: 'Pagination Navigation',
        next: 'Next page',
        previous: 'Previous page',
        page: 'Goto Page {0}',
        currentPage: 'Current Page, Page {0}'
      }
    }
  }
}
