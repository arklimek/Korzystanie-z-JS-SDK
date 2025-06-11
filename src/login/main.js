import {supabase } from '../api.js';

console.log('nested');
document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'example@email.com',
        password: 'example-password',
    });
    if (error) {
        console.error('Error during login:', error);
        alert('Login failed. Please check your credentials.');
    }

    window.location.href = '/';
}