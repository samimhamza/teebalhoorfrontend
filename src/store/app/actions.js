const showToast = ({state, commit}, message) => {
  if (state.toast.show) commit('hideToast')

  setTimeout(() => {
    commit('showToast', {
      color: 'black',
      message,
      timeout: 3000
    })
  })
}

const showError = ({state, commit}, {message = 'Failed!', error}) => {
  if (state.toast.show) commit('hideToast')

  setTimeout(() => {
    commit('showToast', {
      color: 'error',
      message: message + ' ' + error.message,
      timeout: 10000
    })
  })
}

const showSuccess = ({state, commit}, message) => {
  if (state.toast.show) commit('hideToast')

  setTimeout(() => {
    commit('showToast', {
      color: 'success',
      message,
      timeout: 3000
    })
  })
}


const setGlobalTheme = ({commit}, theme) => {
  commit("setGlobalTheme", theme)
}


export default {
  showToast,
  showError,
  showSuccess,
  setGlobalTheme
}
