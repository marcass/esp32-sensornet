#include "DHTesp.h"

#define H_PIN 22
DHTesp dht;
 
void setup()
{
  Serial.begin(115200);
    dht.setup(H_PIN, DHTesp::DHT22);
}
 
void loop()
{
 
  float humidity = dht.getHumidity(); 
  float temp = dht.getTemperature();
 
  Serial.print("Humidity: ");
  Serial.println(humidity);
  delay(1000);
  Serial.print("Temp: ");
  Serial.println(temp);
 
  delay(5000);
 
}
