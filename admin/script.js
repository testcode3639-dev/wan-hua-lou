import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCEU_hkazFaQ47eBcWglU0QZr5N4i_XPFk",
    authDomain: "eng-vocab-website.firebaseapp.com",
    projectId: "eng-vocab-website",
    storageBucket: "eng-vocab-website.firebasestorage.app",
    messagingSenderId: "669746577120",
    appId: "1:669746577120:web:494b943ef1319ce4d69a85",
    measurementId: "G-DHBPC5RL89"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.db = db;
window.collection = collection;
window.getDocs = getDocs;
window.addDoc = addDoc;
window.updateDoc = updateDoc;
window.deleteDoc = deleteDoc;
window.doc = doc;
window.getDoc = getDoc;

const authForm = document.getElementById('auth-form');
const loginError = document.getElementById('login-error');
const loginForm = document.getElementById('login-form');
const mainContent = document.getElementById('main-content');
const contentList = document.getElementById('content-list');
const contentForm = document.getElementById('content-form');
const docIdField = document.getElementById('doc-id');
const titleField = document.getElementById('title');
const infoField = document.getElementById('info');
const imgField = document.getElementById('img');
const vidField = document.getElementById('vid');
const cateField = document.getElementById('cate');

async function checkLogin(username, password) {
    try {
        console.log("Attempting login with username:", username, "password:", password);
        const docRef = doc(window.db, 'admin', 'account');
        console.log("DocRef:", docRef);
        const docSnap = await getDoc(docRef);
        console.log("DocSnap exists:", docSnap.exists());
        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Data from Firestore:", data);
            console.log("Expected user:", data.user, "Expected password:", data.password);
            if (data.user === username && data.password === password) {
                console.log("Login successful");
                return true;
            } else {
                console.log("Login failed: credentials do not match");
            }
        } else {
            console.log("Document 'account' does not exist in collection 'admin'");
        }
        return false;
    } catch (error) {
        console.error("Error checking login:", error);
        return false;
    }
}

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (await checkLogin(username, password)) {
        loginForm.style.display = 'none';
        mainContent.style.display = 'block';
    } else {
        loginError.textContent = 'Incorrect username or password';
        loginError.style.display = 'block';
    }
});

async function loadContents() {
    contentList.innerHTML = '';
    const querySnapshot = await getDocs(collection(window.db, 'content'));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const item = document.createElement('div');
        item.className = 'content-item';
        item.innerHTML = `
            <h3>${data.title}</h3>
            <p>${data.info}</p>
            <p>Image: ${data.img || 'N/A'}</p>
            <p>Video: ${data.vid || 'N/A'}</p>
            <p>Category: ${data.cate}</p>
            <button class="edit-btn" onclick="editContent('${doc.id}', '${data.title}', '${data.info}', '${data.img || ''}', '${data.vid || ''}', '${data.cate}')">Edit</button>
            <button class="delete-btn" onclick="deleteContent('${doc.id}')">Delete</button>
        `;
        contentList.appendChild(item);
    });
}

window.editContent = function(id, title, info, img, vid, cate) {
    docIdField.value = id;
    titleField.value = title;
    infoField.value = info;
    imgField.value = img;
    vidField.value = vid;
    cateField.value = cate;
};

window.deleteContent = async function(id) {
    if (confirm('Are you sure you want to delete?')) {
        await deleteDoc(doc(window.db, 'content', id));
        loadContents();
    }
};

contentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        title: titleField.value,
        info: infoField.value,
        img: imgField.value,
        vid: vidField.value,
        cate: cateField.value
    };
    if (docIdField.value) {
        await updateDoc(doc(window.db, 'content', docIdField.value), data);
    } else {
        await addDoc(collection(window.db, 'content'), data);
    }
    contentForm.reset();
    loadContents();
});

loadContents();