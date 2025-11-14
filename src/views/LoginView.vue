<template>
    <div class="login-container">
        <div class="login-card">
            <h1>StudyFlow</h1>
            <p>Faça login para continuar</p>

            <button class="google-btn" @click="login">
                Entrar com Google
            </button>
        </div>
    </div>
</template>

<script setup>
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { loginWithGoogle } from "@/services/authService";
import { useRouter } from "vue-router";

const router = useRouter();

onAuthStateChanged(auth, (user) => {
    if (user) {
        router.push("/home");
    }
});

async function login() {
    try {
        await loginWithGoogle();
        router.push("/home");
    } catch (e) {
        console.error("Erro ao logar:", e);
        alert("Erro ao logar");
    }
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
}

.login-card {
    background: white;
    padding: 40px;
    border-radius: 10px;
    width: 350px;
    text-align: center;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.google-btn {
    background: #4285F4;
    color: white;
    border: none;
    padding: 12px 20px;
    width: 100%;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
    font-size: 16px;
}

.google-btn:hover {
    background: #357ae8;
}
</style>
