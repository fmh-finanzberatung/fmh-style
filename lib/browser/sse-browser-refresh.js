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
    sseSource.addEventListener('error', function (err) {
      console.error(err); 
    });

    intervalId = setInterval(function() {
      if (sseSource.readyState === 2) {
        console.log('connection is closed => reconnecting ...');
        connect();
      }
    }, 5000);

  }

  connect();

})();

