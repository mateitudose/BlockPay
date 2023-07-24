https://congruous-sphere-fdb.notion.site/Documenta-ie-Blockpay-07a7c54301914b8cbc10900d2cb6fe84?pvs=4

**Documentație Procesor de Plăți Cryptomonede - BlockPay**

**1. Descrierea softului folosit**

Proiectul a utilizat o serie de software-uri și biblioteci care au facilitat dezvoltarea și funcționalitatea finală a procesorului de plăți BlockPay. Acestea includ:

- **Next.js:** Un cadru JavaScript de la Vercel care permite funcționalitate de rendare a serverului și generare a site-ului static pentru aplicații React. Acesta a permis un design mai modular și performant.

- **Supabase:** O alternativă open-source la Firebase, care ne-a permis să ne creăm baza de date și să gestionăm autentificarea.

- **Heroicons, Tailwind UI, Tailwind CSS, și Headless UI:** Aceste instrumente au fost folosite pentru a dezvolta interfața cu utilizatorul, oferindu-ne posibilitatea de a crea o interfață de utilizator modernă și atractivă.

- **React Hot Toast:** O bibliotecă utilizată pentru a afișa notificări atractive și responsive în interfața cu utilizatorul.

- **Tawk.to:** Un software de chat live gratuit, care ne-a permis să comunicăm în timp real cu utilizatorii noștri.

- **QuickNode:** Un nod blockchain ca serviciu, care ne-a permis să interacționăm cu rețeaua Ethereum într-un mod mai eficient.

- **CoinGecko API:** API-ul CoinGecko a fost folosit pentru a obține informații în timp real despre prețul cryptomonedelor.

- **Ankr:** Un serviciu public RPC utilizat pentru a interacționa cu rețeaua blockchain.

- **Rainbow kit wallet, Ethers, Web3js:** Aceste biblioteci au fost folosite pentru a facilita interacțiunile cu portofelele blockchain și pentru a permite tranzacțiile de criptomonedă.

- **Hardhat (Solidity), OpenZeppelin:** A fost folosit pentru a scrie și testa smart contracts pentru platforma Ethereum.

**2. Descrierea părții cu aport propriu**

Aportul meu principal la acest proiect a fost integrarea tuturor componentelor enumerate mai sus într-un procesor de plăți complet și funcțional. Acest lucru a implicat scrierea de cod în Next.js pentru a crea interfața cu utilizatorul, configurarea Supabase pentru a gestiona baza de date și autentificarea, utilizarea API-urilor QuickNode și CoinGecko pentru a facilita tranzacțiile și prelucrarea datelor de preț, și utilizarea Hardhat pentru a scrie și testa smart contracts.

**3. Descrierea elementelor copiate din alte surse**

Am folosit multe elemente de cod din bibliotecile Heroicons, Tailwind UI, Tailwind CSS, și Headless UI pentru a crea interfața cu utilizatorul.

**4. Cum se folosește aplicația**

Procesul de utilizare a aplicației BlockPay este unul simplu și intuitiv, conceput pentru a facilita tranzacțiile cu criptomonede:

1. Înregistrarea și autentificarea: Inițial, utilizatorul trebuie să se înregistreze și să se autentifice în aplicație, proces facil de realizat cu ajutorul sistemului de autentificare Supabase.

2. Crearea unui produs sau a unei subscripții: După autentificare, utilizatorul are posibilitatea să creeze un produs sau o subscripție. Detaliile acesteia, inclusiv prețul și detaliile criptomonedei acceptate, vor fi introduse de utilizator în cadrul acestui proces.

3. Distribuirea linkului: După crearea produsului sau a subscripției, utilizatorul va primi un link unic pe care îl poate distribui cumpărătorilor. Acest link va duce cumpărătorul la o pagină unde poate revizui detaliile tranzacției și poate trimite plata.

4. Trimiterea plății: Cumpărătorul, urmând linkul, va fi direcționat către o pagină unde se poate efectua plata. După confirmarea tranzacției, script-ul aplicației va executa transferul automat de fonduri către vânzător.

**5. Cerințe hardware minime**

Având în vedere că BlockPay este o aplicație web, cerințele de hardware sunt minime. Totuși, pentru a asigura o funcționare optimă, recomandăm următoarele:

- Procesor: 1GHz sau mai rapid
- Memorie RAM: 1GB sau mai mult
- Spațiu pe hard disk: 200MB sau mai mult
- Conexiune la internet: Conexiune stabilă la internet
- Sistem de operare: orice sistem de operare capabil să ruleze un browser web modern (Google Chrome, Mozilla Firefox, Safari, etc.)

Acesta fiind o aplicație web, nu este necesar un hardware specific pentru a putea utiliza serviciul, dar o conexiune la internet stabilă este necesară pentru a asigura o funcționare fără probleme.
