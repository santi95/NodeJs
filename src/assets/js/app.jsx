import React from 'react';
import ReactDOM from 'react-dom';
import Comentarios from './containers/comments';


var commentContainer = document.getElementById('comments');
var publicationId = commentContainer.getAttribute('data-id');
var user = commentContainer.getAttribute('data-logIn');

ReactDOM.render(<Comentarios publicationId={publicationId} user={user} />, commentContainer);

