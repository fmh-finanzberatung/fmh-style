(function () {
  
  function reloadPage (event) {

    const data = JSON.parse(event.data);

    const locationPath = 
      window.location.pathname === '/' ? '/index.html' : window.location.pathname;

    if (data.path && data.path.indexOf(locationPath) !== -1) {

      window.location.replace(window.location.pathname);
      window.location.href = window.location.hash;
      return;
    }
  }

  let intervalId = null;

  function connect () {

    if (intervalId) clearInterval(intervalId);

    const sseSource = new EventSource('event-stream');
    sseSource.addEventListener('message', reloadPage);
    sseSource.addEventListener('error', function (event) {
      console.error(event); 
      if (event.target.readyState === EventSource.CONNECTING) {
        console.error('reconnecting on error');
      }
      if (event.target.readyState === EventSource.CLOSED) {
        console.error('connection is closed on error');
      }
    });

    intervalId = setInterval(function() {
      if (sseSource.readyState === EventSource.CONNECTING) {
        console.log('currently reconnecting');
      }
      if (sseSource.readyState === EventSource.CLOSED) {
        console.log('connection is closed => reconnecting ...');
        connect();
      }
    }, 5000);

  }

  connect();

})();

