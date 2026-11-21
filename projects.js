const PROJECTS=[
{id:"lyrics",title:"Live Lyrics Display (ESP8266)",date:"Sep 2026 to now",file:"lyrics_display.ino",
 desc:"Shows synced lyrics of the song playing on my Mac (Apple Music or YouTube Music) on an LCD. A Mac-side script reads the current track and streams lyrics over Wi-Fi. Long lines auto-scroll, an idle mode shows a clock, songs change with an animation, and the settings page is hosted on the ESP itself.",
 next:"Planned next: an LED strip music visualizer.",tags:["ESP8266","Wi-Fi","I2C LCD"],
 note:"Red is 5V power, grey is ground, green is signal. Assumes a 16x2 I2C LCD module and a NodeMCU board.",
 d:{parts:[{n:"NodeMCU ESP8266",c:0,pins:["VIN (5V)","GND","D1","D2"]},{n:"I2C LCD 16x2",c:2,pins:["VCC","GND","SDA","SCL"]}],
 wires:[[0,"VIN (5V)",1,"VCC","p"],[0,"GND",1,"GND","g"],[0,"D2",1,"SDA","s"],[0,"D1",1,"SCL","s"]]},
 code:String.raw`#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <LiquidCrystal_I2C.h>

const char* SSID = "YOUR_WIFI";
const char* PASS = "YOUR_PASS";
LiquidCrystal_I2C lcd(0x27, 16, 2);
ESP8266WebServer server(80);
String line1 = "", line2 = "";
unsigned long lastLyric = 0, lastScroll = 0;
unsigned int off = 0;

void show() {                       // show 16 chars of each line from offset
  String a = line1.length() > 16 ? line1.substring(off) : line1;
  String b = line2.length() > 16 ? line2.substring(off) : line2;
  lcd.setCursor(0, 0); lcd.print((a + "                ").substring(0, 16));
  lcd.setCursor(0, 1); lcd.print((b + "                ").substring(0, 16));
}

void handleLyric() {                // Mac script calls /lyric?a=...&b=...
  line1 = server.arg("a"); line2 = server.arg("b");
  off = 0; lastLyric = millis(); lcd.clear(); show();
  server.send(200, "text/plain", "ok");
}

void setup() {
  lcd.init(); lcd.backlight(); lcd.print("Connecting...");
  WiFi.begin(SSID, PASS);
  while (WiFi.status() != WL_CONNECTED) delay(300);
  configTime(19800, 0, "pool.ntp.org");   // IST, used by idle clock
  server.on("/lyric", handleLyric);
  server.begin();
  lcd.clear(); lcd.print(WiFi.localIP());
}

void loop() {
  server.handleClient();
  if (millis() - lastLyric > 15000) {       // idle mode: clock
    time_t t = time(nullptr); char b[17];
    strftime(b, 17, "%H:%M:%S", localtime(&t));
    lcd.setCursor(0, 0); lcd.print(b);
  } else if (millis() - lastScroll > 400) { // scroll long lines
    lastScroll = millis();
    unsigned int mx = line1.length() > line2.length() ? line1.length() : line2.length();
    if (mx > 16) { off = (off + 1) % (mx - 15); show(); }
  }
}`},
{id:"smart-room",title:"ESP32 Smart Room",date:"Oct 2026",file:"smart_room.ino",
 desc:"Lights, sockets and a fan work from the original wall switches and from a phone, including Google Home and Assistant. Both paths stay in sync, so a manual flip never leaves the app showing the wrong state. Runs 24/7 with no paid cloud subscription.",
 tags:["ESP32","relays","IoT"],
 note:"Red is 5V power, grey is ground, green is signal. Mains side: the relay COM and NO terminals switch only the live wire. Use an opto-isolated relay module in an enclosure, and have a qualified person check the mains wiring.",
 d:{parts:[{n:"Wall switches",c:0,pins:["SW1 light","SW2 socket","SW3 fan","COM"]},{n:"ESP32 DevKit",c:1,pins:["<GPIO32","<GPIO33","<GPIO25","<GND","GPIO23","GPIO22","GPIO21","5V","GND"]},{n:"4-ch relay module",c:2,pins:["IN1","IN2","IN3","VCC","GND"]}],
 wires:[[1,"<GPIO32",0,"SW1 light","s"],[1,"<GPIO33",0,"SW2 socket","s"],[1,"<GPIO25",0,"SW3 fan","s"],[1,"<GND",0,"COM","g"],[1,"GPIO23",2,"IN1","s"],[1,"GPIO22",2,"IN2","s"],[1,"GPIO21",2,"IN3","s"],[1,"5V",2,"VCC","p"],[1,"GND",2,"GND","g"]]},
 code:String.raw`#include <WiFi.h>
#include <WebServer.h>

const int RELAY[3]  = {23, 22, 21};   // light, socket, fan (active-LOW module)
const int SWITCH[3] = {32, 33, 25};   // wall switches to GND, INPUT_PULLUP
bool state[3] = {false, false, false}, lastSw[3];
WebServer server(80);

void apply(int i, bool on) { state[i] = on; digitalWrite(RELAY[i], on ? LOW : HIGH); }

void handleSet() {                    // /set?ch=0&v=1 from a phone or Google Home bridge
  int ch = server.arg("ch").toInt();
  if (ch < 0 || ch > 2) { server.send(400, "text/plain", "bad"); return; }
  apply(ch, server.arg("v") == "1");
  server.send(200, "text/plain", "ok");
}

void handleState() {                  // apps read this so they never show a stale state
  server.send(200, "text/plain", String(state[0]) + String(state[1]) + String(state[2]));
}

void setup() {
  for (int i = 0; i < 3; i++) {
    pinMode(RELAY[i], OUTPUT); digitalWrite(RELAY[i], HIGH);   // all off
    pinMode(SWITCH[i], INPUT_PULLUP); lastSw[i] = digitalRead(SWITCH[i]);
  }
  WiFi.begin("YOUR_WIFI", "YOUR_PASS");
  while (WiFi.status() != WL_CONNECTED) delay(300);
  server.on("/set", handleSet); server.on("/state", handleState);
  server.begin();
}

void loop() {
  server.handleClient();
  for (int i = 0; i < 3; i++) {       // any change of a wall switch toggles its channel
    bool s = digitalRead(SWITCH[i]);
    if (s != lastSw[i]) {
      delay(30);                      // debounce
      if (digitalRead(SWITCH[i]) == s) { lastSw[i] = s; apply(i, !state[i]); }
    }
  }
}`},
{id:"solar",title:"Dual-Axis Solar Tracker",date:"Jun to Nov 2022",file:"solar_tracker.ino",
 desc:"An Arduino compares light across four LDRs and moves two servos to keep the panel square to the sun, harvesting more energy than a static mount.",
 tags:["Arduino","LDR","servos"],
 note:"Each LDR forms a divider with a 10k resistor to GND, and the middle node goes to the analog pin. Power the servos from a separate 5V supply with a common ground.",
 d:{parts:[{n:"LDR x4 + 10k",c:0,pins:["TL","TR","BL","BR","5V","GND"]},{n:"Arduino Uno",c:1,pins:["<A0","<A1","<A2","<A3","<5V","<GND","D9","D10","5V","GND"]},{n:"Servos",c:2,pins:["PAN signal","TILT signal","V+ (5V)","GND"]}],
 wires:[[1,"<A0",0,"TL","s"],[1,"<A1",0,"TR","s"],[1,"<A2",0,"BL","s"],[1,"<A3",0,"BR","s"],[1,"<5V",0,"5V","p"],[1,"<GND",0,"GND","g"],[1,"D9",2,"PAN signal","s"],[1,"D10",2,"TILT signal","s"],[1,"5V",2,"V+ (5V)","p"],[1,"GND",2,"GND","g"]]},
 code:String.raw`#include <Servo.h>

Servo pan, tilt;
int h = 90, v = 90;                    // servo angles
const int TOL = 30, STEP = 1;          // light difference needed before moving

void setup() {
  pan.attach(9); tilt.attach(10);
  pan.write(h); tilt.write(v);
}

void loop() {
  int tl = analogRead(A0), tr = analogRead(A1);
  int bl = analogRead(A2), br = analogRead(A3);
  int top = (tl + tr) / 2, bot = (bl + br) / 2;
  int left = (tl + bl) / 2, right = (tr + br) / 2;

  if (abs(top - bot) > TOL)    v += (top > bot) ? STEP : -STEP;
  if (abs(left - right) > TOL) h += (left > right) ? -STEP : STEP;  // flip signs to match your mounting

  h = constrain(h, 10, 170); v = constrain(v, 10, 170);
  pan.write(h); tilt.write(v);
  delay(30);
}`},
{id:"irrigation",title:"IoT Smart Irrigation",date:"Jun 2021 to Nov 2022",file:"irrigation.ino",
 desc:"An ESP8266 reads soil moisture and starts the pump when it drops below a threshold. A mobile dashboard gives remote monitoring and manual control.",
 tags:["ESP8266","soil sensor","IoT"],
 note:"The pump and its own supply connect to the relay COM and NO terminals, not to the board. Check whether your relay module is active-high or active-low and flip the logic if needed.",
 d:{parts:[{n:"Soil moisture",c:0,pins:["AO","VCC","GND"]},{n:"NodeMCU ESP8266",c:1,pins:["<A0","<3V3","<GND","D1","VIN (5V)","GND"]},{n:"Relay module",c:2,pins:["IN","VCC","GND"]}],
 wires:[[1,"<A0",0,"AO","s"],[1,"<3V3",0,"VCC","p"],[1,"<GND",0,"GND","g"],[1,"D1",2,"IN","s"],[1,"VIN (5V)",2,"VCC","p"],[1,"GND",2,"GND","g"]]},
 code:String.raw`#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const int PUMP = 5;                    // D1 -> relay IN
const int DRY  = 600;                  // A0 above this = dry soil (calibrate yours)
bool manual = false, manualOn = false;
ESP8266WebServer server(80);

void handleStatus() {                  // dashboard polls this
  server.send(200, "application/json",
    "{\"moisture\":" + String(analogRead(A0)) + ",\"pump\":" + String(digitalRead(PUMP)) + "}");
}
void handlePump() { manual = true; manualOn = server.arg("on") == "1"; server.send(200, "text/plain", "ok"); }
void handleAuto() { manual = false; server.send(200, "text/plain", "auto"); }

void setup() {
  pinMode(PUMP, OUTPUT); digitalWrite(PUMP, LOW);
  WiFi.begin("YOUR_WIFI", "YOUR_PASS");
  while (WiFi.status() != WL_CONNECTED) delay(300);
  server.on("/status", handleStatus);
  server.on("/pump", handlePump);
  server.on("/auto", handleAuto);
  server.begin();
}

void loop() {
  server.handleClient();
  bool on = manual ? manualOn : (analogRead(A0) > DRY);   // dry soil -> pump on
  digitalWrite(PUMP, on);
}`},
{id:"blind-stick",title:"Smart Assistive Blind Stick",date:"Jun to Nov 2022",file:"blind_stick.ino",
 desc:"An Arduino and an ultrasonic sensor detect obstacles and warn the user with haptic vibration and a buzzer. Closer obstacles give faster pulses.",
 tags:["Arduino","ultrasonic","haptics"],
 note:"Drive the vibration motor through an NPN transistor (base via 1k) with a flyback diode across the motor. Never connect the motor straight to an Arduino pin.",
 d:{parts:[{n:"HC-SR04",c:0,pins:["VCC","TRIG","ECHO","GND"]},{n:"Arduino Uno",c:1,pins:["<5V","<D9","<D10","<GND","D6","D7","GND"]},{n:"Buzzer",c:2,pins:["+","-"]},{n:"Vib. motor driver",c:2,pins:["IN","GND"]}],
 wires:[[1,"<5V",0,"VCC","p"],[1,"<D9",0,"TRIG","s"],[1,"<D10",0,"ECHO","s"],[1,"<GND",0,"GND","g"],[1,"D6",2,"+","s"],[1,"GND",2,"-","g"],[1,"D7",3,"IN","s"],[1,"GND",3,"GND","g"]]},
 code:String.raw`const int TRIG = 9, ECHO = 10, BUZZER = 6, MOTOR = 7;

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  pinMode(BUZZER, OUTPUT); pinMode(MOTOR, OUTPUT);
}

long distanceCm() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long us = pulseIn(ECHO, HIGH, 30000);     // timeout is about 5 m
  return us ? us / 58 : 999;
}

void loop() {
  long d = distanceCm();
  if (d < 100) {                            // closer obstacle = faster pulses
    int gap = map(constrain(d, 10, 100), 10, 100, 60, 400);
    digitalWrite(MOTOR, HIGH); tone(BUZZER, 2000, 40); delay(40);
    digitalWrite(MOTOR, LOW);  delay(gap);
  } else {
    delay(100);
  }
}`}
];
