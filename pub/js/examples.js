/* Example 1 */
const ex1 = Seui('#example1 svg', 'ex1-animate', [
  {
    avoid: '#ex1-avoid',
    start: {x: 873, y: 100},
    end: {x: 33, y: 100},
  },
]);
/* Interactive Example */
const interactAnimator = Seui('#interactive__svg', 'interactive__animate', [
  {
    avoid: '#interactive__avoid',
    start: {x: 100, y: 100},
    end: {x: 400, y: 400},
    padding: 5
  },
]);

const interactEx = document.querySelector('#interactive-example')
const inputs = document.querySelectorAll('#table-form input');
inputs.forEach((item, i) => {
  item.addEventListener('change', event => setAttr(event));
});

const toAnimate = interactEx.querySelector('#interactive__animate');
const toAvoid= interactEx.querySelector('#interactive__avoid');
const startDot = interactEx.querySelector('#anim-start');
const endDot = interactEx.querySelector('#anim-end');

function setAttr(event) {
  const {id, value} = event.target;
  switch (id) {
    case 'start-x':
      toAnimate.setAttribute('x', value);
      interactAnimator.animationsSpecs[0].start.x = value;
      startDot.setAttribute('cx', value);
      const startY = interactEx.querySelector('#start-y').value;
      toAnimate.setAttribute('y', startY);
      interactAnimator.animationsSpecs[0].start.y = startY;
      startDot.setAttribute('cy', startY);
      break;
    case 'start-y':
      toAnimate.setAttribute('y', value);
      interactAnimator.animationsSpecs[0].start.y = value;
      startDot.setAttribute('cy', value);
      const startX = interactEx.querySelector('#start-x').value;
      toAnimate.setAttribute('x', startX);
      interactAnimator.animationsSpecs[0].start.x = startX;
      startDot.setAttribute('cx', startX);
      break;
    case 'an-w':
      toAnimate.setAttribute('width', value);
      break;
    case 'an-h':
      toAnimate.setAttribute('height', value);
      break;
    case 'end-x':
      interactAnimator.animationsSpecs[0].end.x = value;
      endDot.setAttribute('cx', value);
      break;
    case 'end-y':
      interactAnimator.animationsSpecs[0].end.y = value;
      endDot.setAttribute('cy', value);
      break;
    case 'pos-x':
      toAvoid.setAttribute('x', value);
      break;
    case 'pos-y':
      toAvoid.setAttribute('y', value);
      break;
    case 'av-w':
      toAvoid.setAttribute('width', value);
      break;
    case 'av-h':
      toAvoid.setAttribute('height', value);
      break;
    default:
      break;
  }
  interactAnimator.renderAnimation();
}
