# Seui2 JavaScript Library
A JavaScript Library to help with animating web elements while avoiding overlap with other web elements.
The website for this libarary can be found here: http://seui2.herokuapp.com/.
The documentation can be found here: http://seui2.herokuapp.com/api.html.
## Getting Started</h2>    
### Step 1
Add the library to your web page via a `script` tag (you must download the library first).    
```
  <head>
    <title>Seui2 Getting Started</title>
    <script type="text/javascript" src="seui2.js"></script>
  </head>
```
### Step 2
Set up an SVG element. Give the SVG element an id. In the example below, the id is `svgId`.        
```
  <body>
    <svg id="svgId" width="500" height="500">
    </svg>
  </body>
  ```          
### Step 3
Give the element you wish to animate an id. In the example below, it is `toAnimateId`.      
```
  <body>
    <svg id="svgId" width="500" height="500">
      <rect id="toAnimateId" x="50" y="100"
        width="50" height="50">
      </rect>
    </svg>
  </body>
```        
### Step 4
Give the element you wish to avoid an id. In the example below, it is `toAvoidId`.
```
  <body>
    <svg id="svgId" width="500" height="500">
      <rect id="toAnimateId" x="50" y="100"
        width="50" height="50">
      </rect>
      <rect id="toAvoidId" x="150" y="100"
        width="150" height="100" style="fill:red">
      </rect>
    </svg>
  </body>
```      
### Step 5
Instantiate a Seui object. The first argument of the constructor is a specifier for the SVG element.
The second argument is the id of the element to animate.
The third argument is a list of animation specifications.
In the example below, the animation specification contains the specifier to the element to avoid, the start point, the end point, and other specifications.
Please look [here](http://seui2.herokuapp.com/api.html#specs) to see what options can be specified.
```
  <body>
    <svg id="svgId" width="500" height="500">
      <rect id="toAnimateId" x="50" y="100"
        width="50" height="50">
      </rect>
      <rect id="toAvoidId" x="150" y="100"
        width="150" height="100" style="fill:red">
      </rect>
    </svg>
    <script>
      const animator = Seui("#svgId", "toAnimateId", [
        {
          avoid: "#toAvoidId",
          start: {x: 50, y: 100},
          end: {x: 350, y: 150},
          direction: "counter-clockwise",
          begin: "click"
        }
      ])
    </script>
  </body>
```
