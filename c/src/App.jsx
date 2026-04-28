import { useState } from "react";

// ─── ARCHETYPE DEFINITIONS ───────────────────────────────────────────────────
// Names taken directly from The Health Rebels Hormone Archetype doc
// GHL result page URLs use evocative neutral slugs — no clinical info in URL

const ARCHETYPES = {
  HC: { id: "HC", name: "The Live Wire",    ghlSlug: "the-live-wire" },
  LC: { id: "LC", name: "The Long Game",   ghlSlug: "the-long-game" },
  OD: { id: "OD", name: "The Tidal Wave",  ghlSlug: "the-tidal-wave" },
  IR: { id: "IR", name: "The Slow Burn",   ghlSlug: "the-slow-burn" },
  HT: { id: "HT", name: "The Still Waters",ghlSlug: "the-still-waters" },
  MIX:{ id: "MIX",name: "The Full Picture",ghlSlug: "the-full-picture" },
};

// ─── GHL BASE URL ─────────────────────────────────────────────────────────────
// Replace with your actual GHL funnel domain before deploying
const GHL_BASE_URL = "https://thelivingherb.com/quiz";

// ─── QUESTIONS ───────────────────────────────────────────────────────────────
// HC = The Live Wire
// LC = The Long Game
// OD = The Tidal Wave
// IR = The Slow Burn
// HT = The Still Waters

