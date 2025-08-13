// Add/expand this list anytime. Slugs become your URLs.
const buildings = [
  // --- existing ---
  { id:"b_lunt",     slug:"1154-w-lunt",             name:"1154 W Lunt",               hood:"Rogers Park",          address:{ street:"1154 W Lunt Ave",        city:"Chicago" } },
  { id:"b_winnemac", slug:"1340-1342-w-winnemac",    name:"1340–1342 W Winnemac",     hood:"Uptown/Andersonville", address:{ street:"1340 W Winnemac Ave",    city:"Chicago" } },
  { id:"b_fargo",    slug:"1535-1557-w-fargo",       name:"1535–1557 W Fargo",         hood:"Rogers Park",          address:{ street:"1535 W Fargo Ave",       city:"Chicago" } },
  { id:"b_damen",    slug:"4818-n-damen",            name:"4818 N Damen",              hood:"Lincoln Square",       address:{ street:"4818 N Damen Ave",       city:"Chicago" } },
  { id:"b_newport",  slug:"1200-1204-w-newport",     name:"1200–1204 W Newport",       hood:"Lakeview",             address:{ street:"1200 W Newport Ave",     city:"Chicago" } },
  { id:"b_racine",   slug:"3436-3442-n-racine",      name:"3436–3442 N Racine",        hood:"Lakeview",             address:{ street:"3436 N Racine Ave",      city:"Chicago" } },
  { id:"b_2344_w_24th_pl",  slug:"2344-w-24th-pl",   name:"2344 W 24th Pl",            hood:"Pilsen",               address:{ street:"2344 W 24th Pl",         city:"Chicago" } },
  { id:"b_2346_w_24th_pl",  slug:"2346-w-24th-pl",   name:"2346 W 24th Pl",            hood:"Pilsen",               address:{ street:"2346 W 24th Pl",         city:"Chicago" } },
  { id:"b_7010_n_ashland",  slug:"7010-n-ashland-ave",name:"7010 N Ashland",           hood:"Rogers Park",          address:{ street:"7010 N Ashland Ave",     city:"Chicago" } },
  { id:"b_2827_n_cambridge",slug:"2827-n-cambridge-ave",name:"2827 N Cambridge",       hood:"Lakeview",             address:{ street:"2827 N Cambridge Ave",   city:"Chicago" } },
  { id:"b_1241_w_chase",    slug:"1241-w-chase-ave", name:"1241 W Chase",              hood:"Rogers Park",          address:{ street:"1241 W Chase Ave",       city:"Chicago" } },
  { id:"b_1535_w_fargo",    slug:"1535-w-fargo-ave", name:"1535 W Fargo",              hood:"Rogers Park",          address:{ street:"1535 W Fargo Ave",       city:"Chicago" } },
  { id:"b_1537_w_fargo",    slug:"1537-w-fargo-ave", name:"1537 W Fargo",              hood:"Rogers Park",          address:{ street:"1537 W Fargo Ave",       city:"Chicago" } },
  { id:"b_1541_w_fargo",    slug:"1541-w-fargo-ave", name:"1541 W Fargo",              hood:"Rogers Park",          address:{ street:"1541 W Fargo Ave",       city:"Chicago" } },
  { id:"b_2020_w_farwell",  slug:"2020-w-farwell-ave",name:"2020 W Farwell",           hood:"Rogers Park",          address:{ street:"2020 W Farwell Ave",     city:"Chicago" } },
  { id:"b_5206_s_harper",   slug:"5206-s-harper-ave",name:"5206 S Harper",             hood:"Hyde Park",            address:{ street:"5206 S Harper Ave",      city:"Chicago" } },
  { id:"b_1441_w_howard",   slug:"1441-w-howard-st", name:"1441 W Howard",             hood:"Rogers Park",          address:{ street:"1441 W Howard St",       city:"Chicago" } },
  { id:"b_2061_n_hoyne",    slug:"2061-n-hoyne-ave", name:"2061 N Hoyne",              hood:"Bucktown",             address:{ street:"2061 N Hoyne Ave",       city:"Chicago" } },
  { id:"b_3814_n_kedzie",   slug:"3814-n-kedzie-ave",name:"3814 N Kedzie",             hood:"Irving Park",          address:{ street:"3814 N Kedzie Ave",      city:"Chicago" } },
  { id:"b_6639_n_newgard",  slug:"6639-n-newgard-ave",name:"6639 N Newgard",           hood:"Rogers Park",          address:{ street:"6639 N Newgard Ave",     city:"Chicago" } },
  { id:"b_6653_n_newgard",  slug:"6653-n-newgard-ave",name:"6653 N Newgard",           hood:"Rogers Park",          address:{ street:"6653 N Newgard Ave",     city:"Chicago" } },
  { id:"b_1142_w_pratt",    slug:"1142-w-pratt",     name:"1142 W Pratt",              hood:"Rogers Park",          address:{ street:"1142 W Pratt Blvd",      city:"Chicago" } },
  { id:"b_3440_n_racine",   slug:"3440-n-racine-ave",name:"3440 N Racine",             hood:"Lakeview",             address:{ street:"3440 N Racine Ave",      city:"Chicago" } },
  { id:"b_7231_n_sheridan", slug:"7231-n-sheridan-rd",name:"7231 N Sheridan",          hood:"Rogers Park",          address:{ street:"7231 N Sheridan Rd",     city:"Chicago" } },
  { id:"b_6751_n_sheridan", slug:"6751-n-sheridan-rd",name:"6751 N Sheridan",          hood:"Rogers Park",          address:{ street:"6751 N Sheridan Rd",     city:"Chicago" } },
  { id:"b_1740_w_touhy",    slug:"1740-w-touhy-ave", name:"1740 W Touhy",              hood:"Rogers Park",          address:{ street:"1740 W Touhy Ave",       city:"Chicago" } },
];

export default buildings;
