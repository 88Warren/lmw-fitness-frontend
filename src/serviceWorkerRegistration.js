export function register() {
  if (
    import.meta.env.MODE === 'production' && 
    'serviceWorker' in navigator
  ) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(`${import.meta.env.BASE_URL}service-worker.js`)
        // .then(() => {
        //   console.log('ServiceWorker registration successful');
        // })
        // .catch(err => {
        //   console.log('ServiceWorker registration failed: ', err);
        // });
    });
  }
}