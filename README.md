# Seui2 JavaScript Library
A JavaScript Library to help with animating web elements while avoiding overlap with other web elements.
The website for this libarary can be found here: http://seui2.herokuapp.com/.
The documentation can be found here: http://seui2.herokuapp.com/api.html.

<h2>Getting Started</h2>
        <div id="getting-started__step1">
          <h3>Step 1</h3>
            <p>Add the library to your web page via a <code><span class="blue">script</span></code> tag.</p>
            <div class="code-segment">
              <pre><code class="base01">
<span class="new">  </span>&lt;<span class="blue">head</span>&gt;
<span class="new">  </span>  &lt;<span class="blue">title</span>&gt;Seui2 Getting Started&lt;/<span class="blue">title</span>&gt;
<span class="new">  </span>  &lt;<span class="blue">script</span> type=<span class="cyan">"text/javascript"</span> src=<span class="cyan">"seui2.js"</span>&gt;&lt;/<span class="blue">script</span>&gt;
<span class="new">  </span>&lt;/<span class="blue">head</span>&gt;
              </code></pre>
            </div>
          </div>
          <div id="getting-started__step2">
            <h3>Step 2</h3>
            <p>Set up an SVG element. Give the SVG element an id. In the example below, the id is <code class="cyan">svgId</code>.</p>
            <div class="code-segment">
              <pre><code class="base01">
<span class="new">  </span>&lt;<span class="blue">body</span>&gt;
<span class="new">  </span>  &lt;<span class="blue">svg</span> id=<span class="cyan">"svgId"</span> width=<span class="cyan">"500"</span> height=<span class="cyan">"500"</span>&gt;
<span class="new">  </span>  &lt;/<span class="blue">svg</span>&gt;
<span class="new">  </span>&lt;/<span class="blue">body</span>&gt;
              </code></pre>
            </div>
          </div>
          <div id="getting-started__step3">
            <h3>Step 3</h3>
            <p>Give the element you wish to animate an id. In the example below, it is <code class="cyan">toAnimateId</code>.</p>
            <div class="code-segment">
              <pre><code class="base01">
  &lt;<span class="blue">body</span>&gt;
    &lt;<span class="blue">svg</span> id=<span class="cyan">"svgId"</span> width=<span class="cyan">"500"</span> height=<span class="cyan">"500"</span>&gt;
<span class="new">  </span>    &lt;<span class="blue">rect</span> id=<span class="cyan">"toAnimateId"</span> x=<span class="cyan">"50"</span> y=<span class="cyan">"100"</span>
<span class="new">  </span>      width=<span class="cyan">"50"</span> height=<span class="cyan">"50"</span>&gt;
<span class="new">  </span>    &lt;/<span class="blue">rect</span>&gt;
    &lt;/<span class="blue">svg</span>&gt;
  &lt;/<span class="blue">body</span>&gt;
              </code></pre>
            </div>
          </div>
          <div id="getting-started__step4">
            <h3>Step 4</h3>
            <p>Give the element you wish to avoid an id. In the example below, it is <code class="cyan">toAvoidId</code>.</p>
            <div class="code-segment">
              <pre><code class="base01">
  &lt;<span class="blue">body</span>&gt;
    &lt;<span class="blue">svg</span> id=<span class="cyan">"svgId"</span> width=<span class="cyan">"500"</span> height=<span class="cyan">"500"</span>&gt;
      &lt;<span class="blue">rect</span> id=<span class="cyan">"toAnimateId"</span> x=<span class="cyan">"50"</span> y=<span class="cyan">"100"</span>
        width=<span class="cyan">"50"</span> height=<span class="cyan">"50"</span>&gt;
      &lt;/<span class="blue">rect</span>&gt;
<span class="new">  </span>    &lt;<span class="blue">rect</span> id=<span class="cyan">"toAvoidId"</span> x=<span class="cyan">"150"</span> y=<span class="cyan">"100"</span>
<span class="new">  </span>      width=<span class="cyan">"150"</span> height=<span class="cyan">"100"</span> style=<span class="cyan">"</span><span class="green">fill</span>:<span class="cyan">red"</span>&gt;
<span class="new">  </span>    &lt;/<span class="blue">rect</span>&gt;
    &lt;/<span class="blue">svg</span>&gt;
  &lt;/<span class="blue">body</span>&gt;
              </code></pre>
            </div>
          </div>
          <div id="getting-started__step5">
            <h3>Step 5</h3>
            <p>Instantiate a Seui object. The first argument of the constructor is a specifier for the SVG element.
            The second argument is the id of the element to animate.
            The third argument is a list of animation specifications.
            In the example below, the animation specification contains the specifier to the element to avoid, the start point, the end point, and other specifications.
            Please look <a href="#specs">here</a> to see what options can be specified.</p>
            <div class="code-segment">
              <pre><code class="base01">
  &lt;<span class="blue">body</span>&gt;
    &lt;<span class="blue">svg</span> id=<span class="cyan">"svgId"</span> width=<span class="cyan">"500"</span> height=<span class="cyan">"500"</span>&gt;
      &lt;<span class="blue">rect</span> id=<span class="cyan">"toAnimateId"</span> x=<span class="cyan">"50"</span> y=<span class="cyan">"100"</span>
        width=<span class="cyan">"50"</span> height=<span class="cyan">"50"</span>&gt;
      &lt;/<span class="blue">rect</span>&gt;
      &lt;<span class="blue">rect</span> id=<span class="cyan">"toAvoidId"</span> x=<span class="cyan">"150"</span> y=<span class="cyan">"100"</span>
        width=<span class="cyan">"150"</span> height=<span class="cyan">"100"</span> style=<span class="cyan">"</span><span class="green">fill</span>:<span class="cyan">red"</span>&gt;
      &lt;/<span class="blue">rect</span>&gt;
    &lt;/<span class="blue">svg</span>&gt;
<span class="new">  </span>  &lt;<span class="blue">script</span>&gt;
<span class="new">  </span>    <span class="green">const</span> <span class="orange">animator</span> = <span class="blue">Seui</span>(<span class="cyan">"#svgId"</span>, <span class="cyan">"toAnimateId"</span>, <span class="blue">[
<span class="new">  </span>      {</span>
<span class="new">  </span>        avoid: <span class="cyan">"#toAvoidId"</span>,
<span class="new">  </span>        start: {x: <span class="red">50</span>, y: <span class="red">100</span>},
<span class="new">  </span>        end: {x: <span class="red">350</span>, y: <span class="red">150</span>},
<span class="new">  </span>        direction: <span class="cyan">"counter-clockwise"</span>,
<span class="new">  </span>        begin: <span class="cyan">"click"</span>
<span class="new">  </span>      <span class="blue">}
<span class="new">  </span>    ]</span>)
<span class="new">  </span>  &lt;/<span class="blue">script</span>&gt;
  &lt;/<span class="blue">body</span>&gt;
              </code></pre>
            </div>
          </div>
