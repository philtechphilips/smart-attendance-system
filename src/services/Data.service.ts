export default function authHeader() {
  if (typeof window !== "undefined") {
    const userJSON = localStorage?.getItem("user");

    if (userJSON) {
      const user = JSON.parse(userJSON);

      if (user && user?.token) {
        return { Authorization: "Bearer " + user?.token };
      }
    }
  }

  return {};
}
