import { MqttClient } from "mqtt"
import { SimpleMqtt, Topic, TopicDispatcher, MqttSetting } from "../lib"

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
