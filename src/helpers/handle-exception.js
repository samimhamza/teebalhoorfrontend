export default {
  handleApiException(appContext, error) {
    const statusCode = error?.response?.status
    const statusText = error?.response?.statusText

    switch (statusCode) {
      case 422:
        this.handleValidationError(appContext, error?.response?.data?.errors)
        break;
      default:
        appContext.$toastr.e(appContext.$tr("something_went_wrong"))
        break;
    }
  },

  handleValidationError(appContext, errors) {
    if (errors instanceof Object || typeof errors === 'object') {
      for (const errorKey of Object.keys(errors)) {
        if (errors[errorKey] instanceof Array) {
          for (const errorText of errors[errorKey]) {
            appContext.$toastr.e(errorText)
          }
        } else {
          appContext.$toastr.e(errors[errorKey])
        }
      }
    } else {
      appContext.$toastr.e(appContext.$tr("something_went_wrong"))
    }
  }
}
