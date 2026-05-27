import { serverFetch } from "../api/serverFetch";

export async function getServerUser() {
  const res = await serverFetch("/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}
