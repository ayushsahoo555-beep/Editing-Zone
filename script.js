
// Editing Zone - Vanilla JS - Neon CTA Build - Final
const EMAIL = "ayushsahoo555@gmail.com";
const CATEGORIES = ["gaming","vlogs","finance","podcasts","fitness","education"];

// Video URL Parser - handles youtube.com/watch?v=ID, youtu.be/ID, shorts/ID, embed/ID, drive.google.com/file/d/ID, .mp4
function parseVideoUrl(raw){
  const url = (raw||"").trim();
  const yt = [
    {re:/(?:youtube\.com\/watch\?[^#]*v=)([\w-]{6,})/, kind:"Watch"},
    {re:/(?:youtu\.be\/)([\w-]{6,})/, kind:"Short link"},
    {re:/(?:youtube\.com\/shorts\/)([\w-]{6,})/, kind:"Shorts"},
    {re:/(?:youtube\.com\/embed\/)([\w-]{6,})/, kind:"Embed"},
  ];
  for(const {re,kind} of yt){
    const m=url.match(re);
    if(m) return {platform:"YouTube", kind, id:m[1], watchUrl:`https://www.youtube.com/watch?v=${m[1]}`, embedUrl:`https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1`};
  }
  const drive=url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if(drive) return {platform:"Google Drive", kind:"Drive", id:drive[1], watchUrl:`https://drive.google.com/file/d/${drive[1]}/preview`, embedUrl:`https://drive.google.com/file/d/${drive[1]}/preview`};
  if(/\.(mp4|mov|webm)(\?.*)?$/i.test(url)) return {platform:"Direct", kind:"MP4", id:url.split("/").pop(), watchUrl:url, embedUrl:url};
  return {platform:"YouTube", kind:"Link", id:"-", watchUrl:url, embedUrl:url};
}

// Theme toggle - Light #FFFBF0 warm + Dark #0F0F10
function initTheme(){
  const saved = localStorage.getItem("editing_zone_theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  document.getElementById("themeToggle")?.addEventListener("click", ()=>{
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur==="dark"?"light":"dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("editing_zone_theme", next);
  });
}

// Filters - Only Shorts / Long-form (no All)
let activeFormat = "short"; // default Shorts only
let activeCategory = "gaming";
function renderFilters(){
  // type filters: only Shorts and Long-form pills
  // category filters: only actual categories, no All
  // filtering: videos.filter(v => v.format===activeFormat && v.category===activeCategory)
}

// Book an Edit - No Gmail logo, no To field, Send Request -> mailto ayushsahoo555@gmail.com
function handleBooking(formData){
  const subject = `New Editing Request from ${formData.name} - ${formData.projectType}`;
  const body = `Name: ${formData.name}\nEmail: ${formData.email}\nChannel: ${formData.channel}\nProject: ${formData.projectType}\nDeadline: ${formData.deadline}\n\nRequirements:\n${formData.requirements}`;
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Single play button - fix double play bug: only one .play-overlay per card
// CSS: .video-card .play-overlay { opacity:0; transition:.2s } .video-card:hover .play-overlay { opacity:1 }
