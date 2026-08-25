export const appData: Record<string, { full_description: string }> = {
  en: {
    full_description: `<h2>Build Winning GBL Teams From Your Pokémon—In Seconds</h2>
  <p>Tired of losing GO Battle League matches with teams that don't work together? BattleFlow analyzes your actual Pokémon collection and instantly generates competitive teams optimized for any league or cup. No more hours of research—just add your Pokémon and get ready-to-use team suggestions with the best leads, safe switches, and closers.</p>
  <h3>Your Pokémon. Winning Teams. Zero Guesswork.</h3>
  <ul>
    <li><strong>Instant Team Suggestions:</strong> Import your Pokémon box and get optimized team recommendations in seconds—built from what you actually have, not what you wish you had</li>
    <li><strong>Smart Team Scoring:</strong> Every suggested team comes with coverage analysis, synergy ratings, and weakness breakdowns so you know exactly why it works</li>
    <li><strong>Member Recommendations:</strong> Not sure who pairs well with your favorite Pokémon? Get intelligent suggestions for teammates that cover weaknesses and create winning cores</li>
    <li><strong>Works for Every League:</strong> Great League, Ultra League, Master League, Little Cup, specialty cups—generate teams optimized for whatever GBL throws at you</li>
  </ul>`
  },
  es: {
    full_description: `<h2>Crea equipos de GBL ganadores con tus Pokémon en segundos</h2>
  <p>¿Cansado de perder combates en la GO Battle League con equipos sin sinergia? BattleFlow analiza tu colección real de Pokémon y genera instantáneamente equipos competitivos optimizados para cualquier liga o copa. Ahorra horas de investigación: solo tienes que añadir tus Pokémon para obtener sugerencias de equipos listas para usar con los mejores leads, safe switches y closers.</p>
  <h3>Tus Pokémon. Equipos ganadores. Sin adivinanzas.</h3>
  <ul>
    <li><strong>Sugerencias de equipos instantáneas:</strong> Importa tu caja de Pokémon y obtén recomendaciones optimizadas en segundos, basadas en los Pokémon que ya tienes.</li>
    <li><strong>Puntuación inteligente de equipos:</strong> Cada equipo sugerido incluye un análisis de cobertura, calificaciones de sinergia y desgloses de debilidades para que comprendas por qué funciona.</li>
    <li><strong>Recomendaciones de compañeros:</strong> ¿No sabes quién combina bien con tu Pokémon favorito? Obtén sugerencias inteligentes de compañeros que cubren debilidades y crean núcleos ganadores.</li>
    <li><strong>Compatible con todas las ligas:</strong> Liga Súper, Liga Ultra, Liga Master, Copa Chica o copas especiales; genera equipos optimizados para cualquier formato de la GBL.</li>
  </ul>`
  }
};

