import { useEffect, useMemo, useRef, useState } from "react";

const KEYS = {
  dailyBookmark: "qingyu_daily_bookmark",
  bookmarkFavorites: "qingyu_bookmark_favorites",
  bookmarkHistory: "qingyu_bookmark_history",
  mindfulness: "qingyu_mindfulness_checkins",
  exercise: "qingyu_exercise_checkins",
  mood: "qingyu_mood_records",
  disclaimer: "qingyu_disclaimer_ack",
};

const tabs = [
  { id: "help", label: "需要帮助" },
  { id: "daily", label: "日常舒缓" },
  { id: "mood", label: "心情记录" },
];

const helpTools = [
  {
    id: "breath478",
    title: "478 呼吸法",
    scene: "呼吸急促、心跳加快、身体很警觉",
    desc: "跟着小愈一起慢慢吸气、停留、呼气，让呼吸节奏缓下来。",
  },
  {
    id: "boxBreath",
    title: "方块呼吸法",
    scene: "大脑混乱、注意力难以集中、情绪波动明显",
    desc: "跟着小愈沿着方块走一圈，把注意力放回节奏上。",
  },
  {
    id: "grounding",
    title: "54321 接地法",
    scene: "感觉失控、不真实，思绪被焦虑拉走",
    desc: "通过看见、触摸、聆听、闻到和身体感受，慢慢回到当前环境。",
  },
  {
    id: "cooling",
    title: "降温法",
    scene: "情绪突然冲上来、身体发热、焦虑感强烈",
    desc: "通过温和、安全的冷水接触，让身体获得一点新的感觉输入。",
  },
  {
    id: "breathSafety",
    title: "呼吸困难安全提示",
    scene: "感觉呼吸不上来、手脚发麻、头晕、害怕出事",
    desc: "先判断是否有危险信号。如果症状严重或不确定，请优先拨打 120 或联系身边的人。",
  },
  {
    id: "emergency",
    title: "紧急求助说明",
    scene: "非常痛苦、无法保证安全、严重身体不适",
    desc: "当情况超出自助范围时，请优先联系现实中的人和专业急救资源。",
  },
];

const breath478 = [
  { label: "吸气", seconds: 4, text: "慢慢吸气，我们一起数 4 秒。", motion: "inhale" },
  { label: "屏息", seconds: 7, text: "轻轻停一下，不需要用力。", motion: "hold" },
  { label: "呼气", seconds: 8, text: "慢慢呼出去，把紧绷也放下来一点。", motion: "exhale" },
];

const boxBreath = [
  { label: "吸气", seconds: 4, text: "沿着第一条边，轻轻吸气。", side: "top" },
  { label: "停留", seconds: 4, text: "停一下，只需要跟着节奏。", side: "right" },
  { label: "呼气", seconds: 4, text: "慢慢呼出去。", side: "bottom" },
  { label: "停留", seconds: 4, text: "再安静停留一小会儿。", side: "left" },
];

const groundingSteps = [
  { title: "看见 5 样东西", state: "watch", text: "我们先看看周围，慢慢找 5 样你能看见的东西。" },
  { title: "触摸 4 样物品", state: "reach", text: "摸一摸身边安全的东西，感受它们的温度、形状或质地。" },
  { title: "听见 3 种声音", state: "listen", text: "听一听周围，有没有 3 种声音？远的、近的，都可以。" },
  { title: "闻到 2 种气味", state: "breathe", text: "留意一下有没有 2 种气味。没有也没关系，可以感受空气的味道。" },
  { title: "感受 1 个身体触点", state: "hug", text: "感受一个身体和外界接触的地方，比如脚踩在地面上。" },
];

const audioAttribution = {
  name: "UCLA Mindful 普通话引导正念音频",
  url: "https://www.uclahealth.org/uclamindful/guided-meditations",
  license: "CC BY-NC-ND 4.0，仅用于非商业原型展示；正式上线建议替换为自有授权音频。",
};

const meditations = [
  {
    id: "m3",
    title: "3 分钟身体扫描",
    minutes: 3,
    durationSeconds: 180,
    scene: "情绪刚刚有点乱，需要短暂停靠",
    audioUrl: "https://d1cy5zxxhbcbkk.cloudfront.net/guided-meditations/Mandarin-bodyscan.mp3",
  },
  {
    id: "m12",
    title: "12 分钟呼吸、声音与身体",
    minutes: 12,
    durationSeconds: 720,
    scene: "想把注意力慢慢放回身体和环境",
    audioUrl: "https://d1cy5zxxhbcbkk.cloudfront.net/guided-meditations/Mandarin-breathsoundbody.mp3",
  },
  {
    id: "m19",
    title: "19 分钟完整正念引导",
    minutes: 19,
    durationSeconds: 1140,
    scene: "想给自己一段完整的安静时间",
    audioUrl: "https://d1cy5zxxhbcbkk.cloudfront.net/guided-meditations/Mandarin-complete.mp3",
  },
];

const psychoEducation = [
  {
    title: "焦虑来时，先降低决策压力",
    body: "急性焦虑状态下，不适合阅读长篇内容。先做一个低门槛动作，再决定下一步。",
  },
  {
    title: "身体信号需要被认真对待",
    body: "胸痛、持续呼吸困难、晕厥、意识模糊等情况不应仅靠自助工具处理，应及时寻求现实帮助。",
  },
  {
    title: "记录不是为了评价自己",
    body: "心情记录更适合用来观察模式：哪些场景更容易紧张，哪些照顾方式对自己更友好。",
  },
];

const pmrParts = ["额头", "眼周", "下颌", "肩颈", "双手", "胸腹", "大腿", "小腿", "双脚"];
const exerciseTypes = ["散步", "拉伸", "瑜伽", "慢跑", "其他轻运动"];
const moodLevels = ["很平静", "有点紧张", "明显焦虑", "很焦虑", "非常难受"];
const moodTags = ["焦虑", "疲惫", "烦躁", "低落", "平静", "委屈", "紧张", "放松", "睡眠不好", "身体不适"];

