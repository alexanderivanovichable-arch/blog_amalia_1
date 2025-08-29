import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDYAl7z96wGtE16CXLc0sNb0gCpPcR2cUE",
  authDomain: "blog-amalia.firebaseapp.com",
  projectId: "blog-amalia",
  storageBucket: "blog-amalia.firebasestorage.app",
  messagingSenderId: "1085304369758",
  appId: "1:1085304369758:web:c246cae6312db768ecbacf",
  measurementId: "G-TWNK2V5BH8"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🚀 Guardar post
const postForm = document.getElementById("postForm");
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nickname = document.getElementById("nickname").value;
  const message = document.getElementById("message").value;

  try {
    await addDoc(collection(db, "posts"), {
      nickname,
      message,
      createdAt: new Date()
    });
    postForm.reset();
    loadPosts();
  } catch (e) {
    console.error("Error publicando post: ", e);
  }
});

// 🚀 Cargar posts estilo tarjeta
async function loadPosts() {
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const post = doc.data();
    const fecha = post.createdAt.toDate ? post.createdAt.toDate() : post.createdAt;
    const fechaStr = new Date(fecha).toLocaleString("es-SV", { dateStyle: "short", timeStyle: "short" });

    postsDiv.innerHTML += `
      <div class="bg-white p-4 rounded-2xl shadow-md border border-gray-200">
        <div class="flex items-center mb-2">
          <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
            ${post.nickname.charAt(0).toUpperCase()}
          </div>
          <div>
            <p class="font-semibold text-gray-800">${post.nickname}</p>
            <p class="text-sm text-gray-500">${fechaStr}</p>
          </div>
        </div>
        <p class="text-gray-700">${post.message}</p>
      </div>
    `;
  });
}

// Cargar al inicio
loadPosts();