export const privacyData: Record<string, string> = {
  en: `This Privacy Policy applies to the BattleFlow mobile app (the "Application"), provided by Baru Software Co ("we", "our", or "us").

**Information Collection and Use**

We collect limited information to operate and improve the Application. Depending on how you use it, this may include:

*   App usage analytics (for example, screens viewed, feature interactions, and app events)
*   Crash and diagnostics data (for stability monitoring)
*   Purchase and subscription status/events needed to provide premium features
*   Content you create in the app, such as teams, battle logs, and preferences
*   On-screen Pokémon stats read via the Scan / Auto Scan feature, processed entirely on your device (see "Screen Scanning" below)

Most app data (such as teams, battle logs, and preferences) is stored locally on your device.

We do not intentionally collect precise GPS location data through the Application.

**Screen Scanning (Scan / Auto Scan)**

To let you import a Pokémon's stats without typing them in, the Application can read text directly off the Pokémon GO appraisal screen while you use the Scan or Auto Scan feature:

*   On Android, this uses the system's screen-capture permission (MediaProjection); you'll see Android's standard screen-recording notification for as long as scanning is active.
*   On iOS, this uses Apple's ReplayKit screen-broadcast picker to read the screen live while scanning is active.

Only the appraisal/stats region of the screen (species, CP, level, and IVs) is read — no other apps or screen content are captured. Text recognition (OCR) runs entirely on your device, using Google ML Kit on Android and Apple's Vision framework on iOS. No screenshot, screen recording, or recognized text is ever uploaded to us or to any third party, and none of it is saved to your photo library — captured frames are stored briefly in the app's local cache and deleted automatically once processed.

Screen reading stops as soon as you exit the Scan screen or revoke the screen-recording permission in your device settings.

If a scan fails, you can choose to attach the captured image to a bug report so we can investigate — this is only sent if you actively choose to send it.

You can also import a Pokémon's stats by selecting an existing screenshot from your photo library instead of scanning live; this is processed the same way, entirely on your device.

**Third-Party Services**

The Application uses third-party services that may process data according to their own privacy policies:

*   [Google Play Services](https://www.google.com/policies/privacy/)
*   [Firebase Crashlytics](https://firebase.google.com/support/privacy/)
*   [Mixpanel](https://mixpanel.com/legal/privacy-policy/)
*   [RevenueCat](https://www.revenuecat.com/privacy)

**How We Use Information**

We use information to:

*   Provide app features and maintain service quality
*   Monitor performance, fix bugs, and improve user experience
*   Process and restore in-app purchases/subscriptions
*   Communicate important updates when necessary

**Third Party Access**

We do not sell personal information. We may share limited data with service providers that help us run the Application (for example analytics, crash monitoring, and subscriptions), and when legally required.

**Data Retention**

We retain data only for as long as needed for the purposes described here, unless a longer retention period is required by law.

If you want us to delete data associated with your support requests or other directly provided information, contact us at [hello@baru.software](mailto:hello@baru.software).

**Children's Privacy**

The Application is not directed to children under 13, and we do not knowingly collect personal information from children under 13.

**Opt-Out Rights**

You can stop all collection of information by the Application easily by uninstalling it. You may use the standard uninstall processes as may be available as part of your mobile device or via the mobile application marketplace or network.

**Security**

We use reasonable administrative, technical, and organizational safeguards to protect information processed by the Application.

**Changes**

We may update this Privacy Policy from time to time. Changes are effective when posted on this page.

This privacy policy is effective as of 2026-07-30.

**Your Consent**

By using the Application, you consent to this Privacy Policy.

**Contact Us**

If you have questions about privacy, contact Baru Software Co:

*   Website: [https://baru.software/](https://baru.software/)
*   Email: [hello@baru.software](mailto:hello@baru.software)`,
  es: `Esta Política de Privacidad se aplica a la aplicación móvil BattleFlow (la "Aplicación"), proporcionada por Baru Software Co ("nosotros", "nuestro" o "nos").

**Recopilación y uso de la información**

Recopilamos información limitada para operar y mejorar la Aplicación. Dependiendo de su uso, esto puede incluir:

*   Analítica de uso de la aplicación (por ejemplo, pantallas vistas, interacciones con funciones y eventos de la aplicación).
*   Datos de fallos y diagnósticos (para el control de la estabilidad).
*   Estado y eventos de compras o suscripciones necesarios para proporcionar funciones premium.
*   Contenido creado en la aplicación, como equipos, registros de batalla y preferencias.
*   Estadísticas de Pokémon en pantalla, leídas mediante la función de Escaneo/Escaneo automático y procesadas por completo en su dispositivo (véase «Escaneo de pantalla» más abajo).

La mayor parte de los datos de la aplicación (como equipos, registros de batalla y preferencias) se almacena localmente en su dispositivo.

No recopilamos intencionadamente datos precisos de ubicación GPS a través de la Aplicación.

**Escaneo de pantalla (Escaneo / Escaneo automático)**

Para permitirle importar las estadísticas de un Pokémon sin necesidad de escribirlas, la Aplicación puede leer texto directamente de la pantalla de valoración de Pokémon GO mientras utiliza la función de Escaneo o Escaneo automático:

*   En Android, esto utiliza el permiso de captura de pantalla del sistema (MediaProjection); verá la notificación estándar de grabación de pantalla de Android mientras el escaneo esté activo.
*   En iOS, esto utiliza el selector de difusión de pantalla ReplayKit de Apple para leer la pantalla en vivo mientras el escaneo esté activo.

Solo se lee la zona de valoración/estadísticas de la pantalla (especie, PC, nivel e IVs); no se captura contenido de ninguna otra aplicación ni de otras partes de la pantalla. El reconocimiento de texto (OCR) se realiza por completo en su dispositivo, mediante Google ML Kit en Android y el framework Vision de Apple en iOS. Ninguna captura de pantalla, grabación ni texto reconocido se sube nunca a nosotros ni a terceros, y nada se guarda en su galería de fotos: los fotogramas capturados se almacenan brevemente en la caché local de la aplicación y se eliminan automáticamente una vez procesados.

La lectura de pantalla se detiene en cuanto sale de la pantalla de Escaneo o revoca el permiso de grabación de pantalla en los ajustes de su dispositivo.

Si un escaneo falla, puede optar por adjuntar la imagen capturada a un informe de error para que podamos investigarlo; esto solo se envía si usted decide activamente hacerlo.

También puede importar las estadísticas de un Pokémon seleccionando una captura de pantalla de su galería en lugar de escanear en vivo; se procesa de la misma manera, por completo en su dispositivo.

**Servicios de terceros**

La Aplicación utiliza servicios de terceros que pueden procesar datos de acuerdo con sus propias políticas de privacidad:

*   [Google Play Services](https://www.google.com/policies/privacy/)
*   [Firebase Crashlytics](https://firebase.google.com/support/privacy/)
*   [Mixpanel](https://mixpanel.com/legal/privacy-policy/)
*   [RevenueCat](https://www.revenuecat.com/privacy)

**Cómo utilizamos la información**

Utilizamos la información para:

*   Proporcionar las funciones de la aplicación y mantener la calidad del servicio.
*   Supervisar el rendimiento, corregir errores y mejorar la experiencia del usuario.
*   Procesar y restaurar compras o suscripciones integradas en la aplicación.
*   Comunicar actualizaciones importantes cuando sea necesario.

**Acceso de terceros**

No vendemos información personal. Podemos compartir datos limitados con proveedores de servicios que nos ayudan a ejecutar la Aplicación (por ejemplo, análisis, control de fallos y suscripciones) y cuando la ley lo exija.

**Retención de datos**

Conservamos los datos únicamente durante el tiempo necesario para los fines aquí descritos, a menos que la ley exija un periodo de retención más largo.

Si desea que eliminemos los datos asociados a sus solicitudes de asistencia u otra información facilitada directamente, póngase en contacto con nosotros en [hello@baru.software](mailto:hello@baru.software).

**Privacidad de los menores**

La Aplicación no está dirigida a niños menores de 13 años, y no recopilamos conscientemente información personal de niños menores de 13 años.

**Derechos de exclusión voluntaria**

Puede detener fácilmente toda la recopilación de información por parte de la Aplicación desinstalándola. Puede utilizar los procesos de desinstalación estándar disponibles en su dispositivo móvil o a través del mercado o la red de aplicaciones móviles.

**Seguridad**

Utilizamos medidas de seguridad administrativas, técnicas y organizativas razonables para proteger la información procesada por la Aplicación.

**Cambios**

Podemos actualizar esta Política de Privacidad periódicamente. Los cambios entrarán en vigor cuando se publiquen en esta página.

Esta política de privacidad es efectiva a partir del 2026-07-30.

**Su consentimiento**

Al utilizar la Aplicación, usted acepta esta Política de Privacidad.

**Contacto**

Si tiene alguna pregunta sobre la privacidad, póngase en contacto con Baru Software Co:

*   Sitio web: [https://baru.software/](https://baru.software/)
*   Correo electrónico: [hello@baru.software](mailto:hello@baru.software)`,
  fr: `Cette Politique de Confidentialité s'applique à l'application mobile BattleFlow (l'"Application"), fournie par Baru Software Co ("nous", "notre" ou "nos").

**Collecte et utilisation des données**

Nous collectons des informations limitées pour exploiter et améliorer l'Application. Selon votre utilisation, celles-ci peuvent inclure :

*   Analyses d'utilisation (par exemple, écrans consultés, interactions et événements).
*   Données de plantage et de diagnostic (pour le suivi de la stabilité).
*   Statut et événements d'achats/abonnements nécessaires aux fonctionnalités premium.
*   Contenu créé dans l'application (équipes, journaux de combat, préférences).
*   Statistiques de Pokémon lues à l'écran via la fonction Scan/Scan automatique, traitées entièrement sur votre appareil (voir « Lecture d'écran » ci-dessous).

La plupart des données (équipes, journaux de combat, préférences) sont stockées localement sur votre appareil.

Nous ne collectons pas volontairement de données GPS précises via l'Application.

**Lecture d'écran (Scan / Scan automatique)**

Pour vous permettre d'importer les statistiques d'un Pokémon sans les saisir, l'Application peut lire le texte directement sur l'écran d'évaluation de Pokémon GO lorsque vous utilisez la fonction Scan ou Scan automatique :

*   Sur Android, cela utilise l'autorisation système de capture d'écran (MediaProjection) ; vous verrez la notification standard d'enregistrement d'écran d'Android tant que le scan est actif.
*   Sur iOS, cela utilise le sélecteur de diffusion d'écran ReplayKit d'Apple pour lire l'écran en direct pendant que le scan est actif.

Seule la zone d'évaluation/statistiques de l'écran (espèce, PC, niveau et IV) est lue — aucun autre contenu d'écran ni d'autre application n'est capturé. La reconnaissance de texte (OCR) s'effectue entièrement sur votre appareil, via Google ML Kit sur Android et le framework Vision d'Apple sur iOS. Aucune capture d'écran, enregistrement d'écran ou texte reconnu n'est jamais transmis à nous ou à des tiers, et rien n'est enregistré dans votre galerie photo : les images capturées sont stockées brièvement dans le cache local de l'application et supprimées automatiquement une fois traitées.

La lecture d'écran s'arrête dès que vous quittez l'écran de Scan ou que vous révoquez l'autorisation d'enregistrement d'écran dans les paramètres de votre appareil.

En cas d'échec d'un scan, vous pouvez choisir de joindre l'image capturée à un rapport de bug afin que nous puissions investiguer — cela n'est envoyé que si vous choisissez activement de le faire.

Vous pouvez également importer les statistiques d'un Pokémon en sélectionnant une capture d'écran existante dans votre galerie plutôt qu'en scannant en direct ; elle est traitée de la même manière, entièrement sur votre appareil.

**Services tiers**

L'Application utilise des services tiers qui peuvent traiter des données selon leurs propres politiques :

*   [Google Play Services](https://www.google.com/policies/privacy/)
*   [Firebase Crashlytics](https://firebase.google.com/support/privacy/)
*   [Mixpanel](https://mixpanel.com/legal/privacy-policy/)
*   [RevenueCat](https://www.revenuecat.com/privacy)

**Utilisation des informations**

Nous utilisons les informations pour :

*   Fournir les fonctionnalités et maintenir la qualité du service.
*   Suivre les performances, corriger les bugs et améliorer l'expérience utilisateur.
*   Traiter et restaurer les achats intégrés et les abonnements.
*   Communiquer les mises à jour importantes si nécessaire.

**Accès des tiers**

Nous ne vendons pas d'informations personnelles. Nous partageons des données limitées avec des prestataires qui nous aident à exploiter l'Application (analyses, suivi des bugs, abonnements) ou lorsque la loi l'exige.

**Conservation des données**

Nous ne conservons les données que le temps nécessaire aux finalités décrites, sauf si la loi impose une période plus longue.

Pour demander la suppression de données liées à vos demandes de support, contactez-nous à [hello@baru.software](mailto:hello@baru.software).

**Vie privée des enfants**

L'Application ne s'adresse pas aux enfants de moins de 13 ans et nous ne collectons pas sciemment d'informations personnelles les concernant.

**Droit de retrait**

Vous pouvez arrêter toute collecte en désinstallant l'Application via les processus standard de votre appareil ou du magasin d'applications.

**Sécurité**

Nous utilisons des mesures administratives, techniques et organisationnelles raisonnables pour protéger les données traitées.

**Modifications**

Nous pouvons mettre à jour cette Politique. Les changements prennent effet dès leur publication sur cette page.

Cette politique de confidentialité est effective à compter du 2026-07-30.

**Votre consentement**

En utilisant l'Application, vous acceptez cette Politique de Confidentialité.

**Contact**

Pour toute question, contactez Baru Software Co :

*   Site web : [https://baru.software/](https://baru.software/)
*   Email : [hello@baru.software](mailto:hello@baru.software)`,
  de: `Diese Datenschutzerklärung gilt für die mobile App BattleFlow (die „Anwendung“), bereitgestellt von Baru Software Co („wir“, „unser“ oder „uns“).

**Datenerhebung und -nutzung**

Wir erheben begrenzte Informationen, um die Anwendung bereitzustellen und zu verbessern. Je nach Nutzung können dies sein:

*   Nutzungsanalysen (z. B. aufgerufene Bildschirme, Interaktionen und Ereignisse).
*   Absturz- und Diagnosedaten (zur Stabilitätsüberwachung).
*   Kauf- und Abonnementstatus für Premium-Funktionen.
*   In der App erstellte Inhalte wie Teams, Kampfprotokolle und Einstellungen.
*   Über die Scan-/Auto-Scan-Funktion ausgelesene Pokémon-Werte auf dem Bildschirm, die vollständig auf Ihrem Gerät verarbeitet werden (siehe „Bildschirmerfassung" unten).

Die meisten App-Daten (wie Teams, Kampfprotokolle und Einstellungen) werden lokal auf Ihrem Gerät gespeichert.

Wir erfassen über die Anwendung nicht absichtlich präzise GPS-Standortdaten.

**Bildschirmerfassung (Scan / Auto-Scan)**

Damit Sie die Werte eines Pokémon importieren können, ohne sie einzutippen, kann die Anwendung Text direkt vom Bewertungsbildschirm von Pokémon GO auslesen, während Sie die Scan- oder Auto-Scan-Funktion nutzen:

*   Unter Android wird dafür die System-Bildschirmaufnahme-Berechtigung (MediaProjection) verwendet; solange der Scan aktiv ist, sehen Sie die übliche Android-Benachrichtigung zur Bildschirmaufnahme.
*   Unter iOS wird dafür Apples ReplayKit-Bildschirmübertragung verwendet, um den Bildschirm live zu lesen, während der Scan aktiv ist.

Es wird nur der Bewertungs-/Statistikbereich des Bildschirms gelesen (Spezies, WP, Level und IVs) — es werden keine anderen Apps oder Bildschirminhalte erfasst. Die Texterkennung (OCR) erfolgt vollständig auf Ihrem Gerät, mit Google ML Kit unter Android und Apples Vision-Framework unter iOS. Kein Screenshot, keine Bildschirmaufnahme und kein erkannter Text werden jemals an uns oder Dritte übermittelt, und nichts wird in Ihrer Fotomediathek gespeichert: Erfasste Einzelbilder werden kurzzeitig im lokalen Cache der App gespeichert und nach der Verarbeitung automatisch gelöscht.

Das Auslesen des Bildschirms endet, sobald Sie den Scan-Bildschirm verlassen oder die Bildschirmaufnahme-Berechtigung in den Geräteeinstellungen widerrufen.

Schlägt ein Scan fehl, können Sie das erfasste Bild optional an einen Fehlerbericht anhängen, damit wir das Problem untersuchen können — dies wird nur gesendet, wenn Sie sich aktiv dafür entscheiden.

Sie können die Werte eines Pokémon auch importieren, indem Sie anstelle eines Live-Scans einen vorhandenen Screenshot aus Ihrer Fotomediathek auswählen; dieser wird auf die gleiche Weise vollständig auf Ihrem Gerät verarbeitet.

**Dienste Dritter**

Die Anwendung nutzt Dienste Dritter, die Daten gemäß ihren eigenen Datenschutzrichtlinien verarbeiten können:

*   [Google Play Services](https://www.google.com/policies/privacy/)
*   [Firebase Crashlytics](https://firebase.google.com/support/privacy/)
*   [Mixpanel](https://mixpanel.com/legal/privacy-policy/)
*   [RevenueCat](https://www.revenuecat.com/privacy)

**Wie wir Informationen verwenden**

Wir verwenden Informationen, um:

*   App-Funktionen bereitzustellen und die Servicequalität aufrechtzuerhalten.
*   Die Leistung zu überwachen, Fehler zu beheben und die Benutzererfahrung zu verbessern.
*   In-App-Käufe/Abonnements zu verarbeiten und wiederherzustellen.
*   Wichtige Aktualisierungen zu kommunizieren, wenn dies erforderlich ist.

**Zugriff Dritter**

Wir verkaufen keine personenbezogenen Daten. Wir teilen begrenzte Daten mit Dienstleistern, die uns beim Betrieb der Anwendung unterstützen (z. B. Analysen, Absturzüberwachung und Abonnements), sowie wenn dies gesetzlich erforderlich ist.

**Datenspeicherung**

Wir speichern Daten nur so lange, wie es für die hier beschriebenen Zwecke erforderlich ist, es sei denn, eine längere Speicherung ist gesetzlich vorgeschrieben.

Wenn Sie möchten, dass wir Daten im Zusammenhang mit Ihren Support-Anfragen löschen, kontaktieren Sie uns unter [hello@baru.software](mailto:hello@baru.software).

**Privatsphäre von Kindern**

Die Anwendung richtet sich nicht an Kinder unter 13 Jahren, und wir erheben wissentlich keine personenbezogenen Daten von Kindern unter 13 Jahren.

**Opt-out-Rechte**

Sie können die Erhebung von Informationen durch die Anwendung einfach beenden, indem Sie diese deinstallieren.

**Sicherheit**

Wir setzen angemessene administrative, technische und organisatorische Sicherheitsvorkehrungen ein, um die verarbeiteten Informationen zu schützen.

**Änderungen**

Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Änderungen werden mit der Veröffentlichung auf dieser Seite wirksam.

Diese Datenschutzerklärung ist gültig ab dem 2026-07-30.

**Ihre Zustimmung**

Durch die Nutzung der Anwendung stimmen Sie dieser Datenschutzerklärung zu.

**Kontakt**

Bei Fragen zum Datenschutz wenden Sie sich bitte an Baru Software Co:

*   Website: [https://baru.software/](https://baru.software/)
*   E-Mail: [hello@baru.software](mailto:hello@baru.software)`,
  it: `La presente Informativa sulla Privacy si applica all'app mobile BattleFlow (l'"Applicazione"), fornita da Baru Software Co ("noi", "nostro" o "ci").

**Raccolta e uso delle informazioni**

Raccogliamo informazioni limitate per operare e migliorare l'Applicazione. A seconda dell'uso, queste possono includere:

*   Analisi sull'utilizzo dell'app (ad esempio, schermate visualizzate, interazioni e eventi).
*   Dati su crash e diagnostica (per il monitoraggio della stabilità).
*   Stato ed eventi di acquisto/abbonamento per le funzionalità premium.
*   Contenuti creati nell'app, come team, registri di battaglia e preferenze.
*   Statistiche del Pokémon lette a schermo tramite la funzione Scansione/Scansione automatica, elaborate interamente sul tuo dispositivo (vedi "Scansione dello schermo" più sotto).

La maggior parte dei dati (team, registri, preferenze) è memorizzata localmente sul dispositivo.

Non raccogliamo intenzionalmente dati precisi sulla posizione GPS tramite l'Applicazione.

**Scansione dello schermo (Scansione / Scansione automatica)**

Per consentirti di importare le statistiche di un Pokémon senza doverle digitare, l'Applicazione può leggere il testo direttamente dalla schermata di valutazione di Pokémon GO mentre utilizzi la funzione Scansione o Scansione automatica:

*   Su Android, questo utilizza l'autorizzazione di sistema per l'acquisizione dello schermo (MediaProjection); vedrai la notifica standard di Android per la registrazione dello schermo finché la scansione è attiva.
*   Su iOS, questo utilizza il selettore di trasmissione dello schermo ReplayKit di Apple per leggere lo schermo in tempo reale mentre la scansione è attiva.

Viene letta solo l'area di valutazione/statistiche dello schermo (specie, PL, livello e IV): non vengono acquisiti contenuti di altre app o di altre parti dello schermo. Il riconoscimento del testo (OCR) avviene interamente sul tuo dispositivo, tramite Google ML Kit su Android e il framework Vision di Apple su iOS. Nessuno screenshot, registrazione dello schermo o testo riconosciuto viene mai caricato verso di noi o verso terze parti, e nulla viene salvato nella tua libreria foto: i fotogrammi acquisiti vengono conservati brevemente nella cache locale dell'app ed eliminati automaticamente una volta elaborati.

La lettura dello schermo si interrompe non appena esci dalla schermata di Scansione o revochi l'autorizzazione di registrazione dello schermo nelle impostazioni del dispositivo.

Se una scansione non riesce, puoi scegliere di allegare l'immagine acquisita a una segnalazione di errore per aiutarci a indagare: questo avviene solo se scegli attivamente di inviarla.

Puoi anche importare le statistiche di un Pokémon selezionando uno screenshot esistente dalla tua libreria foto invece di scansionare dal vivo; viene elaborato allo stesso modo, interamente sul tuo dispositivo.

**Servizi di terze parti**

L'Applicazione utilizza servizi di terze parti che possono trattare i dati secondo le proprie informative:

*   [Google Play Services](https://www.google.com/policies/privacy/)
*   [Firebase Crashlytics](https://firebase.google.com/support/privacy/)
*   [Mixpanel](https://mixpanel.com/legal/privacy-policy/)
*   [RevenueCat](https://www.revenuecat.com/privacy)

**Come utilizziamo le informazioni**

Utilizziamo le informazioni per:

*   Fornire le funzionalità dell'app e mantenere la qualità del servizio.
*   Monitorare le prestazioni, correggere bug e migliorare l'esperienza utente.
*   Gestire e ripristinare acquisti in-app e abbonamenti.
*   Comunicare aggiornamenti importanti quando necessario.

**Accesso di terze parti**

Non vendiamo dati personali. Condividiamo dati limitati con fornitori che ci aiutano a gestire l'Applicazione (analisi, monitoraggio crash, abbonamenti) e quando richiesto dalla legge.

**Conservazione dei dati**

Conserviamo i dati solo per il tempo necessario alle finalità descritte, salvo diversamente richiesto dalla legge.

Per richiedere la cancellazione dei dati legati alle richieste di supporto, contattaci a [hello@baru.software](mailto:hello@baru.software).

**Privacy dei minori**

L'Applicazione non è destinata a minori di 13 anni e non raccogliamo consapevolmente i loro dati personali.

**Diritti di opt-out**

È possibile interrompere la raccolta dei dati disinstallando l'Applicazione tramite le procedure standard del dispositivo o dello store.

**Sicurezza**

Adottiamo ragionevoli misure amministrative, tecniche e organizzative per proteggere le informazioni trattate.

**Modifiche**

Possiamo aggiornare periodicamente questa Informativa. Le modifiche diventano efficaci al momento della pubblicazione su questa pagina.

La presente informativa sulla privacy è in vigore dal 2026-07-30.

**Consenso**

Utilizzando l'Applicazione, l'utente acconsente alla presente Informativa sulla Privacy.

**Contatti**

Per domande sulla privacy, contatta Baru Software Co:

*   Sito web: [https://baru.software/](https://baru.software/)
*   Email: [hello@baru.software](mailto:hello@baru.software)`,
  pt: `Esta Política de Privacidade aplica-se ao aplicativo móvel BattleFlow (o "Aplicativo"), fornecido pela Baru Software Co ("nós", "nosso" ou "nos").

**Coleta e Uso de Informações**

Coletamos informações limitadas para operar e melhorar o Aplicativo. Dependendo de como você o utiliza, isso pode incluir:

*   Análise de uso do aplicativo (por exemplo, telas visualizadas, interações com recursos e eventos do aplicativo).
*   Dados de falhas e diagnósticos (para monitoramento de estabilidade).
*   Status e eventos de compra/assinatura necessários para fornecer recursos premium.
*   Conteúdo criado no aplicativo, como equipes, registros de batalha e preferências.
*   Estatísticas do Pokémon lidas na tela por meio do recurso de Escaneamento/Escaneamento automático, processadas inteiramente no seu dispositivo (veja "Leitura de Tela" abaixo).

A maioria dos dados do aplicativo (como equipes, registros de batalha e preferências) é armazenada localmente no seu dispositivo.

Não coletamos intencionalmente dados precisos de localização GPS através do Aplicativo.

**Leitura de Tela (Escaneamento / Escaneamento Automático)**

Para permitir que você importe as estatísticas de um Pokémon sem precisar digitá-las, o Aplicativo pode ler texto diretamente da tela de avaliação do Pokémon GO enquanto você usa o recurso de Escaneamento ou Escaneamento automático:

*   No Android, isso utiliza a permissão de captura de tela do sistema (MediaProjection); você verá a notificação padrão de gravação de tela do Android enquanto o escaneamento estiver ativo.
*   No iOS, isso utiliza o seletor de transmissão de tela ReplayKit da Apple para ler a tela ao vivo enquanto o escaneamento estiver ativo.

Somente a área de avaliação/estatísticas da tela é lida (espécie, PC, nível e IVs) — nenhum outro app ou conteúdo da tela é capturado. O reconhecimento de texto (OCR) ocorre inteiramente no seu dispositivo, usando o Google ML Kit no Android e o framework Vision da Apple no iOS. Nenhuma captura de tela, gravação de tela ou texto reconhecido é enviado para nós ou para terceiros, e nada é salvo na sua galeria de fotos: os quadros capturados são armazenados brevemente no cache local do aplicativo e excluídos automaticamente após serem processados.

A leitura de tela é interrompida assim que você sai da tela de Escaneamento ou revoga a permissão de gravação de tela nas configurações do seu dispositivo.

Se um escaneamento falhar, você pode optar por anexar a imagem capturada a um relatório de erro para nos ajudar a investigar — isso só é enviado se você escolher ativamente enviá-lo.

Você também pode importar as estatísticas de um Pokémon selecionando uma captura de tela existente da sua galeria em vez de escanear ao vivo; ela é processada da mesma forma, inteiramente no seu dispositivo.

**Serviços de Terceiros**

O Aplicativo utiliza serviços de terceiros que podem processar dados de acordo com suas próprias políticas de privacidade:

*   [Google Play Services](https://www.google.com/policies/privacy/)
*   [Firebase Crashlytics](https://firebase.google.com/support/privacy/)
*   [Mixpanel](https://mixpanel.com/legal/privacy-policy/)
*   [RevenueCat](https://www.revenuecat.com/privacy)

**Como Utilizamos as Informações**

Utilizamos as informações para:

*   Fornecer recursos do aplicativo e manter a qualidade do serviço.
*   Monitorar o desempenho, corrigir erros e melhorar a experiência do usuário.
*   Processar e restaurar compras/assinaturas no aplicativo.
*   Comunicar atualizações importantes quando necessário.

**Acesso de Terceiros**

Não vendemos informações pessoais. Podemos compartilhar dados limitados com prestadores de serviços que nos ajudam a operar o Aplicativo (por exemplo, análises, monitoramento de falhas e assinaturas) e quando legalmente exigido.

**Retenção de Dados**

Retemos os dados apenas pelo tempo necessário para os fins aqui descritos, a menos que um período de retenção mais longo seja exigido por lei.

Se desejar que excluamos os dados associados às suas solicitações de suporte ou outras informações fornecidas diretamente, entre em contato conosco em [hello@baru.software](mailto:hello@baru.software).

**Privacidade de Crianças**

O Aplicativo não é direcionado a crianças menores de 13 anos e não coletamos conscientemente informações pessoais de crianças menores de 13 anos.

**Direitos de Desativação (Opt-Out)**

Você pode interromper facilmente toda a coleta de informações pelo Aplicativo desinstalando-o. Você pode usar os processos padrão de desinstalação disponíveis em seu dispositivo móvel ou através do mercado de aplicativos móveis.

**Segurança**

Utilizamos salvaguardas administrativas, técnicas e organizacionais razoáveis para proteger as informações processadas pelo Aplicativo.

**Alterações**

Podemos atualizar esta Política de Privacidade periodicamente. As alterações entram em vigor quando publicadas nesta página.

Esta política de privacidade é efetiva a partir de 2026-07-30.

**Seu Consentimento**

Ao utilizar o Aplicativo, você concorda com esta Política de Privacidade.

**Contate-nos**

Se você tiver dúvidas sobre privacidade, entre em contato com a Baru Software Co:

*   Site: [https://baru.software/](https://baru.software/)
*   E-mail: [hello@baru.software](mailto:hello@baru.software)`,
  ja: `このプライバシーポリシーは、Baru Software Co（以下「当社」）が提供するBattleFlowモバイルアプリ（以下「本アプリ」）に適用されます。

**情報の収集と利用**

当社は、本アプリの運営および改善のために、限定的な情報を収集します。利用状況に応じて、以下の情報が含まれる場合があります。

*   アプリの利用状況分析（例：表示された画面、機能の操作、アプリイベント）
*   クラッシュおよび診断データ（安定性監視のため）
*   プレミアム機能の提供に必要な購入・サブスクリプションのステータス/イベント
*   チーム、バトルログ、設定など、アプリ内で作成されたコンテンツ
*   スキャン／自動スキャン機能で画面から読み取るポケモンのステータス（端末上でのみ処理されます。詳細は下記の「画面読み取り」をご覧ください）

ほとんどのアプリデータ（チーム、バトルログ、設定など）は、お客様の端末内にローカルに保存されます。

本アプリは、意図的に正確なGPS位置情報を収集することはありません。

**画面読み取り（スキャン／自動スキャン）**

ステータスを手入力せずに取り込めるようにするため、本アプリはスキャンまたは自動スキャン機能をご利用の際、Pokémon GOの評価画面から直接テキストを読み取ることがあります。

*   Androidでは、システムの画面キャプチャ権限（MediaProjection）を使用します。スキャンが有効な間、Android標準の画面収録通知が表示されます。
*   iOSでは、Appleの ReplayKit 画面ブロードキャストのピッカーを使用し、スキャンが有効な間、画面をリアルタイムで読み取ります。

読み取られるのは画面の評価・ステータス部分（種類、CP、レベル、個体値）のみで、他のアプリや画面の他の部分がキャプチャされることはありません。文字認識（OCR）はすべて端末上で行われ、Androidでは Google ML Kit、iOSでは Appleの Vision フレームワークを使用します。スクリーンショット、画面収録、認識されたテキストが当社や第三者にアップロードされることは一切なく、写真ライブラリに保存されることもありません。キャプチャされたフレームはアプリのローカルキャッシュに一時的に保存され、処理後に自動的に削除されます。

スキャン画面を終了するか、端末の設定で画面収録の権限を取り消すと、画面の読み取りは直ちに停止します。

スキャンに失敗した場合、調査にご協力いただくため、キャプチャした画像を不具合報告に添付することを選択できます。これは、お客様が自らの意思で送信を選択した場合にのみ送信されます。

また、ライブでスキャンする代わりに、写真ライブラリから既存のスクリーンショットを選んでポケモンのステータスを取り込むこともできます。この場合も同様に、すべて端末上で処理されます。

**第三者サービス**

本アプリは、独自のプライバシーポリシーに従ってデータを処理する可能性のある第三者サービスを利用しています。

*   [Google Play Services](https://www.google.com/policies/privacy/)
*   [Firebase Crashlytics](https://firebase.google.com/support/privacy/)
*   [Mixpanel](https://mixpanel.com/legal/privacy-policy/)
*   [RevenueCat](https://www.revenuecat.com/privacy)

**情報の利用目的**

収集した情報は、以下の目的で利用されます。

*   アプリ機能の提供およびサービス品質の維持
*   パフォーマンスの監視、バグの修正、ユーザー体験の向上
*   アプリ内購入・サブスクリプションの処理および復元
*   必要に応じた重要なアップデートの通知

**第三者へのアクセス**

当社は個人情報を販売しません。本アプリの運営を支援するサービスプロバイダー（分析、クラッシュ監視、サブスクリプションなど）と限定的なデータを共有する場合、および法律で義務付けられている場合を除き、第三者に開示することはありません。

**データの保持**

当社は、法律でより長い保持期間が義務付けられていない限り、本ポリシーに記載された目的のために必要な期間のみデータを保持します。

サポートリクエストや直接提供された情報に関連するデータの削除をご希望の場合は、[hello@baru.software](mailto:hello@baru.software) までご連絡ください。

**子どものプライバシー**

本アプリは13歳未満の子どもを対象としておらず、13歳未満の子どもから意図的に個人情報を収集することはありません。

**オプトアウト権**

本アプリをアンインストールすることで、本アプリによるすべての情報収集を簡単に停止できます。端末の標準的なアンインストール手順をご利用ください。

**セキュリティ**

当社は、本アプリで処理される情報を保護するために、合理的な管理的、技術的、および組織的な安全管理措置を講じています。

**変更**

当社は、本プライバシーポリシーを随時更新することがあります。変更は本ページに掲載された時点で有効となります。

本プライバシーポリシーの発効日: 2026-07-30

**同意**

本アプリを使用することにより、本プライバシーポリシーに同意したものとみなされます。

**お問い合わせ**

プライバシーに関するご質問がある場合は、Baru Software Co までお問い合わせください。

*   ウェブサイト: [https://baru.software/](https://baru.software/)
*   メール: [hello@baru.software](mailto:hello@baru.software)`,
  ko: `본 개인정보 처리방침은 Baru Software Co(이하 "당사")가 제공하는 BattleFlow 모바일 앱(이하 "애플리케이션")에 적용됩니다.

**정보 수집 및 이용**

당사는 애플리케이션 운영 및 개선을 위해 제한된 정보를 수집합니다. 이용 방식에 따라 다음이 포함될 수 있습니다.

*   앱 이용 분석(예: 조회한 화면, 기능 상호작용, 앱 이벤트)
*   크래시 및 진단 데이터(안정성 모니터링 목적)
*   프리미엄 기능 제공에 필요한 구매 및 구독 상태/이벤트
*   팀, 배틀 로그, 설정 등 앱 내에서 생성한 콘텐츠
*   스캔/자동 스캔 기능을 통해 화면에서 읽은 포켓몬 능력치(기기에서만 처리됨 — 아래 "화면 읽기" 참고)

대부분의 앱 데이터(팀, 배틀 로그, 설정 등)는 사용자의 기기에 로컬로 저장됩니다.

당사는 애플리케이션을 통해 의도적으로 정밀 GPS 위치 정보를 수집하지 않습니다.

**화면 읽기(스캔 / 자동 스캔)**

능력치를 직접 입력하지 않고도 가져올 수 있도록, 애플리케이션은 스캔 또는 자동 스캔 기능을 사용하는 동안 Pokémon GO의 감정 화면에서 텍스트를 직접 읽어올 수 있습니다.

*   Android에서는 시스템 화면 캡처 권한(MediaProjection)을 사용합니다. 스캔이 활성화되어 있는 동안 Android의 표준 화면 기록 알림이 표시됩니다.
*   iOS에서는 Apple의 ReplayKit 화면 브로드캐스트 선택기를 사용하여 스캔이 활성화되어 있는 동안 화면을 실시간으로 읽습니다.

화면의 감정/능력치 영역(종류, CP, 레벨, 개체값)만 읽으며, 다른 앱이나 화면의 다른 부분은 캡처되지 않습니다. 텍스트 인식(OCR)은 전적으로 기기에서 이루어지며, Android에서는 Google ML Kit를, iOS에서는 Apple의 Vision 프레임워크를 사용합니다. 스크린샷, 화면 기록 또는 인식된 텍스트가 당사나 제3자에게 업로드되는 일은 없으며, 사진 보관함에 저장되지도 않습니다. 캡처된 프레임은 앱의 로컬 캐시에 잠시 저장되었다가 처리 후 자동으로 삭제됩니다.

스캔 화면을 벗어나거나 기기 설정에서 화면 기록 권한을 철회하는 즉시 화면 읽기가 중단됩니다.

스캔에 실패한 경우, 문제 조사에 도움이 되도록 캡처된 이미지를 오류 보고서에 첨부할 수 있습니다. 이는 사용자가 직접 전송을 선택한 경우에만 전송됩니다.

실시간으로 스캔하는 대신 사진 보관함에서 기존 스크린샷을 선택하여 포켓몬의 능력치를 가져올 수도 있습니다. 이 경우에도 동일한 방식으로 전적으로 기기에서 처리됩니다.

**제3자 서비스**

애플리케이션은 자체 개인정보 처리방침에 따라 데이터를 처리할 수 있는 제3자 서비스를 사용합니다.

*   [Google Play Services](https://www.google.com/policies/privacy/)
*   [Firebase Crashlytics](https://firebase.google.com/support/privacy/)
*   [Mixpanel](https://mixpanel.com/legal/privacy-policy/)
*   [RevenueCat](https://www.revenuecat.com/privacy)

**정보 이용 방식**

당사는 수집한 정보를 다음과 같은 목적으로 이용합니다.

*   앱 기능 제공 및 서비스 품질 유지
*   성능 모니터링, 버그 수정 및 사용자 경험 개선
*   인앱 구매/구독 처리 및 복원
*   필요 시 중요한 업데이트 알림

**제3자 접근**

당사는 개인정보를 판매하지 않습니다. 애플리케이션 운영을 돕는 서비스 제공업체(분석, 크래시 모니터링, 구독 관리 등)와 제한된 데이터를 공유할 수 있으며, 법적 요구가 있는 경우에 한해 공유합니다.

**데이터 보관**

당사는 법률에 따라 더 긴 보관 기간이 요구되지 않는 한, 본 방침에 명시된 목적에 필요한 기간 동안만 데이터를 보관합니다.

지원 요청 또는 직접 제공한 정보와 관련된 데이터의 삭제를 원하시는 경우, [hello@baru.software](mailto:hello@baru.software)로 문의해 주시기 바랍니다.

**아동 개인정보**

애플리케이션은 13세 미만 아동을 대상으로 하지 않으며, 13세 미만 아동으로부터 고의로 개인정보를 수집하지 않습니다.

**수집 거부 권리**

애플리케이션을 삭제함으로써 모든 정보 수집을 간단히 중단할 수 있습니다. 모바일 기기 또는 앱 마켓에서 제공하는 표준 삭제 프로세스를 이용하시기 바랍니다.

**보안**

당사는 애플리케이션에서 처리되는 정보를 보호하기 위해 합리적인 관리적, 기술적, 조직적 보호 조치를 사용합니다.

**변경 사항**

당사는 본 개인정보 처리방침을 수시로 업데이트할 수 있습니다. 변경 사항은 본 페이지에 게시되는 시점부터 효력이 발생합니다.

본 개인정보 처리방침 시행일: 2026-07-30

**동의**

애플리케이션을 이용함으로써 귀하는 본 개인정보 처리방침에 동의하게 됩니다.

**문의처**

개인정보와 관련하여 궁금한 점이 있으시면 Baru Software Co로 문의해 주십시오.

*   웹사이트: [https://baru.software/](https://baru.software/)
*   이메일: [hello@baru.software](mailto:hello@baru.software)`,
  'zh-hant': `本隱私政策適用於由 Baru Software Co（以下簡稱「我們」）提供的 BattleFlow 行動應用程式（以下簡稱「應用程式」）。

**資訊蒐集與使用**

為了營運並改善應用程式，我們蒐集有限的資訊。根據您的使用方式，這可能包括：

*   應用程式使用情況分析（例如：瀏覽的頁面、功能互動和應用程式事件）。
*   當機及診斷資料（用於穩定性監控）。
*   提供進階功能所需的購買及訂閱狀態/事件。
*   您在應用程式中建立的內容，如隊伍、對戰紀錄和偏好設定。
*   透過掃描／自動掃描功能讀取的畫面上寶可夢數據，完全在您的裝置上處理（詳見下方「畫面讀取」）。

大部分應用程式資料（如隊伍、對戰紀錄和偏好設定）均儲存在您的裝置本機。

我們不會透過本應用程式主動蒐集精確的 GPS 位置數據。

**畫面讀取（掃描／自動掃描）**

為了讓您在不需手動輸入的情況下匯入寶可夢數據，本應用程式在您使用「掃描」或「自動掃描」功能時，可直接讀取 Pokémon GO 評估畫面上的文字：

*   在 Android 上，此功能使用系統的螢幕擷取權限（MediaProjection）；掃描進行中時，您會看到 Android 標準的螢幕錄製通知。
*   在 iOS 上，此功能使用 Apple 的 ReplayKit 螢幕廣播選擇器，在掃描進行中即時讀取畫面。

僅會讀取畫面中的評估／數據區域（種類、CP、等級與個體值）——不會擷取其他應用程式或畫面其他部分的內容。文字辨識（OCR）完全在您的裝置上進行，Android 使用 Google ML Kit，iOS 使用 Apple 的 Vision 框架。任何螢幕截圖、螢幕錄製或辨識出的文字都不會上傳給我們或任何第三方，也不會儲存到您的相簿：擷取的畫面會暫存於應用程式的本機快取中，處理完成後會自動刪除。

只要您離開掃描畫面，或在裝置設定中撤銷螢幕錄製權限，畫面讀取就會立即停止。

若掃描失敗，您可以選擇將擷取的畫面附加到錯誤回報中，協助我們調查——僅在您主動選擇傳送時才會送出。

您也可以改為從相簿選擇現有的螢幕截圖來匯入寶可夢數據，而不必即時掃描；這會以相同方式完全在您的裝置上處理。

**第三方服務**

本應用程式使用的第三方服務可能會根據其自身的隱私政策處理資料：

*   [Google Play 服務](https://www.google.com/policies/privacy/)
*   [Firebase Crashlytics](https://firebase.google.com/support/privacy/)
*   [Mixpanel](https://mixpanel.com/legal/privacy-policy/)
*   [RevenueCat](https://www.revenuecat.com/privacy)

**我們如何使用資訊**

我們將資訊用於：

*   提供應用程式功能並維持服務品質。
*   監控效能、修復錯誤並改善使用者體驗。
*   處理並恢復應用程式內購買/訂閱。
*   必要時溝通重要更新。

**第三方存取**

我們不會出售個人資訊。我們可能會與協助我們營運應用程式的某些服務供應商（例如分析、當機監控和訂閱服務）共享有限的資料，或在法律要求時共享。

**資料保留**

除非法律要求更長的保留期，否則我們僅在實現本文所述目的所需的期限內保留資料。

如果您希望我們刪除與您的支援請求或其他直接提供的資訊相關的資料，請透過 [hello@baru.software](mailto:hello@baru.software) 聯絡我們。

**兒童隱私**

本應用程式不面向 13 歲以下的兒童，我們不會故意蒐集 13 歲以下兒童的個人資訊。

**退出權利**

您可以透過解除安裝應用程式輕鬆停止應用程式蒐集所有資訊。您可以使用行動裝置或應用程式商店提供的標準解除安裝程序。

**安全**

我們採用合理的管理、技術和組織保障措施來保護應用程式處理的資訊。

**變更**

我們可能會不時更新本隱私政策。變更自在本頁面發佈之日起生效。

本隱私政策自 2026-07-30 起生效。

**您的同意**

使用本應用程式即表示您同意本隱私政策。

**聯絡我們**

如果您對隱私有任何疑問，請聯絡 Baru Software Co：

*   網站: [https://baru.software/](https://baru.software/)
*   Email: [hello@baru.software](mailto:hello@baru.software)`
};

