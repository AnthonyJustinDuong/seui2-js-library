'use strict';

const seui2AnimateMotionId = 'seui2AnimateMotion';
// const seui2AnimateTransformId = 'seui2AnimateTransform';

function Seui(svgSpecifier, toAnimate, animationsSpecs, defaultSpecs) {
  const _self = {};

  // Get the SVG for where all actions will take place
  _self.svg = document.querySelector(svgSpecifier);
  if (!_self.svg || _self.svg.nodeName.toLowerCase() !== 'svg') {
    console.error("The specifier for the SVG element is not valid.");
    return null;
  }

  // Get the node to animate
  _self.animate = _self.svg.querySelector(toAnimate);
  if (!_self.animate) {
    console.error("The specifier for the element to animate is not valid.");
    return null;
  }
  _self.animateId = toAnimate;

  // Animation information
  _self.defaultSpecs = defaultSpecs;
  if (!_self.defaultSpecs) _self.defaultSpecs = {};
  if (!animationsSpecs || animationsSpecs.length === 0) {
    animationSpecs = [{}];
  }
  _self.animationsSpecs = animationsSpecs;
  _self.animationCounter = 0;

  // Functions for the user
  _self.addAnimation = (spec, index) => {
    _self.animationsSpecs.splice(index, 0, spec);
  }
  _self.removeAnimation = index => {
    return _self.animationsSpecs.splice(index, 1);
  }
  _self.setAnimationProperty = (index, propertyName, value) => {
    _self.animationsSpecs[index][propertyName] = value;
  }
  _self.renderAnimation = () => {
    const toRemove = _self.animate.querySelectorAll(`[id^=${seui2AnimateMotionId}]`);
    for (let i = 0; i < toRemove.length; i++) {
      toRemove[i].remove();
    }
    createAndAppendAnimation(_self, _self.animationCounter);
  };

  createAndAppendAnimation(_self, 0);
  // createAndAppendAnimation(_self, 1);

  return _self;
}

function createAndAppendAnimation(_self, index) {
  // If this animation has not yet been created
  if (!_self.svg.querySelector('#' + seui2AnimateMotionId + index)) {
    const specifications = getFullSpecs(_self, index);
    const animateMotion = createMotionAnimation(specifications);
    animateMotion.addEventListener('beginEvent', () => setOrigin(_self.animate, 0, 0));
    animateMotion.onend = () => appendNextAnimation(_self);
    _self.animate.appendChild(animateMotion);
  }

  // Check if the next animation starts at the end of this current one,
  // If so, append the next animation alse
  const nextIndex = index < _self.animationsSpecs.length - 1 ? index + 1 : 0;
  const animSpecs = _self.animationsSpecs[nextIndex];
  if (animSpecs.begin && animSpecs.begin.startsWith('.end')
    || _self.defaultSpecs.begin && _self.defaultSpecs.begin.startsWith('.end'))
  {
    const nextAnimateMotion = createMotionAnimation(getFullSpecs(_self, nextIndex));
    nextAnimateMotion.addEventListener('beginEvent', () => setOrigin(_self.animate, 0, 0));
    nextAnimateMotion.onend = () => appendNextAnimation(_self);
    _self.animate.appendChild(nextAnimateMotion);
  }
}

function removeAnimation(_self, index, onEnd) {
  // may not need to reset position if current animation is being removed
  if (onEnd) {
    // Adjust position of node to animate, for when removing the animation
    if (_self.animationsSpecs[index].adjustedEnd) {
      const { adjustedEnd: {x: x0, y: y0} } = _self.animationsSpecs[index];
      setOrigin(_self.animate, x0, y0);
    } else {
      const { end: {x: x0, y: y0} } = _self.animationsSpecs[index];
      setOrigin(_self.animate, x0, y0);
    }
  }

  const nodeToRemove = _self.animate.querySelector(`#${seui2AnimateMotionId}${index}`);
  nodeToRemove.remove();
}

