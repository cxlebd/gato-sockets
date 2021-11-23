
function setName(){
    localStorage.setItem('name', document.getElementById('name').value);
    location.href = '/start/game';
}

function getName(){
    return localStorage.getItem('name');
}

function searchRoom(){
    localStorage.setItem('room','null');
    localStorage.setItem('createRoom',false);
    setName();
}

function loadNewForm(){
    $('#personal').html(`

    <div class="mt-5">
        <div class="alert alert-warning" role="alert">
            Si la sala ya existe ingresera de manera automatica
        </div>
        <p class="text-medium">Ingrese el nombre de la sala (sin espacios)</p>
        <input type="text" autocomplete="off" class="form-control" id="room" placeholder="Room name">
        <br><br>
        <input type="button" class="btn btn-danger" onclick="createRoom()" value="Entrar">
    </div>

    `);
}

function createRoom(){
    //antes de crear la sala debo de mandarle 3 parametros al local storaged
    localStorage.setItem('room',document.getElementById('room').value);
    localStorage.setItem('createRoom',true);
    setName();
}