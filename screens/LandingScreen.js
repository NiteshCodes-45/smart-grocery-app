import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import HeroSection from "../components/landingPages/HeroSection";

export default function LandingScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* HERO SECTION */}
      <HeroSection />

      {/* VALUE SECTION */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Why Smart Grocery?</Text>

        <ValueItem
          icon="checkmark-circle-outline"
          text="Never forget what to buy"
        />
        <ValueItem icon="leaf-outline" text="Seasonal fruits & vegetables" />
        <ValueItem icon="list-outline" text="Simple To Buy & Bought tracking" />
        <ValueItem icon="cloud-offline-outline" text="Works offline" />
      </View>

      {/* FEATURES */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Features</Text>

        <FeatureRow
          icon="cart-outline"
          title="Smart Lists"
          desc="Create, edit and manage groceries easily"
        />

        <FeatureRow
          icon="sunny-outline"
          title="Seasonal Suggestions"
          desc="Eat fresh with season-based produce"
        />

        <FeatureRow
          icon="location-outline"
          title="Location Based"
          desc="Personalized to your area"
        />

        <FeatureRow
          icon="checkbox-outline"
          title="Simple Tracking"
          desc="Track what you bought at a glance"
        />
      </View>

      {/* HOW IT WORKS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>How it works</Text>

        <Step number="1" text="Login with your email" />
        <Step number="2" text="Add groceries you need" />
        <Step number="3" text="Track what you bought" />
      </View>

      {/* CTA */}
      {/* <View style={styles.cta}>
        <Text style={styles.ctaText}>Ready to get started?</Text>

        <Pressable style={styles.primaryBtn} onPress={onLogin}>
          <Ionicons name="log-in-outline" size={20} color="#2F6F4E" />
          <Text style={styles.primaryBtnText}>Login with Email</Text>
        </Pressable>
      </View> */}

      {/* FOOTER */}
      <Text style={styles.footer}>Made with ❤️ for smart households</Text>
    </ScrollView>
  );
}

/* ---------- SMALL UI HELPERS ---------- */

function ValueItem({ icon, text }) {
  return (
    <View style={styles.valueRow}>
      <Ionicons name={icon} size={20} color="#2F6F4E" />
      <Text style={styles.valueText}>{text}</Text>
    </View>
  );
}

function FeatureRow({ icon, title, desc }) {
  return (
    <View style={styles.featureRow}>
      <Ionicons name={icon} size={24} color="#2F6F4E" />
      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </View>
  );
}

function Step({ number, text }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepCircle}>
        <Text style={styles.stepNumber}>{number}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F7F4",
  },
  content: {
    paddingVertical: 40,
  },

  /* CARD */
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B4332",
    marginBottom: 12,
  },

  /* VALUE */
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  valueText: {
    fontSize: 14,
    color: "#444",
  },

  /* FEATURES */
  featureRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1B4332",
  },
  featureDesc: {
    fontSize: 13,
    color: "#555",
  },

  /* STEPS */
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2F6F4E",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  stepText: {
    fontSize: 14,
    color: "#444",
  },

  /* CTA */
  cta: {
    marginTop: 24,
    alignItems: "center",
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1B4332",
  },

  /* FOOTER */
  footer: {
    textAlign: "center",
    marginVertical: 24,
    fontSize: 12,
    color: "#777",
  },
});