const QUESTIONS = [
  {
    id: 1,
    section: "Energy",
    question: "How would you describe your energy across the day?",
    options: [
      { text: "Tired all day but wide awake at night — second wind hits around 9pm", scores: { HC: 3, LC: 0, OD: 1, IR: 0, HT: 0 } },
      { text: "Completely flat all day — no second wind, just grey exhaustion from morning to night", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 1 } },
      { text: "Okay until about 2–3pm, then I fall off a cliff — especially after eating", scores: { HC: 0, LC: 0, OD: 0, IR: 3, HT: 1 } },
      { text: "Everything takes more effort than it should — my energy is just permanently low", scores: { HC: 0, LC: 1, OD: 0, IR: 0, HT: 3 } },
      { text: "Variable — some days wired, some days completely flat, hard to predict", scores: { HC: 2, LC: 2, OD: 1, IR: 1, HT: 0 } },
    ]
  },
  {
    id: 2,
    section: "Energy",
    question: "What are your mornings like — first thing, before caffeine?",
    options: [
      { text: "I hit the ground running — mornings are actually my best time", scores: { HC: 1, LC: 0, OD: 0, IR: 0, HT: 0 } },
      { text: "Can't function before 10am. I'm not a morning person — I'm a barely-a-person person", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 1 } },
      { text: "Foggy and slow but I manage — need coffee before I can form sentences", scores: { HC: 1, LC: 1, OD: 1, IR: 0, HT: 2 } },
      { text: "Anxious from the moment I wake up — heart racing, mind already going", scores: { HC: 3, LC: 0, OD: 1, IR: 0, HT: 0 } },
      { text: "Stiff, slow, and cold — takes me a while to warm up physically", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 3 } },
    ]
  },
  {
    id: 3,
    section: "Energy",
    question: "What happens to your energy after exercise?",
    options: [
      { text: "I feel better for it — it helps shift the anxiety and tension", scores: { HC: 2, LC: 0, OD: 0, IR: 1, HT: 0 } },
      { text: "It wipes me out — I need a day or more to recover from a workout", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 1 } },
      { text: "I feel okay during but I crash hard afterwards", scores: { HC: 0, LC: 2, OD: 0, IR: 1, HT: 1 } },
      { text: "I feel slow during it — I used to be fitter and I can't work out why it's harder now", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 3 } },
      { text: "It depends entirely on where I am in my cycle — sometimes fine, sometimes terrible", scores: { HC: 1, LC: 0, OD: 2, IR: 1, HT: 0 } },
    ]
  },
  {
    id: 4,
    section: "Sleep",
    question: "Which of these sounds most like your sleep pattern?",
    options: [
      { text: "Can't fall asleep — mind won't stop, lying there replaying the day at midnight", scores: { HC: 3, LC: 0, OD: 1, IR: 0, HT: 0 } },
      { text: "Fall asleep fine but wake between 2 and 4am and can't get back to sleep", scores: { HC: 1, LC: 0, OD: 3, IR: 0, HT: 0 } },
      { text: "Sleep 10+ hours and still wake up exhausted — sleep doesn't restore me", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 1 } },
      { text: "My sleep is disrupted by being too hot or by night sweats", scores: { HC: 1, LC: 0, OD: 2, IR: 1, HT: 0 } },
      { text: "I sleep a reasonable amount but I'm still tired — the quantity is there, the quality isn't", scores: { HC: 0, LC: 1, OD: 0, IR: 1, HT: 2 } },
    ]
  },
  {
    id: 5,
    section: "Sleep",
    question: "How do you feel about going to bed?",
    options: [
      { text: "I dread it — I know I won't sleep properly and the anxiety about not sleeping makes it worse", scores: { HC: 3, LC: 0, OD: 2, IR: 0, HT: 0 } },
      { text: "I can't wait — I'm exhausted all the time and sleep is the only relief", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 1 } },
      { text: "Fine with going to bed — I just don't wake up feeling any better", scores: { HC: 0, LC: 1, OD: 0, IR: 0, HT: 3 } },
      { text: "I'm fine if I go to bed late enough — before midnight and I just lie there", scores: { HC: 2, LC: 0, OD: 1, IR: 0, HT: 0 } },
      { text: "It varies a lot depending on the time of month", scores: { HC: 0, LC: 0, OD: 3, IR: 0, HT: 0 } },
    ]
  },
  {
    id: 6,
    section: "Mood & Mind",
    question: "Which emotion shows up most often that you'd rather it didn't?",
    options: [
      { text: "Anxiety — low-level, constant, like something bad is about to happen", scores: { HC: 3, LC: 0, OD: 2, IR: 0, HT: 0 } },
      { text: "Flat nothing — not sad, not happy, just grey and unmotivated", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 1 } },
      { text: "Irritability — I snap at people and then feel awful about it", scores: { HC: 2, LC: 0, OD: 3, IR: 0, HT: 0 } },
      { text: "Low mood and weepiness, especially in the second half of my cycle", scores: { HC: 0, LC: 1, OD: 3, IR: 0, HT: 1 } },
      { text: "General flatness and low mood that doesn't track my cycle — it's just always there", scores: { HC: 0, LC: 2, OD: 0, IR: 1, HT: 2 } },
    ]
  },
  {
    id: 7,
    section: "Mood & Mind",
    question: "What's your brain like most days?",
    options: [
      { text: "Buzzing — too many thoughts, can't settle, hard to focus because of the noise", scores: { HC: 3, LC: 0, OD: 1, IR: 0, HT: 0 } },
      { text: "Slow and foggy — simple tasks feel hard, I lose words, I forget things mid-sentence", scores: { HC: 0, LC: 2, OD: 0, IR: 0, HT: 3 } },
      { text: "Reasonable most of the time but I have patches — usually worse before my period", scores: { HC: 0, LC: 0, OD: 3, IR: 1, HT: 0 } },
      { text: "Flat and unmotivated — I have the capacity but no drive to use it", scores: { HC: 0, LC: 3, OD: 0, IR: 1, HT: 1 } },
      { text: "Foggy after meals, clearer if I skip eating — food seems to make my brain worse", scores: { HC: 0, LC: 0, OD: 0, IR: 3, HT: 0 } },
    ]
  },
  {
    id: 8,
    section: "Mood & Mind",
    question: "How well do you handle stress compared to how you used to?",
    options: [
      { text: "Much worse — things that wouldn't have bothered me before now feel overwhelming", scores: { HC: 3, LC: 1, OD: 1, IR: 0, HT: 0 } },
      { text: "I don't really react to stress anymore — I just feel nothing", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 0 } },
      { text: "My threshold is lower in the week before my period — I'm fine otherwise", scores: { HC: 0, LC: 0, OD: 3, IR: 0, HT: 0 } },
      { text: "About the same, but I recover much more slowly than I used to", scores: { HC: 1, LC: 2, OD: 0, IR: 0, HT: 2 } },
      { text: "I feel wired and agitated under stress, but then crash completely afterwards", scores: { HC: 2, LC: 1, OD: 0, IR: 1, HT: 0 } },
    ]
  },
  {
    id: 9,
    section: "Weight & Body",
    question: "Where do you tend to carry excess weight, or where has your body shape changed?",
    options: [
      { text: "Around my middle and abdomen — it arrived and refuses to leave regardless of what I eat", scores: { HC: 2, LC: 0, OD: 1, IR: 3, HT: 1 } },
      { text: "All over — general puffiness and fluid retention, especially cyclically", scores: { HC: 1, LC: 0, OD: 3, IR: 0, HT: 0 } },
      { text: "I've gained weight generally and can't explain it — my diet hasn't changed", scores: { HC: 1, LC: 0, OD: 0, IR: 1, HT: 3 } },
      { text: "I haven't gained weight but I feel like I'm retaining fluid constantly", scores: { HC: 0, LC: 0, OD: 3, IR: 0, HT: 0 } },
      { text: "Weight isn't my main issue — it's everything else that's the problem", scores: { HC: 1, LC: 1, OD: 0, IR: 0, HT: 1 } },
    ]
  },
  {
    id: 10,
    section: "Weight & Body",
    question: "What's your relationship with food and hunger like?",
    options: [
      { text: "I crave sugar and salt constantly — my body seems to demand them", scores: { HC: 2, LC: 2, OD: 0, IR: 1, HT: 0 } },
      { text: "Carb cravings specifically — bread, pasta, sweet things. It feels compelled, not just hungry", scores: { HC: 1, LC: 0, OD: 0, IR: 3, HT: 0 } },
      { text: "I struggle to skip meals — I get shaky, irritable, or foggy if I don't eat regularly", scores: { HC: 1, LC: 2, OD: 0, IR: 2, HT: 0 } },
      { text: "My appetite is low — food doesn't interest me the way it used to", scores: { HC: 0, LC: 2, OD: 0, IR: 0, HT: 2 } },
      { text: "I eat reasonably well but still gain weight — my metabolism seems to have given up", scores: { HC: 0, LC: 0, OD: 1, IR: 2, HT: 3 } },
    ]
  },
  {
    id: 11,
    section: "Weight & Body",
    question: "How would you describe your temperature regulation?",
    options: [
      { text: "I run hot — I overheat easily and hate being warm", scores: { HC: 2, LC: 0, OD: 1, IR: 0, HT: 0 } },
      { text: "Always cold — cold hands, cold feet, the last one to warm up in any room", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 3 } },
      { text: "Hot flushes or waves of heat — unpredictable, often at night", scores: { HC: 1, LC: 0, OD: 2, IR: 0, HT: 0 } },
      { text: "Normal — temperature isn't something I notice particularly", scores: { HC: 0, LC: 1, OD: 0, IR: 1, HT: 0 } },
      { text: "Variable — sometimes too hot, sometimes too cold, doesn't make sense", scores: { HC: 1, LC: 1, OD: 1, IR: 1, HT: 1 } },
    ]
  },
  {
    id: 12,
    section: "Periods & Cycle",
    question: "What are your periods like?",
    options: [
      { text: "Heavy, painful, or lasting longer than 5 days — or all three", scores: { HC: 0, LC: 0, OD: 3, IR: 1, HT: 1 } },
      { text: "Irregular or missing — cycles that vary wildly in length or don't arrive at all", scores: { HC: 2, LC: 1, OD: 1, IR: 3, HT: 1 } },
      { text: "Light and regular — no significant problems with the period itself", scores: { HC: 1, LC: 0, OD: 0, IR: 0, HT: 0 } },
      { text: "I don't have periods (menopause, surgical, or hormonal contraception)", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 0 } },
      { text: "My cycle is regular but the week before is difficult — PMS or noticeable mood and body changes", scores: { HC: 1, LC: 0, OD: 3, IR: 0, HT: 0 } },
    ]
  },
  {
    id: 13,
    section: "Periods & Cycle",
    question: "If you track your symptoms across the month, do they follow a pattern?",
    options: [
      { text: "Yes — I fall apart in the week before my period and recover quickly once it starts", scores: { HC: 0, LC: 0, OD: 3, IR: 0, HT: 0 } },
      { text: "My symptoms are pretty consistent all month — no real cyclical variation", scores: { HC: 1, LC: 2, OD: 0, IR: 1, HT: 2 } },
      { text: "I don't track but I suspect there's a pattern I haven't properly mapped yet", scores: { HC: 1, LC: 0, OD: 2, IR: 1, HT: 0 } },
      { text: "Since perimenopause or menopause the patterns I had have changed or disappeared", scores: { HC: 1, LC: 1, OD: 2, IR: 1, HT: 1 } },
      { text: "My worst time is mid-cycle — I don't fit the typical PMS pattern", scores: { HC: 2, LC: 0, OD: 1, IR: 1, HT: 0 } },
    ]
  },
  {
    id: 14,
    section: "Skin, Hair & Body",
    question: "What's happening with your skin?",
    options: [
      { text: "Adult acne — particularly jaw, chin, or cheeks", scores: { HC: 1, LC: 0, OD: 1, IR: 3, HT: 0 } },
      { text: "Dull, dry, or thickening skin — it looks and feels different than it used to", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 3 } },
      { text: "Cyclical skin issues — spots or congestion that clearly track my cycle", scores: { HC: 0, LC: 0, OD: 3, IR: 1, HT: 0 } },
      { text: "Generally fine — no major skin concerns", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 0 } },
      { text: "Flushing, redness, or hives that come and go without obvious cause", scores: { HC: 1, LC: 0, OD: 2, IR: 0, HT: 0 } },
    ]
  },
  {
    id: 15,
    section: "Skin, Hair & Body",
    question: "What's happening with your hair?",
    options: [
      { text: "Thinning on my scalp — it's coming out in the shower and in my brush", scores: { HC: 1, LC: 0, OD: 1, IR: 2, HT: 2 } },
      { text: "Thinning specifically at the outer third of my eyebrows", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 3 } },
      { text: "Unwanted hair growth — face, chin, or abdomen", scores: { HC: 0, LC: 0, OD: 0, IR: 3, HT: 0 } },
      { text: "Dry, coarse, or brittle hair — the texture has changed", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 3 } },
      { text: "No significant hair changes", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 0 } },
    ]
  },
  {
    id: 16,
    section: "Gut & Immune",
    question: "What's your gut like?",
    options: [
      { text: "IBS-type symptoms — bloating, urgency, constipation or diarrhoea with no consistent cause", scores: { HC: 2, LC: 1, OD: 2, IR: 1, HT: 0 } },
      { text: "Chronically constipated — slow digestion, uncomfortable", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 3 } },
      { text: "Cyclical bloating and fluid retention that's clearly hormonal", scores: { HC: 0, LC: 0, OD: 3, IR: 0, HT: 0 } },
      { text: "Generally fine digestively — no major complaints", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 0 } },
      { text: "Bloated after most things — food sensitivities that seem to be getting worse over time", scores: { HC: 1, LC: 1, OD: 1, IR: 2, HT: 0 } },
    ]
  },
  {
    id: 17,
    section: "Gut & Immune",
    question: "What's your immune system like?",
    options: [
      { text: "I catch everything — recurrent colds, infections, slow to recover", scores: { HC: 3, LC: 0, OD: 0, IR: 1, HT: 0 } },
      { text: "I have an autoimmune condition, or I've been told my immune system is overactive", scores: { HC: 0, LC: 2, OD: 0, IR: 0, HT: 3 } },
      { text: "Allergies, intolerances, or sensitivities that are getting worse over time", scores: { HC: 1, LC: 2, OD: 2, IR: 1, HT: 0 } },
      { text: "Generally robust — I don't get ill often", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 0 } },
      { text: "Unpredictable — sometimes fine, sometimes I get floored by something small", scores: { HC: 1, LC: 2, OD: 1, IR: 0, HT: 1 } },
    ]
  },
  {
    id: 18,
    section: "Physical Symptoms",
    question: "Do any of these physical symptoms sound familiar?",
    options: [
      { text: "Heart palpitations, racing heart, or awareness of my heartbeat", scores: { HC: 2, LC: 0, OD: 2, IR: 1, HT: 1 } },
      { text: "Low blood pressure — dizziness when I stand up, feeling faint, needing salt", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 0 } },
      { text: "Muscle weakness, joint pain, or stiffness that's disproportionate to activity", scores: { HC: 0, LC: 1, OD: 0, IR: 0, HT: 3 } },
      { text: "Fluid retention — puffy fingers, ankles, or face in the morning", scores: { HC: 1, LC: 0, OD: 3, IR: 1, HT: 1 } },
      { text: "None of these particularly", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 0 } },
    ]
  },
  {
    id: 19,
    section: "Your History",
    question: "Which of these comes closest to your health history?",
    options: [
      { text: "I've been under sustained stress for years — work, family, loss, or all of the above", scores: { HC: 3, LC: 2, OD: 1, IR: 0, HT: 0 } },
      { text: "I've been diagnosed with PCOS, fibroids, endometriosis, or an ovarian cyst", scores: { HC: 0, LC: 0, OD: 2, IR: 3, HT: 0 } },
      { text: "I've been told I have thyroid issues, or I suspect I do — test results that came back 'borderline'", scores: { HC: 0, LC: 0, OD: 1, IR: 0, HT: 3 } },
      { text: "My symptoms started after a specific event — illness, pregnancy, bereavement, a particularly bad year", scores: { HC: 1, LC: 3, OD: 1, IR: 0, HT: 1 } },
      { text: "Nothing specific — it's just been a slow decline over the last few years", scores: { HC: 1, LC: 1, OD: 1, IR: 2, HT: 2 } },
    ]
  },
  {
    id: 20,
    section: "Your History",
    question: "When you've described your symptoms to a doctor, what has happened?",
    options: [
      { text: "I've been told my bloods are normal and offered antidepressants or the pill", scores: { HC: 2, LC: 1, OD: 2, IR: 1, HT: 2 } },
      { text: "I've been diagnosed with anxiety or depression and treated for that", scores: { HC: 3, LC: 1, OD: 2, IR: 0, HT: 0 } },
      { text: "I've been told it's 'just' perimenopause or menopause", scores: { HC: 1, LC: 0, OD: 2, IR: 1, HT: 1 } },
      { text: "I haven't really talked to a doctor about it — I don't think they'll take me seriously", scores: { HC: 1, LC: 2, OD: 1, IR: 1, HT: 1 } },
      { text: "I've had investigation and been told things are slightly off but not enough to treat", scores: { HC: 1, LC: 1, OD: 1, IR: 2, HT: 3 } },
    ]
  },
  {
    id: 21,
    section: "The Last One",
    question: "If you had to describe how you feel in your body right now in one sentence, which is closest?",
    options: [
      { text: "Like I'm running on empty but I can't stop — exhausted but unable to rest", scores: { HC: 3, LC: 1, OD: 1, IR: 0, HT: 0 } },
      { text: "Like someone turned the volume down on my life — everything is muted and slow", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 2 } },
      { text: "Like my body has a completely different agenda to me — I can't trust it or predict it", scores: { HC: 0, LC: 0, OD: 3, IR: 1, HT: 0 } },
      { text: "Like I'm fighting my own biology — everything that should be easy is harder than it should be", scores: { HC: 1, LC: 0, OD: 0, IR: 3, HT: 1 } },
      { text: "Like someone swapped me for a slower, stiffer, foggier version of myself", scores: { HC: 0, LC: 1, OD: 0, IR: 0, HT: 3 } },
    ]
  }
];

