import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import styles from "../styles/LoginStyles";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const validateLogin = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setErrorMsg("Please enter a valid email address.");
            return;
        }
        if (!password) {
            setErrorMsg("Password is required.");
            return;
        }
        if (password.length < 8) {
            setErrorMsg("Password must be at least 8 characters long.");
            return;
        }

        // ✅ Clear errors
        setErrorMsg("");

        // ✅ Navigate to Dashboard/Home
        navigation.navigate("PassengerTransporterSelection");
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.centerContent}>
            {/* Logo */}
            <Image
                source={{
                    uri: "https://cdn.prod.website-files.com/6846c2be8f3d7d1f31b5c7e3/6846e5d971c7bbaa7308cb70_img.webp",
                }}
                style={{ width: 220, height: 120, marginBottom: 20 }}
                resizeMode="contain"
            />

            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

            <TouchableOpacity style={styles.submitBtn} onPress={validateLogin}>
                <Text style={styles.submitText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Register Dashboard")}>
                <Text style={styles.linkText}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