function appendNextAnimation(_self) {
  removeAnimation(_self, _self.animationCounter, true);
  _self.animationCounter += 1;
  if (_self.animationCounter >= _self.animationsSpecs.length) _self.animationCounter = 0;

  createAndAppendAnimation(_self, _self.animationCounter);
}

function createMotionAnimation(specs) {
  const path = generatePath(specs);
  const dummyPathNode = document.createElementNS("http://www.w3.org/2000/svg", "path");
  dummyPathNode.setAttribute('d', path);
  const dur = dummyPathNode.getTotalLength()/500;

  const animMotion = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");

  animMotion.setAttribute('id', specs.id);
  // animMotion.setAttribute('href', animateId);
  animMotion.setAttribute('path', path);
  animMotion.setAttribute('dur', dur + 's')
  animMotion.setAttribute('repeatCount', '1');
  animMotion.setAttribute('begin', specs.begin);
  animMotion.setAttribute('fill', 'freeze');
  // animMotion.beginElement();

  return animMotion;
}

function setOrigin(toAnimateNode, x, y) {
  toAnimateNode.setAttribute('x', x);
  toAnimateNode.setAttribute('y', y);
}

/*
  Will give the full specifications of an animation, as
  some values are not specified and will default based on the following
  hiearchy
*/
function getFullSpecs(_self, index) {
  const fullSpecs = {};

  const specific = _self.animationsSpecs[index];
  const defaultSpecs = _self.defaultSpecs;
  const previous = index > 0 ? _self.animationsSpecs[index - 1] : {};
  const next = index < _self.animationsSpecs.length - 1 ? _self.animationsSpecs[index + 1] : {};

  if (specific.avoid) fullSpecs.avoid = specific.avoid;
  else fullSpecs.avoid = defaultSpecs.avoid;

  if (specific.start && specific.start.x && specific.start.y) fullSpecs.start = specific.start;
  else if (previous.adjustedEnd) fullSpecs.start = previous.adjustedEnd;
  else if (previous.end && previous.end.x && previous.end.y) fullSpecs.start = previous.end;
  else if (defaultSpecs.start && defaultSpecs.start.x && defaultSpecs.start.y) fullSpecs.start = defaultSpecs.start;
  else fullSpecs.start = {x: _self.animate.x.animVal.value, y: _self.animate.y.animVal.value};

  if (specific.end && specific.end.x && specific.end.y) fullSpecs.end = specific.end;
  else if (next.start && next.start.x && next.start.y) fullSpecs.end = next.start;
  else if (defaultSpecs.end && defaultSpecs.end.x && defaultSpecs.end.y) fullSpecs.end = defaultSpecs.end;
  else fullSpecs.end = {x: _self.animate.x.animVal.value, y: _self.animate.y.animVal.value};

  if (specific.direction) fullSpecs.direction = specific.direction;
  else if (defaultSpecs.direction) fullSpecs.direction = defaultSpecs.direction;
  else fullSpecs.direction = 'clockwise';

  const paddingSides = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'];
  paddingSides.map(side => {
    if (specific[side]) fullSpecs[side] = specific[side];
    else if (specific.padding) fullSpecs[side] = specific.padding;
    else if (defaultSpecs[side]) fullSpecs[side] = defaultSpecs[side];
    else if (defaultSpecs.padding) fullSpecs[side] = defaultSpecs.padding;
    else fullSpecs[side] = 0;
  })

  if (specific.bend) fullSpecs.bend = specific.bend;
  else if (defaultSpecs.bend) fullSpecs.bend = defaultSpecs.bend;
  else fullSpecs.bend = 0;

  if (specific.begin) fullSpecs.begin = specific.begin;
  else if (defaultSpecs.begin) fullSpecs.begin = defaultSpecs.begin;
  else fullSpecs.begin = 'click';
  // For begin relative to previous animation
  if (fullSpecs.begin.startsWith('.end')) {
    const prevIndex = index > 0 ? index - 1 : _self.animationsSpecs.length - 1;
    fullSpecs.begin = seui2AnimateMotionId + prevIndex + fullSpecs.begin;
  }

  fullSpecs.id = seui2AnimateMotionId + index;

  // Change specs by adjusting start and end points
  const toAvoid = _self.svg.querySelector(fullSpecs.avoid);
  if (toAvoid) {
    const {x: {animVal: {value: avX}}, y: {animVal: {value: avY}},
      width: {animVal: {value: avW}}, height: {animVal: {value: avH}}} = toAvoid;
    const toAvoidDim = { x: avX, y: avY, width: avW, height: avH };
    fullSpecs.toAvoidDim = toAvoidDim;

    const {width: {animVal: {value: anW}}, height: {animVal: {value: anH}}} = _self.animate;
    const toAnimateDim = { width: anW, height: anH };

    const pads = {pt: fullSpecs.paddingTop, pr: fullSpecs.paddingRight,
      pb: fullSpecs.paddingBottom, pl: fullSpecs.paddingLeft}

    const borders = getBorders(toAnimateDim, toAvoidDim, pads);
    fullSpecs.borders = borders;

    // Evacuaute points - to handle case where points are in the area to avoid
    const adjustedStart = evacuatePoint(fullSpecs.start, borders);
    _self.animationsSpecs[index].adjustedStart = adjustedStart;
    fullSpecs.start = adjustedStart;
    const adjustedEnd = evacuatePoint(fullSpecs.end, borders);
    _self.animationsSpecs[index].adjustedEnd = adjustedEnd;
    fullSpecs.end = adjustedEnd;
  }

  return fullSpecs;
}

