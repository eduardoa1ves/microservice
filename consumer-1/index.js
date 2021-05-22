#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    
    var queue_aceitos = 'pedidos_aceitos';
    var queue_rejeitados = 'pedidos_rejeitados';

    channel.assertQueue(queue_aceitos, {
      durable: false
    });

    channel.assertQueue(queue_rejeitados, {
      durable: false
    });

    channel.prefetch(1);

    channel.consume(queue_aceitos, function(msg) {

      let milliseconds = new Date().getMilliseconds();
      let message = {
        from: 'consumer-1@email.com',
        to: 'to@email.com',
        subject: 'Channel Consumes',
        text: ''
      };
        
      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(() => {
        console.log(" [x] Done");
        if(milliseconds % 10 == 0){
          channel.nack(msg);
          message.text = "Message was nack";
        }else{
          if(milliseconds % 2 == 0){
            channel.ack(msg);
            message.text = "Message was ack";
          }else{
            channel.reject(msg);
            message.text = "Message was reject";
          }
        }
        console.log(message); // send email
      }, 2000);
        
    }, {
      noAck: false
    });

    channel.consume(queue_rejeitados, function(msg) {

      let milliseconds = new Date().getMilliseconds();
        
      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(() => {
        console.log(" [x] Done");
        if(milliseconds % 10 == 0){
          channel.nack(msg);
        }else{
          if(milliseconds % 2 == 0){
            channel.ack(msg);
          }else{
            channel.reject(msg);
          }
        }
      }, 2000);
        
    }, {
      noAck: false
    });
  });
});