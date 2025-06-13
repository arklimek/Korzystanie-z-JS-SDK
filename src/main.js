import { supabase } from './api.js';

let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return console.error('Supabase error:', error);

  currentUser = session ? session.user : null;

  setupNav();

  await fetchArticles();

  const addBtn = document.getElementById('add-article-btn');
  if (addBtn) {
    if (currentUser) {
      addBtn.style.display = '';
      setupAddBtn();
      setupModal();
    } else {
      addBtn.style.display = 'none';
    }
  }

  if (currentUser) {
    setupLogoutBtn();
  }
});

function setupNav(){
  const nav = document.getElementById('nav-list');
  if (!nav) return;
  if (currentUser) {
    nav.innerHTML = `
      <li><a href="index.html" class="text-white hover:underline">Home</a></li>
      <li class="font-medium px-4 text-white">${currentUser.email}</li>
      <li><button id="logout-btn" class="text-red-500 hover:underline transition">Wyloguj</button></li>`;
  } else {
    nav.innerHTML = `
      <li><a href="index.html" class="hover:underline">Home</a></li>
      <li><a href="src/login/index.html" class="text-blue-500 hover:underline transition">Zaloguj</a></li>`;
  }
}

function setupLogoutBtn(){
  document.getElementById('logout-btn')
    .addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.reload();
  });
}

async function fetchArticles(){
  const { data, error } = await supabase
    .from('article')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return console.error(error);

  const container = document.querySelector('.articles');
  container.innerHTML = data.map(renderArticle).join('');
  document.querySelectorAll('.edit-btn').forEach(btn => btn.onclick = openEditModal);
  document.querySelectorAll('.delete-btn').forEach(btn => btn.onclick = deleteArticle);
}

function renderArticle(a) {
  const date = a.created_at ? new Date(a.created_at).toLocaleDateString() : '';
  return `
    <article class="bg-white shadow rounded p-4 flex flex-col gap-2">
      <header>
        <p class="text-3xl font-semibold">TYTUŁ: ${a.title}</p>
        <p class="text-xl font-normal text-black">PODTYTUŁ: ${a.subtitle || ''}</p>
        <p class="text-xl font-normal text-black">AUTOR: ${a.author || ''}</p>
        <p class="text-black text-sm">DATA: ${date}</p>
      </header>
      <p>${a.content}</p>
      ${currentUser ? `
        <footer class="mt-3 flex gap-2">
          <button data-id="${a.id}" class="edit-btn bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 transition">Edytuj</button>
          <button data-id="${a.id}" class="delete-btn bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 transition">Usuń</button>
        </footer>` : ''}
    </article>`;
}

function setupAddBtn(){
  document.getElementById('add-article-btn').onclick = () => openModal();
}

function setupModal(){
  const modal = document.getElementById('article-modal');
  document.getElementById('cancel-btn').onclick = () => modal.close();
  document.getElementById('article-form').onsubmit = handleFormSubmit;
}

async function openModal(article = null){
  const modal = document.getElementById('article-modal');
  document.getElementById('modal-title').textContent = article ? 'Edytuj artykuł' : 'Dodaj artykuł';
  document.getElementById('article-id').value = article?.id || '';
  document.getElementById('title').value = article?.title || '';
  document.getElementById('subtitle').value = article?.subtitle || '';
  document.getElementById('content').value = article?.content || '';
  document.getElementById('author').value = article?.author || '';
    modal.showModal();
}

async function openEditModal(e){
  const { data: article } = await supabase
    .from('article')
    .select('*')
    .eq('id', e.target.dataset.id)
    .single();
  openModal(article);
}

async function deleteArticle(e){
  await supabase.from('article').delete().eq('id', e.target.dataset.id);
  await fetchArticles();
}

async function handleFormSubmit(e){
  e.preventDefault();
  const id = document.getElementById('article-id').value;
  const title = e.target.title.value;
  const content = e.target.content.value;
  const author = e.target.author.value;
  const subtitle = e.target.subtitle ? e.target.subtitle.value : null;
    let tags = e.target.tags ? e.target.tags.value : '["default"]';
  try {
    tags = JSON.parse(tags);
  } catch {
    tags = ["default"];
  }

  const payload = {
    title,
    content,
    author,
    subtitle,
    tags,
    created_at: new Date().toISOString()
  };

  let result;
  if (id) {
    result = await supabase.from('article').update(payload).eq('id', id);
  } else {
    result = await supabase.from('article').insert(payload);
  }

  if (result.error) {
    alert('Błąd: ' + result.error.message);
    return;
  }

  document.getElementById('article-modal').close();
  await fetchArticles();
}