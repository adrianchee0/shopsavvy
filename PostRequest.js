const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(signupForm);
    const userData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const result = await response.json();
            // Handle successful signup (e.g., redirect, display message)
            console.log('Signup successful:', result);
        } else {
            // Handle signup error (e.g., display error message)
            console.error('Signup failed:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error during signup:', error);
    }
});
