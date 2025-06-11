# Siri Shortcuts Setup for Non-HomeKit Z-Wave Devices

This guide provides a step-by-step setup to enable Siri voice control for an enterprise React Native app controlling non-HomeKit Z-Wave devices (locks, thermostats, motion/contact sensors, doorbells) via a Node.js hub with a Z-Wave stack and a Ruby backend. It uses **App Intents** (iOS 16+) to bypass SiriKit’s HomeKit restrictions, enabling custom voice commands (e.g., “Hey Siri, unlock the front door”) for 50,000+ customers, with a focus on increasing app adoption over lock codes/NFC fobs. Code snippets include syntax highlighting for clarity when viewed in markdown-compatible platforms (e.g., GitHub Gist, VS Code).

## Prerequisites
- **App**: Enterprise React Native app (Expo or bare), distributed via MDM/TestFlight.
- **Devices**: Z-Wave locks, thermostats, sensors, doorbells, controlled via Node.js hub APIs.
- **Backend**: Ruby APIs (e.g., `POST /doors/:name/:action`) with OAuth2/API key authentication.
- **iOS**: Xcode 16+, iOS 16+, Apple Developer Program (enterprise account).
- **Tools**: `react-native-siri-shortcut` for shortcut donation, `react-native-keychain` for secure storage.

## Step-by-Step Setup

### 1. Add App Intents Capability
- **Purpose**: Enable App Intents for custom Siri commands.
- **Steps**:
  1. Open `your-project/ios/YourProject.xcworkspace` in Xcode.
  2. In the app target, go to **Signing & Capabilities** > Add “App Intents” (`com.apple.developer.app-intents`).
  3. In Apple Developer Portal, enable “App Intents” for your App ID, regenerate the enterprise provisioning profile, and download it in Xcode.
  4. Verify MDM supports the updated profile for 50,000 customers.

### 2. Create an App Intents Extension
- **Purpose**: Process Siri requests via a separate extension.
- **Steps**:
  1. In Xcode, go to **File** > **New** > **Target** > Choose **Intents Extension**.
  2. Name it `SmartHomeAppIntents`, set your enterprise team, and activate the scheme.
  3. In `SmartHomeAppIntents/Info.plist`, configure supported intents:
     ```xml
     <key>NSExtension</key>
     <dict>
         <key>NSExtensionAttributes</key>
         <dict>
             <key>IntentsSupported</key>
             <array>
                 <string>UnlockDoor</string>
                 <string>AdjustThermostat</string>
                 <string>CheckSensor</string>
                 <string>CheckDoorbell</string>
             </array>
         </dict>
         <key>NSExtensionPointIdentifier</key>
         <string>com.apple.intents-service</string>
         <key>NSExtensionPrincipalClass</key>
         <string>$(PRODUCT_MODULE_NAME).IntentHandler</string>
     </dict>
     ```
  4. Add `com.apple.deployment.siri.access-when-locked` entitlement for locked-device actions (e.g., unlocking doors) and update the profile.