// ─── SCORING ──────────────────────────────────────────────────────────────────

function calculateResult(answers) {
  const totals = { HC: 0, LC: 0, OD: 0, IR: 0, HT: 0 };
  answers.forEach(({ questionId, optionIndex }) => {
    const q = QUESTIONS.find(q => q.id === questionId);
    if (!q) return;
    const scores = q.options[optionIndex]?.scores;
    if (!scores) return;
    Object.entries(scores).forEach(([k, v]) => { totals[k] += v; });
  });
  const maxScore = Math.max(...Object.values(totals));
  if (maxScore === 0) return { primary: "HC", secondary: null, isMix: false };
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const [primaryKey, primaryScore] = sorted[0];
  const [secondaryKey, secondaryScore] = sorted[1];
  const isMix = secondaryScore > 0 && (secondaryScore / primaryScore) >= 0.65;
  return { primary: primaryKey, secondary: isMix ? secondaryKey : null, isMix };
}

function getRedirectUrl(result) {
  const slug = result.isMix ? ARCHETYPES.MIX.ghlSlug : ARCHETYPES[result.primary].ghlSlug;
  return `${GHL_BASE_URL}/${slug}`;
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 12, color: "#5a5248", fontFamily: "'DM Sans', sans-serif" }}>
        <span>Question {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div style={{ height: 3, background: "#1c1915", borderRadius: 2 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #C8553D, #9B8EC4)", borderRadius: 2, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function IntroScreen({ onStart }) {
  return (
    <div style={{ animation: "fadeIn 0.4s ease", textAlign: "center" }}>
      <div style={{ display: "inline-block", padding: "5px 14px", background: "rgba(200,85,61,0.1)", border: "1px solid rgba(200,85,61,0.22)", borderRadius: 20, marginBottom: 22, fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.13em", textTransform: "uppercase", color: "#C8553D", fontWeight: 600 }}>
        The Health Rebels
      </div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 38px)", color: "#f0ece4", fontWeight: 800, lineHeight: 1.25, margin: "0 0 18px" }}>
        What is your hormone<br />archetype?
      </h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 2.5vw, 16px)", color: "#a09888", lineHeight: 1.75, maxWidth: 420, margin: "0 auto 14px" }}>
        You've been told your bloods are normal. You've been offered antidepressants, the pill, or a sympathetic shrug.
      </p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 2.5vw, 16px)", color: "#a09888", lineHeight: 1.75, maxWidth: 420, margin: "0 auto 28px" }}>
        And you still feel awful. There's a reason for that. And it's a lot more specific than "hormones".
      </p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#4a4540", marginBottom: 28, lineHeight: 1.5 }}>
        21 questions. About 5 minutes. No blood tests required (yet).
      </p>
      <button
        onClick={onStart}
        style={{ background: "linear-gradient(135deg, #C8553D, #A8442F)", border: "none", borderRadius: 12, padding: "15px 34px", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 28px rgba(200,85,61,0.28)", transition: "transform 0.15s ease, box-shadow 0.15s ease", letterSpacing: "0.02em" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(200,85,61,0.38)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(200,85,61,0.28)"; }}
      >
        Find out my archetype →
      </button>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#302c28", marginTop: 18, lineHeight: 1.5 }}>
        This quiz is for informational purposes only and does not constitute medical advice.
      </p>
    </div>
  );
}

function QuizQuestion({ question, questionNumber, total, onAnswer, selectedOption }) {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <ProgressBar current={questionNumber} total={total} />
      <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C8553D", fontFamily: "'DM Sans', sans-serif", marginBottom: 10, fontWeight: 600 }}>
        {question.section}
      </div>
      <h2 style={{ fontSize: "clamp(17px, 3vw, 21px)", fontFamily: "'Playfair Display', serif", color: "#f0ece4", fontWeight: 700, lineHeight: 1.4, margin: "0 0 22px" }}>
        {question.question}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(question.id, i)}
            style={{
              background: selectedOption === i ? "rgba(200,85,61,0.14)" : "rgba(255,255,255,0.03)",
              border: `1.5px solid ${selectedOption === i ? "#C8553D" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 10,
              padding: "13px 16px",
              textAlign: "left",
              color: selectedOption === i ? "#f0ece4" : "#908880",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(13px, 2.5vw, 15px)",
              lineHeight: 1.55,
              cursor: "pointer",
              transition: "all 0.18s ease",
              fontWeight: selectedOption === i ? 500 : 400,
            }}
            onMouseEnter={e => { if (selectedOption !== i) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.color = "#f0ece4"; } }}
            onMouseLeave={e => { if (selectedOption !== i) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#908880"; } }}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function CalculatingScreen() {
  return (
    <div style={{ textAlign: "center", padding: "40px 0", animation: "fadeIn 0.4s ease" }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>🧬</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 4vw, 26px)", color: "#f0ece4", fontWeight: 700, marginBottom: 14, lineHeight: 1.3 }}>
        Reading your pattern...
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#a09888", fontSize: 15, lineHeight: 1.7, maxWidth: 340, margin: "0 auto 28px" }}>
        Your results are on their way. You'll be redirected to your full archetype breakdown in just a moment.
      </p>
      <div style={{ width: 36, height: 36, border: "3px solid rgba(200,85,61,0.18)", borderTopColor: "#C8553D", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function HormoneQuiz() {
  const [stage, setStage] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleStart = () => { setStage("quiz"); setCurrentQ(0); setAnswers([]); setSelectedOption(null); };

  const handleAnswer = (questionId, optionIndex) => {
    setSelectedOption(optionIndex);
    setTimeout(() => {
      const newAnswers = [...answers.filter(a => a.questionId !== questionId), { questionId, optionIndex }];
      setAnswers(newAnswers);
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelectedOption(null);
      } else {
        setStage("calculating");
        const result = calculateResult(newAnswers);
        const url = getRedirectUrl(result);
        setTimeout(() => { window.location.href = url; }, 2000);
      }
    }, 320);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#0e0c0a", backgroundImage: "radial-gradient(ellipse at 15% 15%, rgba(200,85,61,0.07) 0%, transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(155,142,196,0.05) 0%, transparent 55%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
        <div style={{ width: "100%", maxWidth: 540, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "clamp(24px, 5vw, 44px)", boxShadow: "0 24px 80px rgba(0,0,0,0.55)" }}>
          {stage === "intro" && <IntroScreen onStart={handleStart} />}
          {stage === "quiz" && QUESTIONS[currentQ] && (
            <QuizQuestion
              question={QUESTIONS[currentQ]}
              questionNumber={currentQ + 1}
              total={QUESTIONS.length}
              onAnswer={handleAnswer}
              selectedOption={selectedOption}
            />
          )}
          {stage === "calculating" && <CalculatingScreen />}
        </div>
      </div>
    </>
  );
}