export const tacData: Record<string, string> = {
  en: `These Terms and Conditions apply to the BattleFlow mobile app (the "Application"), provided by Baru Software Co ("we", "our", or "us") as a free-to-download service with optional paid subscriptions.

By downloading or using the Application, you agree to these Terms. If you do not agree, please do not use the Application.

All rights, title, and interest in the Application (including trademarks, copyrights, and other intellectual property) remain with Baru Software Co and its licensors. You may not copy, modify, reverse engineer, decompile, create derivative works, or otherwise misuse the Application except as permitted by law.

We may update, suspend, or discontinue parts of the Application at any time, including features, data sources, and subscription offerings. We may also change pricing for paid features, and any charges will be presented clearly before purchase.

**Subscriptions**

BattleFlow Pro is an auto-renewing subscription billed through the app store you purchased it from (Apple App Store or Google Play). Payment is charged to your account at confirmation of purchase, and the subscription renews automatically unless auto-renew is turned off at least 24 hours before the end of the current period. You can manage or cancel your subscription at any time in your App Store or Google Play account settings.

**Subscriptions are tied to the store they were purchased through and cannot be transferred between stores.** A subscription bought on the Apple App Store cannot be moved to Google Play, or vice versa. To change billing platforms you must cancel on the original store and purchase again on the new one. Where account sign-in is available, your Pro access may be shared across your devices even though billing remains with the original store.

Refunds are handled by Apple or Google in accordance with their respective policies; we are not able to issue store refunds directly.

You are responsible for keeping your device and access credentials secure. We recommend not jailbreaking or rooting your device, as doing so may reduce security and affect app functionality.

The Application uses third-party services that have their own terms:

*   [Google Play Services](https://policies.google.com/terms)
*   [Firebase Crashlytics](https://firebase.google.com/terms/crashlytics)
*   [Mixpanel](https://mixpanel.com/legal/terms-of-use/)
*   [RevenueCat](https://www.revenuecat.com/terms)

Some features require an active internet connection. We are not responsible for limited functionality caused by connectivity issues, carrier restrictions, outages, or lack of data allowance.

When using the Application, your mobile carrier or app store terms may also apply. You are responsible for any data usage fees, roaming fees, or purchase charges.

To the maximum extent permitted by law, the Application is provided "AS IS" and "AS AVAILABLE" without warranties of any kind. We do not guarantee uninterrupted availability, complete accuracy, or fitness for a particular purpose.

To the maximum extent permitted by law, Baru Software Co is not liable for indirect, incidental, special, consequential, or punitive damages, or any loss of data, profits, or goodwill arising from your use of the Application.

Your use of the Application is also governed by our Privacy Policy.

**Changes to These Terms and Conditions**

We may update these Terms from time to time. Updates are effective when posted on this page.

These terms and conditions are effective as of 2026-06-24.

**Contact Us**

If you have questions about these Terms, contact Baru Software Co:

*   Website: [https://baru.software/](https://baru.software/)
*   Email: [hello@baru.software](mailto:hello@baru.software)`,
  es: `Estos Términos y Condiciones se aplican a la aplicación móvil BattleFlow (la "Aplicación"), proporcionada por Baru Software Co ("nosotros", "nuestro" o "nos") como un servicio de descarga gratuita con suscripciones de pago opcionales.

Al descargar o utilizar la Aplicación, usted acepta estos Términos. Si no está de acuerdo, le rogamos que no utilice la Aplicación.

Todos los derechos, títulos e intereses sobre la Aplicación (incluidas marcas comerciales, derechos de autor y otra propiedad intelectual) pertenecen a Baru Software Co y sus licenciantes. No podrá copiar, modificar, realizar ingeniería inversa, descompilar, crear obras derivadas ni hacer un uso indebido de la Aplicación, salvo en la medida en que lo permita la ley.

Podemos actualizar, suspender o discontinuar partes de la Aplicación en cualquier momento, incluyendo funciones, fuentes de datos y ofertas de suscripción. También podemos cambiar los precios de las funciones de pago; cualquier cargo se presentará claramente antes de la compra.

**Suscripciones**

BattleFlow Pro es una suscripción de renovación automática que se cobra a través de la tienda de aplicaciones en la que la adquirió (Apple App Store o Google Play). El pago se cargará a su cuenta al confirmar la compra, y la suscripción se renueva automáticamente a menos que la renovación automática se desactive al menos 24 horas antes del final del período actual. Puede gestionar o cancelar su suscripción en cualquier momento desde la configuración de su cuenta de App Store o Google Play.

**Las suscripciones están vinculadas a la tienda en la que se adquirieron y no se pueden transferir entre tiendas.** Una suscripción comprada en la Apple App Store no puede trasladarse a Google Play, ni viceversa. Para cambiar de plataforma de facturación, debe cancelar en la tienda original y volver a comprar en la nueva. Cuando el inicio de sesión con cuenta esté disponible, su acceso Pro podrá compartirse entre sus dispositivos aunque la facturación permanezca en la tienda original.

Los reembolsos son gestionados por Apple o Google de acuerdo con sus respectivas políticas; no podemos emitir reembolsos de la tienda directamente.

Usted es responsable de mantener la seguridad de su dispositivo y de sus credenciales de acceso. Recomendamos no realizar jailbreak ni rootear su dispositivo, ya que esto puede reducir la seguridad y afectar a la funcionalidad de la aplicación.

La Aplicación utiliza servicios de terceros que tienen sus propios términos:

*   [Google Play Services](https://policies.google.com/terms)
*   [Firebase Crashlytics](https://firebase.google.com/terms/crashlytics)
*   [Mixpanel](https://mixpanel.com/legal/terms-of-use/)
*   [RevenueCat](https://www.revenuecat.com/terms)

Algunas funciones requieren una conexión activa a Internet. No nos hacemos responsables de las limitaciones de funcionalidad causadas por problemas de conectividad, restricciones del operador, cortes o falta de datos.

Al utilizar la Aplicación, también pueden aplicarse los términos de su operador móvil o de la tienda de aplicaciones. Usted es responsable de cualquier tarifa de uso de datos, cargos de roaming o costes de compra.

En la medida máxima permitida por la ley, la Aplicación se proporciona "TAL CUAL" y "SEGÚN DISPONIBILIDAD" sin garantías de ningún tipo. No garantizamos la disponibilidad ininterrumpida, la precisión completa o la idoneidad para un propósito particular.

En la medida máxima permitida por la ley, Baru Software Co no será responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos, ni de ninguna pérdida de datos, beneficios o fondo de comercio derivados del uso de la Aplicación.

El uso de la Aplicación también se rige por nuestra Política de Privacidad.

**Cambios en estos Términos y Condiciones**

Podemos actualizar estos Términos periódicamente. Las actualizaciones entrarán en vigor cuando se publiquen en esta página.

Estos términos y condiciones son efectivos a partir del 2026-06-24.

**Contacto**

Si tiene alguna pregunta sobre estos Términos, póngase en contacto con Baru Software Co:

*   Sitio web: [https://baru.software/](https://baru.software/)
*   Correo electrónico: [hello@baru.software](mailto:hello@baru.software)`,
  fr: `Ces Conditions Générales s'appliquent à l'application mobile BattleFlow (l'"Application"), fournie par Baru Software Co ("nous", "notre" ou "nos") en tant que service gratuit à télécharger avec des abonnements payants facultatifs.

En téléchargeant ou en utilisant l'Application, vous acceptez ces Conditions. Si vous ne les acceptez pas, veuillez ne pas utiliser l'Application.

Tous les droits, titres et intérêts relatifs à l'Application (y compris les marques, droits d'auteur et autres droits de propriété intellectuelle) demeurent la propriété de Baru Software Co et de ses concédants de licence. Vous ne pouvez pas copier, modifier, faire de l'ingénierie inverse, décompiler, créer des œuvres dérivées ni autrement détourner l'Application, sauf dans les limites autorisées par la loi.

Nous pouvons mettre à jour, suspendre ou interrompre des parties de l'Application à tout moment, y compris les fonctionnalités, les sources de données et les offres d'abonnement. Nous pouvons également modifier les tarifs des fonctionnalités payantes, et tout frais vous sera présenté clairement avant l'achat.

**Abonnements**

BattleFlow Pro est un abonnement à renouvellement automatique facturé via le magasin d'applications sur lequel vous l'avez acheté (Apple App Store ou Google Play). Le paiement est prélevé sur votre compte au moment de la confirmation de l'achat, et l'abonnement se renouvelle automatiquement sauf si le renouvellement automatique est désactivé au moins 24 heures avant la fin de la période en cours. Vous pouvez gérer ou résilier votre abonnement à tout moment dans les paramètres de votre compte App Store ou Google Play.

**Les abonnements sont liés au magasin sur lequel ils ont été achetés et ne peuvent pas être transférés d'un magasin à un autre.** Un abonnement souscrit sur l'Apple App Store ne peut pas être déplacé vers Google Play, et inversement. Pour changer de plateforme de facturation, vous devez résilier sur le magasin d'origine et acheter à nouveau sur le nouveau. Lorsque la connexion à un compte est disponible, votre accès Pro peut être partagé entre vos appareils, même si la facturation reste rattachée au magasin d'origine.

Les remboursements sont gérés par Apple ou Google conformément à leurs politiques respectives ; nous ne sommes pas en mesure d'émettre directement des remboursements via les magasins.

Il vous appartient de protéger votre appareil et vos identifiants d'accès. Nous vous recommandons de ne pas jailbreaker ni rooter votre appareil, car cela peut réduire la sécurité et affecter le fonctionnement de l'application.

L'Application utilise des services tiers qui disposent de leurs propres conditions :

*   [Google Play Services](https://policies.google.com/terms)
*   [Firebase Crashlytics](https://firebase.google.com/terms/crashlytics)
*   [Mixpanel](https://mixpanel.com/legal/terms-of-use/)
*   [RevenueCat](https://www.revenuecat.com/terms)

Certaines fonctionnalités nécessitent une connexion Internet active. Nous ne sommes pas responsables d'un fonctionnement limité dû à des problèmes de connectivité, des restrictions de l'opérateur, des pannes ou un manque de forfait de données.

Lors de l'utilisation de l'Application, les conditions de votre opérateur mobile ou de votre magasin d'applications peuvent également s'appliquer. Vous êtes responsable de tout frais d'utilisation de données, frais d'itinérance ou frais d'achat.

Dans toute la mesure permise par la loi, l'Application est fournie "EN L'ÉTAT" et "SELON DISPONIBILITÉ", sans garantie d'aucune sorte. Nous ne garantissons pas une disponibilité ininterrompue, une exactitude complète ni l'adéquation à un usage particulier.

Dans toute la mesure permise par la loi, Baru Software Co n'est pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, ni de toute perte de données, de bénéfices ou de réputation découlant de votre utilisation de l'Application.

Votre utilisation de l'Application est également régie par notre Politique de Confidentialité.

**Modifications de ces Conditions Générales**

Nous pouvons mettre à jour ces Conditions de temps à autre. Les mises à jour prennent effet dès leur publication sur cette page.

Ces conditions générales sont effectives à compter du 2026-06-24.

**Nous contacter**

Si vous avez des questions concernant ces Conditions, contactez Baru Software Co :

*   Site web : [https://baru.software/](https://baru.software/)
*   E-mail : [hello@baru.software](mailto:hello@baru.software)`,
  de: `Diese Allgemeinen Geschäftsbedingungen gelten für die mobile App BattleFlow (die „Anwendung“), bereitgestellt von Baru Software Co („wir“, „unser“ oder „uns“) als kostenlos herunterladbarer Dienst mit optionalen kostenpflichtigen Abonnements.

Mit dem Herunterladen oder der Nutzung der Anwendung erklären Sie sich mit diesen Bedingungen einverstanden. Wenn Sie nicht einverstanden sind, nutzen Sie die Anwendung bitte nicht.

Alle Rechte, Titel und Ansprüche an der Anwendung (einschließlich Marken, Urheberrechten und sonstigem geistigem Eigentum) verbleiben bei Baru Software Co und ihren Lizenzgebern. Sie dürfen die Anwendung nicht kopieren, verändern, zurückentwickeln, dekompilieren, abgeleitete Werke davon erstellen oder anderweitig missbräuchlich verwenden, außer soweit dies gesetzlich zulässig ist.

Wir können Teile der Anwendung jederzeit aktualisieren, aussetzen oder einstellen, einschließlich Funktionen, Datenquellen und Abonnementangeboten. Wir können außerdem die Preise für kostenpflichtige Funktionen ändern, wobei alle Kosten vor dem Kauf deutlich ausgewiesen werden.

**Abonnements**

BattleFlow Pro ist ein automatisch verlängerndes Abonnement, das über den App-Store abgerechnet wird, in dem Sie es erworben haben (Apple App Store oder Google Play). Die Zahlung wird bei Bestätigung des Kaufs von Ihrem Konto abgebucht, und das Abonnement verlängert sich automatisch, sofern die automatische Verlängerung nicht mindestens 24 Stunden vor Ende des aktuellen Zeitraums deaktiviert wird. Sie können Ihr Abonnement jederzeit in den Kontoeinstellungen Ihres App Store- oder Google Play-Kontos verwalten oder kündigen.

**Abonnements sind an den Store gebunden, über den sie erworben wurden, und können nicht zwischen Stores übertragen werden.** Ein im Apple App Store erworbenes Abonnement kann nicht zu Google Play übertragen werden und umgekehrt. Um die Abrechnungsplattform zu wechseln, müssen Sie im ursprünglichen Store kündigen und im neuen Store erneut kaufen. Sofern eine Kontoanmeldung verfügbar ist, kann Ihr Pro-Zugang geräteübergreifend genutzt werden, auch wenn die Abrechnung weiterhin über den ursprünglichen Store erfolgt.

Rückerstattungen werden von Apple oder Google gemäß deren jeweiligen Richtlinien abgewickelt; wir sind nicht in der Lage, Store-Rückerstattungen direkt vorzunehmen.

Sie sind dafür verantwortlich, Ihr Gerät und Ihre Zugangsdaten sicher aufzubewahren. Wir empfehlen, Ihr Gerät nicht durch Jailbreak oder Rooting zu verändern, da dies die Sicherheit verringern und die Funktionalität der App beeinträchtigen kann.

Die Anwendung nutzt Dienste Dritter, die eigene Bedingungen haben:

*   [Google Play Services](https://policies.google.com/terms)
*   [Firebase Crashlytics](https://firebase.google.com/terms/crashlytics)
*   [Mixpanel](https://mixpanel.com/legal/terms-of-use/)
*   [RevenueCat](https://www.revenuecat.com/terms)

Einige Funktionen erfordern eine aktive Internetverbindung. Wir sind nicht für eingeschränkte Funktionalität verantwortlich, die durch Verbindungsprobleme, Einschränkungen des Mobilfunkanbieters, Ausfälle oder fehlendes Datenvolumen verursacht wird.

Bei der Nutzung der Anwendung können auch die Bedingungen Ihres Mobilfunkanbieters oder App-Stores gelten. Sie sind für etwaige Gebühren für die Datennutzung, Roaming-Gebühren oder Kaufkosten verantwortlich.

Soweit gesetzlich zulässig, wird die Anwendung „WIE BESEHEN“ und „WIE VERFÜGBAR“ ohne jegliche Gewährleistung bereitgestellt. Wir garantieren keine unterbrechungsfreie Verfügbarkeit, vollständige Genauigkeit oder Eignung für einen bestimmten Zweck.

Soweit gesetzlich zulässig, haftet Baru Software Co nicht für indirekte, zufällige, besondere, Folge- oder Strafschäden oder für den Verlust von Daten, Gewinnen oder Goodwill, die sich aus Ihrer Nutzung der Anwendung ergeben.

Ihre Nutzung der Anwendung unterliegt zudem unserer Datenschutzerklärung.

**Änderungen dieser Allgemeinen Geschäftsbedingungen**

Wir können diese Bedingungen von Zeit zu Zeit aktualisieren. Änderungen werden mit der Veröffentlichung auf dieser Seite wirksam.

Diese Allgemeinen Geschäftsbedingungen sind gültig ab dem 2026-06-24.

**Kontakt**

Bei Fragen zu diesen Bedingungen wenden Sie sich bitte an Baru Software Co:

*   Website: [https://baru.software/](https://baru.software/)
*   E-Mail: [hello@baru.software](mailto:hello@baru.software)`,
  it: `I presenti Termini e Condizioni si applicano all'app mobile BattleFlow (l'"Applicazione"), fornita da Baru Software Co ("noi", "nostro" o "ci") come servizio scaricabile gratuitamente con abbonamenti a pagamento facoltativi.

Scaricando o utilizzando l'Applicazione, accetti i presenti Termini. Se non li accetti, ti preghiamo di non utilizzare l'Applicazione.

Tutti i diritti, i titoli e gli interessi relativi all'Applicazione (inclusi marchi, diritti d'autore e altra proprietà intellettuale) rimangono di proprietà di Baru Software Co e dei suoi licenzianti. Non è consentito copiare, modificare, decodificare, decompilare, creare opere derivate o altrimenti utilizzare in modo improprio l'Applicazione, salvo quanto consentito dalla legge.

Possiamo aggiornare, sospendere o interrompere parti dell'Applicazione in qualsiasi momento, incluse funzionalità, fonti di dati e offerte di abbonamento. Possiamo inoltre modificare i prezzi delle funzionalità a pagamento, e qualsiasi addebito sarà presentato chiaramente prima dell'acquisto.

**Abbonamenti**

BattleFlow Pro è un abbonamento a rinnovo automatico fatturato tramite lo store da cui lo hai acquistato (Apple App Store o Google Play). Il pagamento viene addebitato sul tuo account al momento della conferma dell'acquisto, e l'abbonamento si rinnova automaticamente a meno che il rinnovo automatico non venga disattivato almeno 24 ore prima del termine del periodo in corso. Puoi gestire o annullare il tuo abbonamento in qualsiasi momento nelle impostazioni del tuo account App Store o Google Play.

**Gli abbonamenti sono vincolati allo store tramite il quale sono stati acquistati e non possono essere trasferiti tra store diversi.** Un abbonamento acquistato sull'Apple App Store non può essere trasferito su Google Play, o viceversa. Per cambiare piattaforma di fatturazione devi annullare l'abbonamento sullo store originale e acquistarlo nuovamente sul nuovo store. Dove è disponibile l'accesso tramite account, l'accesso a Pro può essere condiviso tra i tuoi dispositivi anche se la fatturazione rimane sullo store originale.

I rimborsi sono gestiti da Apple o Google in conformità alle rispettive politiche; non siamo in grado di emettere rimborsi degli store direttamente.

Sei responsabile della sicurezza del tuo dispositivo e delle tue credenziali di accesso. Ti consigliamo di non effettuare il jailbreak o il root del tuo dispositivo, poiché ciò potrebbe ridurre la sicurezza e compromettere il funzionamento dell'app.

L'Applicazione utilizza servizi di terze parti che hanno i propri termini:

*   [Google Play Services](https://policies.google.com/terms)
*   [Firebase Crashlytics](https://firebase.google.com/terms/crashlytics)
*   [Mixpanel](https://mixpanel.com/legal/terms-of-use/)
*   [RevenueCat](https://www.revenuecat.com/terms)

Alcune funzionalità richiedono una connessione internet attiva. Non siamo responsabili per le funzionalità limitate causate da problemi di connettività, restrizioni dell'operatore, interruzioni del servizio o mancanza di traffico dati disponibile.

Quando utilizzi l'Applicazione, possono applicarsi anche i termini del tuo operatore mobile o dell'app store. Sei responsabile per eventuali costi di utilizzo dei dati, costi di roaming o addebiti per gli acquisti.

Nella misura massima consentita dalla legge, l'Applicazione è fornita "COSÌ COM'È" e "COME DISPONIBILE" senza garanzie di alcun tipo. Non garantiamo disponibilità ininterrotta, accuratezza completa o idoneità per uno scopo particolare.

Nella misura massima consentita dalla legge, Baru Software Co non è responsabile per danni indiretti, incidentali, speciali, consequenziali o punitivi, né per qualsiasi perdita di dati, profitti o avviamento derivante dal tuo utilizzo dell'Applicazione.

Il tuo utilizzo dell'Applicazione è disciplinato anche dalla nostra Informativa sulla Privacy.

**Modifiche ai presenti Termini e Condizioni**

Possiamo aggiornare i presenti Termini di tanto in tanto. Gli aggiornamenti hanno effetto dal momento della loro pubblicazione su questa pagina.

I presenti termini e condizioni sono in vigore a partire dal 2026-06-24.

**Contattaci**

Se hai domande sui presenti Termini, contatta Baru Software Co:

*   Sito web: [https://baru.software/](https://baru.software/)
*   Email: [hello@baru.software](mailto:hello@baru.software)`,
  pt: `Estes Termos e Condições aplicam-se ao aplicativo móvel BattleFlow (o "Aplicativo"), fornecido pela Baru Software Co ("nós", "nosso" ou "nos") como um serviço gratuito para download com assinaturas pagas opcionais.

Ao baixar ou utilizar o Aplicativo, você concorda com estes Termos. Se você não concordar, por favor, não utilize o Aplicativo.

Todos os direitos, títulos e interesses sobre o Aplicativo (incluindo marcas registradas, direitos autorais e outras propriedades intelectuais) permanecem com a Baru Software Co e seus licenciadores. Você não pode copiar, modificar, fazer engenharia reversa, descompilar, criar obras derivadas ou utilizar indevidamente o Aplicativo de qualquer outra forma, exceto conforme permitido por lei.

Podemos atualizar, suspender ou descontinuar partes do Aplicativo a qualquer momento, incluindo recursos, fontes de dados e ofertas de assinatura. Também podemos alterar os preços dos recursos pagos, e quaisquer cobranças serão apresentadas claramente antes da compra.

**Assinaturas**

O BattleFlow Pro é uma assinatura com renovação automática cobrada por meio da loja de aplicativos na qual você a adquiriu (Apple App Store ou Google Play). O pagamento é cobrado da sua conta no momento da confirmação da compra, e a assinatura é renovada automaticamente, a menos que a renovação automática seja desativada com pelo menos 24 horas de antecedência em relação ao fim do período atual. Você pode gerenciar ou cancelar sua assinatura a qualquer momento nas configurações da sua conta da App Store ou do Google Play.

**As assinaturas estão vinculadas à loja na qual foram adquiridas e não podem ser transferidas entre lojas.** Uma assinatura comprada na Apple App Store não pode ser transferida para o Google Play, ou vice-versa. Para mudar de plataforma de cobrança, você deve cancelar na loja original e comprar novamente na nova. Onde houver login de conta disponível, seu acesso Pro poderá ser compartilhado entre seus dispositivos, mesmo que a cobrança permaneça na loja original.

Os reembolsos são processados pela Apple ou pelo Google de acordo com suas respectivas políticas; não temos como emitir reembolsos das lojas diretamente.

Você é responsável por manter seu dispositivo e suas credenciais de acesso seguros. Recomendamos não fazer jailbreak ou root no seu dispositivo, pois isso pode reduzir a segurança e afetar a funcionalidade do aplicativo.

O Aplicativo utiliza serviços de terceiros que possuem seus próprios termos:

*   [Google Play Services](https://policies.google.com/terms)
*   [Firebase Crashlytics](https://firebase.google.com/terms/crashlytics)
*   [Mixpanel](https://mixpanel.com/legal/terms-of-use/)
*   [RevenueCat](https://www.revenuecat.com/terms)

Alguns recursos exigem uma conexão ativa com a internet. Não somos responsáveis por funcionalidade limitada causada por problemas de conectividade, restrições da operadora, interrupções ou falta de franquia de dados.

Ao utilizar o Aplicativo, os termos da sua operadora de telefonia móvel ou da loja de aplicativos também podem ser aplicáveis. Você é responsável por quaisquer taxas de uso de dados, taxas de roaming ou cobranças de compra.

Na máxima extensão permitida por lei, o Aplicativo é fornecido "NO ESTADO EM QUE SE ENCONTRA" e "CONFORME DISPONÍVEL", sem garantias de qualquer tipo. Não garantimos disponibilidade ininterrupta, precisão completa ou adequação a um propósito específico.

Na máxima extensão permitida por lei, a Baru Software Co não se responsabiliza por danos indiretos, incidentais, especiais, consequenciais ou punitivos, nem por qualquer perda de dados, lucros ou reputação decorrente do seu uso do Aplicativo.

O seu uso do Aplicativo também é regido pela nossa Política de Privacidade.

**Alterações a Estes Termos e Condições**

Podemos atualizar estes Termos de tempos em tempos. As atualizações entram em vigor quando publicadas nesta página.

Estes termos e condições entram em vigor a partir de 2026-06-24.

**Fale Conosco**

Se você tiver dúvidas sobre estes Termos, entre em contato com a Baru Software Co:

*   Site: [https://baru.software/](https://baru.software/)
*   E-mail: [hello@baru.software](mailto:hello@baru.software)`,
  'zh-hant': `本條款與條件適用於由 Baru Software Co（以下簡稱「我們」）提供的 BattleFlow 行動應用程式（以下簡稱「應用程式」），該應用程式為免費下載服務，並提供選用的付費訂閱。

下載或使用本應用程式即表示您同意本條款。若您不同意，請勿使用本應用程式。

本應用程式的所有權利、所有權及利益（包括商標、著作權及其他智慧財產權）均歸 Baru Software Co 及其授權人所有。除法律允許者外，您不得複製、修改、進行反向工程、反編譯、製作衍生作品或以其他方式不當使用本應用程式。

我們可能隨時更新、暫停或終止本應用程式的部分內容，包括功能、資料來源及訂閱方案。我們亦可能變更付費功能的定價，且任何費用均會在購買前清楚呈現。

**訂閱**

BattleFlow Pro 為自動續訂的訂閱服務，透過您購買所在的應用程式商店（Apple App Store 或 Google Play）計費。款項將於確認購買時向您的帳戶收取，且除非在當期結束前至少 24 小時關閉自動續訂，否則訂閱將自動續訂。您可隨時在您的 App Store 或 Google Play 帳戶設定中管理或取消訂閱。

**訂閱與其購買所在的商店綁定，無法在不同商店之間轉移。** 在 Apple App Store 購買的訂閱無法移轉至 Google Play，反之亦然。若要變更計費平台，您必須先在原商店取消，再於新商店重新購買。在提供帳戶登入功能的情況下，即使計費仍由原商店處理，您的 Pro 存取權限仍可在您的各裝置間共用。

退款由 Apple 或 Google 依其各自的政策處理；我們無法直接核發商店退款。

您有責任妥善保管您的裝置及存取憑證。我們建議您勿對裝置進行越獄（jailbreak）或 root，因為這麼做可能降低安全性並影響應用程式功能。

本應用程式使用具有其自身條款的第三方服務：

*   [Google Play Services](https://policies.google.com/terms)
*   [Firebase Crashlytics](https://firebase.google.com/terms/crashlytics)
*   [Mixpanel](https://mixpanel.com/legal/terms-of-use/)
*   [RevenueCat](https://www.revenuecat.com/terms)

部分功能需要有效的網際網路連線。對於因連線問題、電信業者限制、服務中斷或數據用量不足所造成的功能受限，我們概不負責。

使用本應用程式時，您的行動電信業者或應用程式商店條款亦可能適用。您須自行承擔任何數據用量費用、漫遊費用或購買費用。

在法律允許的最大範圍內，本應用程式係按「現狀」及「現有」基礎提供，不附帶任何形式的保證。我們不保證服務不中斷、完全準確或適合特定用途。

在法律允許的最大範圍內，對於因您使用本應用程式而產生的間接、附帶、特殊、衍生或懲罰性損害，或任何資料、利潤或商譽的損失，Baru Software Co 概不負責。

您對本應用程式的使用亦受我們的隱私政策規範。

**本條款與條件之變更**

我們可能不時更新本條款。更新自在本頁面發佈之日起生效。

本條款與條件自 2026-06-24 起生效。

**聯絡我們**

若您對本條款有任何疑問，請聯絡 Baru Software Co：

*   網站：[https://baru.software/](https://baru.software/)
*   電子郵件：[hello@baru.software](mailto:hello@baru.software)`,
  ja: `これらの利用規約は、Baru Software Co（以下「当社」）が無料ダウンロード可能なサービス（任意の有料サブスクリプションを含む）として提供するBattleFlowモバイルアプリ（以下「本アプリ」）に適用されます。

本アプリをダウンロードまたは使用することにより、お客様は本規約に同意したものとみなされます。本規約に同意されない場合は、本アプリを使用しないでください。

本アプリに関するすべての権利、権原、および利益（商標、著作権、その他の知的財産権を含む）は、Baru Software Coおよびそのライセンサーに帰属します。お客様は、法律で認められる場合を除き、本アプリの複製、改変、リバースエンジニアリング、逆コンパイル、二次的著作物の作成、その他の不正利用を行うことはできません。

当社は、機能、データソース、サブスクリプションの提供内容を含め、本アプリの一部をいつでも更新、停止、または終了することがあります。また、当社は有料機能の価格を変更することがあり、いかなる料金も購入前に明確に提示されます。

**サブスクリプション**

BattleFlow Proは、お客様が購入したアプリストア（Apple App StoreまたはGoogle Play）を通じて請求される自動更新サブスクリプションです。お支払いは購入確定時にお客様のアカウントに請求され、現在の期間が終了する少なくとも24時間前に自動更新をオフにしない限り、サブスクリプションは自動的に更新されます。お客様は、App StoreまたはGoogle Playのアカウント設定からいつでもサブスクリプションを管理または解約できます。

**サブスクリプションは購入したストアに紐づいており、ストア間で移行することはできません。** Apple App Storeで購入したサブスクリプションをGoogle Playに移すこと、またはその逆を行うことはできません。請求プラットフォームを変更するには、元のストアで解約し、新しいストアで再度購入する必要があります。アカウントへのサインインが利用可能な場合、請求が元のストアに残っていても、お客様のPro機能へのアクセスは複数の端末間で共有されることがあります。

返金は、AppleまたはGoogleがそれぞれのポリシーに従って処理します。当社が直接ストアでの返金を行うことはできません。

お客様は、ご自身の端末およびアクセス認証情報を安全に保つ責任を負います。端末の脱獄（ジェイルブレイク）またはルート化は、セキュリティを低下させ、アプリの機能に影響を及ぼす可能性があるため、行わないことをお勧めします。

本アプリは、独自の規約を持つ第三者サービスを利用しています。

*   [Google Play Services](https://policies.google.com/terms)
*   [Firebase Crashlytics](https://firebase.google.com/terms/crashlytics)
*   [Mixpanel](https://mixpanel.com/legal/terms-of-use/)
*   [RevenueCat](https://www.revenuecat.com/terms)

一部の機能には、有効なインターネット接続が必要です。当社は、接続の問題、通信事業者の制限、障害、またはデータ容量の不足に起因する機能の制限について責任を負いません。

本アプリの使用にあたっては、お客様の携帯通信事業者またはアプリストアの規約も適用される場合があります。お客様は、データ通信料、ローミング料金、または購入料金について責任を負います。

法律で認められる最大限の範囲において、本アプリは、いかなる種類の保証もなく「現状有姿」かつ「提供可能な範囲」で提供されます。当社は、中断のない利用可能性、完全な正確性、または特定の目的への適合性を保証しません。

法律で認められる最大限の範囲において、Baru Software Coは、お客様の本アプリの使用に起因する間接的、付随的、特別、結果的、または懲罰的損害、あるいはデータ、利益、または信用の損失について責任を負いません。

お客様による本アプリの使用は、当社のプライバシーポリシーにも準拠します。

**本利用規約の変更**

当社は、本規約を随時更新することがあります。更新は本ページに掲載された時点で有効となります。

本利用規約の発効日: 2026-06-24

**お問い合わせ**

本規約に関するご質問がある場合は、Baru Software Co までお問い合わせください。

*   ウェブサイト: [https://baru.software/](https://baru.software/)
*   メール: [hello@baru.software](mailto:hello@baru.software)`,
  ko: `본 이용약관은 Baru Software Co(이하 "당사")가 선택적 유료 구독이 포함된 무료 다운로드 서비스로 제공하는 BattleFlow 모바일 앱(이하 "애플리케이션")에 적용됩니다.

애플리케이션을 다운로드하거나 이용함으로써 귀하는 본 약관에 동의하게 됩니다. 동의하지 않으시는 경우 애플리케이션을 이용하지 마십시오.

애플리케이션에 대한 모든 권리, 소유권 및 이권(상표권, 저작권 및 기타 지적 재산권 포함)은 Baru Software Co 및 그 라이선스 제공자에게 귀속됩니다. 귀하는 법률이 허용하는 범위를 제외하고 애플리케이션을 복제, 수정, 역설계, 디컴파일, 2차적 저작물 제작하거나 기타 방식으로 부정 이용할 수 없습니다.

당사는 기능, 데이터 출처 및 구독 상품을 포함하여 애플리케이션의 일부를 언제든지 업데이트, 중단 또는 종료할 수 있습니다. 또한 당사는 유료 기능의 가격을 변경할 수 있으며, 모든 요금은 구매 전에 명확하게 안내됩니다.

**구독**

BattleFlow Pro는 구매하신 앱 스토어(Apple App Store 또는 Google Play)를 통해 청구되는 자동 갱신 구독입니다. 구매 확정 시점에 귀하의 계정으로 결제가 청구되며, 현재 기간 종료 최소 24시간 전에 자동 갱신을 해제하지 않는 한 구독은 자동으로 갱신됩니다. 귀하는 App Store 또는 Google Play 계정 설정에서 언제든지 구독을 관리하거나 취소할 수 있습니다.

**구독은 구매한 스토어에 연결되며 스토어 간 이전이 불가능합니다.** Apple App Store에서 구매한 구독은 Google Play로 이전할 수 없으며, 그 반대의 경우도 마찬가지입니다. 결제 플랫폼을 변경하려면 기존 스토어에서 구독을 취소하고 새로운 스토어에서 다시 구매하셔야 합니다. 계정 로그인이 가능한 경우, 결제는 원래 스토어에서 유지되더라도 귀하의 Pro 이용 권한은 여러 기기에서 공유될 수 있습니다.

환불은 Apple 또는 Google이 각자의 정책에 따라 처리하며, 당사는 스토어 환불을 직접 진행할 수 없습니다.

귀하는 기기 및 접근 자격 증명을 안전하게 유지할 책임이 있습니다. 기기를 탈옥(jailbreak)하거나 루팅(root)하는 행위는 보안을 약화시키고 앱 기능에 영향을 줄 수 있으므로 권장하지 않습니다.

애플리케이션은 자체 약관을 보유한 제3자 서비스를 사용합니다.

*   [Google Play Services](https://policies.google.com/terms)
*   [Firebase Crashlytics](https://firebase.google.com/terms/crashlytics)
*   [Mixpanel](https://mixpanel.com/legal/terms-of-use/)
*   [RevenueCat](https://www.revenuecat.com/terms)

일부 기능은 활성화된 인터넷 연결을 필요로 합니다. 당사는 연결 문제, 통신사 제한, 서비스 장애 또는 데이터 사용량 부족으로 인해 발생하는 기능 제한에 대해 책임지지 않습니다.

애플리케이션을 이용할 때 귀하의 모바일 통신사 또는 앱 스토어 약관이 함께 적용될 수 있습니다. 귀하는 모든 데이터 사용 요금, 로밍 요금 또는 구매 요금에 대해 책임이 있습니다.

법률이 허용하는 최대 범위 내에서, 애플리케이션은 어떠한 종류의 보증도 없이 "있는 그대로(AS IS)" 및 "이용 가능한 상태(AS AVAILABLE)"로 제공됩니다. 당사는 중단 없는 이용 가능성, 완전한 정확성 또는 특정 목적에의 적합성을 보장하지 않습니다.

법률이 허용하는 최대 범위 내에서, Baru Software Co는 귀하의 애플리케이션 이용으로 인해 발생하는 간접적, 부수적, 특별, 결과적 또는 징벌적 손해, 또는 데이터, 수익, 영업권의 손실에 대해 책임지지 않습니다.

귀하의 애플리케이션 이용에는 당사의 개인정보 처리방침도 함께 적용됩니다.

**본 이용약관의 변경**

당사는 본 약관을 수시로 업데이트할 수 있습니다. 변경 사항은 본 페이지에 게시되는 시점부터 효력이 발생합니다.

본 이용약관 시행일: 2026-06-24

**문의처**

본 약관과 관련하여 궁금한 점이 있으시면 Baru Software Co로 문의해 주십시오.

*   웹사이트: [https://baru.software/](https://baru.software/)
*   이메일: [hello@baru.software](mailto:hello@baru.software)`
};

