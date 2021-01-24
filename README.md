# 설명
이 저장소는 NODE에서 사용되는 MQTT를 조금더 간단하게 사용하기 위한 라이브러리입니다.

기존 MQTT 사용법

```js
client.on('message', function (topic, message) {
  if(topic === "some1") {
    // "do something"
  }
  else if(topic === "some1") {
    // "do something"
  }
})
```

위와 같은 형태로 message 콜백에서 조건문으로 토픽을 처리하게 됩니다.

```js
client.on('message', function (topic, message) {
  // topic = "v1/device/1/data"
  const topics = topic.split('/')
  const deviceId = topics[2]
})
```

topic 안에서 식별자를 찾기위해 위 예제와 같이 어떠한 파라미터를 꺼내야 할수도있습니다.
 
# SimpleMqttt 사용법

```js

const deviceDataDispatcher: TopicDispatcher = async (
  client: MqttClient,
  message: Buffer,
  params: any
) => {
  console.log(message.toString())
  console.log(params["deviceId"])
}

const topics = [new Topic("device/<deviceId>/data", deviceDataDispatcher)]

const mqttSetting = {
  ip: "localhost",
  port: 1883,
} as MqttSetting

const simpleMqtt = new SimpleMqtt(mqttSetting, topics)

```
1. SimpleMqtt는 자동으로 위의 토픽을 "device/+/data"로 변경하여 subscribe하게 됩니다.

2. topic "device/\<deviceId\>/data"는 deviceDataDispatcher함수에서 처리됩니다.

3. 파라미터 \<deviceId\>는 deviceDataDispatcher 파라미터인 params안에 자동으로 파싱됩니다.
    

  



  




