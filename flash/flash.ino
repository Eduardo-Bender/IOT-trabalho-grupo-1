#include <stdio.h>
#include <Ultrasonic.h>
#include <Keypad.h>

//----------------------------------------------------------

#include <IRremote.h>                       // Biblioteca IRemote
int RECV_PIN = 22;                          // Arduino pino D11 conectado no Receptor IR
IRrecv irrecv(RECV_PIN);                    // criando a instância
decode_results results;                     // declarando os resultados

//----------------------------------------------------------

#define analogTempPin A0
#define somTriggerPin 21
#define somEchoPin 22

const byte rows = 4;
const byte cols = 4;

char keys[rows][cols] = {
  {'1','2','3', 'a'},
  {'4','5','6', 'b'},
  {'7','8','9', 'c'},
  {'#','0','*', 'd'}
};

byte rowPins[rows] = {13, 12, 11, 10};
byte colPins[cols] = {9, 8, 7, 6};
Keypad keypad = Keypad( makeKeymap(keys), rowPins, colPins, rows, cols );

//////////////////////////////////////////////////////////////////////////////
///////////////////////// Shameless global variables /////////////////////////
int valTemp= 0;
double voltsTemp = 0;
Ultrasonic ultrasonic(somTriggerPin, somEchoPin, 40000UL);


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

void setup() {
  Serial.begin(9600);
  irrecv.enableIRIn();
}

void loop_ir()
{
  if (irrecv.decode(&results))              // se algum código for recebido
  {
    Serial.println(results.value, HEX);     // imprime o HEX Code
    irrecv.resume();                        // reinicializa o receptor
    delay(10);                              // atraso de 10 ms
  }
}

void loop() {
  //temperaturaLoop();
  // somLoop();
  // displayLoop();
  // botaoLoop();
  // numpadLoop();

  loop_ir();

  delay(300);
}

void numpadLoop()
{
  char key = keypad.getKey();

  if (key != NO_KEY){
    //Serial.println(key);
  }
}

void somLoop(){
  float cmMsec, inMsec;
  cmMsec = ultrasonic.read(CM);
  inMsec = ultrasonic.read(INC);

  Serial.print("Distancia em cm: ");
  Serial.print(cmMsec);
  Serial.println();
}

void temperaturaLoop() {  
  valTemp = analogRead(analogTempPin); 
  voltsTemp = map(valTemp, 0, 1023, 0, 3300);
  Serial.println((voltsTemp-500) * 0.1, 1);
}