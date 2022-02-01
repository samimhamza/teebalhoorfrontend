export default function (context) {
  if (context.route?.meta[0]?.hasAuth) {
    if (context.$auth?.$state?.user != false) {
      if (
        !context.$auth?.$state?.user?.scopes?.includes(
          context.route?.meta[0]?.scope
        )
      ) {
        context.error({ statusCode: 401 });
      }
    }
  }
}
