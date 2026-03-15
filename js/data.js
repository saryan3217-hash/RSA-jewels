/* ============================================================
   KANAK SHRI JEWELLERS — data.js
   Static content data only.
   Products are now loaded live from Firestore.
   ============================================================ */

/* ── Firebase Config ── */
const firebaseConfig = {
  apiKey:            "AIzaSyAYwgC31LBH5PZSdFm6Jb2HpgmFXUSjJ1o",
  authDomain:        "jewels-for-everyone.firebaseapp.com",
  projectId:         "jewels-for-everyone",
  storageBucket:     "jewels-for-everyone.firebasestorage.app",
  messagingSenderId: "952172810507",
  appId:             "1:952172810507:web:4fc4364a92c55c3f1b520e",
  measurementId:     "G-1C1L4RT399"
};

/* ── Featured carousel ── */
const FD = [
  {name:'Bridal Heritage Set',    price:'₹3,45,000', tag:'Bridal',   img:'images/set1.jpg'},
  {name:'Solitaire Diamond Ring', price:'₹2,10,000', tag:'Premium',  img:'images/dring1.jpg'},
  {name:'Kundan Necklace',        price:'₹78,000',   tag:'Trending', img:'images/neck1.jpg'},
  {name:'Polki Earring Set',      price:'₹92,000',   tag:'Festive',  img:'images/set2.jpg'},
  {name:'Gold Temple Bangles',    price:'₹58,000',   tag:'Classic',  img:'images/ban1.jpg'},
  {name:'Tennis Bracelet',        price:'₹1,75,000', tag:'Luxury',   img:'images/neck1.jpg'},
];

/* ── Category grid ── */
const CD = {
  gold:[
    {name:'Bridal Sets',  count:24, img:'images/set1.jpg'},
    {name:'Bangles',      count:41, img:'images/ban1.jpg'},
    {name:'Necklaces',    count:38, img:'images/neck1.jpg'},
    {name:'Earrings',     count:56, img:'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&auto=format&fit=crop'},
    {name:'Rings',        count:29, img:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&auto=format&fit=crop'},
    {name:'Chains',       count:18, img:'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&auto=format&fit=crop'},
  ],
  diamond:[
    {name:'Solitaire Rings', count:15, img:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&auto=format&fit=crop'},
    {name:'Pendant Sets',    count:22, img:'images/neck1.jpg'},
    {name:'Stud Earrings',   count:31, img:'images/set2.jpg'},
    {name:'Bracelets',       count:12, img:'images/neck1.jpg'},
    {name:'Maang Tikka',     count:8,  img:'images/set1.jpg'},
    {name:'Bangles',         count:14, img:'images/ban1.jpg'},
  ],
  silver:[
    {name:'Anklets',        count:28, img:'images/pl1.jpg'},
    {name:'Oxidized Sets',  count:19, img:'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&auto=format&fit=crop'},
    {name:'Pooja Articles', count:35, img:'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&auto=format&fit=crop'},
    {name:'Gift Items',     count:22, img:'images/set1.jpg'},
  ],
};

/* ── Gallery ── */
const GALLERY = [
  'images/ban1.jpg',
  'images/dring1.jpg',
  'images/set2.jpg',
  'images/neck4.jpg',
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&auto=format&fit=crop',
  'images/ring1.jpg',
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop',
];

/* ── Testimonials ── */
const TESTIMONIALS = [
  {name:'Priya Sharma',   loc:'Indore', stars:5, text:'The bridal set I ordered for my wedding was breathtaking. Every guest complimented the craftsmanship. Kanak Shri truly understands what luxury means.'},
  {name:'Rajan Mehta',    loc:'Bhopal', stars:5, text:'Bought a diamond ring for our anniversary. The quality and personal service was exceptional. Worth every rupee.'},
  {name:'Sunita Agarwal', loc:'Ujjain', stars:5, text:'Three generations of my family trust Kanak Shri. The gold bangles are authentic and beautifully crafted. Highly recommend!'},
  {name:'Kavita Patel',   loc:'Mumbai', stars:4, text:'Ordered the Kundan choker set online. Packaging was exquisite, arrived safely and looked even better in person.'},
  {name:'Deepak Joshi',   loc:'Indore', stars:5, text:'The most trustworthy jeweller I know. BIS hallmark, transparent pricing, and stunning designs. My go-to for all occasions.'},
  {name:'Anita Verma',    loc:'Nagpur', stars:5, text:'The bridal consultation service helped me choose the perfect set within my budget. The staff was patient and knowledgeable.'},
];

/* ── Heritage timeline ── */
const TIMELINE = [
  {year:'1978', icon:'fa-gem',     desc:'Founded by Shri Rameshwar Lal in the heart of Indore\'s Sarafa Bazaar.'},
  {year:'1994', icon:'fa-award',   desc:'Received BIS Hallmark certification — one of the first in the region.'},
  {year:'2006', icon:'fa-store',   desc:'Expanded to a 3,000 sq ft showroom with dedicated bridal and diamond sections.'},
  {year:'2015', icon:'fa-diamond', desc:'Launched our in-house diamond collection — polished and curated in-store.'},
  {year:'2020', icon:'fa-globe',   desc:'Went digital with online catalogue and WhatsApp-based order service.'},
  {year:'2024', icon:'fa-star',    desc:'Crossed 10,000+ happy customers and celebrated 46 years of craftsmanship.'},
];

/* ── Product variants ── */
const VARIANTS = {
  ring:     ['Size 5','Size 6','Size 7','Size 8','Size 9'],
  bangle:   ['2.2 inch','2.4 inch','2.6 inch','2.8 inch'],
  chain:    ['16 inch','18 inch','20 inch','22 inch','24 inch'],
  necklace: ['Short (16")','Standard (18")','Long (20")'],
  bracelet: ['6 inch','6.5 inch','7 inch','7.5 inch'],
  default:  ['Standard'],
};

/* ── Dummy reviews shown in product popup ── */
const REVIEWS = [
  {stars:5, text:'"Absolutely beautiful! The craftsmanship is superb."',    author:'Anjali S., Indore'},
  {stars:5, text:'"Pure gold, perfect weight. Exactly as described."',       author:'Meena K., Bhopal'},
  {stars:4, text:'"Stunning piece. Delivery was prompt and well packaged."', author:'Rohit V., Nagpur'},
];
