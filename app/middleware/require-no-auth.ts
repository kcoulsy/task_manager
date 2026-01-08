import { ROUTES } from "../../utils/routes";

export default defineNuxtRouteMiddleware(async () => {
  const { data: session } = await useFetch("/api/session");

  const isLoggedIn = !!session.value?.user?.id;

  if (isLoggedIn) {
    return navigateTo(ROUTES.APP.DASHBOARD);
  }
});
