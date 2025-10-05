const ARTISTS_KEY = 'honarmand_artists_v1';

const sampleArtists = [
  {id: 'a1', name: 'علی رضایی', rating: 4.8, city: 'تهران', samples: ['sample1.jpg','sample2.jpg']},
  {id: 'a2', name: 'مریم حسینی', rating: 4.6, city: 'اصفهان', samples: ['s3.jpg','s4.jpg']},
  {id: 'a3', name: 'رضا موسوی', rating: 4.9, city: 'مشهد', samples: ['s5.jpg']}
];

function ensureSampleData(){
  if(!localStorage.getItem(ARTISTS_KEY)){
    localStorage.setItem(ARTISTS_KEY, JSON.stringify(sampleArtists));
  }
}

function getArtists(){
  const raw = localStorage.getItem(ARTISTS_KEY) || '[]';
  return JSON.parse(raw);
}

// utilities for navigating with query params
function qs(key){
  const params = new URLSearchParams(location.search);
  return params.get(key);
}

// If we're on artists.html, render list
function renderArtistsPage(){
  const container = document.getElementById('artist-list');
  if(!container) return;

  const artists = getArtists();

  // support sorting by query param: sort=rating|name|city
  const sort = qs('sort') || 'rating';
  if(sort === 'rating') artists.sort((a,b)=> b.rating - a.rating);
  if(sort === 'name') artists.sort((a,b)=> a.name.localeCompare(b.name));
  if(sort === 'city') artists.sort((a,b)=> a.city.localeCompare(b.city));

  container.innerHTML = '';
  artists.forEach(art=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="name">${art.name}</div>
      <div class="meta">شهر: ${art.city} · امتیاز: ${art.rating}</div>
      <p>نمونه‌کارها:</p>
      <div class="samples">${art.samples.map(s=>`<img src="${s}" alt="نمونه" style="max-width:80px;margin-left:0.25rem;border-radius:6px">`).join('')}</div>
      <div class="actions">
        <a class="btn-outline" href="artist.html?id=${art.id}">مشاهده پروفایل</a>
        <button class="btn" onclick="selectArtist('${art.id}')">انتخاب</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderArtistPage(){
  const id = qs('id');
  if(!id) return;
  const artists = getArtists();
  const art = artists.find(a=>a.id === id);
  if(!art) return;
  const container = document.getElementById('artist-profile');
  if(!container) return;
  container.innerHTML = `
    <h2>${art.name}</h2>
    <div class="meta">شهر: ${art.city} · امتیاز: ${art.rating}</div>
    <h3>نمونه‌کارها</h3>
    <div class="samples">${art.samples.map(s=>`<img src="${s}" alt="نمونه" style="max-width:160px;margin-left:0.5rem;border-radius:8px">`).join('')}</div>
    <div style="margin-top:1rem">
      <button class="btn" onclick="selectArtist('${art.id}')">انتخاب نهایی این نقاش</button>
    </div>
  `;
}

function selectArtist(id){
  // ذخیره انتخاب اولیه و به صفحه انتخاب نوع خدمات برویم
  localStorage.setItem('selected_artist', id);
  location.href = 'choose-service.html';
}

// choose-service page
function renderChooseService(){
  const container = document.getElementById('choose-service');
  if(!container) return;
  const id = localStorage.getItem('selected_artist');
  const art = getArtists().find(a=>a.id===id);
  container.innerHTML = `
    <h2>انتخاب خدمات برای ${art? art.name : 'نقاش'}</h2>
    <p>نوع خدمات را انتخاب کنید:</p>
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
      <button class="btn" onclick="confirmService('داخل')">رنگ آمیزی داخلی</button>
      <button class="btn" onclick="confirmService('خارج')">رنگ آمیزی خارجی</button>
      <button class="btn" onclick="confirmService('روغنی')">روغنی</button>
    </div>
  `;
}

function confirmService(type){
  const id = localStorage.getItem('selected_artist');
  const artists = getArtists();
  const art = artists.find(a=>a.id===id);
  // در این نسخه استاتیک شماره تماس نمایش داده نمیشود.
  // نمایش صفحه نهایی تایید
  localStorage.setItem('confirmed_selection', JSON.stringify({artistId:id, service:type}));
  alert(`شما ${art? art.name : ''} را برای سرویس "${type}" انتخاب کردید. (در نسخه نمونه تماس نمایش داده نمیشود)`);
  // می‌توانیم به صفحه دریافت اطلاعات مشتری برویم یا بازگشت به خانه
  location.href = 'index.html';
}

// registration page: append to localStorage
function handleRegister(e){
  e.preventDefault();
  const name = e.target.name.value.trim();
  const city = e.target.city.value.trim();
  if(!name) return alert('نام را وارد کنید');
  const arr = getArtists();
  const id = 'a' + (Math.random().toString(36).slice(2,8));
  arr.push({id, name, rating:4.5, city, samples: []});
  localStorage.setItem(ARTISTS_KEY, JSON.stringify(arr));
  alert('ثبت نام با موفقیت انجام شد.');
  location.href = 'artists.html';
}

// initialize
ensureSampleData();
window.addEventListener('DOMContentLoaded', ()=>{
  renderArtistsPage();
  renderArtistPage();
  renderChooseService();
  const regForm = document.getElementById('register-form');
  if(regForm) regForm.addEventListener('submit', handleRegister);
});
