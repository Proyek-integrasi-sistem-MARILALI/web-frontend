import tirtaEmpulImg from "../assets/locations/tirta-empul.png";
import tanahLotImg from "../assets/locations/tanah-lot.jpg";
import nusaPenidaImg from "../assets/locations/nusa-penida.jpg";
import lovinaBeachImg from "../assets/locations/lovina-beach.jpg";

const locations = [
  {
    id: "1",
    name: "Tirta Empul",
    city: "Ubud",
    price: "Rp 100.000 - Rp 1.000.000",
    image: tirtaEmpulImg,
    rating: 4,
    weather: "Cloudy",
    description: `
Tirta Empul adalah pura suci yang terkenal dengan mata air
sucinya di Bali. Tempat ini menjadi destinasi spiritual
dan wisata budaya yang populer.

Pengunjung dapat mengikuti ritual melukat
sebagai proses penyucian diri.
`,
  },
  {
    id: "2",
    name: "Tanah Lot",
    city: "Tabanan",
    price: "Rp 60.000 - Rp 300.000",
    image: tanahLotImg,
    rating: 5,
    weather: "Sunny",
    description: `
Tanah Lot adalah ikon wisata Bali yang terkenal
dengan pura di atas batu karang besar di tengah laut.

Tempat terbaik untuk menikmati sunset di Bali.
`,
  },
  {
    id: "3",
    name: "Nusa Penida",
    city: "Klungkung",
    price: "Rp 200.000 - Rp 1.500.000",
    image: nusaPenidaImg,
    rating: 5,
    weather: "Sunny",
    description: `
Nusa Penida menawarkan pantai eksotis,
tebing tinggi, dan laut biru jernih.

Cocok untuk petualangan dan fotografi alam.
`,
  },
    {
    id: "4",
    name: "Lovina Beach",
    city: "Buleleng",
    price: "Rp 200.000 - Rp 1.500.000",
    image: lovinaBeachImg,
    rating: 5,
    weather: "Sunny",
    description: `
Nusa Penida menawarkan pantai eksotis,
tebing tinggi, dan laut biru jernih.

Cocok untuk petualangan dan fotografi alam.
`,
  },

];

export default locations;
