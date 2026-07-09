import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";
import { ImageBackground, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";

type Ayah = {
  number: number;
  text: string;
  translation?: string;
};

const TRANSLATION_OPTIONS = [
  { value: "none", label: "No Translation" },
  { value: "en.asad", label: "English" },
  { value: "ur.junagarhi", label: "Urdu" },
];

type SurahData = {
  number: number;
  name: string;
  englishName: string;
  revelationType: string;
  ayahs: Ayah[];
};

export default function ReaderScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const idParam = (params.id as string) ?? "1";
  const id = Number(idParam) || 1;

  const [surah, setSurah] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translation, setTranslation] = useState<string>("none");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const { width: windowWidth } = useWindowDimensions();
  const pageWidth = Math.min(windowWidth - Spacing.four * 2, 980);
  const isWeb = Platform.OS === "web";

  const [fontsLoaded] = useFonts({
    "Gulzar-Regular": require("@/assets/fonts/Al Mushaf Arabic Font/Al-Mushaf-Quran.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    async function loadSurah() {
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
        const json = await res.json();
        if (!mounted) return;
        if (json.code !== 200 || !json.data) {
          setError("Failed to load surah");
          setLoading(false);
          return;
        }

        const base = json.data;
        const ayahs: Ayah[] = base.ayahs.map((a: any, idx: number) => ({
          number: idx + 1,
          text: a.text,
        }));

        const audioRes = await fetch(
          `https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`,
        );
        const audioJson = await audioRes.json();
        if (audioJson.code === 200 && audioJson.data?.ayahs?.[0]) {
          setAudioUrl(audioJson.data.ayahs[0].audio ?? null);
        } else {
          setAudioUrl(null);
        }

        if (translation !== "none") {
          try {
            const tRes = await fetch(
              `https://api.alquran.cloud/v1/surah/${id}/${translation}`,
            );
            const tJson = await tRes.json();
            if (tJson.code === 200 && tJson.data && tJson.data.ayahs) {
              tJson.data.ayahs.forEach((ta: any, idx: number) => {
                if (ayahs[idx]) ayahs[idx].translation = ta.text;
              });
            }
          } catch (e) {
            // ignore translation errors
          }
        }

        const s: SurahData = {
          number: base.number,
          name: base.name,
          englishName: base.englishName,
          revelationType: base.revelationType,
          ayahs,
        };

        setSurah(s);
        setLoading(false);
      } catch (e: any) {
        if (!mounted) return;
        setError(e.message ?? "Failed to fetch");
        setLoading(false);
      }
    }

    loadSurah();

    return () => {
      mounted = false;
    };
  }, [id, translation]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => null);
      }
    };
  }, []);

  return (
    <ImageBackground
      source={require("@/assets/images/pages.png")}
      style={styles.container}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.page, { width: pageWidth }]}> 
          {loading && <ThemedText type="small">Loading…</ThemedText>}
        {error && <ThemedText type="small">{error}</ThemedText>}
        {surah && (
          <>
            <ThemedView type="backgroundElement" style={[styles.headerCard, isWeb && styles.headerCardFixed]}>
              <ThemedText type="title" style={styles.headerText}>
                {surah.name}
              </ThemedText>
              <ThemedText type="small" style={{ marginTop: 8 }}>
                {surah.englishName} · {surah.revelationType} ·{" "}
                {surah.ayahs.length} Ayahs
              </ThemedText>
            </ThemedView>

            <View style={styles.selectorRow}>
              {TRANSLATION_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setTranslation(option.value)}
                  style={[
                    styles.selectorButton,
                    translation === option.value && styles.selectorButtonActive,
                  ]}
                >
                  <ThemedText
                    type="small"
                    style={
                      translation === option.value
                        ? styles.selectorTextActive
                        : styles.selectorText
                    }
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>

            {audioUrl ? (
              <View style={styles.audioBar}>
                <Pressable
                  style={styles.audioButton}
                  onPress={async () => {
                    if (!soundRef.current) {
                      const { sound } = await Audio.Sound.createAsync(
                        { uri: audioUrl },
                        { shouldPlay: true },
                      );
                      soundRef.current = sound;
                      setIsPlaying(true);
                      sound.setOnPlaybackStatusUpdate((status) => {
                        if (!("isLoaded" in status) || !status.isLoaded) return;
                        if ("isPlaying" in status) {
                          setIsPlaying(status.isPlaying ?? false);
                        }
                      });
                    } else {
                      const status = await soundRef.current.getStatusAsync();
                      if ("isPlaying" in status && status.isPlaying) {
                        await soundRef.current.pauseAsync();
                      } else {
                        await soundRef.current.playAsync();
                      }
                    }
                  }}
                >
                  <ThemedText type="small" style={styles.audioText}>
                    {isPlaying ? "Pause Audio" : "Play Audio"}
                  </ThemedText>
                </Pressable>
              </View>
            ) : (
              <ThemedText type="small" style={{ marginTop: Spacing.two }}>
                Audio not available for this surah.
              </ThemedText>
            )}

            {surah.ayahs.map((a) => (
              <ThemedView key={a.number} style={styles.verseCard}>
                
                <View
  style={{
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    alignItems: "center" 
  }}
>
  <ThemedText
    style={{
      fontFamily: "AlMajeed",
      fontSize: 30,
      color: "#FFFFFF",
      textAlign: "right",
      writingDirection: "rtl",
      flexShrink: 1,
      lineHeight: 60,
      display: "block",
    }}
  >
    {a.text}
  </ThemedText>

  <View
    style={{
      marginRight: 8,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 100,
      width: 32,
      height: 32,
      justifyContent: "center",
      alignItems: "center",
      // display: "block",
    }}
  >
    <ThemedText
      style={{
        color: "#FFFFFF",
        fontSize: 14,
        display: "block",
      }}
    >
      {a.number}
    </ThemedText>
  </View>
</View>

                {a.translation ? (
                  <ThemedText type="small" style={[styles.translationText, { marginTop: Spacing.two, color: "#fdbbbb",fontSize: 20, lineHeight: 24 }]}> 
                    {a.translation}
                  </ThemedText>
                ) : null}
              </ThemedView>
            ))}
          </>
        )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

export const unstable_settings = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    minHeight: "100%",
    backgroundColor: "#08143a",
  },
  backgroundImage: {
    opacity: 0.60,
    alignSelf: "center",
    width: "100%",
    height: "100%",
  },
  content: {
    flexGrow: 1,
    paddingTop: 180,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  page: {
    width: "100%",
    maxWidth: 980,
  },
  headerCard: {
    width: "100%",
    borderRadius: 18,
    padding: Spacing.four,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    zIndex: 1000,
  },
  headerCardFixed: {
    position: "fixed",
    top: Spacing.four,
    left: Spacing.four,
    right: Spacing.four,
    maxWidth: 980,
    width: "auto",
    alignSelf: "center",
    marginHorizontal: "auto",
  },
  selectorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  selectorButton: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
    backgroundColor: "#EDEFF7",
  },
  selectorButtonActive: {
    backgroundColor: "#0A3DBE",
  },
  selectorText: {
    color: "#1C233E",
  },
  selectorTextActive: {
    color: "#FFFFFF",
  },
  audioBar: {
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
    borderRadius: 16,
    // backgroundColor: "#E8EFFB",
    padding: Spacing.three,
    alignItems: "center",
  },
  audioButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    backgroundColor: "#0A3DBE",
    borderRadius: 999,
  },
  audioText: {
    color: "#FFFFFF",
  },
  ayahHeader: {
    width: 44,
    height: 44,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.two,
  },
  ayahNumber: {
    opacity: 0.7,
  },
  verseCard: {
    borderRadius: 12,
    padding: Spacing.three,
    marginTop: Spacing.one,
    backgroundColor: "transparent",
    alignItems: "flex-end",
  },
  arabicText: {
    color: "#FFFFFF",
    fontFamily: "Gulzar-Regular",
    lineHeight: 48,
  },
  headerText: {
    color: "#c9c1da",
    marginBottom: Spacing.two,
    textAlign: "center",
  },
});
