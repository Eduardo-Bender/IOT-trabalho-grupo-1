# IoT Backend - CRUD API

Aplicação backend pra gerenciamento de sensores IoT

## Supported Sensors

- **SensorTemperatura** - Temperature readings
- **SensorUltrasonico** - Ultrasonic distance measurements
- **SensorUmidadeETemperatura** - Humidity and temperature (DHT11)
- **SensorVelocidadeEncoder** - Speed/Encoder pulses
- **SensorAcelerometroEGiroscopio** - MPU6050 accelerometer & gyroscope
- **SensorIR** - Infrared remote codes
- **SensorTeclado** - Keypad inputs
- **SensorModuloRele** - Relay module states

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
node app.js
```

The server will run on `http://localhost:3001`

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Main application file
│   ├── controllers/        # Request handlers
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
├── database.sqlite         # SQLite database (auto-created)
├── package.json
└── README.md
```

## API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Sensor Data

**Send MQTT data**
```
POST /dados
```

Request body:
```json
{
  "esp_id": "AA:BB:CC:DD:EE:FF",
  "sensors": [
    { "type": "TEMP", "pin": 10, "value": 25.5 },
    { "type": "ULTRASSONICO", "pin": 21, "value": 45.2 }
  ]
}
```

**List sensors by type**
```
GET /sensores/:sensorTipo
```

Example: `GET /sensores/TEMP`

**List sensors by type and plate**
```
GET /sensores/:sensorTipo/:placaId
```

Example: `GET /sensores/TEMP/AA:BB:CC:DD:EE:FF`

### Plates

**List all plates**
```
GET /placas
```

**Get specific plate**
```
GET /placas/:id
```

Example: `GET /placas/AA:BB:CC:DD:EE:FF`

**Delete plate**
```
DELETE /placas/:id
```

Example: `DELETE /placas/AA:BB:CC:DD:EE:FF`

## Sensor Type Codes

| Code | Sensor Type |
|------|-------------|
| TEMP | Temperature (DHT11) |
| ULTRASSONICO | Ultrasonic distance |
| UMIDADE_TEMPERATURA | Humidity & Temperature |
| VELOCIDADE_ENCODER | Speed/Encoder |
| ACELEROMETRO_GIROSCOPIO | Accelerometer & Gyroscope |
| IR | Infrared remote |
| TECLADO | Keypad |
| MODULO_RELE | Relay module |

## Database Schema

### Placa Table
- `id` (STRING, PRIMARY KEY) - MAC address or ESP_ID
- `nome` (STRING, OPTIONAL) - Plate name

### Sensor Tables
Each sensor type has its own table with:
- `id` (INTEGER, PRIMARY KEY, AUTO INCREMENT)
- `placaId` (STRING, FOREIGN KEY) - Reference to Plate
- Sensor-specific fields (temperatura, distancia, etc.)
- `dataHora` (DATE) - Timestamp

## Testing with Postman

1. Open Postman
2. Create a new POST request to `http://localhost:3001/api/dados`
3. Set Body to JSON and use the example above
4. Send the request

## Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **sequelize** - ORM for database
- **sqlite3** - SQLite driver

## Development Notes

- Database is auto-created on first run
- Plates are automatically registered when first data is received
- All sensor data includes automatic timestamps
- Data is ordered by `dataHora` in descending order (newest first)

## Troubleshooting

**Module not found error:**
```bash
npm install
```

**Database issues:**
Delete `database.sqlite` and restart the server to recreate it.

**Port already in use:**
Change `PORT` in `app.js` to a different port.