### 3. Define App Intents
- **Purpose**: Define custom intents for device actions, mapped to APIs.
- **Steps**:
  1. Create a new Swift file in `SmartHomeAppIntents` named `SmartHomeIntents.swift`.
  2. Define intents for each device:
     ```swift
     import AppIntents

     // Unlock Door Intent
     struct UnlockDoorIntent: AppIntent {
         static var title: LocalizedStringResource = "Unlock or Lock a Door"
         static var description = IntentDescription("Unlocks or locks a specific door.")
         
         @Parameter(title: "Door Name", description: "The name of the door")
         var doorName: String
         
         @Parameter(title: "Action", description: "The action to perform", options: ["lock", "unlock"])
         var action: String
         
         static var parameterSummary: some ParameterSummary {
             Summary("Perform \(\.$action) on \(\.$doorName)")
         }
         
         func perform() async throws -> some IntentResult & ReturnsValue<String> {
             let urlString = "https://your-backend.com/api/doors/\(doorName.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed)!)/\(action)"
             guard let url = URL(string: urlString) else {
                 throw $doorName.needsValueError()
             }
             var request = URLRequest(url: url)
             request.httpMethod = "POST"
             request.addValue("Bearer your-api-key", forHTTPHeaderField: "Authorization")
             let (_, response) = try await URLSession.shared.data(for: request)
             guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                 throw IntentError.message("Failed to \(action) \(doorName)")
             }
             return .result(value: "Successfully \(action)ed \(doorName)")
         }
     }

     // Adjust Thermostat Intent
     struct AdjustThermostatIntent: AppIntent {
         static var title: LocalizedStringResource = "Set Thermostat Temperature"
         static var description = IntentDescription("Sets the temperature of a thermostat.")
         
         @Parameter(title: "Device Name")
         var deviceName: String
         
         @Parameter(title: "Temperature")
         var temperature: Double
         
         static var parameterSummary: some ParameterSummary {
             Summary("Set \(\.$deviceName) to \(\.$temperature) degrees")
         }
         
         func perform() async throws -> some IntentResult & ReturnsValue<String> {
             let urlString = "https://your-backend.com/api/thermostats/\(deviceName.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed)!)/set?temp=\(temperature)"
             guard let url = URL(string: urlString) else {
                 throw $deviceName.needsValueError()
             }
             var request = URLRequest(url: url)
             request.httpMethod = "POST"
             request.addValue("Bearer your-api-key", forHTTPHeaderField: "Authorization")
             let (_, response) = try await URLSession.shared.data(for: request)
             guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                 throw IntentError.message("Failed to set \(deviceName) to \(temperature)")
             }
             return .result(value: "Set \(deviceName) to \(temperature) degrees")
         }
     }

     // Check Sensor Intent
     struct CheckSensorIntent: AppIntent {
         static var title: LocalizedStringResource = "Check Sensor Status"
         static var description = IntentDescription("Checks the status of a sensor.")
         
         @Parameter(title: "Sensor Name")
         var sensorName: String
         
         static var parameterSummary: some ParameterSummary {
             Summary("Check status of \(\.$sensorName)")
         }
         
         func perform() async throws -> some IntentResult & ReturnsValue<String> {
             let urlString = "https://your-backend.com/api/sensors/\(sensorName.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed)!)/status"
             guard let url = URL(string: urlString) else {
                 throw $sensorName.needsValueError()
             }
             var request = URLRequest(url: url)
             request.httpMethod = "GET"
             request.addValue("Bearer your-api-key", forHTTPHeaderField: "Authorization")
             let (data, response) = try await URLSession.shared.data(for: request)
             guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200,
                   let json = try JSONSerialization.jsonObject(with: data) as? [String: String],
                   let status = json["status"] else {
                 throw IntentError.message("Failed to check \(sensorName) status")
             }
             return .result(value: "\(sensorName) is \(status)")
         }
     }

     // Check Doorbell Intent
     struct CheckDoorbellIntent: AppIntent {
         static var title: LocalizedStringResource = "Check Doorbell Status"
         static var description = IntentDescription("Checks the status of a doorbell.")
         
         @Parameter(title: "Doorbell Name")
         var doorbellName: String
         
         static var parameterSummary: some ParameterSummary {
             Summary("Check status of \(\.$doorbellName)")
         }
         
         func perform() async throws -> some IntentResult & ReturnsValue<String> {
             let urlString = "https://your-backend.com/api/doorbells/\(doorbellName.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed)!)/status"
             guard let url = URL(string: urlString) else {
                 throw $doorbellName.needsValueError()
             }
             var request = URLRequest(url: url)
             request.httpMethod = "GET"
             request.addValue("Bearer your-api-key", forHTTPHeaderField: "Authorization")
             let (data, response) = try await URLSession.shared.data(for: request)
             guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200,
                   let json = try JSONSerialization.jsonObject(with: data) as? [String: String],
                   let status = json["status"] else {
                 throw IntentError.message("Failed to check \(doorbellName) status")
             }
             return .result(value: "\(doorbellName) is \(status)")
         }
     }

     // App Intents Configuration
     struct SmartHomeAppIntents: AppIntentsPackage {
         static var intentTypes: [AppIntent.Type] {
             [UnlockDoorIntent.self, AdjustThermostatIntent.self, CheckSensorIntent.self, CheckDoorbellIntent.self]
         }
     }
     ```
  3. Replace `https://your-backend.com/api/...` with your Ruby backend endpoints and update authentication (e.g., OAuth2).
  4. Ensure the file’s **Target Membership** includes `SmartHomeAppIntents`.

