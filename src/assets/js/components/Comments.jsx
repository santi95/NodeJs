import React from "react";

export default function Comments(props) {
  // Recibo los comentarios en el dumb component.
  const comments = props.comments.comments;
  const users = props.users.users;

  function usuario(users, id){
    const myUser = users.find(item => item.id == id);
    return myUser.firstName + ' ' + myUser.lastName
  };
  
  // Armo los comentarios.
  const comentariosArmados = comments.map((comment) =>
    <div>
      <div class="row">
        <p>
          {/* User */}
          { usuario(users, comment.userId) }
        </p>
        <p class="text-align-right">
          {comment.createdAt.substring(0, 10)}
        </p>
      </div>

      <div class="row comment">
        <p>
          {comment.description}
        </p>
      </div>
      <div class="line50"></div>
    </div>
  );

  // const comentar = 

  // Rendereamos comentarios
  return <div>{comentariosArmados}</div>;
  // return <div><h1>llegue a algo</h1></div>;


}