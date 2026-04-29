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
const GHL_BASE_URL = "https://thelivingherb.com";

// ─── QUESTIONS ───────────────────────────────────────────────────────────────
// HC = The Live Wire
// LC = The Long Game
// OD = The Tidal Wave
// IR = The Slow Burn
// HT = The Still Waters

const QUESTIONS = [
  {
    id: 1,
    section: "How You Feel Right Now",
    question: "If you had to sum up how you feel in your body at the moment, which is closest?",
    options: [
      { text: "Wired and exhausted at the same time, running on empty but unable to switch off", scores: { HC: 3, LC: 1, OD: 1, IR: 0, HT: 0 } },
      { text: "Just... flat. Like someone turned the volume down on everything", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 2 } },
      { text: "Flooded, emotional, bloated, and hormonally all over the place", scores: { HC: 0, LC: 0, OD: 3, IR: 1, HT: 0 } },
      { text: "Sluggish, like I'm wading through treacle no matter what I do", scores: { HC: 1, LC: 0, OD: 0, IR: 3, HT: 1 } },
      { text: "Like a different version of myself showed up a few years ago and I can't find my way back", scores: { HC: 0, LC: 1, OD: 0, IR: 0, HT: 3 } },
    ]
  },
  {
    id: 2,
    section: "Sleep",
    question: "Which of these sounds most like your sleep pattern?",
    options: [
      { text: "Can't fall asleep. My mind won't stop and I lie there replaying the day at midnight", scores: { HC: 3, LC: 0, OD: 1, IR: 0, HT: 0 } },
      { text: "Fall asleep fine but wake between 2 and 4am and can't get back to sleep", scores: { HC: 1, LC: 0, OD: 3, IR: 0, HT: 0 } },
      { text: "Sleep long hours and still wake up exhausted. Sleep doesn't restore me", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 1 } },
      { text: "My sleep is disrupted by being too hot or by night sweats", scores: { HC: 1, LC: 0, OD: 2, IR: 1, HT: 0 } },
      { text: "I sleep a reasonable amount but I'm still tired. The quantity is there, the quality isn't", scores: { HC: 0, LC: 1, OD: 0, IR: 1, HT: 2 } },
    ]
  },
  {
    id: 3,
    section: "Sleep",
    question: "How do you feel about going to bed?",
    options: [
      { text: "I dread it. I know I won't sleep properly, and the anxiety about not sleeping makes it worse", scores: { HC: 3, LC: 0, OD: 2, IR: 0, HT: 0 } },
      { text: "I can't wait. I'm exhausted all the time and sleep is the only relief", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 1 } },
      { text: "Fine with going to bed, I just don't wake up feeling any better", scores: { HC: 0, LC: 1, OD: 0, IR: 0, HT: 3 } },
      { text: "I'm fine if I go to bed late enough. Too early and I just lie there", scores: { HC: 2, LC: 0, OD: 1, IR: 0, HT: 0 } },
      { text: "It varies a lot depending on where I am in my cycle", scores: { HC: 0, LC: 0, OD: 3, IR: 0, HT: 0 } },
    ]
  },
  {
    id: 4,
    section: "Energy",
    question: "How would you describe your energy across the day?",
    options: [
      { text: "Tired all day but wide awake at night. Second wind hits around 9pm", scores: { HC: 3, LC: 0, OD: 1, IR: 0, HT: 0 } },
      { text: "Completely flat all day with no second wind, just grey exhaustion from morning to night", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 1 } },
      { text: "Okay until about 2 or 3pm, then I fall off a cliff, especially after eating", scores: { HC: 0, LC: 0, OD: 0, IR: 3, HT: 1 } },
      { text: "Everything takes more effort than it should. My energy feels permanently low", scores: { HC: 0, LC: 1, OD: 0, IR: 0, HT: 3 } },
      { text: "Variable. Some days wired, some days completely flat, and I can't predict which", scores: { HC: 2, LC: 2, OD: 1, IR: 1, HT: 0 } },
    ]
  },
  {
    id: 5,
    section: "Energy",
    question: "What are your mornings like, before caffeine?",
    options: [
      { text: "I hit the ground running. Mornings are actually my best time", scores: { HC: 1, LC: 0, OD: 0, IR: 0, HT: 0 } },
      { text: "Can't function before 10am. I'm not a morning person, I'm a barely-a-person person", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 1 } },
      { text: "Foggy and slow but I manage. I need coffee before I can form sentences", scores: { HC: 1, LC: 1, OD: 1, IR: 0, HT: 2 } },
      { text: "Anxious from the moment I wake up, heart racing, mind already going", scores: { HC: 3, LC: 0, OD: 1, IR: 0, HT: 0 } },
      { text: "Stiff, slow, and cold. Takes me a while to warm up physically", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 3 } },
    ]
  },
  {
    id: 6,
    section: "Energy",
    question: "What happens to your energy after exercise?",
    options: [
      { text: "I feel better for it. It helps shift the anxiety and tension", scores: { HC: 2, LC: 0, OD: 0, IR: 1, HT: 0 } },
      { text: "It wipes me out. I need a day or more to recover from a workout", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 1 } },
      { text: "I feel okay during but I crash hard afterwards", scores: { HC: 0, LC: 2, OD: 0, IR: 1, HT: 1 } },
      { text: "I feel slow during it. I used to be fitter and I can't work out why it's harder now", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 3 } },
      { text: "It depends entirely on where I am in my cycle, sometimes fine, sometimes terrible", scores: { HC: 1, LC: 0, OD: 2, IR: 1, HT: 0 } },
    ]
  },
  {
    id: 7,
    section: "Mood & Brain",
    question: "Which emotion shows up most often that you'd rather it didn't?",
    options: [
      { text: "Anxiety, low-level and constant, like something bad is about to happen", scores: { HC: 3, LC: 0, OD: 2, IR: 0, HT: 0 } },
      { text: "Flat nothing. Not sad, not happy, just grey and unmotivated", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 1 } },
      { text: "Irritability. I snap at people and then feel awful about it", scores: { HC: 2, LC: 0, OD: 3, IR: 0, HT: 0 } },
      { text: "Low mood and weepiness, especially in the second half of my cycle", scores: { HC: 0, LC: 1, OD: 3, IR: 0, HT: 1 } },
      { text: "General flatness that doesn't track my cycle. It's just always there", scores: { HC: 0, LC: 2, OD: 0, IR: 1, HT: 2 } },
    ]
  },
  {
    id: 8,
    section: "Mood & Brain",
    question: "What's your brain like most days?",
    options: [
      { text: "Racing, too many tabs open, can't switch off, overthinking everything", scores: { HC: 3, LC: 0, OD: 1, IR: 0, HT: 0 } },
      { text: "Foggy and slow. I forget things, lose words, can't concentrate", scores: { HC: 0, LC: 2, OD: 0, IR: 0, HT: 3 } },
      { text: "Sharp enough but my memory is terrible, especially around my cycle", scores: { HC: 0, LC: 0, OD: 3, IR: 1, HT: 0 } },
      { text: "Flat and unmotivated. I know what I need to do, I just can't seem to start", scores: { HC: 0, LC: 3, OD: 0, IR: 1, HT: 1 } },
      { text: "Inconsistent. Some days sharp, some days completely useless, no pattern I can predict", scores: { HC: 0, LC: 0, OD: 0, IR: 3, HT: 0 } },
    ]
  },
  {
    id: 9,
    section: "Body",
    question: "What's happening with your weight?",
    options: [
      { text: "I gain weight easily, especially around my middle, even when I'm eating well", scores: { HC: 2, LC: 0, OD: 1, IR: 3, HT: 1 } },
      { text: "I can't lose weight no matter what I try. It's like my metabolism has given up", scores: { HC: 1, LC: 0, OD: 0, IR: 1, HT: 3 } },
      { text: "My weight fluctuates wildly with my cycle, with bloating and fluid retention", scores: { HC: 1, LC: 0, OD: 3, IR: 0, HT: 0 } },
      { text: "I've lost weight or muscle without trying and I can't seem to rebuild it", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 0 } },
      { text: "My weight is stable but my body composition is shifting, more fat and less muscle", scores: { HC: 1, LC: 1, OD: 0, IR: 0, HT: 1 } },
    ]
  },
  {
    id: 10,
    section: "Body",
    question: "How would you describe your hunger and cravings?",
    options: [
      { text: "I crave sugar and salt constantly. My body seems to demand them", scores: { HC: 2, LC: 2, OD: 0, IR: 1, HT: 0 } },
      { text: "Carb cravings specifically: bread, pasta, sweet things. It feels compelled, not just hungry", scores: { HC: 1, LC: 0, OD: 0, IR: 3, HT: 0 } },
      { text: "I struggle to skip meals. I get shaky, irritable, or foggy if I don't eat regularly", scores: { HC: 1, LC: 2, OD: 0, IR: 2, HT: 0 } },
      { text: "My appetite is low. Food doesn't interest me the way it used to", scores: { HC: 0, LC: 2, OD: 0, IR: 0, HT: 2 } },
      { text: "I eat reasonably well but still gain weight. My metabolism seems to have checked out", scores: { HC: 0, LC: 0, OD: 1, IR: 2, HT: 3 } },
    ]
  },
  {
    id: 11,
    section: "Body",
    question: "How would you describe your temperature?",
    options: [
      { text: "I run hot and overheat easily. I hate being warm", scores: { HC: 2, LC: 0, OD: 1, IR: 0, HT: 0 } },
      { text: "Always cold: cold hands, cold feet, the last to warm up in any room", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 3 } },
      { text: "Hot flushes or waves of heat, unpredictable and often at night", scores: { HC: 1, LC: 0, OD: 2, IR: 0, HT: 0 } },
      { text: "Normal. Temperature isn't something I notice particularly", scores: { HC: 0, LC: 1, OD: 0, IR: 1, HT: 0 } },
      { text: "Variable. Sometimes too hot, sometimes too cold, and it makes no sense", scores: { HC: 1, LC: 1, OD: 1, IR: 1, HT: 1 } },
    ]
  },
  {
    id: 12,
    section: "Body",
    question: "What's happening with your skin?",
    options: [
      { text: "Adult acne, particularly on my jaw, chin, or cheeks", scores: { HC: 1, LC: 0, OD: 1, IR: 3, HT: 0 } },
      { text: "Dull, dry, or thickening skin that looks and feels different than it used to", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 3 } },
      { text: "Cyclical skin issues, spots or congestion that clearly track my cycle", scores: { HC: 0, LC: 0, OD: 3, IR: 1, HT: 0 } },
      { text: "Generally fine. No major skin concerns", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 0 } },
      { text: "Flushing, redness, or hives that come and go without obvious cause", scores: { HC: 1, LC: 0, OD: 2, IR: 0, HT: 0 } },
    ]
  },
  {
    id: 13,
    section: "Body",
    question: "What's happening with your hair?",
    options: [
      { text: "Thinning on my scalp. It's coming out in the shower and in my brush", scores: { HC: 1, LC: 0, OD: 1, IR: 2, HT: 2 } },
      { text: "Thinning specifically at the outer third of my eyebrows", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 3 } },
      { text: "Unwanted hair growth on my face, chin, or abdomen", scores: { HC: 0, LC: 0, OD: 0, IR: 3, HT: 0 } },
      { text: "Dry, coarse, or brittle hair. The texture has changed", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 3 } },
      { text: "No significant hair changes", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 0 } },
    ]
  },
  {
    id: 14,
    section: "Periods",
    question: "What are your periods like?",
    options: [
      { text: "Heavy, painful, or lasting longer than 5 days (or all three)", scores: { HC: 0, LC: 0, OD: 3, IR: 1, HT: 1 } },
      { text: "Irregular or missing, with cycles that vary wildly in length or don't arrive at all", scores: { HC: 2, LC: 1, OD: 1, IR: 3, HT: 1 } },
      { text: "Light and regular with no significant problems with the period itself", scores: { HC: 1, LC: 0, OD: 0, IR: 0, HT: 0 } },
      { text: "I don't have periods (menopause, surgical, or hormonal contraception)", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 0 } },
      { text: "My cycle is regular but the week before is difficult, with PMS or noticeable mood and body changes", scores: { HC: 1, LC: 0, OD: 3, IR: 0, HT: 0 } },
    ]
  },
  {
    id: 15,
    section: "Periods",
    question: "If you track your symptoms across the month, do they follow a pattern?",
    options: [
      { text: "Yes. I fall apart in the week before my period and recover quickly once it starts", scores: { HC: 0, LC: 0, OD: 3, IR: 0, HT: 0 } },
      { text: "My symptoms are pretty consistent all month with no real cyclical variation", scores: { HC: 1, LC: 2, OD: 0, IR: 1, HT: 2 } },
      { text: "I don't track but I suspect there's a pattern I haven't properly mapped", scores: { HC: 1, LC: 0, OD: 2, IR: 1, HT: 0 } },
      { text: "Since perimenopause or menopause the patterns I had have changed or disappeared", scores: { HC: 1, LC: 1, OD: 2, IR: 1, HT: 1 } },
      { text: "My worst time is mid-cycle. I don't fit the typical PMS pattern", scores: { HC: 2, LC: 0, OD: 1, IR: 1, HT: 0 } },
    ]
  },
  {
    id: 16,
    section: "Gut Health",
    question: "What's your gut like?",
    options: [
      { text: "IBS-type symptoms: bloating, urgency, constipation or diarrhoea with no consistent cause", scores: { HC: 2, LC: 1, OD: 2, IR: 1, HT: 0 } },
      { text: "Chronically constipated, slow digestion, uncomfortable", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 3 } },
      { text: "Cyclical bloating and fluid retention that's clearly hormonal", scores: { HC: 0, LC: 0, OD: 3, IR: 0, HT: 0 } },
      { text: "Generally fine digestively with no major complaints", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 0 } },
      { text: "Bloated after most things, with food sensitivities that seem to be getting worse over time", scores: { HC: 1, LC: 1, OD: 1, IR: 2, HT: 0 } },
    ]
  },
  {
    id: 17,
    section: "Gut Health",
    question: "What's your immune system like?",
    options: [
      { text: "I catch everything: recurrent colds, infections, slow to recover", scores: { HC: 3, LC: 0, OD: 0, IR: 1, HT: 0 } },
      { text: "I have an autoimmune condition, or I've been told my immune system is overactive", scores: { HC: 0, LC: 2, OD: 0, IR: 0, HT: 3 } },
      { text: "Allergies, intolerances, or sensitivities that are getting worse over time", scores: { HC: 1, LC: 2, OD: 2, IR: 1, HT: 0 } },
      { text: "Generally robust. I don't get ill often", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 0 } },
      { text: "Unpredictable. Sometimes fine, sometimes I get floored by something small", scores: { HC: 1, LC: 2, OD: 1, IR: 0, HT: 1 } },
    ]
  },
  {
    id: 18,
    section: "Your History",
    question: "Do any of these physical symptoms sound familiar?",
    options: [
      { text: "Heart palpitations, racing heart, or awareness of my heartbeat", scores: { HC: 2, LC: 0, OD: 2, IR: 1, HT: 1 } },
      { text: "Low blood pressure: dizziness when I stand up, feeling faint, needing salt", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 0 } },
      { text: "Muscle weakness, joint pain, or stiffness that feels out of proportion to activity", scores: { HC: 0, LC: 1, OD: 0, IR: 0, HT: 3 } },
      { text: "Fluid retention, puffy fingers, ankles, or face in the morning", scores: { HC: 1, LC: 0, OD: 3, IR: 1, HT: 1 } },
      { text: "None of these particularly", scores: { HC: 0, LC: 0, OD: 0, IR: 0, HT: 0 } },
    ]
  },
  {
    id: 19,
    section: "Your History",
    question: "Which of these comes closest to your health history?",
    options: [
      { text: "I've been under sustained stress for years: work, family, loss, or all of the above", scores: { HC: 3, LC: 2, OD: 1, IR: 0, HT: 0 } },
      { text: "I've been diagnosed with PCOS, fibroids, endometriosis, or an ovarian cyst", scores: { HC: 0, LC: 0, OD: 2, IR: 3, HT: 0 } },
      { text: "I've been told I have thyroid issues, or I suspect I do. Results that came back 'borderline'", scores: { HC: 0, LC: 0, OD: 1, IR: 0, HT: 3 } },
      { text: "My symptoms started after a specific event: illness, pregnancy, bereavement, a bad year", scores: { HC: 1, LC: 3, OD: 1, IR: 0, HT: 1 } },
      { text: "Nothing specific. It's just been a slow decline over the last few years", scores: { HC: 1, LC: 1, OD: 1, IR: 2, HT: 2 } },
    ]
  },
  {
    id: 20,
    section: "Your History",
    question: "What has your relationship with stress looked like over the last few years?",
    options: [
      { text: "High and relentless. I've been running on adrenaline and I know it", scores: { HC: 3, LC: 1, OD: 1, IR: 0, HT: 0 } },
      { text: "I used to be high-stress but I've crashed. I don't have the capacity I used to", scores: { HC: 0, LC: 3, OD: 0, IR: 0, HT: 0 } },
      { text: "Moderate but chronic, not dramatic, just never properly off", scores: { HC: 2, LC: 2, OD: 1, IR: 0, HT: 2 } },
      { text: "I've been through something significant and my body hasn't recovered since", scores: { HC: 1, LC: 3, OD: 1, IR: 0, HT: 1 } },
      { text: "I don't feel particularly stressed, but my body seems to think otherwise", scores: { HC: 1, LC: 1, OD: 1, IR: 2, HT: 2 } },
    ]
  },
  {
    id: 21,
    section: "Your History",
    question: "When you've described your symptoms to a doctor, what happened?",
    options: [
      { text: "I was told my bloods are normal and offered antidepressants or the pill", scores: { HC: 2, LC: 1, OD: 2, IR: 1, HT: 2 } },
      { text: "I was diagnosed with anxiety or depression and treated for that", scores: { HC: 3, LC: 1, OD: 2, IR: 0, HT: 0 } },
      { text: "I was told it's 'just' perimenopause or menopause", scores: { HC: 1, LC: 0, OD: 2, IR: 1, HT: 1 } },
      { text: "I haven't really talked to a doctor about it. I don't think they'll take me seriously", scores: { HC: 1, LC: 2, OD: 1, IR: 1, HT: 1 } },
      { text: "I've had some investigation and been told things are slightly off but not enough to treat", scores: { HC: 1, LC: 1, OD: 1, IR: 2, HT: 3 } },
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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 12, color: "#686867", fontFamily: "'DM Sans', sans-serif" }}>
        <span>Question {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div style={{ height: 3, background: "#bac5b9", borderRadius: 2 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #672146, #4e6548)", borderRadius: 2, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function IntroScreen({ onStart }) {
  return (
    <div style={{ animation: "fadeIn 0.4s ease", textAlign: "center" }}>
      <div style={{ display: "inline-block", padding: "5px 14px", background: "rgba(103,33,70,0.1)", border: "1px solid rgba(103,33,70,0.22)", borderRadius: 20, marginBottom: 22, fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.13em", textTransform: "uppercase", color: "#672146", fontWeight: 600 }}>
        The Health Rebels
      </div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 38px)", color: "#672146", fontWeight: 800, lineHeight: 1.25, margin: "0 0 18px" }}>
        What is your hormone<br />archetype?
      </h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 2.5vw, 16px)", color: "#686867", lineHeight: 1.75, maxWidth: 420, margin: "0 auto 14px" }}>
        You've been told your bloods are normal. You've been offered antidepressants, the pill, or a sympathetic shrug.
      </p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 2.5vw, 16px)", color: "#686867", lineHeight: 1.75, maxWidth: 420, margin: "0 auto 28px" }}>
        You still feel awful, and there's a reason for that. It's a lot more specific than "hormones".
      </p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#4e6548", marginBottom: 28, lineHeight: 1.5 }}>
        21 questions. About 5 minutes. Answer as best you can (there are no right or wrong answers, just your pattern).
      </p>
      <button
        onClick={onStart}
        style={{ background: "linear-gradient(135deg, #672146, #4e1a38)", border: "none", borderRadius: 12, padding: "15px 34px", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 28px rgba(103,33,70,0.28)", transition: "transform 0.15s ease, box-shadow 0.15s ease", letterSpacing: "0.02em" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(103,33,70,0.38)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(103,33,70,0.28)"; }}
      >
        Find out my archetype →
      </button>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#686867", marginTop: 18, lineHeight: 1.5 }}>
        This quiz is for informational purposes only and does not constitute medical advice.
      </p>
    </div>
  );
}

function QuizQuestion({ question, questionNumber, total, onAnswer, selectedOption }) {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <ProgressBar current={questionNumber} total={total} />
      <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4e6548", fontFamily: "'DM Sans', sans-serif", marginBottom: 10, fontWeight: 600 }}>
        {question.section}
      </div>
      <h2 style={{ fontSize: "clamp(17px, 3vw, 21px)", fontFamily: "'Playfair Display', serif", color: "#672146", fontWeight: 700, lineHeight: 1.4, margin: "0 0 22px" }}>
        {question.question}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(question.id, i)}
            style={{
              background: selectedOption === i ? "rgba(103,33,70,0.1)" : "#fff",
              border: `1.5px solid ${selectedOption === i ? "#672146" : "#bac5b9"}`,
              borderRadius: 10,
              padding: "13px 16px",
              textAlign: "left",
              color: selectedOption === i ? "#672146" : "#686867",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(13px, 2.5vw, 15px)",
              lineHeight: 1.55,
              cursor: "pointer",
              transition: "all 0.18s ease",
              fontWeight: selectedOption === i ? 500 : 400,
            }}
            onMouseEnter={e => { if (selectedOption !== i) { e.currentTarget.style.background = "rgba(78,101,72,0.06)"; e.currentTarget.style.borderColor = "#4e6548"; e.currentTarget.style.color = "#4e6548"; } }}
            onMouseLeave={e => { if (selectedOption !== i) { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#bac5b9"; e.currentTarget.style.color = "#686867"; } }}
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
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 4vw, 26px)", color: "#672146", fontWeight: 700, marginBottom: 14, lineHeight: 1.3 }}>
        Your results are being prepared.
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#686867", fontSize: 15, lineHeight: 1.7, maxWidth: 340, margin: "0 auto 28px" }}>
        You'll be redirected in just a moment. Your full report is already heading to your inbox.
      </p>
      <div style={{ width: 36, height: 36, border: "3px solid rgba(103,33,70,0.18)", borderTopColor: "#672146", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
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
        setTimeout(() => { window.top.location.href = url; }, 2000);
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
      <div style={{ minHeight: "100vh", background: "#f1f4ef", backgroundImage: "radial-gradient(ellipse at 15% 15%, rgba(103,33,70,0.06) 0%, transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(78,101,72,0.05) 0%, transparent 55%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
        <div style={{ width: "100%", maxWidth: 540, background: "#fff", border: "1px solid #bac5b9", borderRadius: 20, padding: "clamp(24px, 5vw, 44px)", boxShadow: "0 8px 40px rgba(103,33,70,0.08)" }}>
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


