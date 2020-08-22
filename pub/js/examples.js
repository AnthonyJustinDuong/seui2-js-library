/* Example 1 */
Seui('#example1 svg', 'ex1-animate', [
  {
    avoid: '#ex1-avoid',
    start: {x: 873, y: 100},
    end: {x: 33, y: 100},
  },
]);
/* Example 2 */
Seui('#example2 svg', 'ex2-animate', [
  { start: {x: 50, y: 150}, end: {x: 325, y: 200} },
  { avoid: '#ex2-avoid2', end: {x: 575, y: 125} },
  { end: {x: 50, y: 150} }
  ],
  {
    avoid: '#ex2-avoid1',
    begin: '.end+1s;1s'
  }
);
/* Example 3 */
Seui('#example3 svg', 'ex3-animate', [
    {
      start: {x: 50, y: 150}, end: {x: 550, y: 150},
      calcMode: 'spline',
      keySplines: '.75 0 .25 1', keyTimes: '0; 1',
      begin: 'mouseover', dur: '3s',
      restart: 'never'
    },
    {
      end: {x: 50, y: 150},
      bend: 50,
      direction: 'counter-clockwise',
    },
    {
      start: {x: 50, y: 150}, end: {x:49, y: 20},
      bend: 50,
      direction: 'counter clockwise',
    },
  ],
  {
    avoid: '#ex3-avoid',
    begin: '.end+1s;',
    padding: 20,
    speed: 500
  }
 );
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
