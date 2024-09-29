export const registerUser = async (userDetails) => {
  const response = await fetch("http://localhost:5000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDetails),
  });
  console.log(response);
  return response.json();
};

export const loginUser = async (userDetails) => {
  const response = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDetails),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  localStorage.setItem("token", data.token);
  return data;
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5000/api/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const updateProfile = async (profile) => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5000/api/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ profile }),
  });
  return response.json();
};

export const logout = () => {
  localStorage.removeItem("token");
};
