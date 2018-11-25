import React from 'react';
import ReactDOM from 'react-dom';
import ZoomImg from './components/ZoomImg';

import './assets';
import '../styles/index.scss';

console.log('App is running on the browser too!');

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: true
    };
  }
  render() {
    return (
      <div>
        <ZoomImg
          imageWidth={200}
          imageHeight={200}
          src = {imagePath}
          alt = ""
        />
      </div>
    );
  }
}

const imageElement = document.getElementById('image');
const imagePath = imageElement.getAttribute("path");
ReactDOM.render(<Image path={imagePath} />, imageElement);
