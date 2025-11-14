/// PENDENCIAS PARA RODAR ESSA JOÇA
/// INSTALE ATRAVES DO LIBRARY MANAGER DO ARDUINO IDE AS SEGUINTES COISAS
/// - DHT11 by Dhruba Saha (v2.1.0+)
/// - Ultrasonic by Erick Simões (v3.0.0+)
/// - Keypad by Mark Stanley, Alexander Brevig (v3.1.1+)
/// - PubSubClient by Nick O'Leary (v2.8+)
/// - IRremote by shirriff, z3t0, ArminJo (v4.5.0+)



#include <stdio.h>
//----------------------------------------------------------
// PINOS
#define analogTempPin A0
#define velocidadePin 2
// PINOS DO KEYPAD LA EM BAIXO NA SECAO DO KEYPAD
#define dht11pin 15
#define relePin 17
#define somTriggerPin 21
#define somEchoPin 22
int RECV_PIN = 22;                          // Arduino pino D11 conectado no Receptor IR

//----------------------------------------------------------
// WIFI
#include "../lib/mqtt.h"

//----------------------------------------------------------
// IREMOTE
#include <IRremote.h>                       // Biblioteca IRemote
IRrecv irrecv(RECV_PIN);                    // criando a instância
decode_results results;                     // declarando os resultados

void loop_ir(void);

//----------------------------------------------------------
// DHT11
#include <DHT11.h>
DHT11 dht11(dht11pin);
float temperatura;
float umidade;

void dht11Loop(void);

//----------------------------------------------------------
// Sensor Infravermelho de movimento
int contagemVel = 0;
int leituraVel;

void velocidadeLoop(void);

//----------------------------------------------------------
// Keypad
#include <Keypad.h>
const byte rows = 4;
const byte cols = 4;
byte colPins[cols] = {9, 8, 7, 6};
byte rowPins[rows] = {13, 12, 11, 10};
char keys[rows][cols] = {
  {'1','2','3', 'a'},
  {'4','5','6', 'b'},
  {'7','8','9', 'c'},
  {'#','0','*', 'd'}
};

Keypad keypad = Keypad( makeKeymap(keys), rowPins, colPins, rows, cols );

void keypadLoop(void);

//----------------------------------------------------------
// Sensor de temperatura analogico
int valTemp= 0;
double voltsTemp = 0;

void temperaturaLoop(void);

//----------------------------------------------------------
// Sensor de distancia ultrassonico
#include <Ultrasonic.h>
Ultrasonic ultrasonic(somTriggerPin, somEchoPin, 40000UL);

void somLoop(void);

//----------------------------------------------------------
// Giroscopio e acelerometro MPU6050 
#include <Wire.h>
const int MPU=0x68;  
int AcX,AcY,AcZ,Tmp,GyX,GyY,GyZ;

void setupAcelerometro(void);
void acelerometroLoop(void);

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

void setup() {
  Serial.begin(9600);
  //setupAcelerometro(); // Its over
  setupMqtt();
  pinMode(velocidadePin, INPUT);
  pinMode(relePin, OUTPUT);
  digitalWrite(relePin, HIGH);

  dht11.setDelay(50);
  irrecv.enableIRIn();
}

void loop() {
  mqttLoop();
  somLoop();
  dht11Loop();
  temperaturaLoop();
  velocidadeLoop(); // Precisa achar um jeito de conferir melhor se ta ou nao conectado
  //keypadLoop();   // Precisa achar um jeito de conferir melhor se ta ou nao conectado
  //loop_ir();      // Precisa achar um jeito de conferir melhor se ta ou nao conectado
  //acelerometroLoop(); // Its over

  //displayLoop();
  //botaoLoop();
  delay(1000);
}

void setupAcelerometro()
{
  Wire.begin();
  Wire.beginTransmission(MPU);
  Wire.write(0x6B); 
   
  Wire.write(0); 
  Wire.endTransmission(true);
}
 
void loop_ir()
{
  if (irrecv.decode(&results))              // se algum código for recebido
  {
    Serial.println(results.value, HEX);     // imprime o HEX Code
    irrecv.resume();                        // reinicializa o receptor
  }
}

void velocidadeLoop()
{
  leituraVel = digitalRead(velocidadePin); 
  if (leituraVel == 1) { 
    contagemVel++; 
    Serial.print("Numero de deteccoes: ");
    Serial.println(contagemVel);
  }
}

void dht11Loop()
{
  temperatura = dht11.readTemperature();
  umidade = dht11.readHumidity();
  if(temperatura == DHT11::ERROR_TIMEOUT || umidade == DHT11::ERROR_TIMEOUT)
  {
    return;
  }
  Serial.print("Temperatura: ");
  Serial.println(temperatura);
  Serial.print("Umidade: ");
  Serial.println(umidade);
}

void keypadLoop()
{
  char key = keypad.getKey();
  if (key == NO_KEY)
  {
    return;
  }
  else if (key != NO_KEY)
  {
    Serial.print("Tecla pressionada: ");
    Serial.print(key);
    Serial.println();
  }
}

void somLoop(){
  float cmMsec, inMsec;
  cmMsec = ultrasonic.read(CM);

  if(cmMsec < 0 || cmMsec > 200)
  {
    return;
  }
  Serial.print("Distancia em cm: ");
  Serial.print(cmMsec);
  Serial.println();
}

void temperaturaLoop() {  
  valTemp = analogRead(analogTempPin); 
  voltsTemp = map(valTemp, 0, 1023, 0, 3300);
  float scaledTemp = (voltsTemp-500) * 0.1;
  if(scaledTemp < 0 || scaledTemp > 100)
  {
    return;
  }
  
  Serial.println(scaledTemp, 1);
}

void acelerometroLoop() {
  Wire.beginTransmission(MPU);
  Wire.write(0x3B);  
  Wire.endTransmission(false);
  
  //Solicita os dados do sensor
  Wire.requestFrom(MPU,14,true);  
  
  //Armazena o valor dos sensores nas variaveis correspondentes
  AcX=Wire.read()<<8|Wire.read();      
  AcY=Wire.read()<<8|Wire.read(); 
  AcZ=Wire.read()<<8|Wire.read(); 
  Tmp=Wire.read()<<8|Wire.read(); 
  GyX=Wire.read()<<8|Wire.read(); 
  GyY=Wire.read()<<8|Wire.read(); 
  GyZ=Wire.read()<<8|Wire.read(); 

   
  //Mostra os valores na serial
  Serial.print("AcX = "); 
  Serial.print(AcX);
  Serial.print(" | Y = "); 
  Serial.print(AcY);
  Serial.print(" | Z = "); 
  Serial.print(AcZ);
  Serial.print(" | Gir. X = "); 
  Serial.print(GyX);
  Serial.print(" | Y = "); 
  Serial.print(GyY);
  Serial.print(" | Z = "); 
  Serial.print(GyZ);
  Serial.print(" | Temp = "); 
  Serial.println(Tmp/340.00+36.53);
}
