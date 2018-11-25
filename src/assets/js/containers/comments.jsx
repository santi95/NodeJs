import React, { Component } from 'react';
import Comments from '../components/Comments';
import Box from '../components/Box';


export default class Comentarios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      comments: [],
      newComment: '',
    };

    this.publicationId = this.props.publicationId;
    this.currentUser = this.props.user;
    this.users = [];

    this.handleNewComment = this.handleNewComment.bind(this);

  }

  componentDidMount() {
    this.fetchNowComments();
  }

  async fetchNowComments() {
    this.setState({ loading: true });
    // Pedimos los usuarios
    const userResponse = await fetch('/users', { method: 'get', headers: { Accept: 'application/json' } });
    const users = await userResponse.json();
    this.users = users;
    // Pedimos los comentarios de la publicacion
    const commentResponse = await fetch('/publications/' + this.publicationId + '/comments', { method: 'get', headers: { Accept: 'application/json' } });
    const comments = await commentResponse.json();
    this.setState({ loading: false, comments: comments });
  }

  async handleNewComment() {
    this.setState({ loading: true });
    // Hacemos la llamada a la api
    var json = {
      "userId": this.currentUser,
      "publicationId": this.publicationId,
      "description": document.getElementById('description').value
    };
    await fetch('/publications/' + this.publicationId + '/comments', {
      method: 'post',
      headers: { Accept: 'application/json' },
      body: JSON.stringify(json)
    });
    this.fetchNowComments();
    this.setState({ loading: false });
  }

  render() {
    let body = null;
    let box = null;

    if (this.state.loading) {
      body = <p>Cargando...</p>;
    } else if (this.currentUser != '') {
      body = <Comments comments={this.state.comments} users={this.users} />;

      // Armamos la caja para comentar
      box =
        <div>
          <div class="newComment">
            <h3>Comentar</h3>

            <div class="row">

              <textarea placeholder="Escribe tu comentario aquí" rows="5" cols="200" type="text" name="description"
                id="description" maxlength="120" minLength="10" required></textarea>

            </div>

            <div class='actions' id='botonComentar'>
              <a href="#bottom">
                <input class='defaultButton' type='submit' value='Comentar' onClick={this.handleNewComment} />
              </a>
            </div>
          </div>
        </div>;


    } else {
      body = <Comments comments={this.state.comments} users={this.users} />;

    }

    return (
      <div>
        {body}
        {box}
      </div>
    );
  }
}