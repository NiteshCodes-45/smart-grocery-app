import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function LandingScreen({navigation}) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ---------------- HERO ---------------- */}
      <View style={styles.hero}>
        <Text style={styles.brand}>SMART GROCERY</Text>

        <Text style={styles.heroTitle}>
          Organize. Track. Understand.
        </Text>

        <Text style={styles.heroSubtitle}>
          Smarter grocery planning with intelligent history tracking
          and spending insights.
        </Text>

        <View style={styles.heroButtons}>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.primaryBtnText}>
              Get Started
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.secondaryBtnText}>
              Create Account
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ---------------- VALUE STRIP ---------------- */}
      <View style={styles.valueStrip}>
        <ValueItem text="Offline Ready" />
        <ValueItem text="Smart Insights" />
        <ValueItem text="History Tracking" />
        <ValueItem text="Seasonal Suggestions" />
      </View>

      {/* ---------------- CORE BENEFITS ---------------- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Built for Smarter Households</Text>

        <Benefit
          icon="cart-outline"
          title="Smart Lists"
          desc="Create and manage grocery lists in seconds."
        />

        <Benefit
          icon="time-outline"
          title="Automatic History"
          desc="Track sessions and spending automatically."
        />

        <Benefit
          icon="analytics-outline"
          title="Intelligent Insights"
          desc="Understand trends and optimize your shopping."
        />
      </View>

      {/* ---------------- INTELLIGENCE ---------------- */}
      <View style={styles.intelligenceSection}>
        <Text style={styles.sectionTitle}>
          Understand Your Spending
        </Text>

        <Text style={styles.intelligenceText}>
          • Monthly spending comparisons
        </Text>
        <Text style={styles.intelligenceText}>
          • Most consistent purchases
        </Text>
        <Text style={styles.intelligenceText}>
          • Category dominance insights
        </Text>
        <Text style={styles.intelligenceText}>
          • Shopping pattern detection
        </Text>
      </View>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>

        <Step number="1" text="Login securely" />
        <Step number="2" text="Create your grocery list" />
        <Step number="3" text="Track and analyze purchases" />
      </View>

      {/* ---------------- FINAL CTA ---------------- */}
      <View style={styles.finalCta}>
        <Text style={styles.finalCtaTitle}>
          Start organizing smarter today.
        </Text>

        <Pressable
          style={styles.primaryBtnLarge}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.primaryBtnText}>
            Get Started Free
          </Text>
        </Pressable>
      </View>

      {/* ---------------- FOOTER ---------------- */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Smart Grocery v1.2.0
        </Text>
        <Text style={styles.footerSub}>
          Organized households. Smarter decisions.
        </Text>
      </View>
    </ScrollView>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function ValueItem({ text }) {
  return (
    <View style={styles.valueItem}>
      <Ionicons name="checkmark-circle-outline" size={16} color="#2F6F4E" />
      <Text style={styles.valueText}>{text}</Text>
    </View>
  );
}

function Benefit({ icon, title, desc }) {
  return (
    <View style={styles.benefitRow}>
      <Ionicons name={icon} size={22} color="#2F6F4E" />
      <View style={{ flex: 1 }}>
        <Text style={styles.benefitTitle}>{title}</Text>
        <Text style={styles.benefitDesc}>{desc}</Text>
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

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F6",
  },
  content: {
    paddingVertical: 50,
    paddingHorizontal: 24,
  },

  /* HERO */
  hero: {
    marginBottom: 40,
  },
  brand: {
    fontSize: 12,
    letterSpacing: 2,
    color: "#2F6F4E",
    marginBottom: 10,
    fontWeight: "600",
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 14,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 24,
  },
  heroButtons: {
    flexDirection: "row",
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: "#2F6F4E",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  primaryBtnLarge: {
    backgroundColor: "#2F6F4E",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#2F6F4E",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  secondaryBtnText: {
    color: "#2F6F4E",
    fontWeight: "600",
  },

  /* VALUE STRIP */
  valueStrip: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 40,
  },
  valueItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  valueText: {
    fontSize: 13,
    color: "#444",
  },

  /* SECTION */
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1B4332",
  },

  /* BENEFITS */
  benefitRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1B4332",
  },
  benefitDesc: {
    fontSize: 13,
    color: "#555",
  },

  /* INTELLIGENCE */
  intelligenceSection: {
    marginBottom: 40,
  },
  intelligenceText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#444",
  },

  /* STEPS */
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
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

  /* FINAL CTA */
  finalCta: {
    marginBottom: 40,
    alignItems: "center",
  },
  finalCtaTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1B4332",
    textAlign: "center",
  },

  /* FOOTER */
  footer: {
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#777",
  },
  footerSub: {
    fontSize: 12,
    color: "#999",
  },
});