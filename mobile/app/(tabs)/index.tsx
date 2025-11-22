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

// ▶▶ IMPORTANT ◀◀
// If you’re testing on PHONE via Expo Go: set to your PC's LAN IP (e.g., http://10.33.8.196:8000)
// If you’re testing in BROWSER (press 'w' in Expo): you can use http://localhost:8000
const API_BASE_URL = "http://localhost:8000";

type AnalysisResult = {
  summary: string;
  steps: string[];
  issues: string[];
  suggestions: string[];
  improvedCode: string;
};

export default function Index() {
  const [language, setLanguage] = useState("python");
  const [mode, setMode] = useState<"explain"|"debug"|"refactor">("explain");
  const [code, setCode] = useState("");
  const [errorContext, setErrorContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
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
    } catch (e) {
      console.error(e);
      setError("Failed to reach backend. Check server, URL, and network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>AI Code Companion</Text>
        <Text style={styles.subtitle}>Explain, debug, and refactor code with AI.</Text>

        {/* Language chips */}
        <View style={styles.row}>
          <Text style={styles.label}>Language:</Text>
          <View style={styles.chipRow}>
            {["python", "c", "cpp", "java", "javascript"].map((lang) => (
              <Text
                key={lang}
                style={[styles.chip, language === lang && styles.chipSelected]}
                onPress={() => setLanguage(lang)}
              >
                {lang}
              </Text>
            ))}
          </View>
        </View>

        {/* Mode chips */}
        <View style={styles.row}>
          <Text style={styles.label}>Mode:</Text>
          <View style={styles.chipRow}>
            {[
              { key: "explain", label: "Explain" },
              { key: "debug", label: "Debug" },
              { key: "refactor", label: "Refactor" },
            ].map((m) => (
              <Text
                key={m.key}
                style={[styles.chip, mode === (m.key as any) && styles.chipSelected]}
                onPress={() => setMode(m.key as any)}
              >
                {m.label}
              </Text>
            ))}
          </View>
        </View>

        {/* Code input */}
        <Text style={styles.label}>Code:</Text>
        <TextInput
          style={styles.codeInput}
          multiline
          value={code}
          onChangeText={setCode}
          placeholder="Paste your code here..."
          placeholderTextColor="#6b7280"
        />

        {/* Debug extra input */}
        {mode === "debug" && (
          <>
            <Text style={styles.label}>Error / Behavior (optional):</Text>
            <TextInput
              style={styles.errorInput}
              multiline
              value={errorContext}
              onChangeText={setErrorContext}
              placeholder="e.g., TypeError on line 3 when I click the button..."
              placeholderTextColor="#6b7280"
            />
          </>
        )}

        {/* Analyze button */}
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Button title="Analyze" onPress={handleAnalyze} disabled={!code.trim()} />
          )}
        </View>

        {/* Error text */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Result */}
        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Summary</Text>
            <Text style={styles.resultText}>{result.summary}</Text>

            {!!result.steps?.length && (
              <>
                <Text style={styles.resultTitle}>Steps</Text>
                {result.steps.map((s, i) => (
                  <Text key={i} style={styles.resultBullet}>• {s}</Text>
                ))}
              </>
            )}

            {!!result.issues?.length && (
              <>
                <Text style={styles.resultTitle}>Issues</Text>
                {result.issues.map((s, i) => (
                  <Text key={i} style={styles.resultBullet}>• {s}</Text>
                ))}
              </>
            )}

            {!!result.suggestions?.length && (
              <>
                <Text style={styles.resultTitle}>Suggestions</Text>
                {result.suggestions.map((s, i) => (
                  <Text key={i} style={styles.resultBullet}>• {s}</Text>
                ))}
              </>
            )}

            {result.improvedCode && (
              <>
                <Text style={styles.resultTitle}>Improved Code</Text>
                <ScrollView horizontal>
                  <Text style={styles.codeBlock}>{result.improvedCode}</Text>
                </ScrollView>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b1120" },
  container: { padding: 16, paddingBottom: 48 },
  title: { fontSize: 26, fontWeight: "700", color: "white", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#9ca3af", marginBottom: 16 },
  row: { marginBottom: 12 },
  label: { fontSize: 14, color: "#e5e7eb", marginBottom: 4 },
  chipRow: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
    borderWidth: 1, borderColor: "#4b5563",
    color: "#e5e7eb", marginRight: 8, marginBottom: 8,
  },
  chipSelected: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  codeInput: {
    minHeight: 150, borderWidth: 1, borderColor: "#4b5563",
    borderRadius: 8, padding: 8, color: "#e5e7eb", fontFamily: "monospace",
  },
  errorInput: {
    minHeight: 60, borderWidth: 1, borderColor: "#4b5563",
    borderRadius: 8, padding: 8, color: "#e5e7eb",
  },
  buttonContainer: { marginTop: 10, marginBottom: 12, alignSelf: "flex-start" },
  errorText: { color: "#fca5a5", marginBottom: 12 },
  resultContainer: {
    marginTop: 16, padding: 12, backgroundColor: "#020617",
    borderRadius: 10, borderWidth: 1, borderColor: "#1f2937",
  },
  resultTitle: { fontSize: 16, fontWeight: "600", color: "#e5e7eb", marginTop: 8 },
  resultText: { fontSize: 14, color: "#d1d5db" },
  resultBullet: { fontSize: 14, color: "#9ca3af" },
  codeBlock: { fontFamily: "monospace", fontSize: 13, color: "#e5e7eb" },
});
