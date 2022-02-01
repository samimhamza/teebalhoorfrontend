export default (context, inject) => {
  const isInScope = (scope, checkall) => {
    let userScopes = context.$auth.$state.user.scopes;
    if (userScopes) {
      if (Array.isArray(scope)) {
        if (!checkall) {
          for (let sc of scope) {
            return userScopes.includes(sc);
          }
        } else {
          let res = true;
          for (let sc of scope) {
            return res && userScopes.includes(sc);
          }
        }
      } else if (typeof scope === "string") {
        return userScopes.includes(scope);
      }
    }
  };

  const tr = (phrase, ...params) => {
    let str = context.store.getters["translations/getTranslation"](phrase);
    for (let x = 1; x <= params.length; x++) {
      str = str.replace(`{${x}}`, params[x - 1]);
    }
    return str;
  };

  // Inject $hello(msg) in Vue, context and store.
  inject("isInScope", isInScope);
  inject("tr", tr);
  // For Nuxt <= 2.12, also add 👇
  context.$isInScope = isInScope;
  context.$tr = tr;
};
