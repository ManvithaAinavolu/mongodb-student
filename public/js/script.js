//const userForm = document.getElementById('userForm');
//const userDetailsDiv = document.getElementById('userDetails');


const userForm = document.getElementById('userForm');

userForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(userForm);

  try {
    const response = await fetch('/users/signup', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('User registered successfully');
      window.location.href = '/login'; 
    } else {
      console.error('Error during user registration:', response.statusText);
      // Handle registration error
    }
  } catch (error) {
    console.error('Error during user registration:', error);
    // Handle registration error
  }
});

const formData = new FormData(userForm);
const readButton = document.getElementById('readButton');
const readUsername = document.getElementById('readUsername');
let imageElement1 
const imageElement = document.getElementById('image');
const userDetailsDiv = document.getElementById('userDetails');


// const profileImageInput = document.getElementById('profileImage');
// const selectedImage = profileImageInput.files[0];
// formData.set('profileImage', selectedImage);
readButton.addEventListener('click', async () => {
  const username = readUsername.value;
  try {
    const response = await fetch(`/users/details/${username}`, {
      method: 'GET'
    });
  
    if (response.ok) {
      const userData = await response.json();
      data=userData[0];
      document.getElementById('usernameValue').textContent=data.username
      document.getElementById('emailValue').textContent=data.email
      document.getElementById('passwordValue').textContent=data.password 
      console.log(userData)
      const imageDataArray = new Uint8Array(userData[0].image.data.data);
      const base64Image = arrayBufferToBase64(imageDataArray);
      const imageUrl = `data:image/${userData[0].image.contentType};base64,${base64Image}`;

      console.log(imageUrl);

      imageElement1=imageUrl;
      console.log(imageElement1);

      imageElement.src = imageUrl;
      userDetailsDiv.innerHTML=`
      <table>
      <tr>
          <th>Name</th>
          <th>email</th>
          


      </tr>
      <tr>
          
          <td>${data.username}</td>
          <td>${data.email}</td>
          <td><img src="${imageElement1}" alt="could not get image"></td>


      </tr>
  </table>
      `;
    } else {
      console.error('Error fetching user details:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
});
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
 

  // try {
  //   const response = await fetch(`/users/details/${username}`, {
  //     method: 'GET'
  //   });

  //   if (response.ok) {
  //     const userData = await response.json();
      // console.log(userData);
      // const data=userData[0];
      // console.log(data);
      // document.getElementById('usernameValue').textContent = userData[0].username;
      // document.getElementById('emailValue').textContent = userData[0].email;
      // document.getElementById('passwordValue').textContent = userData[0].password;

      // if (userData.profileImage) {
      //   console.log('Profile Image Content Type:', user.profileImage.contentType);
      //   console.log('Profile Image Data:', user.profileImage.data);
    
      //   const userProfileImage = document.createElement('img');
      //   userProfileImage.src = `data:${user.profileImage.contentType};base64,${user.profileImage.data}`;
      //   userProfileImage.alt = 'Profile Image';
      //   userDetailsDiv.set(userProfileImage);
      // } else {
      //   console.log('No profile image available.');
      // }
  // try {
  // const response = await fetch(`/users/details/${username}`, {
  //   method: 'GET'
  // });

  // if (response.ok) {
  //   const userData = await response.json();
    // ... (rest of the code)
//   } else {
//     console.error('Error fetching user details:', response.statusText);
//   }
// } catch (error) {
//   console.error('Error fetching user details:', error);
// }

//     } else {
//       console.error('Error fetching user details:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Error fetching user details:', error);
//   }
// });

const deleteButton = document.getElementById('deleteButton');
const deleteUsername = document.getElementById('deleteUsername');
const deletediv=document.getElementById('deleted')
deleteButton.addEventListener('click', async () => {
  const username = deleteUsername.value;

  try {
    const response = await fetch(`/users/delete/${username}`, {
      method: 'delete'
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message); 
      deletediv.innerHTML='succesfully deleted';
    } else {
      console.error('Error deleting user:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
});
const updateForm = document.getElementById('updateForm');
const fetchUserButton = document.getElementById('fetchUserButton');
const updateButton = document.getElementById('updateButton');

fetchUserButton.addEventListener('click', async () => {
  const username = updateForm.elements.updateUsername.value;

  try {
    const response = await fetch(`/users/details/${username}`, {
      method: 'GET'
    });

    if (response.ok) {
      const userData = await response.json();
      const user = userData[0]; // Assuming you're getting an array of user data

      updateForm.elements.updatedEmail.value = user.email;
      updateForm.elements.updatedPassword.value = user.password;
      updateForm.elements.updatedCPassword.value = user.cpassword;

      updateButton.style.display = 'block';
    } else {
      console.error('Error fetching user data:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
});

updateForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = updateForm.elements.updateUsername.value;
  const email = updateForm.elements.updatedEmail.value;
  const password = updateForm.elements.updatedPassword.value;
  const cpassword = updateForm.elements.updatedCPassword.value;

  const updatedData = {
    email,
    password,
    cpassword
  };

  try {
    const response = await fetch(`/users/update/${username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    });

    if (response.ok) {
      const updatedUser = await response.json();
      console.log('Updated User:', updatedUser);
      // Display success message or update UI as needed
    } else {
      console.error('Error updating user:', response.statusText);
      // Display error message or handle the error
    }
  } catch (error) {
    console.error('Error updating user:', error);
    // Display error message or handle the error
  }
});
