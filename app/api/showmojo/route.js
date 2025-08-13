// app/api/showmojo/route.js
export const runtime = 'nodejs';

function norm(v){return typeof v==='string'?v.toLowerCase().trim():v}
function isOnMarket(r){
  const vals=[r['Market status'],r.MarketStatus,r.marketStatus,r.status,r.Status,r.on_market,r.onMarket,r.published,r.Published,r.available,r.Available].map(norm);
  return vals.includes('on market')||vals.includes('on_market')||vals.includes('active')||vals.includes('published')||vals.includes('available')||vals.includes(true)||vals.includes('true')||vals.includes('1');
}
function mapListing(r){return{
  id:String(r.id??r.listingId??r['Listing UID']??''),
  title:r.title??r.address??r['Address']??'',
  address:r.address??r['Address']??'',
  unit:r.unit??r['Unit']??'',
  rent:Number(r.rent??r.price??r['Rent']??0),
  beds:r.beds??r['Bedrooms']??null,
  baths:r.baths??r['Full bathrooms']??null,
  sqft:r.sqft??r.squareFeet??r['Square Feet']??null,
  url:r.url??r.link??r['Short url']??'',
  availableOn:r.availableOn??r['Available On']??r['Available Date']??null,
  rawStatus:r['Market status']??r.status??r.marketStatus??null
};}

async function upstream(url,key){
  let res=await fetch(url,{headers:{Authorization:`Bearer ${key}`,Accept:'application/json'},cache:'no-store'});
  if(res.status===401||res.status===403){
    res=await fetch(url,{headers:{'X-Api-Key':key,Accept:'application/json'},cache:'no-store'});
  }
  return res;
}

export async function GET(req){
  const { searchParams } = new URL(req.url);
  const DEBUG = searchParams.get('debug') === '1';
  const API_URL = process.env.SHOWMOJO_API_URL || 'https://api.showmojo.com/v2/listings';
  const API_KEY = process.env.SHOWMOJO_API_KEY;
  if(!API_KEY) return new Response(JSON.stringify({error:'Missing SHOWMOJO_API_KEY'}),{status:500});

  const res = await upstream(API_URL, API_KEY);
  const text = await res.text();
  if(!res.ok) return new Response(JSON.stringify({error:'ShowMojo error',status:res.status,body:text}),{status:502});

  let payload; try{payload=JSON.parse(text)}catch{payload=text}
  const rows = Array.isArray(payload?.listings)?payload.listings:(Array.isArray(payload)?payload:[]);
  const mapped = rows.map(mapListing);
  const active = mapped.filter(isOnMarket).sort((a,b)=>Date.parse(b.availableOn||0)-Date.parse(a.availableOn||0));

  if (DEBUG) {
    return new Response(JSON.stringify({counts:{total:rows.length,active:active.length},sampleKeys:rows[0]?Object.keys(rows[0]):[],firstMapped:mapped[0]??null},null,2),{headers:{'Content-Type':'application/json'}});
  }
  return new Response(JSON.stringify({listings:active}),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
}
