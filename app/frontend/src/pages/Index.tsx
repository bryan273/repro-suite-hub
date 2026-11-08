import { useEffect, useState } from 'react';
import SuiteTopBar from '@/components/SuiteTopBar';
import { Reveal, SectionHead, ShowcaseFrame } from '@/components/SuiteUI';
import { SHOTS, URLS } from '@/lib/content';

type Lang = 'en' | 'zh' | 'vi' | 'id';
type Theme = 'light' | 'dark';
const THEME_KEY = 'repro.theme2';
const LANG_KEY = 'rs-lang';
const LANGS: readonly Lang[] = ['en', 'zh', 'vi', 'id'];
const HTML_LANG: Record<Lang, string> = { en: 'en', zh: 'zh-CN', vi: 'vi', id: 'id' };
const text2 = 'text-[color:var(--text2)]';

/** Every string of the landing page, in the four languages the whole suite speaks. */
const S: Record<Lang, {
  eyebrow: string; title: string; sub: string; try: string;
  nav: [string, string, string];
  products: { name: string; text: string; cta: string; tag: string }[];
  startTitle: string; startSub: string;
  steps: { h: string; p: string }[];
  whyEyebrow: string; whyTitle: string; whyLead: string;
  why: { h: string; p: string }[];
  faqTitle: string; faq: { q: string; a: string }[];
  ctaTitle: string; ctaBody: string; ctaLabel: string;
  team: string; partners: string; shot: (n: string) => string;
}> = {
  en: {
    eyebrow: 'Paperlit', title: 'Drop in any paper. Learn it by video.',
    sub: 'Research papers are slow and hard to read. Paste a link or upload a PDF and Paperlit makes a short video that teaches it, in your language. Then ask questions, quiz yourself, and check if the results are real.',
    try: 'See how it works',
    nav: ['What you get', 'How it works', 'FAQ'],
    products: [
      { tag: 'Learn', name: 'Learn by video', text: 'Drop in a paper or any PDF. Get a short narrated video that teaches it step by step, and pause to ask or quiz yourself.', cta: 'Make my video' },
      { tag: 'Read', name: 'Read and ask', text: 'Read the paper with an AI that answers your questions and shows the exact page each answer came from.', cta: 'Open the reader' },
      { tag: 'Check', name: 'Check the result', text: 'A published number is not always true. Our AI re-runs the experiment and tells you whether the result really holds.', cta: 'Check a paper' },
    ],
    startTitle: 'How it works', startSub: 'From a paper you cannot get through to a paper you understand, in three steps.',
    steps: [{ h: 'Drop in a paper', p: 'Paste an arXiv link or upload a PDF.' }, { h: 'Get a video lesson', p: 'About four minutes later you have a short video that teaches it, with every quote and number checked against the paper.' }, { h: 'Ask, quiz, check', p: 'Pause to ask the AI, answer a question after each part, or have the result re-run.' }],
    whyEyebrow: 'Why you can trust it', whyTitle: 'Every number traces back to the paper.', whyLead: 'No black-box answers. You can check each step yourself.',
    why: [
      { h: 'Quotes are matched', p: 'A quote only appears in a video if it is found word for word in the paper. Anything else is removed.' },
      { h: 'Numbers are matched', p: 'Every number on screen has to appear in the paper text.' },
      { h: 'Verdicts are earned', p: 'The agent fixes its tolerance first, then runs the code twice from scratch before it says the result holds.' },
    ],
    faqTitle: 'Questions people ask',
    faq: [
      { q: 'What is Paperlit?', a: 'A way to learn research papers faster. You drop in a paper, we make a short video that teaches it, and you can ask questions, quiz yourself and check whether the results are real.' },
      { q: 'What can I drop in?', a: 'An arXiv link, a PDF link, a DOI, or a PDF from your computer.' },
      { q: 'Which languages?', a: 'English, 中文, Tiếng Việt and Bahasa Indonesia, for the page and for the video.' },
      { q: 'How do you stop the AI from inventing things?', a: 'Every quote and number in a video is matched against the paper text, and what does not match is removed.' },
      { q: 'Is it free?', a: 'You can try it without signing up. A free account gets a video every day, and plans start at ¥33 a month for 99 videos.' },
    ],
    ctaTitle: 'Stop re-reading. Start understanding.', ctaBody: 'Drop in one paper. Free to try.', ctaLabel: 'Make my video',
    team: 'Group 1, Tsinghua SIGS AIID capstone', partners: 'Partners: DeepWisdom and StepFun', shot: (n) => `Screenshot of ${n}`,
  },
  zh: {
    eyebrow: 'Paperlit', title: '丢进任何论文，看视频就学会。',
    sub: '论文又长又难读。粘贴链接或上传 PDF，Paperlit 会用你的语言做成一段短视频来讲解。之后你还能提问、自测，并检验结果是不是真的。',
    try: '看看怎么用',
    nav: ['你能得到什么', '怎么用', '常见问题'],
    products: [
      { tag: '学', name: '看视频学论文', text: '丢进一篇论文或任意 PDF，得到一段一步步讲解的短视频，可以随时暂停提问或自测。', cta: '制作我的视频' },
      { tag: '读', name: '边读边问', text: '和 AI 一起读论文，它回答你的问题，并指出每个答案出自哪一页。', cta: '打开阅读器' },
      { tag: '验', name: '检验结果', text: '发表的数字不一定为真。我们的 AI 会重新运行实验，告诉你结果是否真的成立。', cta: '检验一篇论文' },
    ],
    startTitle: '怎么用', startSub: '三步，从读不下去到真正读懂。',
    steps: [{ h: '丢进论文', p: '粘贴 arXiv 链接，或上传 PDF。' }, { h: '得到视频课', p: '大约四分钟后，你会得到一段讲解视频，其中每句引文和每个数字都与原文核对过。' }, { h: '提问、自测、验证', p: '随时暂停问 AI，每段结束后答一道题，或让结果重新跑一遍。' }],
    whyEyebrow: '为什么可信', whyTitle: '每个数字都能回到原文。', whyLead: '没有黑箱答案，每一步你都能自己核对。',
    why: [
      { h: '引文逐字比对', p: '引文只有在论文中逐字找到才会出现在视频里，其余都会被删除。' },
      { h: '数字逐个比对', p: '屏幕上的每个数字都必须出现在论文文本中。' },
      { h: '结论靠运行得出', p: '智能体先定容差，再从头运行两次代码，才会说结果成立。' },
    ],
    faqTitle: '常见问题',
    faq: [
      { q: 'Paperlit 是什么？', a: '一种更快学懂论文的方式：你丢进论文，我们做成短视频来讲解，你还可以提问、自测，并检验结果是不是真的。' },
      { q: '可以丢进什么？', a: 'arXiv 链接、PDF 链接、DOI，或你电脑里的 PDF。' },
      { q: '支持哪些语言？', a: '页面和视频都支持 English、中文、Tiếng Việt 和 Bahasa Indonesia。' },
      { q: '如何避免 AI 编造内容？', a: '视频中的每句引文和每个数字都会与论文原文比对，对不上的会被删除。' },
      { q: '免费吗？', a: '无需注册即可试用。免费账号每天可做一个视频，套餐每月 ¥33 起，含 99 个视频。' },
    ],
    ctaTitle: '别再反复啃，直接读懂。', ctaBody: '丢进一篇论文，免费试用。', ctaLabel: '制作我的视频',
    team: '清华 SIGS AIID 课程项目第 1 组', partners: '合作方：DeepWisdom 与 StepFun', shot: (n) => `${n} 截图`,
  },
  vi: {
    eyebrow: 'Paperlit', title: 'Thả bất kỳ bài báo nào vào. Học qua video.',
    sub: 'Bài báo nghiên cứu dài và khó đọc. Dán liên kết hoặc tải PDF lên, Paperlit sẽ làm một video ngắn giảng giải bằng ngôn ngữ của bạn. Sau đó bạn có thể đặt câu hỏi, tự kiểm tra, và xem kết quả có thật không.',
    try: 'Xem cách hoạt động',
    nav: ['Bạn nhận được gì', 'Cách hoạt động', 'Câu hỏi thường gặp'],
    products: [
      { tag: 'Học', name: 'Học qua video', text: 'Thả một bài báo hoặc PDF bất kỳ vào. Nhận video ngắn có lời dẫn giảng từng bước, bạn có thể dừng lại để hỏi hoặc tự kiểm tra.', cta: 'Tạo video của tôi' },
      { tag: 'Đọc', name: 'Đọc và hỏi', text: 'Đọc bài báo cùng một AI trả lời câu hỏi của bạn và chỉ ra mỗi câu trả lời lấy từ trang nào.', cta: 'Mở trình đọc' },
      { tag: 'Kiểm', name: 'Kiểm chứng kết quả', text: 'Con số được công bố không phải lúc nào cũng đúng. AI của chúng tôi chạy lại thí nghiệm và cho bạn biết kết quả có thật sự đúng không.', cta: 'Kiểm chứng một bài báo' },
    ],
    startTitle: 'Cách hoạt động', startSub: 'Từ một bài báo đọc không nổi đến một bài báo bạn hiểu, trong ba bước.',
    steps: [{ h: 'Thả bài báo vào', p: 'Dán liên kết arXiv hoặc tải PDF lên.' }, { h: 'Nhận bài giảng video', p: 'Khoảng bốn phút sau bạn có một video ngắn giảng giải, mọi trích dẫn và con số đều được đối chiếu với bài báo.' }, { h: 'Hỏi, tự kiểm tra, kiểm chứng', p: 'Dừng lại để hỏi AI, trả lời một câu sau mỗi phần, hoặc cho chạy lại kết quả.' }],
    whyEyebrow: 'Vì sao đáng tin', whyTitle: 'Mọi con số đều truy về bài báo.', whyLead: 'Không có câu trả lời hộp đen. Bạn tự kiểm tra được từng bước.',
    why: [
      { h: 'Trích dẫn được đối chiếu', p: 'Một trích dẫn chỉ xuất hiện trong video nếu tìm thấy nguyên văn trong bài báo. Phần còn lại bị loại.' },
      { h: 'Con số được đối chiếu', p: 'Mọi con số trên màn hình phải có trong văn bản bài báo.' },
      { h: 'Kết luận có căn cứ', p: 'Tác tử cố định dung sai trước, rồi chạy mã hai lần từ đầu trước khi nói kết quả đúng.' },
    ],
    faqTitle: 'Câu hỏi thường gặp',
    faq: [
      { q: 'Paperlit là gì?', a: 'Một cách học bài báo nghiên cứu nhanh hơn. Bạn thả bài báo vào, chúng tôi làm video ngắn giảng giải, và bạn có thể đặt câu hỏi, tự kiểm tra và xem kết quả có thật không.' },
      { q: 'Tôi có thể thả gì vào?', a: 'Liên kết arXiv, liên kết PDF, DOI, hoặc tệp PDF từ máy tính của bạn.' },
      { q: 'Có những ngôn ngữ nào?', a: 'English, 中文, Tiếng Việt và Bahasa Indonesia, cho cả trang web lẫn video.' },
      { q: 'Làm sao ngăn AI bịa đặt?', a: 'Mọi trích dẫn và con số trong video đều được đối chiếu với văn bản bài báo, phần nào không khớp sẽ bị loại.' },
      { q: 'Có miễn phí không?', a: 'Bạn có thể dùng thử mà không cần đăng ký. Tài khoản miễn phí có một video mỗi ngày, và các gói bắt đầu từ ¥33 mỗi tháng cho 99 video.' },
    ],
    ctaTitle: 'Đừng đọc đi đọc lại nữa. Hãy hiểu.', ctaBody: 'Thả một bài báo vào. Dùng thử miễn phí.', ctaLabel: 'Tạo video của tôi',
    team: 'Nhóm 1, đồ án AIID Tsinghua SIGS', partners: 'Đối tác: DeepWisdom và StepFun', shot: (n) => `Ảnh chụp màn hình ${n}`,
  },
  id: {
    eyebrow: 'Paperlit', title: 'Masukkan makalah apa pun. Pelajari lewat video.',
    sub: 'Makalah riset itu panjang dan sulit dibaca. Tempel tautan atau unggah PDF, lalu Paperlit membuat video singkat yang mengajarkannya dalam bahasa Anda. Setelah itu Anda bisa bertanya, menguji diri, dan memeriksa apakah hasilnya nyata.',
    try: 'Lihat cara kerjanya',
    nav: ['Yang Anda dapat', 'Cara kerja', 'Tanya jawab'],
    products: [
      { tag: 'Belajar', name: 'Belajar lewat video', text: 'Masukkan makalah atau PDF apa pun. Dapatkan video singkat bernarasi yang mengajarkannya langkah demi langkah, dan jeda untuk bertanya atau menguji diri.', cta: 'Buat video saya' },
      { tag: 'Baca', name: 'Baca dan tanya', text: 'Baca makalah bersama AI yang menjawab pertanyaan Anda dan menunjukkan halaman asal setiap jawaban.', cta: 'Buka pembaca' },
      { tag: 'Periksa', name: 'Periksa hasilnya', text: 'Angka yang dipublikasikan belum tentu benar. AI kami menjalankan ulang eksperimennya dan memberi tahu apakah hasilnya benar-benar berlaku.', cta: 'Periksa sebuah makalah' },
    ],
    startTitle: 'Cara kerja', startSub: 'Dari makalah yang tak sanggup Anda baca sampai makalah yang Anda pahami, dalam tiga langkah.',
    steps: [{ h: 'Masukkan makalah', p: 'Tempel tautan arXiv atau unggah PDF.' }, { h: 'Dapatkan video pelajaran', p: 'Sekitar empat menit kemudian Anda punya video singkat yang mengajarkannya, setiap kutipan dan angka dicocokkan dengan makalahnya.' }, { h: 'Tanya, uji, periksa', p: 'Jeda untuk bertanya pada AI, jawab satu pertanyaan setelah tiap bagian, atau jalankan ulang hasilnya.' }],
    whyEyebrow: 'Mengapa layak dipercaya', whyTitle: 'Setiap angka bisa dilacak ke makalahnya.', whyLead: 'Tidak ada jawaban kotak hitam. Anda bisa memeriksa tiap langkah sendiri.',
    why: [
      { h: 'Kutipan dicocokkan', p: 'Kutipan hanya muncul di video jika ditemukan kata demi kata di makalah. Yang lain dibuang.' },
      { h: 'Angka dicocokkan', p: 'Setiap angka di layar harus ada di teks makalah.' },
      { h: 'Putusan dibuktikan', p: 'Agen menetapkan toleransi lebih dulu, lalu menjalankan kode dua kali dari awal sebelum menyatakan hasilnya berlaku.' },
    ],
    faqTitle: 'Tanya jawab',
    faq: [
      { q: 'Apa itu Paperlit?', a: 'Cara belajar makalah riset dengan lebih cepat. Anda memasukkan makalah, kami membuat video singkat yang mengajarkannya, dan Anda bisa bertanya, menguji diri, serta memeriksa apakah hasilnya nyata.' },
      { q: 'Apa yang bisa saya masukkan?', a: 'Tautan arXiv, tautan PDF, DOI, atau PDF dari komputer Anda.' },
      { q: 'Bahasa apa saja?', a: 'English, 中文, Tiếng Việt dan Bahasa Indonesia, untuk halaman maupun video.' },
      { q: 'Bagaimana AI dicegah mengarang?', a: 'Setiap kutipan dan angka di video dicocokkan dengan teks makalah, dan yang tidak cocok dibuang.' },
      { q: 'Apakah gratis?', a: 'Anda bisa mencobanya tanpa mendaftar. Akun gratis mendapat satu video per hari, dan paket mulai dari ¥33 per bulan untuk 99 video.' },
    ],
    ctaTitle: 'Berhenti membaca berulang. Mulai paham.', ctaBody: 'Masukkan satu makalah. Gratis dicoba.', ctaLabel: 'Buat video saya',
    team: 'Kelompok 1, proyek akhir AIID Tsinghua SIGS', partners: 'Mitra: DeepWisdom dan StepFun', shot: (n) => `Tangkapan layar ${n}`,
  },
};

