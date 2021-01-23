import { MqttClient, connect, PacketCallback } from "mqtt"

export interface MqttSetting {
  ip: string
  port: number
  username?: string
  password?: string
}

export class SimpleMqtt {
  topics: Topic[]
  _mqttClient: MqttClient
  onConnect!: () => void

  constructor(mqttSetting: MqttSetting, topics: Topic[]) {
    this.topics = topics
    this._mqttClient = connect({
      host: mqttSetting["ip"],
      port: mqttSetting["port"],
    })
    this._mqttClient.on("connect", this._onConnect)
    this._mqttClient.on("message", this._onMessage)
  }
  private _onConnect = () => {
    console.log("mqtt coneected")

    if (this.onConnect) {
      this.onConnect()
    }
    this.topics.forEach((topic) => {
      this._mqttClient.subscribe(topic.getMqttTopic())
    })
  }
  private _onMessage = async (topic: string, message: Buffer) => {
    try {
      const result = this.getTopicDispatcher(topic)
      const dispatcher = result["dispatcher"]
      const params = result["params"]

      await dispatcher(this._mqttClient, message, params)
    } catch (e) {
      console.log(`Topic:${topic} error >> ${e}`)
    }
  }

  getTopicDispatcher(topic: string) {
    for (let i = 0; i < this.topics.length; i++) {
      const result = this.topics[i].match(topic)
      if (result) return result
    }

    throw "topic not matched"
  }
  publish(
    topic: string,
    message: string | Buffer,
    callback?: PacketCallback | undefined
  ) {
    this._mqttClient.publish(topic, message, callback)
  }
}

export interface TopicDispatcher {
  (client: MqttClient, message: Buffer, params: any): Promise<void>
}

export class Topic {
  path: string
  dispatcher: TopicDispatcher
  mqttTopic: string
  regexp: RegExp
  constructor(path: string, dispatcher: TopicDispatcher) {
    this.path = path
    this.dispatcher = dispatcher
    this.mqttTopic = this.path.replace(/<\w+>/g, "+")

    this.regexp = new RegExp(
      this.path.replace(/<\w+>/g, "(?$&[^/]+)").replace(/#/g, "(.*?)")
    )
  }

  getMqttTopic() {
    return this.mqttTopic
  }

  match(path: string) {
    const match = this.regexp.exec(path)

    if (match) {
      return {
        dispatcher: this.dispatcher,
        params: match.groups,
      }
    }

    return null
  }
}
