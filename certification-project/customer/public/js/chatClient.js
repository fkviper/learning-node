const socket = io();

let isNickSet = false
// chat event
socket.on('incoming-message', function (message) {
   let incoming_msg = `<div class="incoming_msg"><div class="incoming_msg_img"><img src="https://ptetutorials.com/images/user-profile.png" alt="Annonymous User"></div>
                        <div class="received_msg">
                            <div class="received_withd_msg">
                            <p>${message.text}</p>
                            <span class="time_date"> ${message.timestamp}</span></div>
                        </div>
                        </div>`;
    $('.incoming_msg').append(incoming_msg);
});

// userlist event
socket.on('topic-created', (data)=>{
    console.log("client : userlist event : data => ", data)
    $('#activeuser').empty()
    data.map((item)=>{
        $('#activeuser').append(`nickname: <strong>${item}<strong><br/>`)
    })
    let total = data.length;
    document.getElementById('listu').innerHTML= total
    $('b').val(total);
})

$(function() {
    // Send chat message
    $('.msg_send_btn').on('click', function(event) {
        event.preventDefault();
        const d = new Date();
        const ts = `${d.getHours()}:${d.getMinutes()}`;
        var months = ["January", "February", "March", "April", "May", "June", "July","August","September","October","Novembar","Decembar"];
        const timeStampStr = `${ts} | ${months[d.getMonth()]} ${d.getDate()}`;
        /*11:01 | June 9*/
        socket.emit('new-message', {
                message: $('#text-message').val(),
                timeStamp: timeStampStr
        });
        $('#chatText').val('');
    });
    $('#create-topic-btn').on('click', function(event) {
        event.preventDefault();
        socket.emit('chat', {
                message:$('#text-message').val()
        });
        $('#chatText').val('');
    });
});