function read<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return allowed.includes(v as T) ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

const FT: Record<Lang, { explore: string; examples: string; pricing: string; about: string; terms: string; privacy: string; contact: string; rights: string }> = {
  en: { explore: 'Explore', examples: 'Examples', pricing: 'Pricing', about: 'About', terms: 'Terms', privacy: 'Privacy', contact: 'Contact', rights: 'All rights reserved.' },
  zh: { explore: '探索', examples: '示例', pricing: '价格', about: '关于', terms: '条款', privacy: '隐私', contact: '联系我们', rights: '版权所有。' },
  vi: { explore: 'Khám phá', examples: 'Ví dụ', pricing: 'Bảng giá', about: 'Giới thiệu', terms: 'Điều khoản', privacy: 'Quyền riêng tư', contact: 'Liên hệ', rights: 'Bảo lưu mọi quyền.' },
  id: { explore: 'Jelajahi', examples: 'Contoh', pricing: 'Harga', about: 'Tentang', terms: 'Ketentuan', privacy: 'Privasi', contact: 'Kontak', rights: 'Hak cipta dilindungi.' },
};
const HREF = [URLS.explainer, URLS.reading, URLS.repro];
const SHOT_KEYS = [SHOTS.explainer, SHOTS.reading, SHOTS.repro];
const NAMES = ['Explain', 'Read', 'Reproduce'];

