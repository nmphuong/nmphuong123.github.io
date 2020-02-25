const socket = io('https://webrtcv1demo.herokuapp.com/');
//div chat an khi chua nhap username
$('#divChat').hide();
socket.on('List_Online', arrUserInfo => {

        //Show div chat va hide div dang ky khi da dang ki username
        $('#divChat').show();
        $('#divRegister').hide();
        arrUserInfo.forEach(user => {
                const { ten, peerId } = user;
                $('#ulUser').append(`<button type="button" id="${peerId}">${ten}</button>`);
        });
        socket.on('have_a_register', user => {
                const { ten, peerId } = user;
                $('#ulUser').append(`<button type="button" id="${peerId}">${ten}</button>`);
        });
        socket.on('user_disconnect', peerId => {
                $(`#${peerId}`).remove();
        });
});

socket.on('register_fail', () => alert('Please choose another username!'));

function openStream() {
        const config = { audio: true, video: true };
        return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
        const video = document.getElementById(idVideoTag);
        video.srcObject = stream;
        video.play();
}
// openStream()
// .then(stream => playStream('localStream', stream));

const peer = new Peer({ key: 'peerjs', host: 'mypeer33.herokuapp.com', secure: true, port: 443 });

peer.on('open', id => {
        //$('#my-peer').append(id)
        $('#btnSignUp').click(() => {
                const username = $('#txtUsername').val();
                socket.emit('User_Register', { ten: username, peerId: id });
        });
});

//Local
$('#btnCall').click(() => {
        const id = $('#remoteId').val();
        openStream()
                .then(stream => {
                        playStream('localStream', stream);
                        const call = peer.call(id, stream);
                        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
                });
});

//var offer = 1;
//var id1;
$('#ulUser').on('click', 'button', function () {
        const id = $(this).attr('id');
        //if (offer == 1) {
                openStream()
                        .then(stream => {
                                playStream('localStream', stream);
                                const call = peer.call(id, stream);
                                call.on('stream', remoteStream => playStream('remoteStream1', remoteStream));
                        });
        //} else {
        //         openStream()
        //                 .then(stream => {
        //                         const call = peer.call(id, stream);
        //                         const call1 = peer.call(id1, stream);
        //                         call1.on('stream', remoteStream1 => playStream('remoteStream1', remoteStream1));
        //                         call.on('stream', remoteStream => playStream('remoteStream2', remoteStream));
        //                 });
        // }
        // offer = 2;
        // id1 = id;
});
//var answer = 1;
//Remote
peer.on('call', call => {
        //if(answer == 1){
                openStream()
                .then(stream => {
                        playStream('localStream', stream);
                        call.answer(stream);
                        call.on('stream', remoteStream => playStream('remoteStream1', remoteStream));
                });
        // } else {
        //         openStream()
        //         .then(stream => {
        //                 playStream('localStream', stream);
        //                 call.answer(stream);
        //                 call1.answer(stream);
        //                 call1.on('stream', remoteStream1 => playStream('remoteStream1', remoteStream1));
        //                 call.on('stream', remoteStream => playStream('remoteStream2' , remoteStream));
        //         });
        // }
        // answer = 2;
});