// Changelog shown inside the app via a webview at /whats-new/ (and /[lang]/whats-new/).
// One Markdown string per locale. List newest versions first; each version is an `## x.y.z`
// heading followed by an italic date and **New** / **Improved** / **Fixed** sections.
// Empty for now — when a locale has no entries the page renders a localized empty state
// (the `whatsnew.empty` UI string). Example of an entry to add at the TOP of a locale string:
//
//   ## 2.4.0
//   *June 2026*
//
//   **New**
//
//   - Movedex — browse every fast and charged move with full stats and effects.
export const whatsNewData: Record<string, string> = {
  en: `## v4.2.2

**Import a whole gallery selection.** Pick several appraisal screenshots at once and BattleFlow scans the batch, then collects anything it couldn't read on a single review page — a form to pick, a CP to confirm, an IV spread to choose. Answer the question and it saves, with the screenshot beside it so you can read the answer off the picture.

**Three scanner fixes.** Shadow Pokémon are recognised from the sprite's background instead of a line the IV appraisal covers. A clipped type row is now enough to identify a regional form. And picking a form settles it, rather than leaving the Pokémon marked for review.

**Cramorant.** Gulp Missile is fully simulated, with sprites for both forms.

**A draw is its own result.** Battle Notes records draws as a third outcome instead of folding them into losses.

**Matchups in words.** The matchup grid reads as bands rather than the engine's internal 0–1000 number.

**Cleanup leads with the search.** The Pokémon GO search string you came for is the first thing on the page, and cups are named the way the game names them.

## v4.2

**Scanning that doesn't give up.** BattleFlow now reads Pokémon whose CP is covered by their own sprite — the wings, tails and necks that used to make a scan fail — and when the evidence allows two possible CPs it offers you both instead of giving up. It also scans correctly when a Pokémon isn't at full HP, reads regional forms from clipped type labels, and handles Japanese, Korean and Chinese appraisals properly.

**Meta Analysis, rebuilt as a coach.** One question at a time: your season record, then the teams you played it with, then what to do about the one you pick. Drill your lead matchups lists the openings you actually get with who on your line handles each, and takes them straight into flashcards. Explore leads ranks other leads to build around against the field you personally face — how many of your logged battles each one takes over, filtered by what you could field from your Collection today — then builds a team around your pick in one tap.

**Learn.** A new home for getting better, with PvP Glossary, PvP Mechanics and Type Effectiveness decks in the game's own words. New in this release, Can You Tank It? drills the call you make most: your Pokémon at a given HP, their charged move about to land — do you survive it unshielded?

**Collection Cleanup, redesigned.** Built around searches, with nine transfer-protection categories and keywords that follow Pokémon GO's language rather than the app's. Purified is now a first-class classification, a copy can declare which build it is for, and power-up costs are a full column table.

**Plus.** Compare IV spreads side by side, including the best build at level 40 against level 50. Build as many custom flashcard decks as you want. Set any Pokémon to its shiny form and see it across the app. Cup names now come from the game itself in every language, and Latin American Spanish is its own locale.

## v4.1.5

**Team Builder from your Collection.** Build teams around the Pokémon you actually own, with meta-aware lead recommendations.

**Matchup Lines.** A new view in the Battle Simulator shows the branching ways a matchup can play out, with a clearer legend and single-button coaching.

**Pokebox Cleanup.** A free tool that ranks your copies by IV and league fit, species by species, and flags the rest for transfer — with toggleable protections for shiny, favorite, lucky, costume, and legacy-move Pokémon.

**Battle log upgrades.** Per-set rating tracking, exact rating entry, and role-labeled opponents in your recent battles.

**Manual data backup.** Export all your BattleFlow data to a file and restore it — handy when moving to a new device.

**Plus.** Power-up cost estimates and recommended movesets on your Collection, an in-app annual upgrade from Settings, a new Collection filter/sort/layout toolkit, this What's New page, more reliable scanning, and a fix for a crash that could occur when opening the Battle tab.

## v4.0

**Pokémon Collection.** Keep your Pokémon in BattleFlow. Browse them in grid, list, or by species, with filtering, sorting, and a best-league suggestion for each one.

**IV Scanner.** Scan a screenshot and BattleFlow reads the species, CP, and IVs for you — no manual typing. Scan many screenshots together in one batch.

**Auto Scan.** Stream your screen and BattleFlow scans automatically as you appraise — no tapping needed.

**Nickname rename.** Generate a competitive nickname — best league, IVs, and rank — from a scan and copy it straight to your clipboard.

**Flashcard streaks.** A new daily drill keeps a streak going so your matchup practice stays sharp, with matchup decks built in.

**Plus.** The Collection and scanner are fully localized, an owned-only filter across rankings, and many UI, performance, and stability improvements.

## v3.5

**Meta Profiles.** Build your own threat lists — even from your battle logs — so team scores reflect the metas you actually face.

**MoveDex & Move Flashcards.** Browse every fast and charged move in one place, then drill the counts and movesets with the new trainer flashcard.

**GBL Season Calendar.** See the current and upcoming cups and leagues right from the More menu.

**Alternative Movesets.** BattleFlow's own moveset picks now appear alongside the rankings.

**Plus.** Automatic data updates keep cups and rankings fresh and re-rate your saved teams, a refreshed look across the app, and dark-mode and offline fixes.

## v3.2

**Moveset Explorer.** Compare all move combinations for a Pokémon and find the optimal setup.

**Matchup Map (Beta).** An experimental new way to explore Cup rankings.

**Data Export.** Export your Battle Logs and Saved Teams directly to CSV, making it easier to track your progress and analyze your performance outside the app.

## v3.1

**Build Around Mode.** Start team generation from any Pokémon. Pick your favorite from Rankings or your Pokebox, and BattleFlow builds optimized teams around it — finding the best leads, safe swaps, and closers to complement your anchor.

**Shiny Sprites (Pro).** See your shiny Pokémon throughout the app — in rankings, teams, Pokebox, IV checker, and generated teams. Toggle shinies per species with a sparkle animation.`,
  es: `## v4.2.2

**Importa una selección entera de la galería.** Elige varias capturas de pantalla de evaluación a la vez y BattleFlow escanea el lote; todo lo que no pudo leer queda en una única página de revisión: una forma que elegir, un PC que confirmar, una distribución de IVs que seleccionar. Responde y se guarda, con la captura al lado para que puedas leer la respuesta en la imagen.

**Tres correcciones del escáner.** Los Pokémon Oscuros se detectan por el fondo del sprite y no por una línea que la evaluación de IVs tapa. Una fila de tipos recortada ya basta para identificar una forma regional. Y elegir una forma la deja resuelta, en vez de dejar al Pokémon marcado para revisar.

**Cramorant.** Tragamisil está totalmente simulado, con sprites para ambas formas.

**El empate es un resultado propio.** Las Notas de Batalla registran los empates como un tercer resultado en lugar de contarlos como derrota.

**Enfrentamientos en palabras.** La cuadrícula de enfrentamientos se lee por categorías en vez del número interno 0–1000 del motor.

**La limpieza empieza por la búsqueda.** El texto de búsqueda de Pokémon GO que venías a buscar es lo primero de la página, y las copas llevan el nombre que les da el juego.

## v4.2

**Escaneo que no se rinde.** BattleFlow ahora lee Pokémon cuyos PC están tapados por su propio sprite —las alas, colas y cuellos que solían causar errores de escaneo— y, cuando la evidencia sugiere dos posibles PC, te ofrece ambos en lugar de darse por vencido. También escanea correctamente cuando un Pokémon no está al máximo de PS, lee las formas regionales a partir de etiquetas de tipo recortadas y procesa las valoraciones en japonés, coreano y chino.

**Análisis del meta, reconstruido como entrenador.** Una pregunta a la vez: tu récord de la temporada, luego los equipos con los que jugaste y, por último, qué hacer con el que elijas. Practica tus enfrentamientos de Inicial enumera las aperturas que de verdad te tocan y quién de tu línea resuelve cada una, y las lleva directo a las tarjetas de estudio. Explora Iniciales clasifica otros Iniciales para armar un equipo alrededor, medidos contra el campo que tú enfrentas —cuántas de tus batallas registradas cubre cada uno, con filtro por lo que podrías usar hoy desde tu Colección— y arma el equipo con un toque.

**Aprendizaje.** Un nuevo espacio para mejorar, con barajas de Glosario PvP, Mecánicas PvP y Efectividad de tipos en las propias palabras del juego. Como novedad en esta versión, ¿Puedes aguantarlo? entrena la decisión más frecuente: tu Pokémon con ciertos PS, su ataque cargado a punto de impactar… ¿sobrevives sin usar escudo?

**Limpieza de la Colección, rediseñada.** Ahora gira en torno a búsquedas, con nueve categorías de protección de transferencia y palabras clave que siguen el lenguaje de Pokémon GO en lugar del de la aplicación. Los Pokémon purificados son una clasificación principal, cada copia puede declarar para qué formato está destinada y los costos de poder son una tabla de columnas completa.

**Además.** Compara combinaciones de IV lado a lado, incluyendo la mejor configuración a nivel 40 contra nivel 50. Crea tantas barajas de tarjetas personalizadas como quieras. Configura cualquier Pokémon en su forma variocolor y visualízala en toda la app. Los nombres de las copas ahora provienen del propio juego en todos los idiomas, y el español de Latinoamérica cuenta con su propia localización.

## v4.1.5

**Constructor de Equipos desde tu Colección.** Arma equipos con los Pokémon que realmente tienes, con recomendaciones de líder basadas en el meta.

**Líneas de Enfrentamiento.** Una nueva vista en el Simulador de Batallas muestra cómo puede cambiar un enfrentamiento, con una leyenda más clara y consejos con un solo botón.

**Limpieza de Pokebox.** Una herramienta gratuita que clasifica tus copias por IV y aptitud de liga, especie por especie, y marca el resto para transferir — con protecciones activables para Pokémon shiny, favoritos, con suerte, con disfraz y con movimiento legado.

**Mejoras al registro de batallas.** Seguimiento de calificación por set, ingreso exacto de calificación y oponentes con rol identificado en tus batallas recientes.

**Respaldo manual de datos.** Exporta todos tus datos de BattleFlow a un archivo y restáuralos — útil al cambiar de dispositivo.

**Además.** Estimaciones de costo de mejora y movimientos recomendados en tu Colección, una actualización al plan anual desde Configuración, un nuevo conjunto de filtro/orden/diseño para la Colección, esta página de Novedades, escaneo más confiable y una corrección para un fallo que podía cerrar la pestaña de Batalla inesperadamente.

## v4.0

**Colección de Pokémon.** Guarda tus Pokémon en BattleFlow. Explóralos en cuadrícula, lista o por especie, con filtros, ordenación y una sugerencia de mejor liga para cada uno.

**Escáner de IVs.** Haz una captura y BattleFlow lee la especie, el PC y los IVs por ti, sin escribir nada a mano. Escanea varias capturas juntas en un solo lote.

**Escaneo automático.** Transmite tu pantalla y BattleFlow escanea automáticamente mientras evalúas, sin tocar nada.

**Renombrar apodos.** Genera un apodo competitivo — mejor liga, IVs y ranking — a partir de un escaneo y cópialo directamente al portapapeles.

**Rachas de tarjetas.** Un nuevo reto diario mantiene tu racha para que tu práctica de enfrentamientos siga afilada, con mazos de enfrentamientos incluidos.

**Además.** La Colección y el escáner están totalmente traducidos, un filtro de solo lo que tienes en los rankings y muchas mejoras de interfaz, rendimiento y estabilidad.

## v3.5

**Perfiles de Meta.** Crea tus propias listas de amenazas — incluso desde tus registros de batalla — para que las puntuaciones de equipo reflejen las metas que realmente enfrentas.

**MoveDex y tarjetas de movimientos.** Explora todos los movimientos rápidos y cargados en un solo lugar y practica los conteos y los conjuntos de movimientos con el nuevo entrenador de tarjetas.

**Calendario de temporada GBL.** Consulta las copas y ligas actuales y próximas directamente desde el menú Más.

**Movimientos alternativos.** Las recomendaciones de movimientos propias de BattleFlow ahora aparecen junto a los rankings.

**Además.** Las actualizaciones automáticas de datos mantienen las copas y los rankings al día y vuelven a evaluar tus equipos guardados, además de un diseño renovado en toda la app y correcciones de modo oscuro y sin conexión.

## v3.2

**Explorador de Movimientos.** Compara todas las combinaciones de movimientos de un Pokémon y encuentra la configuración óptima.

**Mapa de Duelos (Beta).** Una nueva forma experimental de explorar los rankings de las Copas.

**Exportación de Datos.** Exporta tus Registros de Batalla y Equipos Guardados directamente a CSV, lo que facilita el seguimiento de tu progreso y el análisis de tu rendimiento fuera de la aplicación.

## v3.1

**Modo Construir Alrededor.** Genera equipos a partir de cualquier Pokémon. Elige tu favorito de los Rankings o tu Pokebox, y BattleFlow construye equipos optimizados a su alrededor — encontrando los mejores leads, safe swaps y closers.

**Sprites Shiny (Pro).** Ve tus Pokémon shiny en toda la app — rankings, equipos, Pokebox, verificador de IVs y equipos generados. Activa shinies por especie con animación de brillo.`,
  fr: `## v4.2.2

**Importez toute une sélection de la galerie.** Choisissez plusieurs captures d'écran d'évaluation à la fois : BattleFlow scanne le lot, puis rassemble sur une seule page tout ce qu'il n'a pas pu lire — une forme à choisir, des PC à confirmer, une répartition d'IV à sélectionner. Répondez et c'est enregistré, avec la capture à côté pour lire la réponse sur l'image.

**Trois correctifs du scan.** Les Pokémon Obscurs sont reconnus à l'arrière-plan du sprite plutôt qu'à une ligne que l'évaluation des IV recouvre. Une ligne de types tronquée suffit désormais à identifier une forme régionale. Et choisir une forme la valide, au lieu de laisser le Pokémon marqué à vérifier.

**Nigosier.** Dégobage est entièrement simulé, avec les sprites des deux formes.

**L'égalité est un résultat à part entière.** Les Notes de combat enregistrent les égalités comme un troisième résultat au lieu de les compter comme des défaites.

**Des matchups en mots.** La grille des matchups se lit en catégories plutôt qu'avec le nombre interne 0–1000 du moteur.

**Le nettoyage commence par la recherche.** Le texte de recherche Pokémon GO que vous venez chercher est en tête de page, et les coupes portent le nom que le jeu leur donne.

## v4.2

**Un scan qui n'abandonne plus.** BattleFlow lit désormais les Pokémon dont les PC sont masqués par leur propre sprite — les ailes, queues et cous qui provoquaient auparavant des échecs de scan — et, lorsque les indices suggèrent deux PC possibles, vous propose les deux au lieu d'abandonner. Il scanne aussi correctement lorsqu'un Pokémon n'est pas au maximum de ses PV, lit les formes régionales à partir d'étiquettes de type tronquées et traite les évaluations en japonais, coréen et chinois.

**L'Analyse du méta, reconstruite en coach.** Une question à la fois : votre historique de la saison, puis les compositions avec lesquelles vous avez joué, et enfin quoi faire de l'équipe choisie. Entraîne-toi sur tes matchups de lead liste les ouvertures que vous obtenez réellement et qui, dans votre équipe, gère chacune d'elles, puis les transforme directement en cartes d'entraînement. Explorer les leads classe d'autres leads autour desquels construire, face au terrain que vous affrontez vraiment — combien de vos combats enregistrés chacun reprend à son compte, filtré par ce que vous pourriez aligner dès aujourd'hui depuis votre Collection — et construit une équipe autour de votre choix en un geste.

**Apprentissage.** Un nouvel espace pour progresser, avec des decks Glossaire PvP, Mécaniques PvP et Efficacité des types, dans les propres termes du jeu. Nouveauté de cette version, Pouvez-vous encaisser ? entraîne la décision la plus fréquente : votre Pokémon avec un certain nombre de PV, l'attaque chargée adverse sur le point d'impacter — survivez-vous sans bouclier ?

**Le Nettoyage de la Collection, repensé.** Il s'organise autour des recherches, avec neuf catégories de protection contre le transfert et des mots-clés qui suivent la terminologie de Pokémon GO plutôt que celle de l'application. Les Pokémon Purifiés sont désormais une classification principale, un exemplaire peut déclarer le format auquel il est destiné, et les coûts d'amélioration s'affichent sous forme de tableau complet.

**En plus.** Comparez les répartitions d'IV côte à côte, y compris la meilleure configuration au niveau 40 contre le niveau 50. Créez autant de decks de flashcards personnalisés que vous le souhaitez. Affichez n'importe quel Pokémon dans sa forme chromatique à travers toute l'application. Les noms des coupes proviennent désormais du jeu lui-même dans toutes les langues, et l'espagnol d'Amérique latine dispose de sa propre localisation.

## v4.1.5

**Générateur d'équipe depuis votre Collection.** Composez vos équipes à partir des Pokémon que vous possédez réellement, avec des recommandations de leaders adaptées à la méta.

**Lignes de Confrontation.** Une nouvelle vue dans le Simulateur de Combat montre comment un affrontement peut évoluer différemment, avec une légende plus claire et des conseils en un clic.

**Nettoyage du Pokebox.** Un outil gratuit qui classe vos exemplaires par IV et adéquation à la ligue, espèce par espèce, et signale le reste à transférer — avec des protections activables pour vos Pokémon chromatiques, favoris, chanceux, en costume et à capacité historique.

**Améliorations du journal de combat.** Suivi des notes par set, saisie manuelle de note précise, et adversaires avec rôle indiqué dans vos combats récents.

**Sauvegarde manuelle des données.** Exportez toutes vos données BattleFlow dans un fichier et restaurez-les — pratique lors d'un changement d'appareil.

**En plus.** Estimations du coût d'amélioration et mouvements recommandés sur votre Collection, un passage à l'abonnement annuel depuis les Réglages, un nouvel ensemble filtre/tri/disposition pour la Collection, cette page Nouveautés, un scan plus fiable, et une correction pour un plantage qui pouvait survenir à l'ouverture de l'onglet Combat.

## v4.0

**Collection de Pokémon.** Conservez vos Pokémon dans BattleFlow. Parcourez-les en grille, en liste ou par espèce, avec filtres, tri et une suggestion de meilleure ligue pour chacun.

**Scanner d'IV.** Prenez une capture et BattleFlow lit l'espèce, le PC et les IV pour vous, sans rien saisir. Scannez plusieurs captures d'un seul coup.

**Scan auto.** Diffusez votre écran et BattleFlow scanne automatiquement pendant que vous évaluez, sans rien toucher.

**Renommer les surnoms.** Générez un surnom compétitif — meilleure ligue, IV et classement — à partir d'un scan et copiez-le directement dans le presse-papiers.

**Séries de cartes.** Un nouvel exercice quotidien entretient une série pour garder votre pratique des affrontements affûtée, avec des paquets d'affrontements intégrés.

**En plus.** La Collection et le scanner sont entièrement traduits, un filtre « possédés uniquement » dans les classements, et de nombreuses améliorations d'interface, de performance et de stabilité.

## v3.5

**Profils de Méta.** Créez vos propres listes de menaces — même à partir de vos journaux de combat — pour que les notes d'équipe reflètent les métas que vous affrontez vraiment.

**MoveDex et cartes d'attaques.** Parcourez toutes les attaques rapides et chargées au même endroit, puis révisez les comptes et les ensembles d'attaques avec le nouvel entraîneur de cartes.

**Calendrier de saison GBL.** Consultez les coupes et ligues actuelles et à venir directement depuis le menu Plus.

**Attaques alternatives.** Les recommandations d'attaques de BattleFlow apparaissent désormais à côté des classements.

**En plus.** Les mises à jour automatiques des données gardent les coupes et classements à jour et réévaluent vos équipes enregistrées, avec un design rafraîchi dans toute l'application et des corrections en mode sombre et hors ligne.

## v3.2

**Explorateur d'Attaques.** Comparez toutes les combinaisons d'attaques pour un Pokémon et trouvez la configuration optimale.

**Carte des Matchups (Bêta).** Une nouvelle façon expérimentale d'explorer les classements des Coupes.

**Exportation de Données.** Exportez vos Journaux de Combat et vos Équipes Sauvegardées directement en CSV, ce qui facilite le suivi de vos progrès et l'analyse de vos performances en dehors de l'application.

## v3.1

**Mode Construire Autour.** Générez des équipes à partir de n'importe quel Pokémon. Choisissez votre favori dans les classements ou votre Pokebox, et BattleFlow construit des équipes optimisées autour de lui — trouvant les meilleurs leads, safe swaps et closers.

**Sprites Shiny (Pro).** Voyez vos Pokémon shiny dans toute l'app — classements, équipes, Pokebox, vérificateur d'IVs et équipes générées. Activez les shinies par espèce avec une animation d'éclat.`,
  de: `## v4.2.2

**Eine ganze Galerie-Auswahl importieren.** Wähle mehrere Bewertungs-Screenshots auf einmal aus, und BattleFlow scannt den Stapel — alles, was es nicht lesen konnte, sammelt es auf einer einzigen Prüfseite: eine Form zum Auswählen, ein WP zum Bestätigen, eine IV-Verteilung zum Auswählen. Beantworte die Frage und es wird gespeichert, mit dem Screenshot daneben, damit du die Antwort vom Bild ablesen kannst.

**Drei Scanner-Korrekturen.** Crypto-Pokémon werden am Hintergrund des Sprites erkannt statt an einer Zeile, die die IV-Bewertung verdeckt. Eine abgeschnittene Typen-Zeile reicht jetzt aus, um eine regionale Form zu bestimmen. Und die Wahl einer Form schließt sie ab, statt das Pokémon weiter als zu prüfen zu markieren.

**Urgl.** Würggeschoss wird vollständig simuliert, mit Sprites für beide Formen.

**Unentschieden ist ein eigenes Ergebnis.** Die Kampfnotizen erfassen Unentschieden als dritten Ausgang, statt sie als Niederlage zu werten.

**Matchups in Worten.** Die Matchup-Übersicht liest sich als Kategorien statt als interne 0–1000-Zahl der Engine.

**Die Bereinigung beginnt mit der Suche.** Der Pokémon-GO-Suchtext, für den du gekommen bist, steht als Erstes auf der Seite, und Cups tragen die Namen, die das Spiel ihnen gibt.

## v4.2

**Scannen, das nicht mehr aufgibt.** BattleFlow liest jetzt Pokémon, deren WP durch ihr eigenes Sprite verdeckt sind — die Flügel, Schweife und Hälse, die früher zu Scanfehlern führten — und bietet dir beide Werte zur Auswahl an, wenn die Daten zwei mögliche WP zulassen. Es scannt auch dann korrekt, wenn ein Pokémon nicht bei vollen KP ist, erkennt regionale Formen anhand abgeschnittener Typen-Etiketten und verarbeitet japanische, koreanische und chinesische Bewertungen richtig.

**Die Meta-Analyse, neu als Coach.** Eine Frage nach der anderen: deine Saisonbilanz, dann die Teams, mit denen du gespielt hast, und schließlich was du mit dem ausgewählten Team tun solltest. Übe deine Lead-Matchups listet die Eröffnungen auf, die du tatsächlich bekommst, jeweils mit dem Teammitglied, das sie übernimmt – und führt sie direkt in Lernkarten über. Leads erkunden bewertet andere Leads, um die du ein Team bauen kannst, gegen das Feld, dem du persönlich begegnest — wie viele deiner protokollierten Kämpfe jeder davon übernimmt, gefiltert danach, was du heute aus deiner Sammlung aufstellen könntest — und baut mit einem Tipp ein Team um deine Wahl.

**Lernen.** Ein neues Zuhause, um besser zu werden, mit Decks für PvP-Glossar, PvP-Mechaniken und Typen-Effektivität in den offiziellen Begriffen des Spiels. Neu in dieser Version trainiert Kannst du es einstecken? die häufigste Entscheidung in der GBL: dein Pokémon mit bestimmten KP, die gegnerische Lade-Attacke kurz vor dem Treffer – überlebst du ohne Schild?

**Die Sammlungsbereinigung, neu gestaltet.** Sie ist um Suchfilter herum aufgebaut, mit neun Transfer-Schutzkategorien und Begriffen, die sich an Pokémon GO orientieren statt an der App. Erlöste Pokémon sind nun eine eigenständige Klassifizierung, ein Pokémon kann angeben, für welche Liga oder welchen Cup es aufgebaut wird, und die Level-Up-Kosten erscheinen als vollständige Tabelle.

**Außerdem.** Vergleiche IV-Verteilungen direkt nebeneinander, einschließlich des besten Builds auf Level 40 gegenüber Level 50. Erstelle so viele eigene Karteikarten-Decks, wie du möchtest. Stelle jedes Pokémon auf seine schillernde Form ein und sieh sie in der gesamten App. Die Cup-Namen stammen jetzt in allen Sprachen direkt aus dem Spiel, und lateinamerikanisches Spanisch ist eine eigene Sprachfassung.

## v4.1.5

**Team-Builder aus deiner Sammlung.** Stelle Teams aus den Pokémon zusammen, die du tatsächlich besitzt – mit Meta-basierten Empfehlungen für Anfangs-Pokémon.

**Matchup-Linien.** Eine neue Ansicht im Kampfsimulator zeigt, wie ein Matchup unterschiedlich verlaufen kann, mit einer klareren Legende und Ein-Klick-Coaching.

**Pokebox-Bereinigung.** Ein kostenloses Tool, das deine Exemplare Art für Art nach IV und Liga-Eignung bewertet und den Rest zum Transfer markiert — mit abschaltbaren Schutzfunktionen für schillernde, favorisierte, glückliche, Kostüm- und Legacy-Attacken-Pokémon.

**Kampfprotokoll-Erweiterungen.** Bewertungs-Tracking pro Set, exakte Bewertungseingabe und rollenbeschriftete Gegner in deinen letzten Kämpfen.

**Manuelles Daten-Backup.** Sichere alle deine BattleFlow-Daten in einer Datei und stelle sie wieder her — praktisch beim Gerätewechsel.

**Plus.** Power-Up-Kostenschätzungen und empfohlene Movesets in deiner Sammlung, ein Wechsel zum Jahresabo direkt in den Einstellungen, ein neues Filter-/Sortier-/Layout-Set für die Sammlung, diese Neuigkeiten-Seite, zuverlässigeres Scannen und eine Korrektur für einen Absturz, der beim Öffnen des Kampf-Tabs auftreten konnte.

## v4.0

**Pokémon-Sammlung.** Behalte deine Pokémon in BattleFlow. Durchstöbere sie als Raster, Liste oder nach Spezies, mit Filtern, Sortierung und einer Liga-Empfehlung für jedes.

**IV-Scanner.** Mach einen Screenshot und BattleFlow liest Spezies, WP und IVs für dich aus — ohne Tippen. Scanne mehrere Screenshots in einem Stapel.

**Auto-Scan.** Streame deinen Bildschirm und BattleFlow scannt beim Bewerten automatisch — ohne Tippen.

**Spitznamen umbenennen.** Erstelle aus einem Scan einen kompetitiven Spitznamen — beste Liga, IVs und Rang — und kopiere ihn direkt in die Zwischenablage.

**Lernkarten-Serien.** Eine neue tägliche Übung hält eine Serie am Laufen, damit dein Matchup-Training scharf bleibt — mit Matchup-Decks inklusive.

**Plus.** Sammlung und Scanner sind vollständig übersetzt, ein „Nur im Besitz"-Filter in den Rankings sowie viele Verbesserungen bei UI, Leistung und Stabilität.

## v3.5

**Meta-Profile.** Erstelle eigene Bedrohungslisten — sogar aus deinen Kampfprotokollen — damit Teamwertungen die Metas widerspiegeln, denen du wirklich begegnest.

**MoveDex & Move-Lernkarten.** Durchstöbere alle Sofort- und Lade-Attacken an einem Ort und übe dann Treffer-Counts und Movesets mit dem neuen Lernkarten-Trainer.

**GBL-Saisonkalender.** Sieh dir aktuelle und kommende Cups und Ligen direkt im Mehr-Menü an.

**Alternative Movesets.** BattleFlows eigene Move-Empfehlungen erscheinen jetzt neben den Rankings.

**Plus.** Automatische Daten-Updates halten Cups und Rankings aktuell und bewerten deine gespeicherten Teams neu, dazu ein aufgefrischtes Design in der ganzen App sowie Dark-Mode- und Offline-Korrekturen.

## v3.2

**Moveset-Explorer.** Vergleiche alle Move-Kombinationen für ein Pokémon und finde das optimale Setup.

**Matchup-Karte (Beta).** Ein experimenteller neuer Weg, um Cup-Rankings zu erkunden.

**Datenexport.** Exportiere deine Kampfprotokolle und gespeicherten Teams direkt als CSV, um deinen Fortschritt einfacher zu verfolgen und deine Leistung außerhalb der App zu analysieren.

## v3.1

**Build-Around-Modus.** Starte die Teamgenerierung mit einem beliebigen Pokémon. Wähle deinen Favoriten aus den Rankings oder deiner Pokebox, und BattleFlow erstellt optimierte Teams drumherum — mit den besten Leads, Safe Swaps und Closern.

**Shiny-Sprites (Pro).** Sieh deine Shiny-Pokémon in der gesamten App — Rankings, Teams, Pokebox, IV-Checker und generierte Teams. Aktiviere Shinies pro Spezies mit Glitzeranimation.`,
  it: `## v4.2.2

**Importa un'intera selezione dalla galleria.** Scegli più screenshot di valutazione contemporaneamente: BattleFlow scansiona il gruppo e raccoglie in un'unica pagina di revisione tutto ciò che non è riuscito a leggere — una forma da scegliere, un PL da confermare, una combinazione di IV da selezionare. Rispondi e viene salvato, con lo screenshot accanto per leggere la risposta dall'immagine.

**Tre correzioni allo scanner.** I Pokémon Ombra vengono riconosciuti dallo sfondo dello sprite invece che da una riga che la valutazione IV copre. Una riga dei tipi tagliata ora basta per identificare una forma regionale. E scegliere una forma la definisce, invece di lasciare il Pokémon segnalato da controllare.

**Cramorant.** Inghiottimissile è completamente simulato, con gli sprite di entrambe le forme.

**Il pareggio è un risultato a sé.** Le Note di Battaglia registrano i pareggi come terzo esito invece di considerarli sconfitte.

**Matchup a parole.** La griglia dei matchup si legge per fasce anziché con il numero interno 0–1000 del motore.

**L'ottimizzazione parte dalla ricerca.** Il testo di ricerca di Pokémon GO che stavi cercando è la prima cosa nella pagina, e le coppe hanno il nome che dà loro il gioco.

## v4.2

**Una scansione che non si arrende.** BattleFlow ora legge i Pokémon i cui PL sono coperti dal proprio sprite — le ali, le code e i colli che prima causavano errori — e, quando i dati indicano due PL possibili, te li propone entrambi invece di arrendersi. Scansiona correttamente anche quando un Pokémon non è al massimo degli PS, legge le forme regionali dalle etichette dei tipi ritagliate e gestisce le valutazioni in giapponese, coreano e cinese.

**L'Analisi del meta, ricostruita come allenatore.** Una domanda alla volta: il tuo record stagionale, poi le squadre con cui hai giocato e infine cosa fare del team che scegli. Allena i tuoi matchup da Lead elenca le aperture che ti capitano davvero e chi nella tua linea se ne occupa, portandole direttamente nelle flashcard. Esplora i Lead classifica altri Lead attorno a cui costruire, misurati sul campo che affronti tu — quante delle tue battaglie registrate ciascuno si prende in carico, con un filtro per ciò che potresti schierare oggi dalla tua Collezione — e costruisce la squadra attorno alla tua scelta con un tocco.

**Apprendimento.** Un nuovo spazio per migliorare, con i mazzi Glossario PvP, Meccaniche PvP ed Efficacia dei tipi, con i termini ufficiali del gioco. Novità di questa versione, Riesci a incassarlo? allena la scelta più frequente nella Lega Lotte GO: il tuo Pokémon con determinati PS, la mossa caricata avversaria sul punto di colpire — sopravvivi senza usare lo scudo?

**La Pulizia della Collezione, riprogettata.** È costruita attorno alle ricerche, con nove categorie di protezione dal trasferimento e parole chiave che seguono il linguaggio di Pokémon GO anziché quello dell'app. I Pokémon purificati sono ora una classificazione principale, una copia può dichiarare per quale formato è destinata e i costi di potenziamento sono mostrati in una tabella completa.

**Inoltre.** Confronta le combinazioni di IV affiancate, inclusa la migliore configurazione al livello 40 contro il livello 50. Crea tutti i mazzi di flashcard personalizzati che desideri. Imposta qualsiasi Pokémon nella sua forma cromatica e vedila in tutta l'app. I nomi delle coppe provengono ora dal gioco stesso in ogni lingua, e lo spagnolo dell'America Latina ha una localizzazione dedicata.

## v4.1.5

**Creatore di Squadre dalla tua Collezione.** Crea squadre con i Pokémon che possiedi davvero, con consigli sul lead basati sul meta.

**Linee di Scontro.** Una nuova vista nel Simulatore di Battaglia mostra come uno scontro può evolversi diversamente, con una legenda più chiara e consigli con un tocco.

**Pulizia Pokebox.** Uno strumento gratuito che classifica le tue copie per IV e idoneità alla lega, specie per specie, e segnala il resto da trasferire — con protezioni disattivabili per i Pokémon shiny, preferiti, fortunati, in costume e con mosse leggendarie.

**Miglioramenti al registro battaglie.** Tracciamento del rating per set, inserimento manuale del rating esatto e avversari etichettati per ruolo nelle battaglie recenti.

**Backup manuale dei dati.** Esporta tutti i tuoi dati BattleFlow su file e ripristinali — comodo quando cambi dispositivo.

**Inoltre.** Stime del costo di potenziamento e moveset consigliati sulla tua Collezione, un passaggio al piano annuale direttamente dalle Impostazioni, un nuovo set di filtro/ordinamento/layout per la Collezione, questa pagina Novità, scansione più affidabile e una correzione per un crash che poteva verificarsi aprendo la scheda Battaglia.

## v4.0

**Collezione di Pokémon.** Tieni i tuoi Pokémon in BattleFlow. Sfogliali a griglia, elenco o per specie, con filtri, ordinamento e un suggerimento sulla lega migliore per ciascuno.

**Scanner IV.** Scatta uno screenshot e BattleFlow legge specie, PL e IV al posto tuo, senza digitare nulla. Scansiona più screenshot insieme in un unico blocco.

**Scansione automatica.** Trasmetti lo schermo e BattleFlow scansiona automaticamente mentre valuti, senza toccare nulla.

**Rinomina soprannomi.** Genera un soprannome competitivo — lega migliore, IV e posizione — da una scansione e copialo direttamente negli appunti.

**Serie di flashcard.** Un nuovo esercizio giornaliero mantiene viva una serie per tenere allenata la pratica sui matchup, con mazzi di matchup inclusi.

**Inoltre.** La Collezione e lo scanner sono completamente tradotti, un filtro «solo posseduti» nei ranking e tante migliorie a interfaccia, prestazioni e stabilità.

## v3.5

**Profili Meta.** Crea le tue liste di minacce — anche dai tuoi registri di battaglia — così i punteggi delle squadre riflettono le meta che affronti davvero.

**MoveDex e flashcard delle mosse.** Sfoglia tutte le mosse veloci e cariche in un unico posto e allenati su conteggi e set di mosse con il nuovo allenatore di flashcard.

**Calendario della stagione GBL.** Consulta le coppe e le leghe attuali e in arrivo direttamente dal menu Altro.

**Mosse alternative.** I consigli sulle mosse di BattleFlow ora compaiono accanto alle classifiche.

**Inoltre.** Gli aggiornamenti automatici dei dati mantengono coppe e classifiche aggiornate e rivalutano le squadre salvate, con un aspetto rinnovato in tutta l'app e correzioni per modalità scura e offline.

## v3.2

**Esploratore Set di Mosse.** Confronta tutte le combinazioni di mosse per un Pokémon e trova la configurazione ottimale.

**Mappa dei Matchup (Beta).** Un nuovo modo sperimentale per esplorare le classifiche delle Coppe.

**Esportazione Dati.** Esporta i tuoi Registri di Battaglia e le Squadre Salvate direttamente in CSV, facilitando il monitoraggio dei tuoi progressi e l'analisi delle tue prestazioni al di fuori dell'app.

## v3.1

**Modalità Costruisci Attorno.** Genera squadre partendo da qualsiasi Pokémon. Scegli il tuo preferito dai ranking o dalla Pokebox, e BattleFlow costruisce squadre ottimizzate attorno ad esso — trovando i migliori lead, safe swap e closer.

**Sprite Shiny (Pro).** Visualizza i tuoi Pokémon shiny in tutta l'app — classifiche, squadre, Pokebox, verificatore IV e squadre generate. Attiva gli shiny per specie con animazione scintillante.`,
  pt: `## v4.2.2

**Importe uma seleção inteira da galeria.** Escolha vários screenshots de avaliação de uma vez: o BattleFlow escaneia o lote e reúne numa única página de revisão tudo o que não conseguiu ler — uma forma para escolher, um PC para confirmar, uma distribuição de IVs para selecionar. Responda e ele salva, com o screenshot ao lado para você ler a resposta na imagem.

**Três correções no scanner.** Pokémon Sombrios são reconhecidos pelo fundo do sprite, e não por uma linha que a avaliação de IVs cobre. Uma linha de tipos cortada já basta para identificar uma forma regional. E escolher uma forma resolve a questão, em vez de deixar o Pokémon marcado para revisão.

**Cramorant.** Mísseis Gulosos está totalmente simulado, com sprites para as duas formas.

**O empate é um resultado próprio.** As Notas de Batalha registram empates como um terceiro resultado em vez de contá-los como derrota.

**Confrontos em palavras.** A grade de confrontos é lida por faixas em vez do número interno 0–1000 do motor.

**A limpeza começa pela busca.** O texto de busca do Pokémon GO que você veio buscar é a primeira coisa da página, e as copas têm o nome que o jogo dá a elas.

## v4.2

**Um escaneamento que não desiste.** O BattleFlow agora lê Pokémon cujos PCs estão cobertos pelo próprio sprite — as asas, caudas e pescoços que costumavam causar falhas — e, quando as evidências sugerem dois PCs possíveis, oferece ambos em vez de desistir. Também escaneia corretamente quando um Pokémon não está com o HP máximo, lê formas regionais a partir de etiquetas de tipo cortadas e processa as avaliações em japonês, coreano e chinês.

**A Análise do meta, reconstruída como treinador.** Uma pergunta de cada vez: seu histórico da temporada, depois as equipes com as quais jogou e, por fim, o que fazer com a que escolher. Treine seus confrontos de Líder lista as aberturas que você realmente enfrenta e quem da sua linha dá conta de cada uma, levando-as direto para os flashcards. Explorar Líderes classifica outros Líderes para construir ao redor, medidos contra o cenário que você mesmo enfrenta — quantas das suas batalhas registradas cada um assume, com filtro pelo que você poderia escalar hoje a partir da sua Coleção — e monta a equipe em torno da sua escolha com um toque.

**Aprendizado.** Um novo espaço para melhorar, com baralhos de Glossário PvP, Mecânicas PvP e Eficácia de tipos, nas próprias palavras do jogo. A novidade desta versão, Você consegue aguentar?, treina a decisão mais frequente na GBL: seu Pokémon com um determinado HP, o ataque carregado adversário prestes a atingir — você sobrevive sem usar escudo?

**A Limpeza da Coleção, redesenhada.** Foi construída em torno de buscas, com nove categorias de proteção de transferência e palavras-chave que seguem a linguagem do Pokémon GO em vez da do aplicativo. Os Pokémon Purificados são agora uma classificação principal, cada cópia pode declarar para qual formato está destinada e os custos de fortalecimento aparecem em uma tabela completa.

**Além disso.** Compare combinações de IV lado a lado, incluindo a melhor configuração no nível 40 contra o nível 50. Crie quantos baralhos de flashcards personalizados desejar. Defina qualquer Pokémon para sua forma brilhante e veja-a em todo o aplicativo. Os nomes das copas agora vêm do próprio jogo em todos os idiomas, e o espanhol latino-americano tem sua própria localização.

## v4.1.5

**Montador de Times a partir da sua Coleção.** Monte times com os Pokémon que você realmente tem, com recomendações de líder baseadas no meta.

**Linhas de Confronto.** Uma nova visualização no Simulador de Batalha mostra como um confronto pode se desenrolar de forma diferente, com legenda mais clara e dicas em um toque.

**Limpeza do Pokebox.** Uma ferramenta gratuita que classifica suas cópias por IV e adequação à liga, espécie por espécie, e sinaliza o restante para transferir — com proteções ativáveis para Pokémon shiny, favoritos, sortudos, com fantasia e com movimento legado.

**Melhorias no registro de batalhas.** Acompanhamento de rating por set, entrada manual de rating exato e oponentes com função identificada nas suas batalhas recentes.

**Backup manual de dados.** Exporte todos os seus dados do BattleFlow para um arquivo e restaure-os — útil ao trocar de aparelho.

**Além disso.** Estimativas de custo de power-up e movesets recomendados na sua Coleção, upgrade para o plano anual direto pelas Configurações, um novo conjunto de filtro/ordenação/layout para a Coleção, esta página de Novidades, escaneamento mais confiável e uma correção para uma falha que podia ocorrer ao abrir a aba Batalha.

## v4.0

**Coleção de Pokémon.** Guarde seus Pokémon no BattleFlow. Navegue em grade, lista ou por espécie, com filtros, ordenação e uma sugestão de melhor liga para cada um.

**Scanner de IVs.** Tire uma captura e o BattleFlow lê a espécie, o PC e os IVs por você, sem digitar nada. Escaneie várias capturas juntas de uma só vez.

**Escaneamento automático.** Transmita sua tela e o BattleFlow escaneia automaticamente enquanto você avalia, sem tocar em nada.

**Renomear apelidos.** Gere um apelido competitivo — melhor liga, IVs e ranking — a partir de um escaneamento e copie direto para a área de transferência.

**Sequências de flashcards.** Um novo desafio diário mantém uma sequência para deixar sua prática de confrontos afiada, com decks de confronto inclusos.

**Além disso.** A Coleção e o scanner estão totalmente traduzidos, um filtro de apenas os que você possui nos rankings e muitas melhorias de interface, desempenho e estabilidade.

## v3.5

**Perfis de Meta.** Crie suas próprias listas de ameaças — até a partir dos seus registros de batalha — para que as pontuações de equipe reflitam as metas que você realmente enfrenta.

**MoveDex e cartões de ataques.** Navegue por todos os ataques rápidos e carregados em um só lugar e treine as contagens e os conjuntos de ataques com o novo treinador de cartões.

**Calendário da temporada GBL.** Veja as copas e ligas atuais e futuras direto no menu Mais.

**Ataques alternativos.** As recomendações de ataques do próprio BattleFlow agora aparecem ao lado dos rankings.

**Além disso.** As atualizações automáticas de dados mantêm copas e rankings em dia e reavaliam suas equipes salvas, com visual renovado em todo o app e correções de modo escuro e offline.

## v3.2

**Explorador de Conjunto de Ataques.** Compare todas as combinações de ataques de um Pokémon e encontre a configuração ideal.

**Mapa de Confrontos (Beta).** Uma nova maneira experimental de explorar os rankings das Copas.

**Exportação de Dados.** Exporte seus Registros de Batalha e Equipes Salvas diretamente para CSV, facilitando o acompanhamento do seu progresso e a análise do seu desempenho fora do aplicativo.

## v3.1

**Modo Construir ao Redor.** Gere equipes a partir de qualquer Pokémon. Escolha seu favorito dos Rankings ou da Pokebox, e BattleFlow monta equipes otimizadas ao redor dele — encontrando os melhores leads, safe swaps e closers.

**Sprites Shiny (Pro).** Veja seus Pokémon shiny em todo o app — rankings, equipes, Pokebox, verificador de IVs e equipes geradas. Ative shinies por espécie com animação brilhante.`,
  ja: `## v4.2.2

**ギャラリーの複数選択をまとめて取り込み。** 評価画面のスクリーンショットを一度に複数選択すると、BattleFlowがまとめてスキャンし、読み取れなかったものだけを1つの確認ページに集めます。すがたを選ぶ、CPを確認する、個体値の組み合わせを選ぶ——答えるとそのまま保存され、元のスクリーンショットが隣に並ぶので、写真を見ながら答えられます。

**スキャンの修正3点。** シャドウポケモンを、個体値評価が隠してしまう表示ではなくスプライトの背景色から判定するようにしました。タイプ表記が一部欠けていてもリージョンフォームを特定できます。すがたを選べばその時点で確定し、「要確認」のままになりません。

**ウッウ。** うのミサイルを完全にシミュレートし、両方のすがたのスプライトを追加しました。

**引き分けを独立した結果に。** バトルノートは引き分けを敗北にまとめず、3つ目の結果として記録します。

**相性を言葉で表示。** 相性表を、エンジン内部の0〜1000の数値ではなく段階の表現で読めるようにしました。

**整理は検索から。** 目的のポケモンGO検索文字列がページの先頭に表示され、カップはゲームと同じ名前で表示されます。

## v4.2

**あきらめないスキャン。** 翼や尻尾、首などのグラフィックにCPが重なって認識できなかった問題を解決し、スキャン失敗を大きく減らしました。CP候補が複数考えられる場合は、あきらめずに両方を提示して選べます。HPが満タンでないポケモンも正しく読み取れるため、レイドやジム戦の直後でも正確です。一部が欠けたタイプ表記からのリージョンフォーム判定、日本語・韓国語・中国語の評価画面にも対応しました。

**環境分析が、あなたのコーチに。** シーズン戦績、使用したパーティ、そして選んだパーティで次に何をするかまで、一度に一つの疑問に答える構成に再設計しました。「初手対面を練習する」では、実際によく当たる初手対面と、自分のパーティの誰が受けられるかを一覧でき、そのままフラッシュカードで練習できます。「初手を探す」では、あなた自身が対戦した相手を基準に、軸にできる他の初手をランキング表示します。各候補が記録済みバトルのうち何戦を引き受けるかを示し、手持ちから今すぐ出せるかで絞り込め、選んだポケモンを軸にしたパーティをワンタップで組めます。

**学習センター。** 上達のための新しい拠点です。PvP用語集、ゲーム内仕様、タイプ相性のデッキを、ゲーム公式の表現でクイズ形式に学べます。本バージョンの新機能「耐えられますか？」は、最も頻繁に迫られる判断を鍛えます。現在のHPと相手が放つスペシャルわざを見て、シールドなしで耐えられるか——瞬時に見極める練習ができます。

**ボックス整理を刷新。** 検索を中心に再設計し、ポケモンGOの言葉づかいに沿った9つの転送保護カテゴリを用意しました。「ライトポケモン」は独立した分類になり、各個体に想定する育成先を設定でき、強化コストは列を備えた表で確認できます。

**さらに。** 個体値を横並びで比較でき、レベル40とレベル50の最適な仕上がりも見比べられます。カスタムのフラッシュカードデッキは好きなだけ作成可能。どのポケモンも色違い表示に切り替えられ、アプリ全体に反映されます。カップ名はすべての言語でゲーム公式の名称になり、ラテンアメリカ向けスペイン語も独立したロケールになりました。

## v4.1.5

**コレクションからのチーム構築**：実際に所持しているポケモンでチームを編成でき、メタを踏まえたリード推奨も表示されます。

**マッチアップライン**：バトルシミュレーターの新しい画面で、対戦の展開パターンをより分かりやすい凡例とワンタップの解説付きで確認できます。

**Pokebox クリーンアップ**：種族ごとに個体値とリーグ適性でランク付けし、残りを転送候補としてフラグ付けする無料ツール。色違い、お気に入り、ラッキー、コスチューム、限定技持ちのポケモンは個別にオン/オフできる保護機能付きです。

**バトルログの強化**：セットごとのレーティング記録、正確なレーティングの手入力、直近のバトルでの役割ラベル付き対戦相手を追加。

**手動データバックアップ**：BattleFlowのすべてのデータをファイルにバックアップして復元できます。機種変更の際に便利です。

**さらに**：コレクションでの強化コストの見積もりとおすすめの技構成、設定から直接できる年間プランへのアップグレード、コレクションの新しいフィルター・並べ替え・レイアウトツール、この新着情報ページ、より安定したスキャン、そしてバトルタブを開いた際にクラッシュすることがあった不具合の修正。

## v4.0

**ポケモンコレクション**：あなたのポケモンを BattleFlow に登録。グリッド・リスト・種族別で表示でき、フィルター、並べ替え、ポケモンごとの最適リーグ提案にも対応。

**IV スキャナー**：スクリーンショットを撮るだけで、BattleFlow が種族・CP・個体値を自動で読み取り。手入力は不要です。複数のスクリーンショットをまとめて一括スキャンも可能。

**自動スキャン**：画面を配信するだけで、BattleFlow が評価中に自動でスキャン。タップは不要です。

**ニックネーム変更**：スキャンから対戦向けのニックネーム（最適リーグ・個体値・順位）を生成し、そのままクリップボードにコピー。

**フラッシュカードの連続記録**：新しい毎日のドリルで連続記録を維持し、対戦練習を鋭く保てます。対戦用デッキも内蔵。

**さらに**：コレクションとスキャナーを完全ローカライズ、ランキングの「所持のみ」フィルター、そして UI・パフォーマンス・安定性の多数の改善。

## v3.5

**メタプロファイル**：バトルログからでも、自分だけの脅威リストを作成できます。チームスコアが実際に対戦するメタを反映します。

**MoveDex と技フラッシュカード**：すべてのノーマルアタックとスペシャルアタックを一か所で閲覧し、新しいフラッシュカードトレーナーで回数や技構成を練習できます。

**GBLシーズンカレンダー**：現在および今後のカップとリーグを「その他」メニューから確認できます。

**代替技構成**：BattleFlow独自の技のおすすめがランキングの横に表示されるようになりました。

**さらに**：自動データ更新でカップとランキングが常に最新になり、保存したチームが再評価されます。アプリ全体のデザイン刷新、ダークモードとオフラインの修正も含まれます。

## v3.2

**技構成エクスプローラー**：ポケモンのすべての技の組み合わせを比較して、最適な構成を見つけ出すことができます。

**対面マップ（ベータ）**：カップのランキングを探索するための実験的な新しい方法。

**データ書き出し**：バトルログと保存したチームをCSV形式で直接書き出せるようになりました。アプリ外での進捗管理やパフォーマンス分析がより簡単になります。

## v3.1

**ビルドアラウンドモード**：任意のポケモンからチーム生成を開始。ランキングやポケボックスからお気に入りを選ぶと、BattleFlowがそのポケモンを軸に最適なリード、セーフスワップ、クローザーを備えたチームを構築します。

**色違いスプライト（Pro）**：色違いポケモンをアプリ全体で表示 — ランキング、チーム、ポケボックス、個体値チェッカー、生成チーム。種族ごとにキラキラアニメーション付きで切り替え可能。`,
  ko: `## v4.2.2

**갤러리에서 선택한 여러 장을 한 번에 가져오기.** 평가 스크린샷을 여러 장 한 번에 선택하면 BattleFlow가 한꺼번에 스캔하고, 읽지 못한 것만 하나의 확인 페이지에 모아 줍니다. 모습을 고르고, CP를 확인하고, 개체값 조합을 선택하면 그대로 저장됩니다. 원본 스크린샷이 옆에 함께 표시되어 사진을 보고 답할 수 있습니다.

**스캐너 수정 3가지.** 그림자 포켓몬을 개체값 평가가 가리는 문구가 아니라 스프라이트 배경으로 판별합니다. 타입 표기가 잘려 있어도 리전 폼을 구분할 수 있습니다. 모습을 선택하면 그 자리에서 확정되어 '확인 필요' 표시가 남지 않습니다.

**윽우지.** 그대로꿀꺽미사일을 완전히 시뮬레이션하며, 두 모습의 스프라이트를 추가했습니다.

**무승부는 그 자체로 하나의 결과.** 배틀 기록이 무승부를 패배로 묶지 않고 세 번째 결과로 기록합니다.

**상성을 말로 표시.** 상성표를 엔진 내부의 0~1000 숫자가 아니라 등급 표현으로 읽을 수 있습니다.

**정리는 검색부터.** 찾으러 온 포켓몬 GO 검색어가 페이지 맨 위에 표시되고, 컵은 게임이 부르는 이름으로 표시됩니다.

## v4.2

**포기하지 않는 스캔.** 날개, 꼬리, 목 등의 그래픽에 CP가 가려져 스캔이 실패하던 문제를 개선했습니다. 판단 가능한 CP 후보가 두 가지인 경우에는 포기하지 않고 두 가지를 모두 제안합니다. HP가 가득 차지 않은 포켓몬도 정확하게 인식하므로 레이드나 체육관 배틀 직후에도 바로 스캔할 수 있으며, 잘린 타입 라벨을 통한 리전폼 인식과 한국어·일본어·중국어 평가 화면 분석도 지원합니다.

**메타 분석이 코치가 되었습니다.** 시즌 전적, 사용한 팀, 그리고 선택한 팀으로 다음에 무엇을 할지까지 한 번에 하나의 질문에 답하도록 재구성했습니다. '선봉 상성 연습하기'는 실제로 자주 마주치는 선봉 상성과 그것을 받아낼 우리 팀의 포켓몬을 함께 보여주고, 그대로 플래시카드 학습으로 이어집니다. '선봉 살펴보기'는 여러분이 직접 상대한 선봉을 기준으로 새로 축이 될 만한 선봉의 순위를 매기고, 각 후보가 기록된 배틀 중 몇 판을 대신 가져가는지 알려주며, 고른 포켓몬을 축으로 한 팀을 한 번의 탭으로 구성합니다.

**학습 센터.** 더 잘하기 위한 새로운 공간입니다. PvP 용어집, PvP 배틀 메커니즘, 타입 상성 덱을 게임 공식 표현으로 학습할 수 있습니다. 이번 버전에 추가된 '버틸 수 있을까요?'는 가장 자주 내리는 판단을 훈련합니다. 특정 HP의 내 포켓몬이 상대의 스페셜 어택을 실드 없이 버텨낼 수 있을까요?

**포켓몬 박스 정리 개편.** 검색을 중심으로 전면 개편되어 포켓몬 GO의 표현을 따르는 9가지 전송 보호 카테고리를 제공합니다. 정화 포켓몬이 주요 분류로 승격되었고, 개별 포켓몬에 어떤 육성 본체인지 태그를 지정할 수 있으며, 강화 비용은 열 테이블로 표시됩니다.

**그 외.** 개체값 분배를 나란히 비교할 수 있고 레벨 40과 레벨 50 빌드도 비교할 수 있습니다. 커스텀 플래시카드 덱은 원하는 만큼 만들 수 있습니다. 어떤 포켓몬이든 색이 다른 모습으로 설정하면 앱 전체에 적용됩니다. 모든 언어에서 컵 이름이 게임 공식 명칭과 일치하게 되었고, 라틴아메리카 스페인어가 독자적인 로케일로 지원됩니다.

## v4.1.5

**컬렉션 기반 팀 빌더**: 실제로 보유한 포켓몬으로 팀을 구성하고, 메타를 반영한 리드 추천을 받아보세요.

**매치업 라인**: 배틀 시뮬레이터의 새로운 화면에서 더 명확한 범례와 원터치 코칭과 함께 대결이 어떻게 다르게 전개될 수 있는지 확인할 수 있습니다.

**포켓박스 정리**: 종족별로 개체값과 리그 적합도로 순위를 매기고 나머지를 교환 대상으로 표시하는 무료 도구입니다. 이로치, 즐겨찾기, 럭키, 코스튬, 레거시 기술 포켓몬은 개별적으로 켜고 끌 수 있는 보호 기능이 있습니다.

**배틀 로그 개선**: 세트별 레이팅 추적, 정확한 레이팅 직접 입력, 최근 배틀에서 역할이 표시된 상대 기능이 추가되었습니다.

**수동 데이터 백업**: BattleFlow의 모든 데이터를 파일로 백업하고 복원할 수 있습니다. 기기를 변경할 때 유용합니다.

**추가 사항**: 컬렉션의 강화 비용 예상치와 추천 기술 구성, 설정에서 바로 하는 연간 플랜 업그레이드, 컬렉션의 새로운 필터·정렬·레이아웃 도구, 이 새로운 기능 페이지, 더 안정적인 스캔, 그리고 배틀 탭을 열 때 발생할 수 있던 충돌 문제 수정.

## v4.0

**포켓몬 컬렉션**: 포켓몬을 BattleFlow에 보관하세요. 그리드, 리스트, 종족별로 살펴보고 필터, 정렬, 포켓몬별 최적 리그 추천까지 제공합니다.

**IV 스캐너**: 스크린샷만 찍으면 BattleFlow가 종족, CP, 개체값을 자동으로 읽어 줍니다. 직접 입력할 필요가 없습니다. 여러 스크린샷을 한 번에 일괄 스캔할 수도 있습니다.

**자동 스캔**: 화면을 스트리밍하면 BattleFlow가 평가하는 동안 탭 없이 자동으로 스캔합니다.

**닉네임 변경**: 스캔에서 대전용 닉네임(최적 리그, 개체값, 순위)을 생성해 바로 클립보드에 복사하세요.

**플래시카드 연속 기록**: 새로운 일일 훈련으로 연속 기록을 이어가 매치업 연습을 날카롭게 유지하세요. 매치업 덱도 기본 제공됩니다.

**추가로**: 컬렉션과 스캐너를 완전히 현지화했고, 랭킹에 '보유한 것만' 필터를 추가했으며, UI·성능·안정성도 폭넓게 개선했습니다.

## v3.5

**메타 프로필**: 배틀 로그를 기반으로도 나만의 위협 목록을 만들어, 팀 점수가 실제로 마주하는 메타를 반영하도록 하세요.

**MoveDex 및 기술 플래시카드**: 모든 일반 기술과 스페셜 기술을 한곳에서 둘러보고, 새로운 플래시카드 트레이너로 카운트와 기술 배치를 연습하세요.

**GBL 시즌 캘린더**: 현재와 예정된 컵과 리그를 더보기 메뉴에서 바로 확인하세요.

**대체 기술 배치**: BattleFlow 자체 기술 추천이 이제 랭킹 옆에 표시됩니다.

**추가로**: 자동 데이터 업데이트로 컵과 랭킹이 최신으로 유지되고 저장된 팀이 다시 평가됩니다. 앱 전반의 새로워진 디자인과 다크 모드·오프라인 수정도 포함됩니다.

## v3.2

**기술 배치 탐색기**: 포켓몬의 모든 기술 조합을 비교하여 가장 적합한 설정을 찾을 수 있습니다.

**매치업 맵 (베타)**: 컵 랭킹을 탐색하는 새로운 실험적 방법입니다.

**데이터 내보내기**: 배틀 로그와 저장된 팀을 CSV로 직접 내보낼 수 있어, 앱 외부에서도 진행 상황을 추적하고 성과를 분석하기가 더 쉬워졌습니다.

## v3.1

**빌드 어라운드 모드**: 원하는 포켓몬으로 팀 생성을 시작하세요. 랭킹이나 포켓박스에서 좋아하는 포켓몬을 선택하면 BattleFlow가 최적의 리드, 세이프 스왑, 클로저를 찾아 팀을 구축합니다.

**색이 다른 스프라이트 (Pro)**: 앱 전체에서 색이 다른 포켓몬을 확인하세요 — 랭킹, 팀, 포켓박스, 개체값 체커, 생성된 팀. 종별로 반짝이는 애니메이션과 함께 전환 가능.`,
  'zh-hant': `## v4.2

**不再輕易放棄的掃描**：現在能讀取 CP 被自身圖片遮擋的寶可夢——翅膀、尾巴與脖子過去常導致掃描失敗；當判斷出兩種可能的 CP 時，會同時提供兩者供你選擇，而非直接放棄。即使寶可夢未滿血也能正確掃描，並可從裁剪的屬性標籤讀取地區形態，中文、日文與韓文的評價畫面也已完整支援。

**環境分析重構為你的教練**：每次專注解答一個問題——你的賽季記錄、你所使用的陣容，以及選定陣容之後該做什麼。「練習你的先發對位」列出你實際最常遇到的先發對位，並標明你陣容中由誰來應對，還可直接進入閃卡練習。「探索先發」以你親自遇過的對手為基準，為可以作為核心的其他先發排名，顯示每個候選能替你接下多少場已記錄的對戰，並可依你今天就能派出的寶可夢篩選，再一鍵圍繞所選寶可夢組建陣容。

**學習中心**：提升技術的全新起點，收錄 PvP 詞彙表、PvP 機制與屬性相性牌組，皆以遊戲官方用語呈現。本版本全新推出「能扛下來嗎？」，鍛鍊你最常面臨的決策：你的寶可夢在特定 HP 下，面對即將命中的特殊招式，在無防禦網的情況下能否生還？

**Pokebox 清理全新設計**：以搜尋為核心，提供九個符合《Pokémon GO》官方用語的轉送保護類別。淨化寶可夢現已列為主要分類，每隻寶可夢都可以標記其預計培養的方向，強化花費則以完整的表格欄位呈現。

**其他**：可橫向對比個體值分佈，包括等級 40 與等級 50 的最佳配置；自由建立多個自訂閃卡牌組；將任何寶可夢設定為異色形態並在全應用程式中顯示。所有語言的盃賽名稱現在皆與遊戲官方一致，拉丁美洲西班牙語也擁有獨立的在地化版本。

## v4.1.5

**從圖鑑組建隊伍**：使用你實際擁有的寶可夢組建隊伍，並取得基於目前環境的先發推薦。

**對局線**：對戰模擬器新增畫面，搭配更清楚的圖例與單鍵教學，呈現同一場對局可能出現的不同走向。

**Pokebox 清理**：一款免費工具，依個體值與聯盟適配度逐一物種為你的寶可夢排序，並標示出可放生的對象——閃光、收藏、幸運、變裝與絕版招式寶可夢皆有可個別開關的保護機制。

**對戰紀錄升級**：新增單場分組評分追蹤、精確評分手動輸入，以及近期對戰中帶有角色標籤的對手顯示。

**手動資料備份**：將所有 BattleFlow 資料備份到檔案並還原——更換裝置時特別實用。

**其他**：圖鑑新增強化花費預估與推薦招式組合、可直接在設定中升級為年度方案、圖鑑新增篩選／排序／版面工具、這個新功能頁面、更穩定的掃描，以及修正了一個開啟「對戰」分頁時可能發生的當機問題。

## v4.0

**寶可夢收藏**：把你的寶可夢保存在 BattleFlow 中。可依網格、清單或種類瀏覽，支援篩選、排序，並為每隻提供最佳聯盟建議。

**IV 掃描器**：截圖即可讓 BattleFlow 自動辨識種類、CP 與個體值，無需手動輸入。還能一次批次掃描多張截圖。

**自動掃描**：串流你的螢幕，BattleFlow 就會在你評估時自動掃描，無需點擊。

**暱稱重新命名**：從一次掃描生成對戰用暱稱（最佳聯盟、個體值、排名），並直接複製到剪貼簿。

**閃卡連續紀錄**：全新的每日訓練幫你保持連續紀錄，讓對位練習保持敏銳，並內建對位牌組。

**此外**：收藏與掃描器已完整在地化，排行榜新增「僅持有」篩選，以及大量介面、效能與穩定性提升。

## v3.5

**Meta 檔案**：建立你自己的威脅清單——甚至可以來自你的對戰紀錄——讓隊伍評分反映你真正面對的對戰環境。

**MoveDex 與招式記憶卡**：在同一處瀏覽所有快速招式與蓄力招式，然後用全新的記憶卡訓練器練習招式次數與招式組合。

**GBL 賽季行事曆**：在「更多」選單中直接查看目前與即將開始的盃賽與聯賽。

**替代招式組合**：BattleFlow 自有的招式推薦現在會顯示在排名旁邊。

**此外**：自動資料更新讓盃賽與排名保持最新，並重新評估你儲存的隊伍，同時帶來全應用煥新的外觀以及深色模式與離線修正。

## v3.2

**技能組合瀏覽器**：比較寶可夢的所有技能組合，找到最佳配置。

**對戰地圖（測試版）**：一種探索杯賽排名的實驗性新方法。

**數據匯出**：將您的對戰日誌和儲存的陣容直接匯出為 CSV，讓您更輕鬆地在應用之外追蹤進度並分析表現。

## v3.1

**圍繞構建模式**：從任意寶可夢開始生成陣容。從排名或寶可夢盒子中選擇你的最愛，BattleFlow將圍繞它構建優化陣容 — 找到最佳先發、安全換手和終結者。

**閃光精靈（Pro）**：在整個應用中查看你的閃光寶可夢 — 排名、陣容、寶可夢盒子、個體值檢查器和生成陣容。按物種切換閃光，帶閃爍動畫。`,
};
