export const showMessage = (alertContainerId, message, type) => {
    const alertContainer = document.getElementById(alertContainerId);
    if (!alertContainer) return;
  
    const alertMessage = document.createElement("div");
    
    alertMessage.classList.add("text-xl", "font-sans", "font-extrabold", "text-center", "p-6", "rounded-lg");
    
    if (type === 'error') {
      alertMessage.classList.add("bg-red-500", "text-white"); 
      alertMessage.classList.add("bg-green-500", "text-white");  
    }
    
    alertMessage.innerText = message;
  
    alertContainer.appendChild(alertMessage);
  
    setTimeout(() => {
      alertContainer.removeChild(alertMessage);
    }, 10000);  
  };