export default function Index() {
  const initial = (() => {
    const nav = (navigator.language || '').toLowerCase();
    return nav.startsWith('zh') ? 'zh' : nav.startsWith('vi') ? 'vi' : nav.startsWith('id') ? 'id' : 'en';
  })() as Lang;
  const [lang, setLang] = useState<Lang>(() => read('suite-lang', LANGS, read(LANG_KEY, LANGS, initial)));
  const [theme, setTheme] = useState<Theme>(() => read(THEME_KEY, ['light', 'dark'], window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const t = S[lang];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* private mode */ }
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
    try { localStorage.setItem(LANG_KEY, lang); localStorage.setItem('suite-lang', lang); } catch { /* private mode */ }
  }, [lang]);

  const nav = [
    { label: t.nav[0], href: '#tools' },
    { label: t.nav[1], href: '#start' },
    { label: t.nav[2], href: '#faq' },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <SuiteTopBar
        appId="hub"
        nav={nav}
        dark={theme === 'dark'}
        onToggleDark={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        lang={lang}
        onLang={(l) => setLang(l as Lang)}
        languages={['en', 'zh', 'vi', 'id']}
      />

      <main id="top" className="mx-auto w-full max-w-[1160px] px-5 sm:px-8">
        <section className="su-hero">
          <span className="su-pill"><i />{t.eyebrow}</span>
          <h1 className="su-title">{t.title}</h1>
          <p className="su-sub">{t.sub}</p>
          <div className="su-cta">
            <a href={HREF[0]} className="su-btn">{t.products[0].cta}</a>
            <a href="#start" className="su-btn-2">{t.try}</a>
          </div>
          <ShowcaseFrame
            slides={[0, 1, 2].map((i) => ({ key: NAMES[i], label: t.products[i].name, url: HREF[i].replace('https://', ''), src: SHOT_KEYS[i], alt: t.shot(t.products[i].name) }))}
          />
        </section>

        <section className="su-section" id="tools">
          <div className="grid gap-6 md:grid-cols-3">
            {t.products.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <a href={HREF[i]} className="su-card block h-full rounded-[22px] border border-[color:var(--line)] p-6 no-underline transition hover:-translate-y-0.5" style={{ background: 'var(--card, transparent)' }}>
                  <span className="su-pill"><i />{p.tag}</span>
                  <h2 className="mt-3 text-[22px] font-bold tracking-[-0.02em]">{p.name}</h2>
                  <p className={`mt-2 text-[15px] leading-relaxed ${text2}`}>{p.text}</p>
                  <span className="su-btn mt-5 inline-flex">{p.cta}</span>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="su-section" id="start">
          <Reveal><SectionHead center eyebrow={t.nav[1]} title={t.startTitle} lead={t.startSub} /></Reveal>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {t.steps.map((s, i) => (
              <li key={s.h} className="rounded-[18px] border border-[color:var(--line)] p-5">
                <span className={`text-[13px] font-semibold ${text2}`}>{i + 1}</span>
                <h3 className="text-[18px] font-bold">{s.h}</h3>
                <p className={`mt-1 text-[14.5px] ${text2}`}>{s.p}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="su-section" id="why">
          <Reveal><SectionHead center eyebrow={t.whyEyebrow} title={t.whyTitle} lead={t.whyLead} /></Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {t.why.map((w) => (
              <div key={w.h} className="rounded-[18px] border border-[color:var(--line)] p-5">
                <h3 className="text-[17px] font-bold">{w.h}</h3>
                <p className={`mt-1 text-[14.5px] leading-relaxed ${text2}`}>{w.p}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="su-section" id="faq">
          <h2 className="text-[28px] font-bold tracking-[-0.02em]">{t.faqTitle}</h2>
          <div className="mt-5 overflow-hidden rounded-[16px] border border-[color:var(--line)]">
            {t.faq.map((f, i) => (
              <details key={f.q} className={i ? 'border-t border-[color:var(--line)]' : ''}>
                <summary className="cursor-pointer list-none px-5 py-4 text-[15.5px] font-semibold">{f.q}</summary>
                <p className={`px-5 pb-5 text-[14.5px] leading-relaxed ${text2}`}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="su-section">
          <div className="flex flex-wrap items-center justify-between gap-5 rounded-[22px] bg-[#1d1d1f] px-8 py-9 text-white dark:bg-white dark:text-[#1d1d1f]">
            <div>
              <h2 className="text-[26px] font-bold tracking-[-0.02em]">{t.ctaTitle}</h2>
              <p className="mt-1 opacity-80">{t.ctaBody}</p>
            </div>
            <a href={HREF[0]} className="rounded-full bg-white px-6 py-3 font-semibold text-[#1d1d1f] no-underline dark:bg-[#1d1d1f] dark:text-white">{t.ctaLabel}</a>
          </div>
        </section>

        <footer className={`mt-14 grid gap-8 border-t border-[color:var(--line)] py-10 text-[14px] sm:grid-cols-[1.4fr_1fr_1fr_1fr] ${text2}`}>
          <div>
            <p className="font-bold text-[16px]" style={{ color: 'inherit' }}>Paperlit</p>
            <p className="mt-1 max-w-[30ch]">{t.title}</p>
          </div>
          {[
            { h: 'Paperlit', l: [[t.products[0].name, HREF[0]], [t.products[1].name, HREF[1]], [t.products[2].name, HREF[2]]] },
            { h: FT[lang].explore, l: [[FT[lang].examples, `${HREF[0]}#examples`], [FT[lang].pricing, `${HREF[0]}#pricing`], ['FAQ', '#faq']] },
            { h: FT[lang].about, l: [[FT[lang].terms, `${HREF[0]}/terms`], [FT[lang].privacy, `${HREF[0]}/privacy`], [FT[lang].contact, `${HREF[0]}#contact`]] },
          ].map((c) => (
            <nav key={c.h} className="grid content-start gap-2" aria-label={String(c.h)}>
              <p className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: 'inherit' }}>{c.h}</p>
              {c.l.map(([n, h]) => <a key={n} href={h} className="inline-block py-1.5 no-underline hover:underline" style={{ color: 'inherit' }}>{n}</a>)}
            </nav>
          ))}
          <p className="sm:col-span-4 border-t border-[color:var(--line)] pt-5 text-[13px]" style={{ color: 'inherit' }}>&copy; {new Date().getFullYear()} Paperlit. {FT[lang].rights}</p>
        </footer>
      </main>
    </div>
  );
}
