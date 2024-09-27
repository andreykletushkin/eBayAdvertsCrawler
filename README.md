# Automatischer Anzeige-Handler für das Portal **eBay Kleinanzeigen**

Die Anwendung ermöglicht das automatische Lesen, Speichern und Versenden von Nachrichten an Vermieter auf **eBay Kleinanzeigen**.  
Es ist kein Geheimnis, dass es in Deutschland sehr schwierig ist, eine passende Wohnung zu finden. Diese Anwendung hilft Ihnen dabei, das Problem zu lösen oder zumindest zu minimieren, indem neue Anzeigen schnell erfasst und behandelt werden.

## Anforderungen an Software und Hardware

| Komponente         | Version/Details                          |
|--------------------|------------------------------------------|
| **Node.js**        | v20.17.0                                 |
| **Arbeitsspeicher**| Mindestens 4 GB (empfohlen: 8 GB)        |
| **Browser**        | Google Chrome                            | 
| **Kontainer**      | Docker                                   |

## Anwendung erstellen und starten

Die Anwendung kann als Docker-Container bereitgestellt werden. Dies ist der empfohlene Weg, um die Anwendung auszuführen.

### Voraussetzungen für das Versenden von Nachrichten:

Bevor Sie die Docker-Umgebung aufsetzen, müssen Sie die folgenden Schritte ausführen, um die Cookies korrekt zu behandeln:

1. Öffnen Sie die Website [eBay Kleinanzeigen](https://www.kleinanzeigen.de/) in Google Chrome.
2. Melden Sie sich mit Ihren Zugangsdaten im Portal an.
3. Beenden Sie den Chrome-Browser-Prozess:
    - **Windows**: Task-Manager öffnen und den Chrome-Prozess beenden.
    - **Linux**: `pkill chrome` im Terminal ausführen.
4. Wechseln Sie in das Verzeichnis `app/login_session` und öffnen Sie die Datei `.env`. Passen Sie den Pfad zur Cookie-Datei wie folgt an:

   ```env
   FOLDER_WITH_COOKIES = 'C:\\Users\\username\\AppData\\Local\\Google\\Chrome\\User Data'
   ```
   
   Dies ist der Pfad, in dem Chrome die Cookies unter Windows 10/11 speichert. Ersetzen Sie username durch Ihren tatsächlichen Benutzernamen.
   * In Ubuntu oder MacOS sieht der Pfad anders aus, z.B.:

   ```env
   ~/.config/google-chrome/Default/Cookies
   ```
   Bitte konsultieren Sie die Dokumentation Ihres Betriebssystems, um den richtigen Pfad zu finden.
5. Führen Sie folgenden Befehl aus:

   ```env
   node .\prepare_login_cookies.js
   ```
   Dadurch wird eine Datei namens cookies erstellt. Diese Datei wird später von playwright verwendet, um sich automatisch anzumelden und Nachrichten zu versenden.

### Anwendung mit Docker ausführen
Um die Anwendung mit Docker zu starten, führen Sie den folgenden Befehl aus:
  ```env
  docker compose up
   ```
Es werden drei Docker-Container gestartet:

- MongoDB: NoSQL-Datenbank, um Daten wie Nachrichten und Anzeigen zu speichern.
- Chrome-Browser: Browser-Container, in dem die Nachrichten gesendet werden.
- BayCrawler: Node.js-Anwendung, die das eBay Kleinanzeigen-Portal crawlt und Nachrichten automatisiert versendet.

