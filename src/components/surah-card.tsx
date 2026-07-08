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
  },
  card: {
    borderRadius: 18,
    padding: Spacing.three,
    minHeight: 110,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  inner: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  arabic: {
    fontSize: 22,
    lineHeight: 28,
  },
  english: {
    marginTop: Spacing.one,
    opacity: 0.9,
  },
});
