import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.reservation.deleteMany();
  await prisma.package.deleteMany();
  await prisma.user.deleteMany();

  // Admin
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.create({
    data: { name: "Administrator", email: "admin@packgo.ro", password: adminPassword, role: "ADMIN" },
  });

  // 30 unique clients
  const userPassword = await bcrypt.hash("user123", 12);
  const clientNames = [
    { name: "Andrei Popescu",    email: "andrei.popescu@example.com" },
    { name: "Maria Ionescu",     email: "maria.ionescu@example.com" },
    { name: "Alexandru Dumitrescu", email: "alex.dumitrescu@example.com" },
    { name: "Elena Stan",        email: "elena.stan@example.com" },
    { name: "Mihai Georgescu",   email: "mihai.georgescu@example.com" },
    { name: "Ioana Radu",        email: "ioana.radu@example.com" },
    { name: "Gabriel Marin",     email: "gabriel.marin@example.com" },
    { name: "Cristina Tudor",    email: "cristina.tudor@example.com" },
    { name: "Daniel Stoica",     email: "daniel.stoica@example.com" },
    { name: "Ana Pavel",         email: "ana.pavel@example.com" },
    { name: "Robert Ilie",       email: "robert.ilie@example.com" },
    { name: "Bianca Enache",     email: "bianca.enache@example.com" },
    { name: "Vlad Neagu",        email: "vlad.neagu@example.com" },
    { name: "Teodora Munteanu",  email: "teodora.munteanu@example.com" },
    { name: "Florin Dobre",      email: "florin.dobre@example.com" },
    { name: "Larisa Petrescu",   email: "larisa.petrescu@example.com" },
    { name: "Ștefan Nicolae",    email: "stefan.nicolae@example.com" },
    { name: "Oana Diaconu",      email: "oana.diaconu@example.com" },
    { name: "Rareș Matei",       email: "rares.matei@example.com" },
    { name: "Adina Sandu",       email: "adina.sandu@example.com" },
    { name: "Cătălin Voicu",     email: "catalin.voicu@example.com" },
    { name: "Sabina Aldea",      email: "sabina.aldea@example.com" },
    { name: "Lucian Toma",       email: "lucian.toma@example.com" },
    { name: "Daniela Frățilă",   email: "daniela.fratila@example.com" },
    { name: "Denis Grigore",     email: "denis.grigore@example.com" },
    { name: "Alina Dragomir",    email: "alina.dragomir@example.com" },
    { name: "Cosmin Barbu",      email: "cosmin.barbu@example.com" },
    { name: "Nicoleta Păun",     email: "nicoleta.paun@example.com" },
    { name: "Tudor Zamfir",      email: "tudor.zamfir@example.com" },
    { name: "Irina Mocanu",      email: "irina.mocanu@example.com" },
  ];

  const users = await Promise.all(
    clientNames.map((c) =>
      prisma.user.create({ data: { name: c.name, email: c.email, password: userPassword, role: "USER" } })
    )
  );

  // ─── 28 packages ─────────────────────────────────────────────────────────────
  const packages = await Promise.all([
    // 0
    prisma.package.create({ data: { title: "Evadare de vis în Santorini", titleEn: "Santorini Dream Escape", destination: "Santorini, Grecia", destinationEn: "Santorini, Greece", description: "Descoperă farmecul insulei Santorini cu apusuri spectaculoase, plaje cu nisip negru și arhitectura cicladică unică. Pachetul include cazare în hotel de 4 stele cu vedere la calderă, mic dejun, transfer aeroport și o excursie cu barca la vulcan.", descriptionEn: "Discover the charm of Santorini island with spectacular sunsets, black sand beaches and unique Cycladic architecture. Package includes 4-star hotel with caldera view, breakfast, airport transfer and a boat trip to the volcano.", price: 1299.99, startDate: new Date("2026-06-15"), endDate: new Date("2026-06-22"), maxSlots: 20, imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=500&fit=crop" } }),
    // 1
    prisma.package.create({ data: { title: "Aventură Safari în Kenya", titleEn: "Safari Adventure Kenya", destination: "Nairobi, Kenya", destinationEn: "Nairobi, Kenya", description: "O aventură de neuitat în inima Africii! Explorează Parcul Național Masai Mara, întâlnește Big Five și trăiește experiența unui safari autentic. Include cazare în lodge-uri de lux, toate mesele, ghid profesionist și transport 4x4.", descriptionEn: "An unforgettable adventure in the heart of Africa! Explore Masai Mara National Park, meet the Big Five and experience an authentic safari. Includes luxury lodge accommodation, all meals, professional guide and 4x4 transport.", price: 2499.99, startDate: new Date("2026-07-10"), endDate: new Date("2026-07-20"), maxSlots: 12, imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=500&fit=crop" } }),
    // 2
    prisma.package.create({ data: { title: "Imersiune Culturală în Tokyo", titleEn: "Tokyo Cultural Immersion", destination: "Tokyo, Japonia", destinationEn: "Tokyo, Japan", description: "Descoperă contrastul fascinant dintre tradițional și ultramodern în capitala Japoniei. Vizitează temple antice, gustă bucătăria locală, și explorează cartierele vibrante ale Tokyo-ului. Include cazare, JR Pass și ghid bilingv.", descriptionEn: "Discover the fascinating contrast between traditional and ultra-modern in Japan's capital. Visit ancient temples, taste local cuisine and explore Tokyo's vibrant districts. Includes accommodation, JR Pass and bilingual guide.", price: 3199.99, startDate: new Date("2026-09-01"), endDate: new Date("2026-09-12"), maxSlots: 15, imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=500&fit=crop" } }),
    // 3
    prisma.package.create({ data: { title: "Croazieră pe Mediterana", titleEn: "Mediterranean Cruise", destination: "Barcelona, Spania", destinationEn: "Barcelona, Spain", description: "Navighează pe apele albastre ale Mediteranei cu opriri în Barcelona, Marsilia, Roma și Napoli. Pachetul all-inclusive oferă cabină cu balcon, toate mesele, spectacole live și excursii ghidate în fiecare port.", descriptionEn: "Sail the blue waters of the Mediterranean with stops in Barcelona, Marseille, Rome and Naples. The all-inclusive package offers a balcony cabin, all meals, live shows and guided excursions at every port.", price: 1899.99, startDate: new Date("2026-08-05"), endDate: new Date("2026-08-15"), maxSlots: 30, imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=500&fit=crop" } }),
    // 4
    prisma.package.create({ data: { title: "Aurora Boreală Norvegia", titleEn: "Northern Lights Norway", destination: "Tromsø, Norvegia", destinationEn: "Tromsø, Norway", description: "Trăiește magia aurorei boreale în nordul Norvegiei! Pachetul include cazare într-un igloo de sticlă, excursii cu sanie trasă de husky, pescuit pe gheață și vizite la satele samilor.", descriptionEn: "Experience the magic of the Northern Lights in northern Norway! Package includes accommodation in a glass igloo, husky sled rides, ice fishing and visits to Sami villages.", price: 2799.99, startDate: new Date("2026-12-01"), endDate: new Date("2026-12-08"), maxSlots: 10, imageUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=500&fit=crop" } }),
    // 5
    prisma.package.create({ data: { title: "Paradisul Tropical Bali", titleEn: "Bali Tropical Paradise", destination: "Bali, Indonezia", destinationEn: "Bali, Indonesia", description: "Relaxează-te în paradisul tropical din Bali. Vizitează temple sacre, terase cu orez, plaje cu nisip alb și jungle luxuriante. Include cazare în vilă privată cu piscină, spa, yoga și excursii cultural.", descriptionEn: "Relax in Bali's tropical paradise. Visit sacred temples, rice terraces, white sand beaches and lush jungles. Includes private villa with pool, spa, yoga and cultural excursions.", price: 1599.99, startDate: new Date("2026-10-10"), endDate: new Date("2026-10-20"), maxSlots: 18, imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=500&fit=crop" } }),
    // 6
    prisma.package.create({ data: { title: "Drumeție în Sălbăticia Patagoniei", titleEn: "Patagonia Wilderness Trek", destination: "Patagonia, Argentina", destinationEn: "Patagonia, Argentina", description: "Aventură de trekking în sălbăticia Patagoniei! Explorează ghețari masivi, lacuri turcoaz și piscuri muntoase dramatice. Include cazare, echipament de trekking, ghid de munte și toate mesele.", descriptionEn: "A trekking adventure in the Patagonian wilderness! Explore massive glaciers, turquoise lakes and dramatic mountain peaks. Includes accommodation, trekking equipment, mountain guide and all meals.", price: 3499.99, startDate: new Date("2026-11-15"), endDate: new Date("2026-11-28"), maxSlots: 8, imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop" } }),
    // 7
    prisma.package.create({ data: { title: "Dubrovnik & Coasta Dalmată", titleEn: "Dubrovnik & Dalmatian Coast", destination: "Dubrovnik, Croația", destinationEn: "Dubrovnik, Croatia", description: "Explorează perla Adriaticii și coastele sale spectaculoase. Plimbă-te pe zidurile antice ale Dubrovnikului, navighează între insule și savurează bucătăria mediteraneană. Include cazare boutique, tur ghidat și excursie cu barca.", descriptionEn: "Explore the pearl of the Adriatic and its spectacular coastlines. Walk the ancient walls of Dubrovnik, sail between islands and savour Mediterranean cuisine. Includes boutique accommodation, guided tour and boat trip.", price: 999.99, startDate: new Date("2026-07-01"), endDate: new Date("2026-07-07"), maxSlots: 25, imageUrl: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&h=500&fit=crop" } }),
    // 8
    prisma.package.create({ data: { title: "Evadare Exotică în Marrakech", titleEn: "Marrakech Exotic Escape", destination: "Marrakech, Maroc", destinationEn: "Marrakech, Morocco", description: "Cufundă-te în atmosfera magică a suq-urilor din Marrakech, vizitează palate imperiale, grădini exotice și deșertul Sahara. Inclus: riad tradițional, ghid local și excursie în deșert.", descriptionEn: "Immerse yourself in the magical atmosphere of Marrakech's souks, visit imperial palaces, exotic gardens and the Sahara desert. Includes: traditional riad, local guide and desert excursion.", price: 899.99, startDate: new Date("2026-05-10"), endDate: new Date("2026-05-17"), maxSlots: 20, imageUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&h=500&fit=crop" } }),
    // 9
    prisma.package.create({ data: { title: "Revelion la New York", titleEn: "New Year's Eve in New York", destination: "New York, SUA", destinationEn: "New York, USA", description: "Petrece Revelionul în cel mai vibrant oraș din lume! Inclus: cazare în Times Square, acces la petreceri exclusive, tur al orașului și o cină de gală.", descriptionEn: "Spend New Year's Eve in the world's most vibrant city! Includes: accommodation near Times Square, access to exclusive parties, city tour and gala dinner.", price: 3999.99, startDate: new Date("2026-12-28"), endDate: new Date("2027-01-04"), maxSlots: 15, imageUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=500&fit=crop" } }),
    // 10
    prisma.package.create({ data: { title: "Sezonul Sakura din Kyoto", titleEn: "Kyoto Sakura Season", destination: "Kyoto, Japonia", destinationEn: "Kyoto, Japan", description: "Trăiește sezonul sakura în Kyoto! Vizitează temple budiste, sanctuare shinto, alei de bambus și savurează ceremonia ceaiului. Inclus: cazare ryokan, mic dejun tradițional și ghid.", descriptionEn: "Experience the sakura season in Kyoto! Visit Buddhist temples, Shinto shrines, bamboo groves and enjoy a traditional tea ceremony. Includes: ryokan accommodation, traditional breakfast and guide.", price: 2899.99, startDate: new Date("2026-03-25"), endDate: new Date("2026-04-05"), maxSlots: 12, imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=500&fit=crop" } }),
    // 11
    prisma.package.create({ data: { title: "Islanda: Tărâmul Gheții", titleEn: "Iceland: Land of Ice", destination: "Reykjavik, Islanda", destinationEn: "Reykjavik, Iceland", description: "Explorează vulcani activi, geizeruri, cascade spectaculoase și plaje negre. Inclus: cazare, jeep tour, intrare Blue Lagoon și vânătoare de aurore boreale.", descriptionEn: "Explore active volcanoes, geysers, spectacular waterfalls and black sand beaches. Includes: accommodation, jeep tour, Blue Lagoon entry and Northern Lights hunting.", price: 2199.99, startDate: new Date("2026-11-01"), endDate: new Date("2026-11-10"), maxSlots: 14, imageUrl: "https://images.unsplash.com/photo-1474690870753-1b92efa1f2d8?w=800&h=500&fit=crop" } }),
    // 12
    prisma.package.create({ data: { title: "Serenitate în Maldive", titleEn: "Maldives Serenity", destination: "Malé, Maldive", destinationEn: "Malé, Maldives", description: "Evadarea perfectă — vile pe apă, lagune turcoaz și recife de corali magnifice. Include acces nelimitat la snorkeling, spa și mese la restaurantul cu podea din sticlă.", descriptionEn: "The perfect escape — overwater villas, turquoise lagoons and magnificent coral reefs. Includes unlimited snorkeling, spa access and meals at the glass-floor restaurant.", price: 4999.99, startDate: new Date("2026-02-14"), endDate: new Date("2026-02-24"), maxSlots: 10, imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=500&fit=crop" } }),
    // 13
    prisma.package.create({ data: { title: "Safari în Tanzania", titleEn: "Tanzania Safari", destination: "Arusha, Tanzania", destinationEn: "Arusha, Tanzania", description: "Urmărește Marea Migrație în Serengeti și admiră Ngorongoro. Inclus: lodge-uri eco, toate mesele, safari zilnic și vizita unui sat Maasai.", descriptionEn: "Witness the Great Migration in Serengeti and marvel at Ngorongoro Crater. Includes: eco lodges, all meals, daily safari and Maasai village visit.", price: 3299.99, startDate: new Date("2026-07-20"), endDate: new Date("2026-07-31"), maxSlots: 10, imageUrl: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=500&fit=crop" } }),
    // 14 — Vienna fixed image
    prisma.package.create({ data: { title: "Viena & Salzburg Cultural", titleEn: "Vienna & Salzburg Cultural", destination: "Viena, Austria", destinationEn: "Vienna, Austria", description: "Descoperă arhitectura barocă, operele clasice și prăjiturile vieneze. Excursie inclusă la Salzburg, orașul lui Mozart, palatele imperiale și turul orașului vechi.", descriptionEn: "Discover Baroque architecture, classic operas and Viennese pastries. Included excursion to Salzburg, Mozart's city, imperial palaces and old town tour.", price: 1199.99, startDate: new Date("2026-10-01"), endDate: new Date("2026-10-08"), maxSlots: 22, imageUrl: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=500&fit=crop" } }),
    // 15
    prisma.package.create({ data: { title: "Drumeție Machu Picchu, Peru", titleEn: "Peru & Machu Picchu Trek", destination: "Cusco, Peru", destinationEn: "Cusco, Peru", description: "Parcurge Traseul Inca până la cetatea din nori Machu Picchu. Include aclimatizare în Cusco, traseu ghidat 4 zile, mese și cazare în camping de lux.", descriptionEn: "Trek the Inca Trail to the cloud citadel of Machu Picchu. Includes acclimatization in Cusco, 4-day guided trail, meals and luxury camping accommodation.", price: 3199.99, startDate: new Date("2026-08-20"), endDate: new Date("2026-09-01"), maxSlots: 10, imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&h=500&fit=crop" } }),
    // 16
    prisma.package.create({ data: { title: "Praga de Basm", titleEn: "Fairy-Tale Prague", destination: "Praga, Cehia", destinationEn: "Prague, Czech Republic", description: "Plimbă-te pe străduțele medievale ale Pragăi, vizitează Castelul, Podul Carol și Piața Orașului Vechi. Inclus: cazare boutique, tur ghidat și degustare de bere cehă.", descriptionEn: "Walk the medieval streets of Prague, visit the Castle, Charles Bridge and Old Town Square. Includes: boutique accommodation, guided tour and Czech beer tasting.", price: 799.99, startDate: new Date("2026-05-25"), endDate: new Date("2026-06-01"), maxSlots: 25, imageUrl: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=500&fit=crop" } }),
    // 17
    prisma.package.create({ data: { title: "Creta: Perla Mediteranei", titleEn: "Crete: Pearl of the Mediterranean", destination: "Heraklion, Grecia", destinationEn: "Heraklion, Greece", description: "Explorează ruinele minoice de la Knossos, defileul Samaria și plajele turcoaz din Elafonisi. Include resort 5 stele, all-inclusive, închiriere mașină și tur cultural.", descriptionEn: "Explore the Minoan ruins of Knossos, Samaria Gorge and turquoise Elafonisi beaches. Includes 5-star all-inclusive resort, car rental and cultural tour.", price: 1499.99, startDate: new Date("2026-06-25"), endDate: new Date("2026-07-05"), maxSlots: 20, imageUrl: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&h=500&fit=crop" } }),
    // 18
    prisma.package.create({ data: { title: "Lux și Deșert în Dubai", titleEn: "Dubai Luxury & Desert", destination: "Dubai, EAU", destinationEn: "Dubai, UAE", description: "Trăiește luxul absolut în Dubai — cumpărături în mall-urile de lux, safari în deșert, cina la Burj Khalifa și o croazieră pe Dubai Creek.", descriptionEn: "Experience ultimate luxury in Dubai — shopping in designer malls, desert safari, dinner at the Burj Khalifa and a cruise on Dubai Creek.", price: 2599.99, startDate: new Date("2026-01-15"), endDate: new Date("2026-01-23"), maxSlots: 18, imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=500&fit=crop" } }),
    // 19
    prisma.package.create({ data: { title: "Lisabona & Coasta Algarve", titleEn: "Lisbon & Algarve Coast", destination: "Lisabona, Portugalia", destinationEn: "Lisbon, Portugal", description: "Descoperă farmecul Lisabonei cu tramvaiurile istorice, fado autentic și pastéis de nata. Excursie pe coasta Algarve cu faleze spectaculoase și plaje ascunse.", descriptionEn: "Discover the charm of Lisbon with its historic trams, authentic fado music and pastéis de nata. Day trip to the Algarve coast with spectacular cliffs and hidden beaches.", price: 1099.99, startDate: new Date("2026-09-15"), endDate: new Date("2026-09-23"), maxSlots: 22, imageUrl: "https://images.unsplash.com/photo-1513735492246-483525079686?w=800&h=500&fit=crop" } }),
    // 20
    prisma.package.create({ data: { title: "Filipine: Insulele Paradis", titleEn: "Philippines: Paradise Islands", destination: "Palawan, Filipine", destinationEn: "Palawan, Philippines", description: "Explorează lagunele ascunse din Palawan, snorkeling printre recifele colorate și relaxare pe plajele cu nisip alb virgin. Include resort eco-friendly și toate activitățile pe apă.", descriptionEn: "Explore Palawan's hidden lagoons, snorkel among colourful reefs and relax on pristine white sand beaches. Includes eco-friendly resort and all water activities.", price: 2199.99, startDate: new Date("2026-03-10"), endDate: new Date("2026-03-20"), maxSlots: 14, imageUrl: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&h=500&fit=crop" } }),
    // 21
    prisma.package.create({ data: { title: "Coasta Amalfi & Capri", titleEn: "Amalfi Coast & Capri", destination: "Napoli, Italia", destinationEn: "Naples, Italy", description: "Navighează pe Coasta Amalfi, vizitează insula Capri și Grotta Azzurra, guști pizza napolitana autentică și vinuri locale. Include ferry, cazare și tur ghidat al siturilor UNESCO.", descriptionEn: "Sail along the Amalfi Coast, visit Capri island and the Blue Grotto, taste authentic Neapolitan pizza and local wines. Includes ferry, accommodation and guided tour of UNESCO sites.", price: 1799.99, startDate: new Date("2026-09-05"), endDate: new Date("2026-09-14"), maxSlots: 18, imageUrl: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&h=500&fit=crop" } }),
    // 22
    prisma.package.create({ data: { title: "Sri Lanka: Insula Minunilor", titleEn: "Sri Lanka: Island of Wonders", destination: "Colombo, Sri Lanka", destinationEn: "Colombo, Sri Lanka", description: "Explorează templele budiste, plantațiile de ceai din munți, elefanți în sălbăticie și plajele line ale Oceanului Indian. Inclus: transport intern, ghid și cazare boutique.", descriptionEn: "Explore Buddhist temples, mountain tea plantations, wild elephants and the gentle shores of the Indian Ocean. Includes: internal transport, guide and boutique accommodation.", price: 1899.99, startDate: new Date("2026-02-01"), endDate: new Date("2026-02-12"), maxSlots: 16, imageUrl: "https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&h=500&fit=crop" } }),
    // 23
    prisma.package.create({ data: { title: "Revelion în Sydney", titleEn: "New Year's Eve in Sydney", destination: "Sydney, Australia", destinationEn: "Sydney, Australia", description: "Celebrează Revelionul sub artificiile legendare ale Sydney Opera House! Include cazare cu vedere la port, petrecere de Revelion, tur al orașului și excursie la Bondi Beach.", descriptionEn: "Celebrate New Year's Eve under the legendary fireworks at the Sydney Opera House! Includes harbour-view accommodation, New Year's party, city tour and Bondi Beach excursion.", price: 4499.99, startDate: new Date("2026-12-27"), endDate: new Date("2027-01-05"), maxSlots: 12, imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop" } }),
    // 24
    prisma.package.create({ data: { title: "Egipt: Faraoni & Nisip", titleEn: "Egypt: Pharaohs & Sand", destination: "Cairo, Egipt", destinationEn: "Cairo, Egypt", description: "Vizitează Piramidele din Giza și Sfinxul, navighează pe Nil până la Luxor și Valley of the Kings. Inclus: croazieră pe Nil 4 zile, cazare 5 stele și ghid egiptolog.", descriptionEn: "Visit the Pyramids of Giza and the Sphinx, cruise the Nile to Luxor and the Valley of the Kings. Includes: 4-day Nile cruise, 5-star accommodation and Egyptologist guide.", price: 1699.99, startDate: new Date("2026-10-20"), endDate: new Date("2026-10-31"), maxSlots: 20, imageUrl: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&h=500&fit=crop" } }),
    // 25
    prisma.package.create({ data: { title: "Irlanda: Stâncile Moher", titleEn: "Ireland: Cliffs of Moher", destination: "Dublin, Irlanda", destinationEn: "Dublin, Ireland", description: "Descoperă verdele magic al Irlandei — cliffurile dramatice, castele medievale, pub-uri cu muzică tradițională și whiskey artizanal. Include car hire și cazare în country house.", descriptionEn: "Discover Ireland's magic green — dramatic cliffs, medieval castles, pubs with traditional music and artisan whiskey. Includes car hire and country house accommodation.", price: 1399.99, startDate: new Date("2026-06-10"), endDate: new Date("2026-06-18"), maxSlots: 18, imageUrl: "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800&h=500&fit=crop" } }),
    // 26
    prisma.package.create({ data: { title: "Phuket & Insulele Phi Phi", titleEn: "Phuket & Phi Phi Islands", destination: "Phuket, Tailanda", destinationEn: "Phuket, Thailand", description: "Descoperă plajele paradisiace din Phuket și insulele Phi Phi, încearcă mâncarea stradală autentică, masaj thai tradițional și activități de watersport la cel mai înalt nivel.", descriptionEn: "Discover the paradisiacal beaches of Phuket and the Phi Phi Islands, try authentic street food, traditional Thai massage and top-level watersports.", price: 1349.99, startDate: new Date("2026-11-20"), endDate: new Date("2026-11-30"), maxSlots: 22, imageUrl: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=500&fit=crop" } }),
    // 27 — Galapagos fixed image
    prisma.package.create({ data: { title: "Expediție în sălbăticia din Galapagos", titleEn: "Galapagos Wildlife Expedition", destination: "Santa Cruz, Ecuador", destinationEn: "Santa Cruz, Ecuador", description: "Explorează arhipelagul unic al Galapagos — navighezi între insule, înoți cu lei de mare, observi broaște țestoase gigantice și iguane marine unice în lume.", descriptionEn: "Explore the unique Galapagos archipelago — sail between islands, swim with sea lions, observe giant tortoises and marine iguanas found nowhere else on Earth.", price: 5499.99, startDate: new Date("2026-08-01"), endDate: new Date("2026-08-14"), maxSlots: 8, imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=500&fit=crop" } }),
    // 28
    prisma.package.create({ data: { title: "Pura Vida Costa Rica", titleEn: "Pura Vida Costa Rica", destination: "San Jose, Costa Rica", destinationEn: "San Jose, Costa Rica", description: "Vacanță eco în cele mai frumoase rezervații ale lumii. Explorează jungla, vulcanii și cascadele magice.", descriptionEn: "Eco holiday in the world's most beautiful reserves. Explore the jungle, volcanoes and magical waterfalls.", price: 1899.99, startDate: new Date("2026-10-10"), endDate: new Date("2026-10-20"), maxSlots: 15, imageUrl: "https://picsum.photos/seed/costarica/800/500" } }),
    // 29
    prisma.package.create({ data: { title: "Explorator în Cape Town", titleEn: "Cape Town Explorer", destination: "Cape Town, Africa de Sud", destinationEn: "Cape Town, South Africa", description: "Admiră Table Mountain, priveliștea oceanului și coloniile de pinguini pe Plaja Boulders.", descriptionEn: "Admire Table Mountain, ocean views, and the penguin colonies at Boulders Beach.", price: 2199.99, startDate: new Date("2026-11-05"), endDate: new Date("2026-11-15"), maxSlots: 20, imageUrl: "https://picsum.photos/seed/capetown/800/500" } }),
    // 30
    prisma.package.create({ data: { title: "Magia Ha Long Bay", titleEn: "Magic of Ha Long Bay", destination: "Hanoi, Vietnam", destinationEn: "Hanoi, Vietnam", description: "Croazieră printre mii de insule calcaroase în Ha Long Bay, cu peșteri secrete și sate plutitoare.", descriptionEn: "Cruise among thousands of limestone islands in Ha Long Bay, with secret caves and floating villages.", price: 1599.99, startDate: new Date("2026-04-10"), endDate: new Date("2026-04-20"), maxSlots: 25, imageUrl: "https://picsum.photos/seed/halong/800/500" } }),
    // 31
    prisma.package.create({ data: { title: "Carnaval la Rio", titleEn: "Carnival in Rio", destination: "Rio de Janeiro, Brazilia", destinationEn: "Rio de Janeiro, Brazil", description: "Bucură-te de energia efervescentă a Carnavalului, plajele Copacabana și statuia Cristo Redentor.", descriptionEn: "Enjoy the effervescent energy of Carnival, Copacabana beaches and Christ the Redeemer statue.", price: 2899.99, startDate: new Date("2026-02-10"), endDate: new Date("2026-02-20"), maxSlots: 10, imageUrl: "https://picsum.photos/seed/rio/800/500" } }),
    // 32
    prisma.package.create({ data: { title: "Aloha Hawaii", titleEn: "Aloha Hawaii", destination: "Honolulu, SUA", destinationEn: "Honolulu, USA", description: "Serenitate pe plaje aurii, lecții de surf, vulcani activi și tradiții polineziene.", descriptionEn: "Serenity on golden beaches, surfing lessons, active volcanoes and Polynesian traditions.", price: 3499.99, startDate: new Date("2026-07-05"), endDate: new Date("2026-07-15"), maxSlots: 15, imageUrl: "https://picsum.photos/seed/hawaii/800/500" } }),
    // 33
    prisma.package.create({ data: { title: "Aventură în Noua Zeelandă", titleEn: "New Zealand Adventure", destination: "Queenstown, Noua Zeelandă", destinationEn: "Queenstown, New Zealand", description: "Fiorul adrenalinei în capitala mondială a aventurii, printre fiorduri magnifice și natură sălbatică.", descriptionEn: "Thrill of adrenaline in the adventure capital of the world, among magnificent fjords and wild nature.", price: 4199.99, startDate: new Date("2026-01-15"), endDate: new Date("2026-01-28"), maxSlots: 12, imageUrl: "https://picsum.photos/seed/zealand/800/500" } }),
    // 34
    prisma.package.create({ data: { title: "Misterele din Petra", titleEn: "Mysteries of Petra", destination: "Amman, Iordania", destinationEn: "Amman, Jordan", description: "Explorează Orașul Roz sculptat în piatră și trăiește experiența de a pluti în Marea Moartă.", descriptionEn: "Explore the Rose City carved into stone and experience floating in the Dead Sea.", price: 1699.99, startDate: new Date("2026-03-20"), endDate: new Date("2026-03-27"), maxSlots: 20, imageUrl: "https://picsum.photos/seed/petra/800/500" } }),
    // 35
    prisma.package.create({ data: { title: "Banff Explorer", titleEn: "Banff Explorer", destination: "Banff, Canada", destinationEn: "Banff, Canada", description: "Admiră vârfurile înzăpezite și lacurile glaciare turcoaz, în inima spectaculoșilor Munți Stâncoși.", descriptionEn: "Admire snowy peaks and turquoise glacial lakes in the heart of the spectacular Rocky Mountains.", price: 2599.99, startDate: new Date("2026-06-10"), endDate: new Date("2026-06-20"), maxSlots: 14, imageUrl: "https://picsum.photos/seed/banff/800/500" } }),
    // 36
    prisma.package.create({ data: { title: "Lună de Miere în Bora Bora", titleEn: "Bora Bora Honeymoon", destination: "Bora Bora, Polinezia", destinationEn: "Bora Bora, Polynesia", description: "Destinația supremă de relaxare — vile pe apă deasupra unei lagune hipnotizante.", descriptionEn: "The ultimate relaxation destination — overwater villas above a mesmerizing lagoon.", price: 6999.99, startDate: new Date("2026-08-01"), endDate: new Date("2026-08-10"), maxSlots: 6, imageUrl: "https://picsum.photos/seed/borabora/800/500" } }),
    // 37
    prisma.package.create({ data: { title: "Magia din Istanbul", titleEn: "Istanbul Magic", destination: "Istanbul, Turcia", destinationEn: "Istanbul, Turkey", description: "Punctul de întâlnire dintre Europa și Asia. Vizitează Moscheea Albastră și Bazarul Mare.", descriptionEn: "The meeting point of Europe and Asia. Visit the Blue Mosque and the Grand Bazaar.", price: 799.99, startDate: new Date("2026-05-15"), endDate: new Date("2026-05-20"), maxSlots: 30, imageUrl: "https://picsum.photos/seed/istanbul/800/500" } }),
    // 38
    prisma.package.create({ data: { title: "Highlands Scoțiene", titleEn: "Scottish Highlands", destination: "Edinburgh, Scoția", destinationEn: "Edinburgh, Scotland", description: "Castele misterioase, lacuri legendare și degustări fine de scotch într-un peisaj feeric.", descriptionEn: "Mysterious castles, legendary lochs and fine scotch tastings in a magical landscape.", price: 1899.99, startDate: new Date("2026-09-01"), endDate: new Date("2026-09-10"), maxSlots: 18, imageUrl: "https://picsum.photos/seed/scotland/800/500" } }),
    // 39
    prisma.package.create({ data: { title: "Schi în Alpii Elvețieni", titleEn: "Swiss Alps Ski", destination: "Zermatt, Elveția", destinationEn: "Zermatt, Switzerland", description: "Pârtii impecabile, aer alpin clar și majestuosul Matterhorn chiar în fața ta.", descriptionEn: "Impeccable slopes, crisp alpine air and the majestic Matterhorn right in front of you.", price: 2799.99, startDate: new Date("2026-01-20"), endDate: new Date("2026-01-30"), maxSlots: 10, imageUrl: "https://picsum.photos/seed/zermatt/800/500" } }),
    // 40
    prisma.package.create({ data: { title: "Scufundări în Belize", titleEn: "Belize Diving", destination: "Belize City, Belize", destinationEn: "Belize City, Belize", description: "Scufundă-te în Marele Blue Hole și admiră al doilea cel mai mare recif de corali din lume.", descriptionEn: "Dive in the Great Blue Hole and admire the world's second largest coral reef.", price: 2399.99, startDate: new Date("2026-03-05"), endDate: new Date("2026-03-15"), maxSlots: 16, imageUrl: "https://picsum.photos/seed/belize/800/500" } }),
    // 41
    prisma.package.create({ data: { title: "Ruinele din Tulum", titleEn: "Tulum Ruins", destination: "Tulum, Mexic", destinationEn: "Tulum, Mexico", description: "Relaxează-te pe plaje caraibiene, explorează ruine mayașe și înoată în cenote cristaline.", descriptionEn: "Relax on Caribbean beaches, explore Mayan ruins and swim in crystal clear cenotes.", price: 1999.99, startDate: new Date("2026-11-15"), endDate: new Date("2026-11-25"), maxSlots: 22, imageUrl: "https://picsum.photos/seed/tulum/800/500" } }),
    // 42
    prisma.package.create({ data: { title: "Evadare în Fiji", titleEn: "Fiji Escape", destination: "Nadi, Fiji", destinationEn: "Nadi, Fiji", description: "Evadează pe o insulă privată — palmieri, apă limpede, ospitalitate locală și kava.", descriptionEn: "Escape to a private island — palm trees, clear water, local hospitality and kava.", price: 3899.99, startDate: new Date("2026-07-20"), endDate: new Date("2026-07-30"), maxSlots: 12, imageUrl: "https://picsum.photos/seed/fiji/800/500" } }),
    // 43
    prisma.package.create({ data: { title: "Minunatele temple din India", titleEn: "Wonderful Temples in India", destination: "Jaipur, India", destinationEn: "Jaipur, India", description: "Turul faimosului Triunghi de Aur, cu Taj Mahal și fortărețele impresionante din Rajasthan.", descriptionEn: "Tour the famous Golden Triangle, featuring the Taj Mahal and impressive Rajasthani forts.", price: 1599.99, startDate: new Date("2026-02-15"), endDate: new Date("2026-02-28"), maxSlots: 25, imageUrl: "https://picsum.photos/seed/india/800/500" } }),
    // 44
    prisma.package.create({ data: { title: "Paradis în Seychelles", titleEn: "Paradise in Seychelles", destination: "Mahé, Seychelles", destinationEn: "Mahé, Seychelles", description: "Cele mai fotografiate plaje din lume! Nisip imaculat, stânci uriașe rotunjite și apă de jad.", descriptionEn: "The most photographed beaches in the world! Immaculate sand, giant rounded boulders and jade water.", price: 4299.99, startDate: new Date("2026-04-05"), endDate: new Date("2026-04-15"), maxSlots: 14, imageUrl: "https://picsum.photos/seed/seychelles/800/500" } }),
    // 45
    prisma.package.create({ data: { title: "Marele Canion", titleEn: "Grand Canyon", destination: "Arizona, SUA", destinationEn: "Arizona, USA", description: "Un tur cu elicopterul, drumeții excepționale și peisaje sălbatice fără egal.", descriptionEn: "A helicopter tour, outstanding hiking and unparalleled wild scenery.", price: 2399.99, startDate: new Date("2026-06-25"), endDate: new Date("2026-07-02"), maxSlots: 18, imageUrl: "https://picsum.photos/seed/canyon/800/500" } }),
    // 46
    prisma.package.create({ data: { title: "Deșertul Atacama", titleEn: "Atacama Desert", destination: "San Pedro de Atacama, Chile", destinationEn: "San Pedro de Atacama, Chile", description: "Observă cel mai senin cer nocturn din lume într-un deisaj asemănător cu planeta Marte.", descriptionEn: "Observe the clearest night sky in the world in a landscape resembling planet Mars.", price: 2699.99, startDate: new Date("2026-09-12"), endDate: new Date("2026-09-22"), maxSlots: 10, imageUrl: "https://picsum.photos/seed/atacama/800/500" } }),
    // 47
    prisma.package.create({ data: { title: "Aleea Baobabilor", titleEn: "Avenue of the Baobabs", destination: "Morondava, Madagascar", destinationEn: "Morondava, Madagascar", description: "Descoperă flora unică și arborii giganți milenari în inima Madagascarului.", descriptionEn: "Discover the unique flora and giant millennial trees in the heart of Madagascar.", price: 2999.99, startDate: new Date("2026-10-01"), endDate: new Date("2026-10-14"), maxSlots: 12, imageUrl: "https://picsum.photos/seed/baobabs/800/500" } }),
  ]);

  // ─── 33 reservations spread across 30 days with all 30 users ─────────────────
  const dAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };

  const reservationData: Array<{ userIdx: number; pkgIdx: number; people: number; status: string; day: number }> = [];

  // Generate 103 reservations randomly across ALL 48 packages mapping to all 30 clients over the last 180 days
  for (let i = 0; i < 103; i++) {
    reservationData.push({
      userIdx: Math.floor(Math.random() * 30),
      pkgIdx: Math.floor(Math.random() * 48),  // 0 to 47
      people: Math.floor(Math.random() * 4) + 1,
      status: Math.random() > 0.8 ? (Math.random() > 0.5 ? "PENDING" : "CANCELLED") : "CONFIRMED",
      day: Math.floor(Math.random() * 180) + 1,
    });
  }

  for (const r of reservationData) {
    const pkg = packages[r.pkgIdx];
    await prisma.reservation.create({
      data: {
        userId:        users[r.userIdx].id,
        packageId:     pkg.id,
        numberOfPeople: r.people,
        totalPrice:    parseFloat((pkg.price * r.people).toFixed(2)),
        status:        r.status,
        createdAt:     dAgo(r.day),
      },
    });
  }

  console.log(" Database seeded successfully!");
  console.log(`   - ${await prisma.user.count()} users (1 admin + 30 clients)`);
  console.log(`   - ${await prisma.package.count()} packages`);
  console.log(`   - ${await prisma.reservation.count()} reservations`);
  console.log("");
  console.log(" Admin: admin@travelpack.ro / admin123");
  console.log(" Any client: [firstname].[lastname]@example.com / user123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
