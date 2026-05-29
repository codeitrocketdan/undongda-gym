interface User {
  email: string;
  name: string;
  image: string | null;
}

export const getMe = async (): Promise<User | null> => {
  try {
    const response = await fetch(`http://localhost:3000/api/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }
    const data = response.json();
    console.log(data);
    return response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};