const bookmarks = [
  "先不用解决整个人生，只需要回到这一分钟。",
  "你不需要立刻平静，只要先陪自己完成一次呼吸。",
  "今天的你已经在努力了，即使努力的样子并不明显。",
  "不是所有事情都需要现在回应，也不是所有情绪都需要马上解决。",
  "把脚踩在地上，感受身体被稳稳托住。",
  "今晚不必复盘所有遗憾，身体也需要被允许休息。",
  "可以慢一点，也可以乱一点。你不需要在焦虑里表现得很好。",
  "此刻先确认一件事：你正在这里，你正在呼吸。",
  "情绪不是敌人，它只是提醒你需要被照顾。",
  "今天先少责怪自己一点。",
  "你可以先暂停，不需要马上回应所有事情。",
  "把注意力放回脚下，那里有一个稳定的支点。",
  "焦虑来了，不代表你失败了，只代表你正在承受很多。",
  "慢慢来，也是往前走的一种方式。",
  "你不用把今天过得很完美，只要真实地过完它。",
  "给身体一点时间，它正在努力保护你。",
  "有些答案可以晚一点再找，现在先照顾呼吸。",
  "你可以允许自己需要帮助。",
  "不舒服的时候，先把标准放低一点。",
  "今天能照顾自己一点点，就已经很好。",
];

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => readJSON(key, fallback));
  const update = (next) => {
    setValue((previous) => {
      const resolved = typeof next === "function" ? next(previous) : next;
      localStorage.setItem(key, JSON.stringify(resolved));
      return resolved;
    });
  };
  return [value, update];
}

function todayKey(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function humanDate(key) {
  const [year, month, day] = key.split("-");
  return `${Number(month)} 月 ${Number(day)} 日`;
}

function formatClock(seconds = 0) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function boxPosition(ratio) {
  const side = 190;
  const loop = clamp(ratio);
  if (loop <= 0.25) return { x: (loop / 0.25) * side, y: 0 };
  if (loop <= 0.5) return { x: side, y: ((loop - 0.25) / 0.25) * side };
  if (loop <= 0.75) return { x: side - ((loop - 0.5) / 0.25) * side, y: side };
  return { x: 0, y: side - ((loop - 0.75) / 0.25) * side };
}

function breathVisual(motion, ratio) {
  if (motion === "inhale") {
    const scale = 0.94 + ratio * 0.2;
    return { scale, glowScale: 0.82 + ratio * 0.36, glowOpacity: 0.42 + ratio * 0.48 };
  }
  if (motion === "exhale") {
    const scale = 1.12 - ratio * 0.2;
    return { scale, glowScale: 1.14 - ratio * 0.32, glowOpacity: 0.82 - ratio * 0.38 };
  }
  return { scale: 1.1, glowScale: 1.08, glowOpacity: 0.74 };
}

function streakCount(days) {
  const set = new Set(days);
  let count = 0;
  const cursor = new Date();
  while (set.has(todayKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

function thisWeekCount(days) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  start.setHours(0, 0, 0, 0);
  return days.filter((day) => new Date(`${day}T00:00:00`) >= start).length;
}

function copyText(text, notify) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => notify("已复制，可以发给可信任的人。"));
    return;
  }
  const input = document.createElement("textarea");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
  notify("已复制，可以发给可信任的人。");
}

function Xiaoyu({ state = "calm", size = "medium" }) {
  return (
    <div className={`xiaoyu xiaoyu--${state} xiaoyu--${size}`} aria-label="小愈">
      <span className="xiaoyu__glow" />
      <span className="xiaoyu__body">
        <span className="xiaoyu__face">
          <i />
          <i />
          <b />
          <em className="xiaoyu__cheek xiaoyu__cheek--left" />
          <em className="xiaoyu__cheek xiaoyu__cheek--right" />
        </span>
        <span className="xiaoyu__hand xiaoyu__hand--left" />
        <span className="xiaoyu__hand xiaoyu__hand--right" />
      </span>
    </div>
  );
}

function GroundingMotion({ state }) {
  const dots = state === "watch" ? 5 : state === "reach" ? 4 : state === "listen" ? 3 : state === "breathe" ? 2 : 1;
  return (
    <div className={`ground-motion ground-motion--${state}`} aria-hidden="true">
      {Array.from({ length: dots }).map((_, index) => (
        <span key={index} style={{ "--dot": index }} />
      ))}
    </div>
  );
}

function SoftCard({ children, className = "" }) {
  return <section className={`soft-card ${className}`}>{children}</section>;
}

