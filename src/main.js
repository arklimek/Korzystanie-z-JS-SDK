import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://mbqxxmkjxfxzhlmxadzv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icXh4bWtqeGZ4emhsbXhhZHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMTM2NDMsImV4cCI6MjA2Mzc4OTY0M30.WsPyyfD6F9FlHSCKfwldbzSVhpX_VrUhmRcsuF8sYlE')
main();

///

async function main() {
  const { data, error } = await supabase.auth.getSession();
  if ()
  if (error) {
    console.error('Error fetching session:', error);
    alert('Error fetching session. Please try again later.');
    return;
  }
  if (!data.session) {
    console.log('No active session found. Redirecting to login page.');
    window.location.href = '/login';
    return;
  }
  console.log('Active session found:', data.session);
  await fertchArticles();
}

async function fertchArticles() {
  // Create a single supabase client for interacting with your database
  console.log('main');
    
  const {data,error} = await supabase.from('article').select().order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching articles:', error);
    alert('Error fetching articles. Please try again later.');
    return;
  }
    
  const articleList = data.map(article => (
  const tagList = article.tags.map(tag => (
    return '<article> ${artile.tags.map(tag => <p><small>Created at: ' + new Date(article.created_at).toLocaleDateString() + '</small></p></article>';
  )).join('');
  document.querySelector('.articles').innerHTML = articleList;
}

function setupLoginLink(){
  const loginLink = document.querySelector('.login-link');
  if (loginLink) {
    loginLink.addEventListener('click', () => {
      window.location.href = '/login';
    });
  }
}

function setupLogoutButton() {
  const logoutButton = document.querySelector('.logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again later.');
      } else {
        console.log('User signed out successfully.');
        window.location.href = '/login';
      }
      await fertchArticles();
      setupNav();
    });
  }
}

function setupNav(session) {
  const nav = document.querySelector('nav');
  
  if (nav) {
    const userEmail = session.user.email;
    nav.innerHTML = `
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/profile">${userEmail}</a></li>
        <li><button class="logout-button">Logout</button></li>
      </ul>
    `;
  }
}
//boczny wysuwany panel
function setupAddArticleButton() {
  const addArticleButton = document.querySelector('nav');
  if (addArticleButton) {
    addArticleButton.addEventListener('click',async (e) => {
      const { error } = await supabase
        .from('countries')
        .insert({ id: 1, name: 'Mordor' })
      const dialog = document.querySelector('.add-article-dialog');
      dialog.innerHTML = `<section></section>`;
      document.body.appendChild(dialog);
      dialog.showModal();
      
      window.location.href = '/add-article';
    });
    document.querySelector
  }
}