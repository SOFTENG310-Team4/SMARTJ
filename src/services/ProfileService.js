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

export const updateProfile = async (profile, file) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("profile", JSON.stringify(profile));

  if (file) {
    formData.append("profilePicture", file);
  }

  const response = await fetch("http://localhost:5000/api/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};

export const saveFeedback = async (feedback, interviewData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questions: interviewData.questions,
        answers: interviewData.answers,
        feedback: feedback,
        duration: interviewData.duration,
        date: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error("Failed to save feedback");
    }
  } catch (error) {
    console.error("Failed to save feedback");
  }

  return { message: "Feedback saved successfully" };
};

export const logout = () => {
  localStorage.removeItem("token");
};
