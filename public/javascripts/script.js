var buttons = document.getElementsByClassName('vote');

for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', vote, false);
}

function vote() {
  var attribute = this.getAttribute("id");
  var visited = this.getAttribute("visited");
  if(attribute==-1) {
    window.location = "login";
  } else {
    var counter = this.getElementsByClassName("counter")[0];
    var vote = document.getElementById(attribute);
    if(counter.style.color != "rgb(108, 197, 118)" && !visited) {
      counter.style.color = "#6CC576";
      vote.style.borderColor = "#6CC576";
      counter.innerHTML++;
    } else {
      counter.style.color = "#f4157e";
      vote.style.borderColor = "#f4157e";
      counter.innerHTML--;
    }
    var score = counter.innerHTML;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    if(visited==null)
      visited = false;
    xhr.send(encodeURI('score=' + score + "&id=" + attribute + "&visited=" + visited));
    if(visited) {
      this.setAttribute("visited", "");
    } else {
      this.setAttribute("visited", "true");
    }
  }
}