### 4. Configure Intent Handler
- **Purpose**: Route Siri requests to the correct App Intent.
- **Steps**:
  1. Open `SmartHomeAppIntents/IntentHandler.swift`.
  2. Update to support App Intents:
     ```swift
     import Intents
     import AppIntents

     class IntentHandler: INExtension {
         override func handler(for intent: INIntent) -> Any {
             // App Intents are handled automatically
             return self
         }
     }
     ```

### 5. Donate Shortcuts from React Native
- **Purpose**: Make Siri aware of app actions for custom voice phrases.
- **Steps**:
  1. Install `react-native-siri-shortcut`:
     ```bash
     npm install react-native-siri-shortcut
     npx react-native link react-native-siri-shortcut
     ```
     For Expo, use a custom dev client:
     ```bash
     expo install react-native-siri-shortcut
     expo prebuild
     ```
  2. Create a shortcut donation module:
     ```javascript
     // SiriShortcuts.js
     import { SiriShortcuts } from 'react-native-siri-shortcut';

     export const donateUnlockDoorShortcut = (doorName, action) => {
         SiriShortcuts.donate({
             title: `${action === 'unlock' ? 'Unlock' : 'Lock'} ${doorName}`,
             userInfo: { action: 'unlockDoor', doorName, intentAction: action },
             persistentIdentifier: `unlock-door-${doorName.toLowerCase().replace(/\s/g, '-')}-${action}`,
             suggestedInvocationPhrase: `${action === 'unlock' ? 'Unlock' : 'Lock'} ${doorName}`,
         });
     };

     export const donateAdjustThermostatShortcut = (deviceName, temperature) => {
         SiriShortcuts.donate({
             title: `Set ${deviceName} to ${temperature} degrees`,
             userInfo: { action: 'adjustThermostat', deviceName, temperature },
             persistentIdentifier: `thermostat-${deviceName.toLowerCase().replace(/\s/g, '-')}-${temperature}`,
             suggestedInvocationPhrase: `Set ${deviceName} to ${temperature} degrees`,
         });
     };

     export const donateCheckSensorShortcut = (sensorName) => {
         SiriShortcuts.donate({
             title: `Check ${sensorName} status`,
             userInfo: { action: 'checkSensor', sensorName },
             persistentIdentifier: `sensor-${sensorName.toLowerCase().replace(/\s/g, '-')}`,
             suggestedInvocationPhrase: `Check ${sensorName}`,
         });
     };

     export const donateCheckDoorbellShortcut = (doorbellName) => {
         SiriShortcuts.donate({
             title: `Check ${doorbellName} status`,
             userInfo: { action: 'checkDoorbell', doorbellName },
             persistentIdentifier: `doorbell-${doorbellName.toLowerCase().replace(/\s/g, '-')}`,
             suggestedInvocationPhrase: `Check ${doorbellName}`,
         });
     };
     ```
  3. Call donations after API actions:
     ```javascript
     import { donateUnlockDoorShortcut } from './SiriShortcuts';

     const unlockDoor = async (doorName) => {
         await fetch(`https://your-backend.com/api/doors/${doorName}/unlock`, {
             method: 'POST',
             headers: { Authorization: 'Bearer your-token' },
         });
         donateUnlockDoorShortcut(doorName, 'unlock');
     };
     ```

### 6. Handle Shortcuts in React Native
- **Purpose**: Process Siri-triggered shortcuts and call APIs.
- **Steps**:
  1. Listen for shortcut events:
     ```javascript
     // App.js
     import React, { useEffect } from 'react';
     import { SiriShortcutsEvent } from 'react-native-siri-shortcut';

     const App = () => {
         useEffect(() => {
             const listener = SiriShortcutsEvent.addListener('SiriShortcutListener', (event) => {
                 const { userInfo } = event;
                 switch (userInfo.action) {
                     case 'unlockDoor':
                         handleUnlockDoor(userInfo.doorName, userInfo.intentAction);
                         break;
                     case 'adjustThermostat':
                         handleAdjustThermostat(userInfo.deviceName, userInfo.temperature);
                         break;
                     case 'checkSensor':
                         handleCheckSensor(userInfo.sensorName);
                         break;
                     case 'checkDoorbell':
                         handleCheckDoorbell(userInfo.doorbellName);
                         break;
                 }
             });
             return () => listener.remove();
         }, []);

         const handleUnlockDoor = async (doorName, action) => {
             try {
                 const response = await fetch(`https://your-backend.com/api/doors/${doorName}/${action}`, {
                     method: 'POST',
                     headers: { Authorization: 'Bearer your-token' },
                 });
                 if (response.ok) console.log(`${doorName} ${action}ed`);
             } catch (error) {
                 console.error(error);
             }
         };

         const handleAdjustThermostat = async (deviceName, temperature) => {
             try {
                 const response = await fetch(`https://your-backend.com/api/thermostats/${deviceName}/set?temp=${temperature}`, {
                     method: 'POST',
                     headers: { Authorization: 'Bearer your-token' },
                 });
                 if (response.ok) console.log(`${deviceName} set to ${temperature}`);
             } catch (error) {
                 console.error(error);
             }
         };

         const handleCheckSensor = async (sensorName) => {
             try {
                 const response = await fetch(`https://your-backend.com/api/sensors/${sensorName}/status`, {
                     method: 'GET',
                     headers: { Authorization: 'Bearer your-token' },
                 });
                 if (response.ok) {
                     const { status } = await response.json();
                     console.log(`${sensorName} status: ${status}`);
                 }
             } catch (error) {
                 console.error(error);
             }
         };

         const handleCheckDoorbell = async (doorbellName) => {
             try {
                 const response = await fetch(`https://your-backend.com/api/doorbells/${doorbellName}/status`, {
                     method: 'GET',
                     headers: { Authorization: 'Bearer your-token' },
                 });
                 if (response.ok) {
                     const { status } = await response.json();
                     console.log(`${doorbellName} status: ${status}`);
                 }
             } catch (error) {
                 console.error(error);
             }
         };

         return (/* Your app UI */);
     };

     export default App;
     ```

### 7. Enhance User Adoption
- **Purpose**: Increase app usage over lock codes/NFC fobs.
- **Steps**:
  1. Add an onboarding screen using `react-native-onboarding-swiper`:
     ```javascript
     import Onboarding from 'react-native-onboarding-swiper';

     const OnboardingScreen = () => (
         <Onboarding
             pages={[
                 {
                     title: 'Control with Siri',
                     subtitle: 'Say "Hey Siri, unlock my door" hands-free!',
                     image: require('./siri-icon.png'),
                 },
             ]}
         />
     );
     ```
  2. Send push notifications via Ruby backend:
     - Example: “Try ‘Hey Siri, set my thermostat to 72’ for instant control.”
  3. Show confirmations with animations (`react-native-lottie`):
     ```javascript
     import LottieView from 'react-native-lottie';
     <LottieView source={require('./success-animation.json')} autoPlay loop={false} />;
     ```

### 8. Test and Debug
- **Steps**:
  1. Build and run `SmartHomeAppIntents` on a physical iOS device (iOS 16+).
  2. In the Shortcuts app, create shortcuts for each intent and test (e.g., “Unlock Front Door”).
  3. Say “Hey Siri, unlock the front door” and verify API calls and Siri responses.
  4. Log API requests in Ruby backend and Z-Wave commands in Node.js hub.
  5. Use `react-native-sentry` for app error tracking.

### 9. Secure and Optimize
- **Security**:
  - Use HTTPS and OAuth2/API keys, stored in `react-native-keychain`.
  - Validate requests in Node.js hub before Z-Wave commands.
- **Performance**:
  - Optimize Ruby backend with Redis caching and Sidekiq.
  - Use MQTT for real-time updates:
     ```javascript
     import MQTT from 'mqtt';
     const client = MQTT.connect('mqtt://your-hub.com');
     client.on('message', (topic, message) => {
         console.log(`Update: ${message.toString()}`);
         // Update UI
     });
     ```
  - Ensure Node.js hub handles 50,000+ users.

### 10. Deploy and Monitor
- **Steps**:
  1. Build with the Intents Extension and distribute via MDM.
  2. Track shortcut usage in Ruby backend analytics.
  3. Collect feedback via in-app surveys (`react-native-modal`).

## Example Workflow
1. User says: “Hey Siri, unlock the front door.”
2. Siri triggers `UnlockDoorIntent`.
3. Extension sends `POST /doors/front_door/unlock` to Ruby backend.
4. Backend forwards to Node.js hub, which sends Z-Wave command.
5. App updates UI via MQTT.
6. Siri responds: “Front door unlocked.”

## Notes
- Replace API endpoints with your actual ones.
- For iOS <16, use `NSUserActivity` shortcuts (similar donation logic).
- Promote Siri via onboarding to boost adoption.
- For Android, consider Google Assistant integration.