function generatePath(specs) {
  const {start, end, direction, borders, bend} = specs;

  const startOctant = getOctant(start, borders);
  const endOct = getOctant(end, borders);
  const corners = getCorners(borders);
  const ccw = /^\s*(anti|counter)[\s|-]?clockwise\s*$/.test(direction);

  const {incr, cont, edgePath, directPath, sameOctPath, getNearestCorner}
    = getCCWExpressions(ccw, bend, borders);

  // Easy path, if same octant and the adjustedStart point is "before" the end point
  if (startOctant === endOct) {
    const possiblePath = sameOctPath(startOctant, directPath, start, end);
    if (possiblePath) return possiblePath;
  }

  // Easy path, if "direct" path is available
  const startCorner = getNearestCorner(startOctant);
  if (!cont(startCorner, endOct)) {
    return `m ${start.x} ${start.y} ` + directPath(start, end);
  }

  /* More complex path */
  let path = `m ${start.x} ${start.y} `;

  // Start with a path to the first corner
  const next = incr(startCorner);
  path += directPath(start, corners[next]);

  // Add edge paths until end is "in sight" (a "direct" path is available)
  // Moving around the element to avoid
  let corner = next;
  while (cont(corner, endOct)) {
    path += edgePath(corner);
    corner = incr(corner);
  }

  // Add last path to end point
  path += directPath(corners[corner], end);

  return path;
}

function getBorders(toAnimateDim, toAvoidDim, pads) {
  const {width: anW, height: anH} = toAnimateDim;
  const {x: avX, y: avY, width: avW, height: avH} = toAvoidDim;
  const {pt, pr, pb, pl} = pads;

  return {
    left: avX - pl - anW,
    top: avY - pt - anH,
    right: avX + avW + pr,
    bottom: avY + avH + pb,
  };
}

function getCorners(borders) {
  return [
    {x: borders.left, y: borders.top},
    {x: borders.right, y: borders.top},
    {x: borders.right, y: borders.bottom},
    {x: borders.left, y: borders.bottom},
  ];
}

function getOctant(point, borders) {
  const {x, y} = point;

  /*
  __0__|__4__|__1__
  __7__|_____|__5__
    3  |  6  |  2
  */
  if (x <= borders.left && y <= borders.top) return 0;
  if (x <= borders.right && y <= borders.top) return 4;
  if (/* x > borders.right && */ y <= borders.top) return 1;
  if (x >= borders.right && y <= borders.bottom) return 5;
  if (x >= borders.right && y >= borders.bottom) return 2;
  if (x >= borders.left && y >= borders.bottom) return 6;
  if (x <= borders.left && y >= borders.bottom) return 3;
  // if (x <= borders.left && y <= borders.top)
  return 7;
}

