export const getCookie = (name) => {
    const match = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
    return match ? match.split('=')[1] : null;
  };