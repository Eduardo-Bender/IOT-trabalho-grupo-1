import paho.mqtt.client as mqtt

BROKER = "broker.hivemq.com"
TOPICO_ENTRADA = "grupo1_publish_mqtt"
TOPICO_SAIDA = "grupo1_subscribe_mqtt"

def on_connect(client, userdata, flags, rc, properties=None):
    print("Conectado ao broker! Código:", rc)
    client.subscribe(TOPICO_ENTRADA)
    print(f"Assinado no tópico: {TOPICO_ENTRADA}")

def on_message(client, userdata, msg):

    if msg.payload.decode() != "":
        print(f"\n📩 Mensagem recebida em {msg.topic}: {msg.payload.decode()}\n> ", end="")

# Criar cliente compatível com Paho 2.x
client = mqtt.Client(
    client_id="BridgePython",
    callback_api_version=mqtt.CallbackAPIVersion.VERSION2
)

client.on_connect = on_connect
client.on_message = on_message

client.connect(BROKER, 1883, 60)
client.loop_start()

print("Digite mensagens para publicar (Ctrl+C para sair):")

try:
    while True:
        texto = input("> ").strip()
        if texto:
            client.publish(TOPICO_SAIDA, texto)
            print(f"📤 Enviado para {TOPICO_SAIDA}: {texto}")

except KeyboardInterrupt:
    print("\nEncerrando...")

client.loop_stop()
client.disconnect()