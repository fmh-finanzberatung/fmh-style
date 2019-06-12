/**
const fmh = fmh || {};

// same functions as above
fmh.util = (function() {
    function toggleBox(buttonClass, boxClass) {
      const boxToggleClass = 'showBox';
      const buttonToggleClass = 'isOpen';

      let button = document.querySelector(buttonClass);
      let box = document.querySelector(boxClass);

      button.addEventListener('click', function() {
        box.classList.toggle(boxToggleClass);
        button.classList.toggle(buttonToggleClass);
      });
    }

    return {
        toggleBox: toggleBox
    };
})();

fmh.util.toggleBox('.fmh-util__toggleBox--button', '.fmh-util__toggleBox--box');
**/

function toggleBox(buttonClass, boxClass) {
  const boxToggleClass = 'showBox';
  const buttonToggleClass = 'isOpen';

  let button = document.querySelector('.'+buttonClass);
  let box = document.querySelector('.'+boxClass);

  box.classList.toggle(boxToggleClass);
  button.classList.toggle(buttonToggleClass);

}