function PrimaryButton({ children, onClick, soft = false, disabled = false }) {
  return (
    <button type="button" className={soft ? "soft-button" : "primary-button"} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function Disclaimer() {
  return <p className="disclaimer">本工具仅用于情绪自助调节，不能替代专业医疗诊断、心理咨询、心理治疗或紧急救助。</p>;
}

function BackButton({ onClick }) {
  return (
    <button type="button" className="back-button" onClick={onClick}>
      ← 返回
    </button>
  );
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div className="section-title">
      {eyebrow && <span>{eyebrow}</span>}
      <h2>{title}</h2>
      {desc && <p>{desc}</p>}
    </div>
  );
}

export function App() {
  const [tab, setTab] = useState("help");
  const [screen, setScreen] = useState("home");
  const [helpExpanded, setHelpExpanded] = useState(false);
  const [timer, setTimer] = useState(null);
  const [motionNow, setMotionNow] = useState(0);
  const [groundingIndex, setGroundingIndex] = useState(0);
  const [pmrIndex, setPmrIndex] = useState(0);
  const [exerciseType, setExerciseType] = useState("散步");
  const [meditation, setMeditation] = useState(null);
  const [meditationPlaying, setMeditationPlaying] = useState(false);
  const [meditationElapsed, setMeditationElapsed] = useState(0);
  const [meditationError, setMeditationError] = useState("");
  const [shaking, setShaking] = useState(false);
  const [toast, setToast] = useState("");
  const [ack, setAck] = useState(() => localStorage.getItem(KEYS.disclaimer) === "yes");
  const [mindfulness, setMindfulness] = useStoredState(KEYS.mindfulness, []);
  const [exercise, setExercise] = useStoredState(KEYS.exercise, []);
  const [dailyBookmark, setDailyBookmark] = useStoredState(KEYS.dailyBookmark, null);
  const [favorites, setFavorites] = useStoredState(KEYS.bookmarkFavorites, []);
  const [history, setHistory] = useStoredState(KEYS.bookmarkHistory, []);
  const [moodRecords, setMoodRecords] = useStoredState(KEYS.mood, {});
  const [selectedMoodDate, setSelectedMoodDate] = useState(todayKey());
  const [moodDraft, setMoodDraft] = useState({ level: 2, tags: [], note: "" });

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__qingyuToast);
    window.__qingyuToast = window.setTimeout(() => setToast(""), 2200);
  };

  const changeTab = (id) => {
    setTab(id);
    setScreen("home");
    setTimer(null);
    setMeditation(null);
    setMeditationPlaying(false);
    setMeditationError("");
    if (id === "mood") {
      setSelectedMoodDate(todayKey());
      setMoodDraft(moodRecords[todayKey()] || { level: 2, tags: [], note: "" });
    }
  };

  useEffect(() => {
    if (!timer?.running) return undefined;
    let frameId = 0;
    const step = (now) => {
      setMotionNow(now);
      setTimer((current) => {
        if (!current?.running) return current;
        const phases = current.type === "478" ? breath478 : boxBreath;
        const phase = phases[current.phaseIndex] || phases[0];
        const durationMs = phase.seconds * 1000;
        const startedAt = current.phaseStartedAt ?? now;
        const elapsed = Math.max(0, now - startedAt);
        if (elapsed < durationMs) {
          const remaining = Math.max(1, Math.ceil((durationMs - elapsed) / 1000));
          const phaseElapsedMs = elapsed;
          if (current.remaining === remaining && Math.abs((current.phaseElapsedMs || 0) - phaseElapsedMs) < 34) return current;
          return { ...current, remaining, phaseElapsedMs };
        }
        const nextIndex = current.phaseIndex + 1;
        if (nextIndex >= phases.length) {
          return { ...current, running: false, completed: true, remaining: 0, phaseElapsedMs: durationMs, phaseIndex: phases.length - 1 };
        }
        const overflow = Math.min(elapsed - durationMs, phases[nextIndex].seconds * 1000);
        return {
          ...current,
          phaseIndex: nextIndex,
          remaining: Math.max(1, Math.ceil((phases[nextIndex].seconds * 1000 - overflow) / 1000)),
          phaseStartedAt: now - overflow,
          phaseElapsedMs: overflow,
        };
      });
      frameId = window.requestAnimationFrame(step);
    };
    frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [timer?.running]);

  const startTimer = (type) => {
    const phases = type === "478" ? breath478 : boxBreath;
    const now = performance.now();
    setTimer((current) => {
      if (!current || current.type !== type || current.completed) {
        return { type, phaseIndex: 0, remaining: phases[0].seconds, running: true, completed: false, phaseStartedAt: now, phaseElapsedMs: 0 };
      }
      const phase = phases[current.phaseIndex] || phases[0];
      const savedElapsed = clamp((current.phaseElapsedMs || 0) / (phase.seconds * 1000), 0, 1) * phase.seconds * 1000;
      return { ...current, running: true, phaseStartedAt: now - savedElapsed };
    });
  };

  const resetTimer = (type) => {
    const phases = type === "478" ? breath478 : boxBreath;
    setTimer({ type, phaseIndex: 0, remaining: phases[0].seconds, running: false, completed: false, phaseElapsedMs: 0, phaseStartedAt: performance.now() });
  };

  const pauseTimer = (type) => {
    const phases = type === "478" ? breath478 : boxBreath;
    const now = performance.now();
    setTimer((current) => {
      if (!current || current.type !== type) {
        return { type, phaseIndex: 0, remaining: phases[0].seconds, running: false, completed: false, phaseElapsedMs: 0, phaseStartedAt: now };
      }
      const phase = phases[current.phaseIndex] || phases[0];
      const durationMs = phase.seconds * 1000;
      const elapsed = current.running ? clamp((now - (current.phaseStartedAt || now)) / durationMs, 0, 1) * durationMs : current.phaseElapsedMs || 0;
      return { ...current, running: false, phaseElapsedMs: elapsed, remaining: Math.max(1, Math.ceil((durationMs - elapsed) / 1000)) };
    });
  };

  const checkIn = (kind) => {
    const today = todayKey();
    if (kind === "mindfulness") {
      if (mindfulness.includes(today)) return notify("今天已经照顾过自己了。");
      setMindfulness([...mindfulness, today]);
      notify("很好，今天你给了自己一点安静的时间。");
    } else {
      if (exercise.some((item) => item.date === today)) return notify("今天已经记录过运动了。");
      setExercise([...exercise, { date: today, type: exerciseType }]);
      notify("身体动了一点点，情绪也有机会松动一点点。");
    }
  };

  const drawBookmark = () => {
    const today = todayKey();
    if (dailyBookmark?.date === today) {
      notify("今天的书签已经在瓶子里啦。");
      return;
    }
    setShaking(true);
    window.setTimeout(() => setShaking(false), 800);
    const text = bookmarks[Math.floor(Math.random() * bookmarks.length)];
    const item = { date: today, text };
    setDailyBookmark(item);
    setHistory([item, ...history.filter((old) => old.date !== today)].slice(0, 30));
    notify("小愈轻轻摇出了一张书签。");
  };

  const toggleFavorite = (text) => {
    if (!text) return;
    if (favorites.includes(text)) {
      setFavorites(favorites.filter((item) => item !== text));
      notify("已取消收藏。");
    } else {
      setFavorites([text, ...favorites]);
      notify("已收藏到书签瓶。");
    }
  };

  const saveMood = () => {
    const record = { ...moodDraft, date: selectedMoodDate, updatedAt: new Date().toISOString() };
    setMoodRecords({ ...moodRecords, [selectedMoodDate]: record });
    notify("今天的一点感受已经留下了。");
  };

  const deleteMood = () => {
    const next = { ...moodRecords };
    delete next[selectedMoodDate];
    setMoodRecords(next);
    setMoodDraft({ level: 2, tags: [], note: "" });
    notify("这条心情记录已删除。");
  };

  const openMoodDate = (date) => {
    setSelectedMoodDate(date);
    setMoodDraft(moodRecords[date] || { level: 2, tags: [], note: "" });
  };

  const content = tab === "help" ? renderHelp() : tab === "daily" ? renderDaily() : renderMood();

  return (
    <main className="mobile-prototype" aria-label="轻愈移动端原型">
      <div className="app-shell">
        <header className="topbar">
          <div>
            <p className="mini-caption">qingyu</p>
            <h1>轻愈</h1>
          </div>
          <span className="pill">温柔自助</span>
        </header>
        {content}
        <Disclaimer />
      </div>

      <nav className="bottom-tab" aria-label="底部导航">
        {tabs.map((item) => (
          <button type="button" key={item.id} className={tab === item.id ? "active" : ""} onClick={() => changeTab(item.id)}>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {!ack && (
        <div className="modal-backdrop">
          <div className="welcome-modal">
            <Xiaoyu state="hug" />
            <h2>欢迎使用轻愈</h2>
            <p>
              本产品仅用于情绪自助调节和心理健康科普参考，不能替代专业医疗诊断、心理咨询、心理治疗或紧急救助。如你正在经历强烈痛苦、伤害自己或他人的想法，或出现严重身体不适，请立即联系当地急救服务、心理危机干预热线或身边可信任的人。
            </p>
            <PrimaryButton
              onClick={() => {
                localStorage.setItem(KEYS.disclaimer, "yes");
                setAck(true);
              }}
            >
              我已了解，开始使用
            </PrimaryButton>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </main>
  );

  function renderHelp() {
    if (screen === "breath478") return <BreathingScreen type="478" />;
    if (screen === "boxBreath") return <BreathingScreen type="box" />;
    if (screen === "grounding") return <GroundingScreen />;
    if (screen === "cooling") return <CoolingScreen />;
    if (screen === "breathSafety") return <BreathSafetyScreen />;
    if (screen === "emergency") return <EmergencyScreen />;
    const selfHelpTools = helpTools.filter((tool) => !["breathSafety", "emergency"].includes(tool.id));
    const emergencyCopy = "我现在感觉很焦虑 / 不舒服，想请你陪我说几句话，或者帮我确认一下我是否安全。";

    return (
      <div className="page stack">
        <SoftCard className="hero-card">
          <div className="hero-copy">
            <p className="mini-caption">need help</p>
            <h2>
              <span>我在这里，</span>
              <span>我们先一起慢下来。</span>
            </h2>
            <p>如果此刻很慌，不需要解释清楚。先选一个最容易开始的小动作。</p>
          </div>
          <Xiaoyu state="calm" size="large" />
          <PrimaryButton onClick={() => setHelpExpanded(true)}>{helpExpanded ? "自救小册已展开" : "我现在需要帮助"}</PrimaryButton>
        </SoftCard>

        {helpExpanded && (
          <>
            <SoftCard className="first-aid-panel">
              <div className="first-aid-panel__top">
                <Xiaoyu state="steady" />
                <div>
                  <span className="tagline">先确认安全</span>
                  <h3>如果情况很严重，先联系现实中的帮助</h3>
                </div>
              </div>
              <p>
                如果你有伤害自己或他人的想法，感到无法保证安全，或出现胸痛、持续呼吸困难、晕厥、意识模糊、嘴唇发紫、严重虚弱，请不要继续只靠自助工具，立即拨打 120 或联系身边可信任的人。
              </p>
              <p className="safety-note">
                呼吸很不舒服时，先坐下、松开压迫、把呼吸放慢一点。不要用塑料袋罩住口鼻呼吸，也不建议自行使用纸袋呼吸。
              </p>
              <div className="button-row">
                <PrimaryButton soft onClick={() => setScreen("breathSafety")}>查看呼吸困难提示</PrimaryButton>
                <PrimaryButton soft onClick={() => copyText(emergencyCopy, notify)}>复制求助文字</PrimaryButton>
              </div>
            </SoftCard>

            <div className="book-section">
              <div className="book-cover">
                <span className="mini-caption">self help tools</span>
                <h3>选择一个现在可以尝试的自救方法</h3>
              </div>
              <div className="book-pages">
                {selfHelpTools.map((tool, index) => (
                  <SoftCard key={tool.id} className="tool-card book-page" style={{ "--page-index": index }}>
                    <span className="tagline">{tool.scene}</span>
                    <h3>{tool.title}</h3>
                    <p>{tool.desc}</p>
                    <PrimaryButton soft onClick={() => setScreen(tool.id)}>
                      进入
                    </PrimaryButton>
                  </SoftCard>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  function BreathingScreen({ type }) {
    const is478 = type === "478";
    const phases = is478 ? breath478 : boxBreath;
    const current = timer?.type === type ? timer : { type, phaseIndex: 0, remaining: phases[0].seconds, running: false, completed: false };
    const phase = phases[current.phaseIndex] || phases[0];
    const total = phases.reduce((sum, item) => sum + item.seconds, 0);
    const completedBefore = phases.slice(0, current.phaseIndex).reduce((sum, item) => sum + item.seconds, 0);
    const durationMs = phase.seconds * 1000;
    const liveElapsedMs = current.completed
      ? durationMs
      : current.running
        ? clamp(((motionNow || performance.now()) - (current.phaseStartedAt || motionNow || performance.now())) / durationMs, 0, 1) * durationMs
        : clamp((current.phaseElapsedMs || 0) / durationMs, 0, 1) * durationMs;
    const phaseRatio = current.completed ? 1 : clamp(liveElapsedMs / durationMs, 0, 1);
    const phaseElapsed = phaseRatio * phase.seconds;
    const preciseProgress = current.completed ? 1 : clamp((completedBefore + phaseElapsed) / total, 0, 1);
    const progress = Math.round(preciseProgress * 100);
    const displayRemaining = current.completed ? "✓" : Math.max(1, Math.ceil((durationMs - liveElapsedMs) / 1000));
    const breath = breathVisual(phase.motion, phaseRatio);
    const box = boxPosition(preciseProgress);

    return (
      <div className="page stack detail-page">
        <BackButton onClick={() => setScreen("home")} />
        <SectionTitle
          eyebrow={is478 ? "4 · 7 · 8" : "box breathing"}
          title={is478 ? "478 呼吸法" : "方块呼吸法"}
          desc={is478 ? "跟着小愈慢慢变大、停留、变小。" : "跟着小愈走一圈，只需要把注意力放在节奏上。"}
        />

        {is478 ? (
          <SoftCard className="breath-stage">
            <div
              className={`breath-orb ${current.completed ? "breath-orb--done" : `breath-orb--${phase.motion}`} ${current.running ? "is-running" : "is-paused"}`}
              style={{ "--breath-scale": breath.scale, "--glow-scale": breath.glowScale, "--glow-opacity": breath.glowOpacity }}
            >
              <Xiaoyu state={current.completed ? "hug" : `breathe-${phase.motion}`} size="large" />
            </div>
            <div className="timer-number">{displayRemaining}</div>
            <h3>{current.completed ? "完成" : phase.label}</h3>
            <p>{current.completed ? "很好，我们完成了一轮。你可以再来一次，也可以先停一停。" : phase.text}</p>
            <div className="progress"><span style={{ width: `${progress}%` }} /></div>
          </SoftCard>
        ) : (
          <SoftCard className="box-stage">
            <div
              className={`box-track ${current.completed ? "is-complete" : progress > 0 || current.running ? "box-track--walking" : ""} ${current.running ? "is-running" : "is-paused"}`}
            >
              <span className="box-dot" style={{ "--box-x": `${box.x}px`, "--box-y": `${box.y}px` }}>
                <span className="box-breath-ball" />
              </span>
            </div>
            <div className="timer-number">{displayRemaining}</div>
            <h3>{current.completed ? "完成一圈" : phase.label}</h3>
            <p>{current.completed ? "很好，小愈陪你走完了一圈。" : phase.text}</p>
            <div className="progress"><span style={{ width: `${progress}%` }} /></div>
          </SoftCard>
        )}

        <div className="button-row">
          <PrimaryButton onClick={() => startTimer(type)}>{current.running ? "继续跟着小愈" : current.completed ? "再来一轮" : "开始"}</PrimaryButton>
          <PrimaryButton soft onClick={() => pauseTimer(type)}>暂停</PrimaryButton>
          <PrimaryButton soft onClick={() => resetTimer(type)}>重置</PrimaryButton>
        </div>
        <p className="safety-note">如果你感到明显胸痛、持续呼吸困难、晕厥、意识模糊，或不确定这是不是焦虑，请停止练习并及时寻求帮助。</p>
      </div>
    );
  }

  function GroundingScreen() {
    const complete = groundingIndex >= groundingSteps.length;
    const step = groundingSteps[Math.min(groundingIndex, groundingSteps.length - 1)];
    return (
      <div className="page stack detail-page">
        <BackButton onClick={() => setScreen("home")} />
        <SectionTitle eyebrow="54321" title="接地法" desc="慢慢把注意力带回当前环境。" />
        <SoftCard className="ground-card">
          <Xiaoyu state={complete ? "hug" : step.state} size="large" />
          <GroundingMotion state={complete ? "complete" : step.state} />
          {!complete ? (
            <>
              <span className="step-badge">第 {groundingIndex + 1} 步 / 5</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <PrimaryButton onClick={() => setGroundingIndex(groundingIndex + 1)}>我找到了，下一步</PrimaryButton>
            </>
          ) : (
            <>
              <h3>你刚刚回到了当下</h3>
              <p>你刚刚把注意力带回了当下。哪怕只稳定了一点点，也很值得。</p>
              <div className="button-row">
                <PrimaryButton onClick={() => setGroundingIndex(0)}>再做一次</PrimaryButton>
                <PrimaryButton soft onClick={() => setScreen("home")}>返回需要帮助</PrimaryButton>
              </div>
            </>
          )}
        </SoftCard>
      </div>
    );
  }

  function CoolingScreen() {
    return (
      <div className="page stack detail-page">
        <BackButton onClick={() => setScreen("home")} />
        <SectionTitle eyebrow="cool down" title="用一点凉意帮助身体稳定" desc="重点不是忍耐寒冷，而是让身体得到温和的感觉变化。" />
        <SoftCard>
          <Xiaoyu state="calm" />
          <h3>什么时候可以使用</h3>
          <p>当情绪突然冲上来、身体发热、手心发烫、焦虑感很强烈时，可以尝试短暂、温和的凉水接触。</p>
          <h3>如何安全操作</h3>
          <ol className="soft-list">
            <li>找到安全坐姿。</li>
            <li>用凉水轻轻接触手腕、脸颊或后颈。</li>
            <li>保持几秒即可，不需要很久。</li>
            <li>观察身体感受。</li>
            <li>如果不舒服，马上停止。</li>
          </ol>
          <p>你可以用凉水轻轻接触手腕、脸颊或后颈，时间不需要太长。重点不是忍耐寒冷，而是让身体得到一个温和的感觉变化。</p>
          <p className="safety-note">如果你有心血管疾病、严重胸痛、呼吸困难、晕厥感、身体明显不适，请不要使用该方法，应立即寻求专业帮助。</p>
          <PrimaryButton onClick={() => notify("已了解。先照顾安全，再照顾情绪。")}>我知道了</PrimaryButton>
        </SoftCard>
      </div>
    );
  }

  function BreathSafetyScreen() {
    const helpText = "我现在感觉呼吸很不舒服，也有些焦虑。可以请你陪我一下，或者帮我判断是否需要去医院 / 打 120 吗？";
    const steps = [
      ["换一个更安全的姿势", "先坐下来，背部有支撑，双脚踩地。不要强迫自己躺下。", "我坐好了"],
      ["松开压迫", "松开领口、腰带或让你觉得被勒住的衣物。", "我松开了"],
      ["把呼吸放慢一点", "不用深呼吸。试着轻轻吸气，再慢慢呼气。重点是变慢，不是吸得更多。", "跟着小愈呼吸"],
      ["联系一个现实中的人", "如果你很害怕，或者不确定自己是否安全，请联系身边可信任的人。", "复制求助文字"],
      ["严重不适时拨打 120", "如果呼吸困难持续加重，或伴随胸痛、晕厥、嘴唇发紫、意识模糊，请不要继续使用自助工具，立即拨打 120。", "我知道了"],
    ];
    return (
      <div className="page stack detail-page">
        <BackButton onClick={() => setScreen("home")} />
        <SectionTitle eyebrow="safety first" title="感觉呼吸不上来时，先这样做" desc="这里不做自我诊断，只帮你先识别风险、选择更安全的行动。" />
        <SoftCard className="urgent-card">
          <Xiaoyu state="steady" />
          <p>如果你出现胸痛、持续呼吸困难、嘴唇发紫、晕厥、意识模糊、严重虚弱，或你不确定这是不是焦虑，请立即拨打 120。</p>
        </SoftCard>
        <SoftCard>
          <h3>重要：不要这样做</h3>
          <p className="safety-note">不要用塑料袋罩住口鼻呼吸，也不建议自行使用纸袋呼吸。呼吸急促不一定都是焦虑，也可能和哮喘、心脏问题、低氧或其他身体状况有关。错误地限制氧气摄入可能带来危险。</p>
        </SoftCard>
        {steps.map(([title, text, button], index) => (
          <SoftCard key={title} className="step-card">
            <span className="step-badge">第 {index + 1} 步</span>
            <h3>{title}</h3>
            <p>{text}</p>
            <PrimaryButton soft onClick={() => (button.includes("复制") ? copyText(helpText, notify) : notify(button))}>{button}</PrimaryButton>
          </SoftCard>
        ))}
      </div>
    );
  }

  function EmergencyScreen() {
    const helpText = "我现在感觉很焦虑 / 不舒服，想请你陪我说几句话，或者帮我确认一下我是否安全。";
    return (
      <div className="page stack detail-page">
        <BackButton onClick={() => setScreen("home")} />
        <SectionTitle eyebrow="real help" title="当自助不够时，请马上联系现实中的帮助" />
        <SoftCard className="urgent-card">
          <p>本工具仅用于情绪自助调节，不能替代专业医疗诊断、心理咨询、心理治疗或紧急救助。</p>
        </SoftCard>
        <SoftCard>
          <h3>如果出现这些情况，请优先寻求外部帮助</h3>
          <ol className="soft-list">
            <li>有伤害自己或他人的想法。</li>
            <li>感到自己无法保证安全。</li>
            <li>出现胸痛、呼吸困难、晕厥等明显身体症状。</li>
            <li>焦虑或惊恐持续加重。</li>
            <li>身边无人陪伴且感到非常害怕。</li>
          </ol>
          <div className="button-row">
            <PrimaryButton onClick={() => copyText(helpText, notify)}>复制求助文字</PrimaryButton>
            <PrimaryButton soft onClick={() => setScreen("home")}>返回需要帮助</PrimaryButton>
          </div>
        </SoftCard>
      </div>
    );
  }

  function renderDaily() {
    if (screen === "meditation" && meditation) return <MeditationScreen />;
    if (screen === "pmr") return <PmrScreen />;

    const today = todayKey();
    const todayMindful = mindfulness.includes(today);
    const todayExercise = exercise.some((item) => item.date === today);
    return (
      <div className="page stack">
        <SoftCard className="hero-card daily-hero">
          <div className="hero-copy">
            <p className="mini-caption">daily care</p>
            <h2>今天也可以轻轻照顾自己一点。</h2>
            <p>不需要完成很多，只要给身体和心情一个小小的停靠点。</p>
          </div>
          <Xiaoyu state="wave" size="large" />
        </SoftCard>

        <SoftCard className="checkin-card">
          <h3>正念打卡</h3>
          <div className="stat-row">
            <span>今日：{todayMindful ? "已完成" : "未完成"}</span>
            <span>连续 {streakCount(mindfulness)} 天</span>
            <span>累计 {mindfulness.length} 天</span>
          </div>
          <PrimaryButton onClick={() => checkIn("mindfulness")} disabled={todayMindful}>
            {todayMindful ? "今天已经照顾过自己了" : "完成今天的正念打卡"}
          </PrimaryButton>
        </SoftCard>

        <SectionTitle title="冥想练习" desc="已接入普通话引导音频。建议在网络稳定、环境安全时使用。" />
        <div className="card-grid">
          {meditations.map((item) => (
            <SoftCard key={item.id} className="tool-card">
              <span className="tagline">{item.minutes} 分钟</span>
              <h3>{item.title}</h3>
              <p>{item.scene}</p>
              <PrimaryButton soft onClick={() => { setMeditation(item); setMeditationElapsed(0); setMeditationError(""); setScreen("meditation"); }}>开始练习</PrimaryButton>
            </SoftCard>
          ))}
        </div>

        <SectionTitle title="安心科普" desc="适合放在日常舒缓里，作为非急性状态下的心理健康科普入口。" />
        <div className="science-grid">
          {psychoEducation.map((item) => (
            <SoftCard key={item.title} className="science-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </SoftCard>
          ))}
        </div>

        <SoftCard className="checkin-card">
          <h3>运动打卡</h3>
          <div className="chips">
            {exerciseTypes.map((type) => (
              <button type="button" key={type} className={exerciseType === type ? "selected" : ""} onClick={() => setExerciseType(type)}>{type}</button>
            ))}
          </div>
          <div className="stat-row">
            <span>今日：{todayExercise ? "已完成" : "未完成"}</span>
            <span>本周 {thisWeekCount(exercise.map((item) => item.date))} 次</span>
            <span>累计 {exercise.length} 天</span>
          </div>
          <PrimaryButton onClick={() => checkIn("exercise")} disabled={todayExercise}>记录今天的轻运动</PrimaryButton>
        </SoftCard>

        <SoftCard className="tool-card">
          <span className="tagline">肩颈紧绷 · 睡前放松 · 长期压力</span>
          <h3>渐进式肌肉放松</h3>
          <p>从头到脚轻轻绷紧再放松，帮助身体一点点卸下紧张。</p>
          <PrimaryButton soft onClick={() => { setPmrIndex(0); setScreen("pmr"); }}>开始练习</PrimaryButton>
        </SoftCard>

        <BookmarkBottle />
      </div>
    );
  }

  function MeditationScreen() {
    const audioRef = useRef(null);
    const limit = meditation.durationSeconds || meditation.minutes * 60;
    const progress = Math.round((meditationElapsed / limit) * 100);
    const toggleAudio = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (meditationPlaying) {
        audio.pause();
        setMeditationPlaying(false);
        return;
      }
      setMeditationError("");
      audio.play()
        .then(() => setMeditationPlaying(true))
        .catch(() => {
          setMeditationPlaying(false);
          setMeditationError("音频暂时无法播放。请检查网络，或稍后再试。");
        });
    };
    return (
      <div className="page stack detail-page">
        <BackButton onClick={() => { audioRef.current?.pause(); setScreen("home"); setMeditationPlaying(false); }} />
        <SectionTitle eyebrow={`${meditation.minutes} min`} title={meditation.title} desc={meditation.scene} />
        <SoftCard className="breath-stage meditation-player">
          <Xiaoyu state="sleep" size="large" />
          <audio
            ref={audioRef}
            src={meditation.audioUrl}
            preload="metadata"
            onTimeUpdate={(event) => setMeditationElapsed(event.currentTarget.currentTime)}
            onLoadedMetadata={(event) => {
              if (Number.isFinite(event.currentTarget.duration)) {
                setMeditationElapsed(event.currentTarget.currentTime);
              }
            }}
            onPlay={() => setMeditationPlaying(true)}
            onPause={() => setMeditationPlaying(false)}
            onEnded={() => {
              setMeditationPlaying(false);
              setMeditationElapsed(limit);
              notify("练习结束了。你可以先停一停。");
            }}
            onError={() => {
              setMeditationPlaying(false);
              setMeditationError("音频加载失败。当前资源需要联网播放，也可以后续替换为自有音频文件。");
            }}
          />
          <div className="timer-number">{formatClock(meditationElapsed)}</div>
          <div className="progress"><span style={{ width: `${progress}%` }} /></div>
          <p className="audio-time">{formatClock(meditationElapsed)} / {formatClock(limit)}</p>
          {meditationError && <p className="safety-note">{meditationError}</p>}
          <div className="button-row">
            <PrimaryButton onClick={toggleAudio}>{meditationPlaying ? "暂停" : "播放"}</PrimaryButton>
            <PrimaryButton
              soft
              onClick={() => {
                if (!audioRef.current) return;
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                setMeditationElapsed(0);
                setMeditationPlaying(false);
              }}
            >
              重置
            </PrimaryButton>
          </div>
          <p className="audio-source">
            音频来源：<a href={audioAttribution.url} target="_blank" rel="noreferrer">{audioAttribution.name}</a><br />
            {audioAttribution.license}
          </p>
        </SoftCard>
      </div>
    );
  }

  function PmrScreen() {
    const part = pmrParts[pmrIndex];
    const finished = pmrIndex >= pmrParts.length;
    return (
      <div className="page stack detail-page">
        <BackButton onClick={() => setScreen("home")} />
        <SectionTitle eyebrow="body release" title="渐进式肌肉放松" desc="轻轻用力即可，不需要做到标准。" />
        <SoftCard className="ground-card">
          <Xiaoyu state={finished ? "hug" : "steady"} size="large" />
          {!finished ? (
            <>
              <span className="step-badge">{pmrIndex + 1} / {pmrParts.length}</span>
              <h3>{part}</h3>
              <ol className="soft-list">
                <li>轻轻绷紧。</li>
                <li>保持 5 秒。</li>
                <li>慢慢放松。</li>
                <li>感受变化。</li>
              </ol>
              <PrimaryButton onClick={() => setPmrIndex(pmrIndex + 1)}>下一处</PrimaryButton>
            </>
          ) : (
            <>
              <h3>身体辛苦啦</h3>
              <p>你已经陪身体从头到脚放松了一遍。</p>
              <PrimaryButton onClick={() => setScreen("home")}>返回日常舒缓</PrimaryButton>
            </>
          )}
          <p className="safety-note">轻轻用力即可。如果出现疼痛、头晕、胸闷或明显不适，请立即停止。</p>
        </SoftCard>
      </div>
    );
  }

  function BookmarkBottle() {
    const today = todayKey();
    const todays = dailyBookmark?.date === today ? dailyBookmark.text : "";
    return (
      <SoftCard className="bookmark-card">
        <div>
          <span className="tagline">今日书签瓶</span>
          <h3>轻轻摇一摇</h3>
          <p>每天默认抽取一句，当天再次进入会保留同一句。</p>
        </div>
        <div className={`bottle ${shaking ? "shaking" : ""}`} aria-label="透明奶白色书签瓶">
          <span />
          <span />
          <span />
        </div>
        {todays ? <blockquote>{todays}</blockquote> : <p className="empty-text">今天的小书签还在瓶子里。</p>}
        <div className="button-row">
          <PrimaryButton onClick={drawBookmark}>轻轻摇一摇</PrimaryButton>
          <PrimaryButton soft onClick={() => toggleFavorite(todays)} disabled={!todays}>
            {favorites.includes(todays) ? "已收藏" : "收藏"}
          </PrimaryButton>
        </div>
        {history.length > 0 && (
          <details className="soft-details">
            <summary>历史记录</summary>
            {history.slice(0, 5).map((item) => <p key={item.date}>{humanDate(item.date)}：{item.text}</p>)}
          </details>
        )}
      </SoftCard>
    );
  }

  function renderMood() {
    const today = todayKey();
    return (
      <div className="page stack">
        <SoftCard className="hero-card mood-hero">
          <div className="hero-copy">
            <p className="mini-caption">mood note</p>
            <h2>不用写得很完整，留下今天的一点感受就好。</h2>
            <p>小愈会安静听着，不评分，也不催促。</p>
          </div>
          <Xiaoyu state="hug" size="large" />
        </SoftCard>

        <SoftCard className="mood-form">
          <span className="tagline">{selectedMoodDate === today ? "今日心情记录" : humanDate(selectedMoodDate)}</span>
          <h3>今日心情 / 焦虑等级</h3>
          <div className="mood-levels">
            {moodLevels.map((label, index) => (
              <button type="button" key={label} className={moodDraft.level === index + 1 ? "selected" : ""} onClick={() => setMoodDraft({ ...moodDraft, level: index + 1 })}>
                <span>{index + 1}</span>
                {label}
              </button>
            ))}
          </div>
          <h3>情绪标签</h3>
          <div className="chips">
            {moodTags.map((tag) => (
              <button
                type="button"
                key={tag}
                className={moodDraft.tags.includes(tag) ? "selected" : ""}
                onClick={() => {
                  const tags = moodDraft.tags.includes(tag) ? moodDraft.tags.filter((item) => item !== tag) : [...moodDraft.tags, tag];
                  setMoodDraft({ ...moodDraft, tags });
                }}
              >
                {tag}
              </button>
            ))}
          </div>
          <textarea
            maxLength={300}
            value={moodDraft.note}
            placeholder="今天发生了什么？或者你现在身体有什么感觉？"
            onChange={(event) => setMoodDraft({ ...moodDraft, note: event.target.value })}
          />
          <p className="counter">{moodDraft.note.length}/300</p>
          <div className="button-row">
            <PrimaryButton onClick={saveMood}>保存记录</PrimaryButton>
            <PrimaryButton soft onClick={deleteMood} disabled={!moodRecords[selectedMoodDate]}>删除</PrimaryButton>
          </div>
        </SoftCard>

        <MoodCalendar />
        <MoodSummary />
      </div>
    );
  }

  function MoodCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;
    const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

    return (
      <SoftCard>
        <h3>心情日历</h3>
        <div className="mood-legend">
          {moodLevels.map((label, index) => (
            <span key={label}><i className={`mood-dot mood-${index + 1}`} />{label}</span>
          ))}
        </div>
        <div className="calendar-weekdays">{["一", "二", "三", "四", "五", "六", "日"].map((day) => <span key={day}>{day}</span>)}</div>
        <div className="calendar-grid">
          {cells.map((day, index) => {
            if (!day) return <span key={`empty-${index}`} />;
            const key = todayKey(new Date(year, month, day));
            const record = moodRecords[key];
            return (
              <button
                type="button"
                key={key}
                className={`${key === todayKey() ? "today" : ""} ${record ? `mood-${record.level}` : ""} ${selectedMoodDate === key ? "selected" : ""}`}
                onClick={() => openMoodDate(key)}
              >
                {day}
              </button>
            );
          })}
        </div>
        {moodRecords[selectedMoodDate] ? (
          <p className="calendar-note">{humanDate(selectedMoodDate)}：{moodLevels[moodRecords[selectedMoodDate].level - 1]} · {moodRecords[selectedMoodDate].tags.join("、") || "未选择标签"}</p>
        ) : (
          <p className="empty-text">点击日期可以查看或补记当天状态。</p>
        )}
      </SoftCard>
    );
  }

  function MoodSummary() {
    const summary = useMemo(() => {
      const now = new Date();
      const keys = Array.from({ length: 7 }, (_, index) => {
        const day = new Date(now);
        day.setDate(now.getDate() - index);
        return todayKey(day);
      });
      const records = keys.map((key) => moodRecords[key]).filter(Boolean);
      const avg = records.length ? (records.reduce((sum, item) => sum + item.level, 0) / records.length).toFixed(1) : "暂无";
      const tagCounts = {};
      records.forEach((record) => record.tags.forEach((tag) => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; }));
      const common = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "暂无";
      return { count: records.length, avg, common };
    }, [moodRecords]);

    return (
      <SoftCard className="summary-card">
        <h3>本周小结</h3>
        <p>这周你记录了 {summary.count} 天，平均焦虑等级是 {summary.avg}。出现最多的情绪是 {summary.common}。谢谢你愿意观察自己的状态，这本身就是一种照顾。</p>
      </SoftCard>
    );
  }
}
