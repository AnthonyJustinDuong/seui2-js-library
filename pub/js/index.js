Seui('svg', 'animate1', [
    {
      start: { x: 48, y: 178 },
      end: { x: 542, y: 178 },
      begin: '.end+0s;1s'
    },
    {
      end: { x: 48, y: 178 },
      begin: '.end+0s'
    }
  ],
  {
    avoid: 'image',
    direction: 'counter-clockwise',
    speed: 233,
    calcMode: 'spline',
    keySplines: '.75 0 .25 1', keyTimes: '0; 1'
  }
);
Seui('svg', 'animate2', [
    {
      end: { x: 48, y: 178 },
      start: { x: 542, y: 178 },
      begin: '.end+0s;1s'
    },
    {
      end: { x: 542, y: 178 },
      begin: '.end+0s'
    }
  ],
  {
    avoid: 'image',
    direction: 'counter-clockwise',
    speed: 233,
    calcMode: 'spline',
    keySplines: '.75 0 .25 1', keyTimes: '0; 1'
  }
);
