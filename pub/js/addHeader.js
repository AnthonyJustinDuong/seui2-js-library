(function () {
  const newHeader = document.createElement('header');
  newHeader.id = 'main-header';
  newHeader.innerHTML =
        `<nav class="main-nav">
          <ul>
            <li><a href="examples.html">Examples</a></li>
            <li><a href="api.html">API</a></li>
          </ul>
        </nav>

        <div class="logo">
          <a href="/"><img src="images/seui2-logo3.png" height="21px"></a>
        </div>`
  const oldHeader = document.body.querySelector('#main-header');
  document.body.replaceChild(newHeader, oldHeader);

  // Append stylesheet
  document.head.appendChild();
  console.log("check did it execute");
})();
