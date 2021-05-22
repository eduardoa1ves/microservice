#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  console.log('connection success');
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    console.log('channel success');
    
    var queue_aceitos = 'pedidos_aceitos';
    var queue_rejeitados = 'pedidos_rejeitados';

    channel.assertQueue(queue_aceitos, {
      durable: false
    });

    channel.assertQueue(queue_rejeitados, {
      durable: false
    });

    setInterval(() => {

      var msg = {
        data: new Date().toISOString(),
        nome: "hello",
        servicos: [
          {
            nome: "a"
          },
          {
            nome: "b"
          },
        ]
      };

      if(new Date().getMilliseconds() % 2 == 0){
        channel.sendToQueue(queue_aceitos, Buffer.from(JSON.stringify(msg)));
      }else{
        channel.sendToQueue(queue_rejeitados, Buffer.from(JSON.stringify(msg)));
      }
      console.log(" [x] Sent %s", msg);

    }, 100);
      
  });

});