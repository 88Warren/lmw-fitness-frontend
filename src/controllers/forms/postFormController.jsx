export const postForm = async ({ url, payload, alertContainerId }) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: payload,
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      showMessage(alertContainerId, "Form submitted successfully!", "success");
      return { success: true, data };
    } else {
      const errorData = await response.json();
      showMessage(
        alertContainerId,
        errorData.error || "Request failed",
        "error",
      );
      return { success: false, error: errorData };
    }
  } catch (error) {
    console.error("Error:", error);
    showMessage(
      alertContainerId,
      "An error occurred during the request",
      "error",
    );
    return { success: false, error };
  }
};

export const showMessage = (alertContainerId, message, type) => {
  const alertContainer = document.getElementById(alertContainerId);
  if (!alertContainer) return;

  // Clear any existing messages before adding a new one
  alertContainer.innerHTML = "";

  const alertMessage = document.createElement("div");
  alertMessage.classList.add(
    "text-xl",
    "font-sans",
    "font-extrabold",
    "text-center",
    "p-6",
    "rounded-lg",
  );

  if (type === "error") {
    alertMessage.classList.add("bg-red-500", "text-white");
  } else if (type === "success") {
    alertMessage.classList.add("bg-green-500", "text-white");
  }

  alertMessage.innerText = message;
  alertContainer.appendChild(alertMessage);

  setTimeout(() => {
    if (alertContainer.contains(alertMessage)) {
      alertContainer.removeChild(alertMessage);
    }
  }, 10000);
};
