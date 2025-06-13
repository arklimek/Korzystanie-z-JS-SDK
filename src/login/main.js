import { supabase } from '../api.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const { error } = await supabase.auth.signInWithPassword({
    email: fd.get('email'),
    password: fd.get('password')
  });
  if (error) {
    alert('Błąd: ' + error.message);
  } else {
    window.location.href = '/';
  }
});
