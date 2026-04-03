        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
        import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

        async function loadContents() {
            const contentContainer = document.getElementById('content-container');
            contentContainer.innerHTML = '';
            const querySnapshot = await getDocs(collection(db, 'content'));
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const item = document.createElement('div');
                item.className = 'content-item';
                item.innerHTML = `
                    <h3>${data.title}</h3>
                    <p>${data.info}</p>
                    ${data.img ? `<img src="${data.img}" alt="Image">` : ''}
                    ${data.vid ? `<p><a href="${data.vid}" target="_blank">Watch Video</a></p>` : ''}
                    <p class="category">${data.cate}</p>
                `;
                contentContainer.appendChild(item);
            });
        }

        document.addEventListener('DOMContentLoaded', loadContents);