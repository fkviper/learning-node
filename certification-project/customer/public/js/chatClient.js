$(function () {
    const socket = io();
    function createTopicHandler(event){
        event.preventDefault();
        let topicName = $("#new-topic-text").val();
        $("#topic-name-id").attr("value",topicName );
        $('#myModal').modal({show: true});
        $("#final-create-topic-btn").on('click',function(event){
            const nickname = $("#nick-name-id").val();
            const description =$("#topic-description-id").val();
            topicName =  $("#topic-name-id").val();
            socket.emit('add-new-topic', {
                name : nickname,
                topic: topicName,
                description:description,
                socketId: socket.id
            });
            //erase everything before closing.
            $('#new-topic-text').val('');
            $("#topic-name-id").val('');
            $("#nick-name-id").val('');
            $("#topic-description-id").val('');
            $('#myModal').modal('hide');
        });        
    };

    function onTopicClickEventHandler(event){
        event.preventDefault();
        const id = $(this).attr('id');
        const idStr = `#${id}`;
        const NewTopic = $(idStr).find(".topic_title").text();
        console.log("Topic id :" , id);
        console.log("Topic text :",NewTopic);
        const newUserEnteredData = {
            active: NewTopic,
            socketId: socket.id
        };
        console.log(newUserEnteredData);
        const currTopic = $(".active_topic").find(".topic_title").text();
        if(NewTopic != currTopic){
            socket.emit('user-leave-topic',currTopic);
            socket.emit('user-entered-topic', newUserEnteredData);
            $(".active_topic").removeClass("active_topic");
            $(this).addClass("active_topic");
            $(".msg_history").empty();
        }
    };
    socket.on('connect', () => {
        let activeTopic =$(".active_topic").find(".topic_title").text();
        const newUserEnteredData = {
            active: activeTopic,
            socketId: socket.id
        };
        socket.emit('user-entered-topic', newUserEnteredData);
    });

    socket.on('incoming-message', function (message) {
        if (message.socketId != socket.id)
            $('.msg_history').append(message.text);
    });

    socket.on('new-user-entered', function (message) {
        if (message.socketId != socket.id)
            $('.msg_history').append(message.text);
    });

    //if condition is not required because this is a broadcaseted message.
    socket.on('new-topic-added', function (message) {
        $('.topic_list').append(message.text);
        $('.topic_item').on('click', onTopicClickEventHandler);
    });

    // userlist event
    socket.on('topic-created', (data) => {
        console.log("client : userlist event : data => ", data)
        $('#activeuser').empty()
        data.map((item) => {
            $('#activeuser').append(`nickname: <strong>${item}<strong><br/>`)
        })
        let total = data.length;
        document.getElementById('listu').innerHTML = total
        $('b').val(total);
    })
    $('.msg_send_btn').on('click', function (event) {
        event.preventDefault();
        const d = new Date();
        const ts = `${d.getHours()}:${d.getMinutes()}`;
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novembar", "Decembar"];
        const timeStampStr = `${ts} | ${months[d.getMonth()]} ${d.getDate()}`;
        /*11:01 | June 9*/

        let title = $(".active_topic").find(".topic_title").text();
        console.log(title);
        let eventData = {
            topic: title,
            message: $('#text-message').val(),
            timeStamp: timeStampStr,
            socketId: socket.id
        };

        socket.emit('new-message', eventData);
        let messageHtml = `<div class="outgoing_msg">
                                <div class="sent_msg">
                                <p>${eventData.message}</p>
                                <span class="time_date"> ${eventData.timeStamp}</span> </div>
                            </div>`;
        $('.msg_history').append(messageHtml);
        $('#text-message').val('');
    });
    $('#create-topic-btn').on('click', createTopicHandler );
    $('.topic_item').on('click', onTopicClickEventHandler);
});