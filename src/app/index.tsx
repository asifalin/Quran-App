import { ImageBackground, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Device from "expo-device";

import { AnimatedIcon } from "@/components/animated-icon";
import { SurahCard } from "@/components/surah-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { SURAH_LIST } from "@/data/surah-list";
import { useRouter } from "expo-router";

export const unstable_settings = {
  headerShown: false,
};

function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  function openReader(id: number) {
    router.push(`/reader?id=${id}`);
  }

  return (
    <ImageBackground
      source={require("@/assets/images/pages.png")}
      style={styles.container}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.pageWrapper}>
            <ThemedView type="backgroundElement" style={styles.topHeader}>
              <View style={styles.topHeaderBadge}>
                <ThemedText type="smallBold" style={styles.topHeaderBadgeText}>
                  Quran Kareem
                </ThemedText>
              </View>
              <ThemedText type="title" style={styles.topHeaderTitle}>
                القرآن الكريم
              </ThemedText>
              <ThemedText type="small" style={styles.topHeaderSubtitle}>
                Offline Quran — Urdu + English translations
              </ThemedText>
            </ThemedView>

            <View style={styles.grid}>
              {SURAH_LIST.map((surah) => (
                <SurahCard
                  key={surah.id}
                  arabic={surah.arabic}
                  english={surah.english}
                  onPress={() => openReader(surah.id)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    minHeight: "100%",
    backgroundColor: "#08143a",
  },
  backgroundImage: {
    opacity: 0.88,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    marginHorizontal: "auto",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    backgroundColor: "transparent",
  },
  topHeader: {
    width: "100%",
    borderRadius: 32,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.four,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0b173f",
    shadowOpacity: 0.28,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    overflow: "hidden",
  },
  topHeaderBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.four,
    borderRadius: 999,
    marginBottom: Spacing.three,
  },
  topHeaderBadgeText: {
    color: "#F8FAFF",
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  topHeaderTitle: {
    color: "#FFFFFF",
    marginBottom: Spacing.one,
    fontSize: 42,
    letterSpacing: 0.8,
  },
  topHeaderSubtitle: {
    color: "#E4ECFF",
    textAlign: "center",
    paddingHorizontal: Spacing.three,
    fontSize: 15,
    lineHeight: 22,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 0,
    width: "100%",
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
    marginTop: Spacing.nine,
  },
  heroCard: {
    marginTop: Spacing.two,
    borderRadius: 24,
    padding: Spacing.four,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 5,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  heroTitle: {
    color: "#fff",
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  pageWrapper: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignItems: "center",
  },
  scrollView: {
    width: "100%",
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.six,
    gap: Spacing.four,
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.three,
    marginTop: Spacing.four,
    paddingBottom: Spacing.six,
  },
});
