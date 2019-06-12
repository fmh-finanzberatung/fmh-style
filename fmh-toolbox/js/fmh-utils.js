/**********************************************************************************************************************
 * ToggleBox: a little helper to show/hide a defined box by click on a button
 * Example:
    <div class="toggleBox__wrapper">
      <div class="toggleBox__button">
        The content of the button goes here
      </div>
      <div class="toggleBox__box">
        The content of the box goes here ...
      </div>
    </div>
 * The box and button must be somewhere below the wrapper, but not necessarily direct below
 *
 * The box gets the 'showBox'-class toggled
 * and the button the 'isOpen'-class
 *
 * The styles are defined in fmh-utils.scss/css
*/

/**
 * toggleBox: open or close the box and change the button-class
 * @param event
 * @param button
 * @param box
 */
function toggleBox(event, button, box) {
  button.classList.toggle('isOpen');
  box.classList.toggle('showBox')
}

/**
 * registerToggleBoxes: register click-events to all toggleBoxes on page
 */
function registerToggleBoxes() {
  let tbWrappers = document.querySelectorAll('.toggleBox__wrapper');
  tbWrappers.forEach(function(tbWrapper) {
    let tbButton = tbWrapper.querySelector('.toggleBox__button');
    let tbBox = tbWrapper.querySelector('.toggleBox__box');
    tbButton.addEventListener("click", function (e) { toggleBox(e, tbButton, tbBox) }, false );
  });
}

window.onload = registerToggleBoxes;



