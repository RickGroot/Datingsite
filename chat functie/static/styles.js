var socket = io.connect('http://localhost:8080');

var message = document.getElementById('bericht');
var btn = document.getElementById('send');
var output = document.getElementById('tekst');
var feedback = document.getElementById('feedback');

btn.addEventListener('click', function(){

    socket.emit('chat', {
    message: message.value,
    username : username
    });
    document.getElementById('bericht').value ='';
});


message.addEventListener('keypress', function(){
    socket.emit('typing', username);
});



socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += "<p><strong>" + data.username + ': </strong>' + data.message + "</p>"
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is aan het typen... </em></p>'
});


var username = prompt('Wat is je naam');
socket.emit('username', username );
usr.innerHTML = username;