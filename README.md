## Automatische Anzeige Handler für das Portal Ebay Kleinanzeige 
Unterstützt Lesen, Speichern und Schicken die Nachricht an die Vermieter
Es ist nicht der Geheim, dass die Wohnung in Deutschland sehr schwere zu finden
Die Anwendungen kann das Problem endlich löschen. Oder mindestens helfen
Die allgemeine Idee ist die neue Anzeige am schnellsten behandeln und bemerken

## Application Erstellen und Laufen

Die Anwendung konnte sich als Docker erstellen. Dieser Wege is empfelenswert zu anwenden
Wann möchten Sie die Nachricht shicken, das folgenden Shritten sollten Sie erfühlen um cookies richtige behandeln bevor docker vorbereiten:<br>
1.Öffnen die Seite https://www.kleinanzeigen.de/ in Google Chrome <br>
2.Login in portal unter Ihre Berechigt Auskunft <br>
3.In Task-Manager(Windows) löschen Chrome process auf. In linux: pkill chrome <br>
4.cd in ordner app\login_session. verändern file .env <br>
FOLDER_WITH_COOKIES = 'C:\\Users\\username\\AppData\\Local\\Google\\Chrome\\User Data' <br>
Das ist Ordner in den cookies von Chrome gespeichert werden in Windows 10,11. <br>
Sie sollen username mit Ihre username verändern<br>
In Ubuntu oder Mac die Ordner Weg sieht anders aus, z.B:<br>
~/.config/google-chrome/Default/Cookies
Bitte guck mal in Dokumentation des OS der richtige Weg <br>
5.Laufen command: node .\prepare_login_cookies.js <br>
Es wird file nennt cookies erstellt <br>
Dieser file in playwright benutzen werden um die Nachricht schicken<br>

Docker einsetzen <br>

Laufen kommand: docker compose up <br>
Es wird drei Docker Containers: <br>
Mongo - noSQL databanken <br>
Chrome-browser - browser in den die Nachricht geschikt <br>
Ebaycrawler- NodeJS anwendungen händelt eBay-Kleineinzeigen portal <br>