function getCCWExpressions(ccw, bend, borders) {
  return (ccw ?
    {
      incr: oct => (oct + 3) % 4,
      cont: (corner, endOct) => corner !== (endOct - 3) % 4 && (corner + 3) % 4 !== endOct,
      edgePath: corner => {
        const h = borders.bottom - borders.top;
        const w = borders.right - borders.left;
        switch (corner) {
          case 0:
            return `q ${-bend} ${h/2} 0 ${h} `;
          case 1:
            return `q ${-w/2} ${-bend} ${-w} 0 `;
          case 2:
            return `q ${bend} ${-h/2} 0 ${-h} `;
          case 3:
            return `q ${w/2} ${bend} ${w} 0 `;
          defaultSpecs:
            return '';
        }
      },
      directPath: (start, end) => {
        if (start.x <= end.x && start.y <= end.y || start.x >= end.x && start.y >= end.y) {
          return `q 0 ${end.y - start.y} ${end.x - start.x} ${end.y - start.y} `;
        }
        return `q ${end.x - start.x} 0 ${end.x - start.x} ${end.y - start.y} `;
      },
      sameOctPath: (octant, directPath, start, end) => {
        const corner = octant >= 4 ? (octant - 3) % 4 : octant;
        if (corner == 0 && start.y <= end.y || corner == 1 && start.x >= end.x
          || corner == 2 && start.y >= end.y || corner == 3 && start.x <= end.x)
          return `m ${start.x} ${start.y} ` + directPath(start, end);
      },
      getNearestCorner: octant => octant >= 4 ? (octant + 1) % 4 : octant,
    } :
    {
      incr: oct => (oct + 1) % 4,
      cont: (corner, endOct) => corner + 4 !== endOct && (corner + 1) % 4 !== endOct,
      edgePath: corner => {
        const h = borders.bottom - borders.top;
        const w = borders.right - borders.left;
        switch (corner) {
          case 0:
            return `q ${w/2} ${-bend} ${w} 0 `;
          case 1:
            return `q ${bend} ${h/2} 0 ${h} `;
          case 2:
            return `q ${-w/2} ${bend} ${-w} 0 `;
          case 3:
            return `q ${-bend} ${-h/2} 0 ${-h} `;
          defaultSpecs:
            return '';
        }
      },
      directPath: (start, end) => {
        if (start.x <= end.x && start.y >= end.y || start.x >= end.x && start.y <= end.y) {
          return `q 0 ${end.y - start.y} ${end.x - start.x} ${end.y - start.y} `;
        }
        return `q ${end.x - start.x} 0 ${end.x - start.x} ${end.y - start.y} `;
      },
      sameOctPath: (octant, directPath, start, end) => {
        const corner = octant % 4;
        if (corner == 0 && start.x <= end.x || corner == 1 && start.y <= end.y
          || corner == 2 && start.x >= end.x || corner == 3 && start.y >= end.y)
          return `m ${start.x} ${start.y} ` + directPath(start, end);
      },
      getNearestCorner: octant => octant % 4,
    }
  );
}

function evacuatePoint(point, borders) {
  if (point.x <= borders.left || borders.right <= point.x ||
    point.y <= borders.top || borders.bottom <= point.y) return point;

  const difMinX = point.x - borders.left;
  const difMaxX = borders.right - point.x;
  const difMinY = point.y - borders.top;
  const difMaxY = borders.bottom - point.y;

  const min = Math.min(difMinX, difMaxX, difMinY, difMaxY);

  switch (min) {
    case difMinX:
      return {x: borders.left, y: point.y};
    case difMaxX:
      return {x: borders.right, y: point.y};
    case difMinY:
      return {x: point.x, y: borders.top};
    case difMaxY:
      return {x: point.x, y: borders.bottom};
    default:
      return point;
  }
}
