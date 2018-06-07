const env = require('./Environment');
const amqp = require('amqplib');
const logger = require('./Logger');
const Q = require('q');
const uuidV1 = require('uuid/v1');

const FAN_EXCHANGE_ID = 'fanout_';

let instance = null;

class EventQueue {
  constructor() {
    this.amqpConn = null;
    this.channel = null;
    this.serviceQueue = null;
    this.messageHandler = null;

    if (!instance) {
      instance = this;
    }
    return instance;
  }

  init() {
    return this.connect()
      .then(this.setUpChannel.bind(this))
  }

  connect() {

    let eqUrl = this.createEQUrl();
    logger.info('[EVENT QUEUE] connecting...' + eqUrl);
    let that = this;
    let promise = new Promise(function (resolve, reject) {
      amqp.connect(eqUrl)
        .then(onConnectionSuccess, onConnectionFailure);

      function onConnectionFailure(err) {
        logger.error(err);
        reject()
      }

      function onConnectionSuccess(conn) {
        logger.info('[EVENT QUEUE] connection successful');
        that.setAmqpConnection(conn);
        let promise = that.setUpConnection(that.getAmqpConnection());
        resolve(promise)
      }
    });

    return promise;
  }


  createEQUrl() {
    let host = env.getProperty('QUEUE_HOST');
    let user = env.getProperty('QUEUE_USER');
    let password = env.getProperty('QUEUE_PASSWORD');
    let vHost = env.getProperty('QUEUE_VHOST');
    let heartbeat = env.getProperty('QUEUE_HEARTBEAT');

    let queueUrl = 'amqps://' + user + ':' + password + '@' + host + '/' + vHost + '?' + heartbeat;
    return queueUrl;
  }

  setUpConnection(conn) {
    conn.on('error', this.onError);
    conn.on('close', this.onClose);
  }

  onError(err) {
    if (err.message !== "Connection closing") {
      logger.error("[EVENT QUEUE] conn error", err.message);
    }
  }

  onClose() {
    logger.error("[EVENT QUEUE] reconnecting");
  }

  setUpChannel() {
    let conn = this.getAmqpConnection();
    let that = this;
    return conn.createChannel()
      .then((ch) => {
        that.setChannel(ch);
      }, (err) => {
        logger.error(err);
      })
      .then(this.assertTopicExchange.bind(this))
      .then(this.assetFanoutExchange.bind(this))
      .then(this.bindExchanges.bind(this))
      .then(this.assertQueue.bind(this))
      .then(this.bindQueue.bind(this))
  }

  assertTopicExchange() {
    let topicExchangeId = env.getProperty('EVENT_TOPIC_EXCHANGE_ID');
    let channel = this.getChannel();
    return channel.assertExchange(topicExchangeId, 'topic', {durable: false})
      .then((exchange) => {
        logger.info('[EVENT QUEUE] event exchange :: ' + exchange.exchange);
      }, (err) => {
        logger.error('[EVENT QUEUE] Topic exchange failed :: ' + err);
        if (err && err.stack) {
          logger.error('[EVENT QUEUE] ' + err.stack);
        }
      })
  }

  assetFanoutExchange() {
    logger.info('[EVENT QUEUE] asserting fanout exchanges');
    let that = this;
    let promiseArray = [];
    let exchangeList = that.extractFanoutExchangeList();
    let channel = that.getChannel();
    exchangeList.forEach(function (item) {
      let promise = channel.assertExchange(item.exchangeId, item.type, item.options)
        .then((exchange) => {
          logger.info('[EVENT QUEUE] FanOut exchange asserted :: ' + exchange.exchange);
        }, (err) => {
          logger.error('[EVENT QUEUE] FanOut exchange failed :: ' + err);
        });
      promiseArray.push(promise);
    });
    return Q.all(promiseArray);
  }

