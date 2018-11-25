import React from "react";

export default function Box(props) {

    // Recibo los comentarios en el dumb component.
    const currentUser = props.user;
    // Armo los comentarios.
    const comentariosArmados =
        <div>
            <div class="newComment">
                <h3>Comentar</h3>

                <div class="row">

                    <textarea placeholder="Escribe tu comentario aquí" rows="5" cols="200" type="text" name="description"
                        id="description" maxlength="120" required></textarea>

                </div>

                <div class='actions' id='botonComentar'>
                    <input class='defaultButton' type='submit' value='Comentar' />
                </div>
            </div>
        </div>;


    return <div>{comentariosArmados}</div>;
    // return <div><h1>llegue a algo</h1></div>;


}