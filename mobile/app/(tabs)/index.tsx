import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";

const API_BASE_URL = "http://10.33.8.196:8000"; // or your IP / localhost

export default function Index() {
  const [language, setLanguage] = useState("python");
  const [mode, setMode] = useState("explain");
  const [code, setCode] = useState("");
  const [errorContext, setErrorContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError("Please paste some code first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/analyze`, {
        language,
        mode,
        code,
        errorContext: mode === "debug" ? errorContext : null,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to reach backend. Check IP / server / network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>AI Code Companion</Text>
        <Text style={styles.subtitle}>
          Explain, debug, and refactor code with AI.
        </Text>

        {/* language chips, mode chips, inputs, result... (same as before) */}
        {/* ... paste the rest of the styles + JSX from our earlier code */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b1120" },
  container: { padding: 16, paddingBottom: 40 },
  // ... rest of styles from earlier
});
