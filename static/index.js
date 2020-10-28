// -------------------front end---------------------------
let frontSocket = io.connect('http://localhost:3500');


let nameRef  = document.getElementById('name')
let messageRef = document.getElementById('message')
let output = document.getElementById('output');
let feedback = document.getElementById('feedback');
let sendBtnRef = document.getElementById('send-btn');
let clear = document.getElementById('clear');

sendBtnRef.addEventListener('click',function(){
    if(!messageRef.value || !nameRef.value){
     return;
    }
    frontSocket.emit('message',{
      name:nameRef.value,
      message:messageRef.value
    });
});

clear.addEventListener('click',function(){ // clear
  frontSocket.emit('clear');
  while (output) // as long as there is a message, each one will be removed.
      output.removeChild(output.firstChild);

  
});
document.addEventListener('keydown',function(e){
  if(e.key == 'Enter'){
    if(!messageRef.value || !nameRef.value){
      return;
     }
     frontSocket.emit('message',{
       name:nameRef.value,
       message:messageRef.value
     });
  }
})
messageRef.addEventListener('input',function(){
  if(messageRef.value != ''){
    frontSocket.emit('typing',nameRef.value)
  }
  else{
    frontSocket.emit('typing', '');
  }
})
frontSocket.on('output',function(data){ 
  if(data.length){ // if there are messages stored in the data base, 
                  //it'll execute this loop to print out all the messages
    for(let i = 0; i < data.length; i++){
      let message = document.createElement('div');
      message.textContent = data[i].name + ':' + data[i].message;
      output.append(message);
    }
  }
  messageRef.value = '';
  feedback.innerHTML = ''
});
frontSocket.on('typing',function(data){
  if(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing... </em></p>';
  }
  else feedback.innerHTML = '';
})

