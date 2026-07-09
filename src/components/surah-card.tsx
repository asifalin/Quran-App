import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

type Props = {
  arabic: string;
  english?: string;
  onPress?: () => void;
};

export function SurahCard({ arabic, english, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.touch}
    >
      <ThemedView type="backgroundElement" style={styles.card}>
        <View style={styles.inner}>
          <ThemedText type="title" style={styles.arabic}>
            {arabic}
          </ThemedText>
          {english ? (
            <ThemedText type="small" style={styles.english}>
              {english}
            </ThemedText>
          ) : null}
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touch: {
    width: "48%",
    marginVertical: Spacing.two,
    minWidth: 160,
  },
  card: {
    borderRadius: 22,
    padding: Spacing.four,
    minHeight: 130,
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    shadowColor: "#0c1b4d",
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  inner: {
    alignItems: "flex-start",
    justifyContent: "center",
    gap: Spacing.one,
  },
  arabic: {
    fontSize: 24,
    lineHeight: 30,
    color: "#F9FAFF",
  },
  english: {
    marginTop: Spacing.one,
    opacity: 0.9,
    color: "#DDE6FF",
    fontWeight: "600",
  },
});