  bindExchanges() {
    let that = this;
    let topicExchangeId = env.getProperty('EVENT_TOPIC_EXCHANGE_ID', 'gmn_event');
    let exchangeList = this.extractFanoutExchangeList();
    let channel = that.getChannel();
    exchangeList.forEach(function (item) {
      channel.bindExchange(item.exchangeId, topicExchangeId, item.topic);
      logger.info('[EVENT QUEUE] Bonded fan out exchange :: ' + item.exchangeId + ' to topic exchange :: ' + topicExchangeId + ' with topic:: ' + item.topic);
    })
  }

  assertQueue() {
    let that = this;
    let serviceName = env.getProperty('SERVICE_NAME', '');
    let serviceVersion = env.getProperty('SERVICE_VERSION', '');
    let channel = that.getChannel();
    return channel.assertQueue(serviceName + '_' + serviceVersion + '_event_queue', {durable: true})
      .then((q) => {
        logger.info('[EVENT QUEUE] Queue ' + q.queue + ' Asserted');
        that.setServiceQueue(q)
      }, (err) => {
        logger.error('[EVENT QUEUE] assert queue failed :: ' + err);
      });
  }

  bindQueue() {

    let that = this;
    let exchangeList = that.extractFanoutExchangeList();
    let channel = that.getChannel();
    let serviceQueue = that.getServiceQueue();
    let promiseArray = [];

    exchangeList.forEach(function (item) {
      channel.bindQueue(serviceQueue.queue, item.exchangeId);
      logger.info('[EVENT QUEUE] Queue :: ' + serviceQueue.queue + ' bound to :: ' + item.exchangeId + ' exchange');
      let promise = channel.consume(serviceQueue.queue, that.getMessageHandler(), {noAck: true});
      promiseArray.push(promise);
    });

    return Q.all(promiseArray);
  }

  extractFanoutExchangeList() {
    let configString = env.getProperty('FANOUT_EXCHANGE_LIST', '');
    let exchangeList = configString.split(',');
    logger.info('[EVENT QUEUE] exchangeList :: ' + exchangeList);
    let that = this;
    let fanOutExchangeList = [];
    exchangeList.forEach(function (item) {
      let fanExchangeData = {
        topic: item,
        exchangeId: FAN_EXCHANGE_ID + that.getExchangeName(item),
        type: 'fanout',
        options: {
          durable: false
        }
      };
      fanOutExchangeList.push(fanExchangeData);
    });
    return fanOutExchangeList;
  };

  getExchangeName(exchange) {
    exchange = exchange.replace('\*', '_');
    exchange = exchange.replace('\.', '_');
    return exchange;
  };

  setMessageHandler(fn) {
    this.messageHandler = fn;
  }

  getMessageHandler() {
    return this.messageHandler;
  }

  setServiceQueue(q) {
    this.serviceQueue = q
  }

  getServiceQueue() {
    return this.serviceQueue;
  }

  getChannel() {
    return this.channel;
  }

  setChannel(ch) {
    this.channel = ch;
  }

  setAmqpConnection(conn) {
    this.amqpConn = conn;
  }

  getAmqpConnection() {
    return this.amqpConn;
  }

  dispatchEvent(eName, eCategory, eReqId, data) {
    logger.info('[EVENT QUEUE] dispatchEvent ::' + eName);
    let topicExchangeId = env.getProperty('EVENT_TOPIC_EXCHANGE_ID');
    let serviceName = env.getProperty('SERVICE_NAME');
    let serviceVersion = env.getProperty('SERVICE_VERSION');
    let timeStamp = new Date();
    let evt = {
      eventId: uuidV1(),
      eventName: eName,
      timeStamp: timeStamp.getTime(),
      category: eCategory,
      eventVersion: 'v1',
      eventSource: serviceName + '_' + serviceVersion,
      requestId: eReqId,
      data: data
    };
    this.getChannel().publish(topicExchangeId, eName, new Buffer(JSON.stringify(evt)));
  };


}

module.exports = EventQueue;