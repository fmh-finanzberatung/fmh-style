(function() {

  let socket;

  function refreshStyleUrl(url) {
    console.log('url', url);
    const linkElements = document.getElementsByTagName('link'); 
    for (let i = 0, l = linkElements.length; i < l; i++) {
      const link = linkElements[i];
      if (
        (link.getAttribute('rel') === 'stylesheet') &&
        (link.getAttribute('href').indexOf(url) !== -1)
      ) {
        const href = link.getAttribute('href').split('?');
        if (href.indexOf(url) !== -1) {
          console.log('href', href);
          link.setAttribute('href', href[0] + '?unique=' + new Date().getTime());
        }
      }
    } 
  } 

  /**
   * create a socket connection with server 
   *
   * @returns {undefined}
   */
  function start () {

    const hostname = window.location.hostname;
    const port = window.location.port;

    socket = new WebSocket('wss://' + hostname +':' + port + '/socket');

    socket.onopen = function onopen () {
      ping();
    };

    socket.onmessage = function onmessage (event) {

      const data = JSON.parse(event.data);

      console.log('data', data);

      const locationPath = 
        window.location.pathname === '/' ? '/index.html' : window.location.pathname;

      if (data.path && data.path.indexOf(locationPath) !== -1) {

        window.location.replace(window.location.pathname);
        window.location.href = window.location.hash;
        return;
      }

      const stylePaths = data.stylePaths;
      if (!stylePaths) return false;

      for (let i = 0, l = stylePaths.length; i < l; i++) {
        const path = stylePaths[i]; 
        console.log('path', path);
        refreshStyleUrl(path);      
      }; 
    };
    
    socket.onclose = function onclose () {
      console.log('Lost connection!');
    };

    socket.onerror = function onerror (err) {
      console.error('Socket error', err);
    };

  }

  
  /**
   * reestablish socket connection 
   *
   * @returns {undefined}
   */
  function ping() {
    if (!socket) return false; 
    if (socket.readyState !== 1) return; // 1 === OPEN 
    socket.send('ping');
    setTimeout(ping, 2000);
  }

  start();
})();

